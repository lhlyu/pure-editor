import type { StateCommand, EditorState } from "@codemirror/state";
import {getIndentation, IndentContext, indentString, syntaxTree} from "@codemirror/language";
import {EditorSelection, Text} from "@codemirror/state";
import {NodeProp} from "@lezer/common";
import {KeyBinding} from "@codemirror/view";


// 是否在括号之间
function isBetweenBrackets(state: EditorState, pos: number): {from: number, to: number} | null {
    if (/\(\)|\[\]|\{\}/.test(state.sliceDoc(pos - 1, pos + 1))) {
        return {from: pos, to: pos}
    }
    let context = syntaxTree(state).resolveInner(pos)
    let before = context.childBefore(pos)
    let after = context.childAfter(pos)
    let closedBy
    if (before && after && before.to <= pos && after.from >= pos &&
        (closedBy = before.type.prop(NodeProp.closedBy)) && closedBy.indexOf(after.name) > -1 &&
        state.doc.lineAt(before.to).from == state.doc.lineAt(after.from).from) {
        return {from: before.to, to: after.from}
    }
    return null
}

const newlineAndIndent = (): StateCommand => {
    return ({state, dispatch}): boolean => {
        if (state.readOnly) return false
        let changes = state.changeByRange(range => {
            let {from, to} = range
            let line = state.doc.lineAt(from)
            let explode = from == to && isBetweenBrackets(state, from)
            let cx = new IndentContext(state, {
                simulateBreak: from,
                simulateDoubleBreak: !!explode
            })
            let indent = getIndentation(cx, from)
            if (indent == null) {
                indent = /^\s*/.exec(state.doc.lineAt(from).text)![0].length
            }

            while (to < line.to && /\s/.test(line.text[to - line.from])) {
                to++
            }
            if (explode) {
                ({from, to} = explode)
            }
            else if (from > line.from && from < line.from + 100 && !/\S/.test(line.text.slice(0, from))) {
                from = line.from
            }
            console.log(line, line.text.indexOf("　　"))
            const insert = []
            if (line.text.indexOf("　　") != -1) {
                insert.push("　　")
            } else {
                insert.push("")
            }
            insert.push(indentString(state, indent))
            if (explode) {
                insert.push(indentString(state, cx.lineIndent(line.from, -1)))
            }
            return {changes: {from, to, insert: Text.of(insert)},
                range: EditorSelection.cursor(from + 1 + insert[0].length + insert[1].length)}
        })
        dispatch(state.update(changes, {scrollIntoView: true, userEvent: "input"}))
        return true
    }
}

const Enter: KeyBinding = {
    key: "Enter",
    run: newlineAndIndent()
}

export default Enter