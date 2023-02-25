import { onMounted, ref } from 'vue'
import {
    EditorView,
    highlightActiveLine,
    keymap,
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import {
    defaultKeymap,
    history,
    historyKeymap,
    indentWithTab,
} from '@codemirror/commands'
import { searchKeymap } from '@codemirror/search'
import {
    indentService,
    indentUnit,
    defaultHighlightStyle,
    syntaxHighlighting
} from '@codemirror/language'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import Enter from "./newlineAndIndent";

const doc = ``


// 本地化
const localization = {
    next: '下一个',
    previous: '上一个',
    all: '全部',
    Find: '查找',
    replace: '替换',
    Replace: '替换词',
    regexp: '正则',
    'replace all': '全替换',
    'match case': '区分大小写',
    'by word': '逐字逐句',
}

const usePureEditor = () => {
    // 需要渲染成editor的dom
    const editor = ref<HTMLElement>()
    // 编辑器
    const view = ref<EditorView>()
    // 缩进
    const indentValue = ref<string>('　　')
    // 创建editor
    const createEditorState = (): EditorState => {
        return EditorState.create({
            doc: doc,
            extensions: [
                keymap.of([
                    Enter,
                    indentWithTab,
                    ...defaultKeymap,
                    ...searchKeymap,
                    ...historyKeymap,
                ]),
                history(),
                indentUnit.of(indentValue.value),
                indentService.of(
                    () => indentValue.value.length
                ),
                highlightActiveLine(),
                EditorView.lineWrapping,
                EditorState.phrases.of(localization),
                syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
                markdown({ base: markdownLanguage }),
            ],
        })
    }

    onMounted(() => {
        view.value = new EditorView({
            state: createEditorState(),
            parent: editor.value,
        })
    })

    return {
        editor,
    }
}



export default usePureEditor
