import { onMounted, ref } from 'vue'
import {
    EditorView,
    highlightActiveLine,
    keymap,
    Panel,
    showPanel,
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import {
    defaultKeymap,
    indentWithTab,
    history,
    historyKeymap,
} from '@codemirror/commands'
import {
    search,
    searchKeymap,
    openSearchPanel,
    closeSearchPanel,
} from '@codemirror/search'
import {
    indentService,
    indentUnit,
} from '@codemirror/language'

// 自定义样式
const theme = {
    '&.cm-editor': { height: '100%' },
    '&.cm-focused': { outline: 'none' },
    '.cm-content': {
        padding: '4px 0',
        caretColor: 'var(--pure-font-color)',
    },
    '.cm-activeLine': {
        backgroundColor:
            'rgba(var(--pure-catalogue-item-bg-rgba))',
    },
    '.cm-panels': {
        padding: '0 2em',
        textAlign: 'right',
        backgroundColor:
            'rgba(var(--pure-sidebar-bg-rgba))',
        border: 'none',
        color: 'inherit',
        userSelect: 'none',
    },
    '.cm-scroller': {
        lineHeight: '1.8',
        fontSize: '16px',
        letterSpacing: '1px',
        wordSpacing: '1px',
        fontFamily:
            "-apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica, 'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif",
    },
    '.cm-cursor': {
        display: 'block',
    },
    '.cm-line': {
        padding: '4px 2em',
    },
    '.cm-search': {
        textAlign: 'left',
        fontSize: '16px',
    },
    '.cm-searchMatch': {
        backgroundColor:
            'rgba(var(--pure-theme-color-rgb), 0.4)',
    },
    '.cm-searchMatch-selected': {
        backgroundColor:
            'rgba(var(--pure-theme-color-rgb), 0.8)',
    },
    '.cm-search input[type=checkbox]': {
        verticalAlign: 'middle',
    },
    '.cm-button': {
        outline: 'none',
        borderRadius: '2px',
        border: '1px solid rgba(var(--pure-theme-color-rgb), 0.2)',
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        color: 'inherit',
        transition: 'all 0.4s linear',
    },
    '.cm-button:hover': {
        border: '1px solid rgba(var(--pure-theme-color-rgb), 0.5)',
    },
    '[name=close]': {
        color: 'inherit',
    },
    '.cm-textfield': {
        outline: 'none',
        padding: '3px',
        borderRadius: '2px',
        border: '1px solid rgba(var(--pure-theme-color-rgb), 0.2)',
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        color: 'inherit',
    },
    '.cm-textfield:hover': {
        border: '1px solid rgba(var(--pure-theme-color-rgb), 0.5)',
    },
    '.cm-panel.cm-search input[type=checkbox]': {
        marginTop: '-0.5px',
    },
}

// 本地化
const localization = {
    next: '下一个',
    previous: '上一个',
    all: '全部',
    Find: '查找',
    replace: '替换',
    Replace: '替换词',
    'replace all': '全替换',
    'match case': '区分大小写',
    regexp: '正则',
    'by word': '逐字逐句',
}

const bottomPanelStatus = (
    doc: string,
    row: number,
    col: number
): string => {
    const chNumber = doc.length
    const wordNumber = doc.trim().replace(/\s+/g, '').length
    return `<span>${row}</span>:<span>${col}</span>&emsp;<span>${chNumber} 符</span>&emsp;<span>${wordNumber} 字</span>`
}

// 底部状态栏
function bottomPanel(view: EditorView): Panel {
    let dom = document.createElement('div')

    const doc = view.state.doc.toString()
    const head = view.state.selection.main.head
    const line = view.state.doc.lineAt(head)

    dom.innerHTML = bottomPanelStatus(
        doc,
        line.number,
        head - line.from
    )

    return {
        dom,
        update(update) {
            if (update.docChanged || update.selectionSet) {
                const doc = view.state.doc.toString()
                const head = view.state.selection.main.head
                const line = view.state.doc.lineAt(head)
                dom.innerHTML = bottomPanelStatus(
                    doc,
                    line.number,
                    head - line.from
                )
            }
        },
    }
}

const useEditor = () => {
    // 需要渲染成editor的dom
    const editor = ref<HTMLElement>()
    // 编辑器
    const view = ref<EditorView>()
    // 缩进
    const indentValue = ref<string>('　　')
    // 是否开启回车缩进
    const isIndent = ref<boolean>(true)
    // 查找替换界面是否展示
    const isFindAndReplacePanel = ref<boolean>(false)

    onMounted(() => {
        const startState = EditorState.create({
            doc: indentValue.value,
            extensions: [
                keymap.of([
                    indentWithTab,
                    ...defaultKeymap,
                    ...searchKeymap,
                    ...historyKeymap,
                ]),
                indentUnit.of(indentValue.value),
                indentService.of(() => {
                    return indentValue.value.length
                }),
                EditorView.theme(theme),
                highlightActiveLine(),
                history(),
                EditorView.lineWrapping,
                showPanel.of(bottomPanel),
                search({ top: true }),
                EditorState.phrases.of(localization),
            ],
        })

        view.value = new EditorView({
            state: startState,
            parent: editor.value,
        })
    })

    // 打开/关闭 查找替换界面
    const openFindAndReplacePanel = () => {
        if (isFindAndReplacePanel.value) {
            closeSearchPanel(view.value!)
            isFindAndReplacePanel.value = false
            return
        }
        isFindAndReplacePanel.value = openSearchPanel(
            view.value!
        )
    }

    // 复制内容
    const copyEditorValue = async () => {
        if (!view.value) {
            return
        }
    }

    // 关闭/开启缩进
    const triggleIndent = () => {
        if (isIndent.value) {
            indentValue.value = ''
            isIndent.value = false
            return
        }
        indentValue.value = '      '
        isIndent.value = true
    }

    // 排版
    const typesettingEditorValue = () => {
        if (!view.value) {
            return
        }
        let iter = view.value?.state.doc.iter()
        const lines = []
        while (!iter?.done) {
            const value = iter?.value.trim()
            if (value?.length) {
                lines.push(
                    indentValue.value + iter?.value.trim()
                )
            }
            iter = iter?.next()
        }
        view.value?.dispatch({
            changes: {
                from: 0,
                to: view.value?.state.doc.length,
                insert: lines.join('\n'),
            },
        })
        view.value?.dom.blur()
    }

    // 设置内容
    const setEditorValue = (
        value: string,
        paste: boolean = false
    ) => {
        if (!view.value) {
            return
        }
        if (paste) {
            console.log(view.value?.state.selection)
            view.value?.dispatch(
                view.value?.state.replaceSelection(value)
            )
            return
        }
        view.value?.dispatch({
            changes: {
                from: 0,
                to: view.value?.state.doc.length,
                insert: value,
            },
        })
        view.value?.dom.blur()
    }

    // 清空内容
    const clearEditorValue = () => {
        if (!view.value) {
            return
        }
        view.value?.dispatch({
            changes: {
                from: 0,
                to: view.value?.state.doc.length,
                insert: indentValue.value,
            },
        })
        view.value?.dom.blur()
    }

    return {
        editor,
        view,
        isIndent,
        openFindAndReplacePanel,
        copyEditorValue,
        triggleIndent,
        typesettingEditorValue,
        setEditorValue,
        clearEditorValue,
    }
}

export default useEditor
