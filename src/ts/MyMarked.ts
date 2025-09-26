import { marked, Marked, type Tokens } from 'marked'
import { markedHighlight } from 'marked-highlight'
import katex, { type KatexOptions } from 'katex'
import markedKatex from 'marked-katex-extension'
import hljs from 'highlight.js';
import 'katex/dist/katex.min.css';  // 导入 KaTeX 样式

export const escape2Html = (str: string): string => {
    // 1.首先动态创建一个容器标签元素
    let temp = document.createElement('div')
    // 2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
    temp.innerHTML = str
    // 3.最后返回这个元素的innerText或者textContent，即得到经过HTML解码的字符串了。
    let output = temp.innerText || temp.textContent
    if (output == null) {
        return ''
    }
    return output
}

const katexOptions = {
    throwOnError: false,
    displayMode: true,
    nonStandard: true,
    // 生成 katex-mathml 时会出现错误, mathml 绝对定位没有定到 katex-display 元素, 而是找到上级导致页面出现错误
    output: 'html'
}

let hljsConfig = {
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
        if (lang === 'katex' || lang === 'mermaid' || lang.startsWith('markmap') || lang.startsWith('bilibili')) return code
        const language = hljs.getLanguage(lang) ? lang : 'shell'
        return hljs.highlight(code, { language }).value
    }
}

export const renderCodespan = (src: Tokens.Codespan) => {
    return `<code>${src.text}</code>`
}

//#region ----------------------------------------< simpleMarked >--------------------------------------
const simpleMarked = new Marked(markedKatex(<any>katexOptions))
simpleMarked.use(markedHighlight(hljsConfig))

const simpleRenderer = {
    heading(heading: Tokens.Heading) {
        const content = simpleMarked.parser(heading.tokens)
        if (content.includes('katex')) {
            return `
                <h${heading.depth} class=hkatex name=${heading.text}>
                  ${content}
                </h${heading.depth}>`;
        }
        return `
                <h${heading.depth} name=${heading.text}>
                  ${content}
                </h${heading.depth}>`;
    },
    // code({type,raw,codeBlockStyle,lang,text,escaped}:Tokens.Code) {
    //     console.log({type,raw,codeBlockStyle,lang,text,escaped})
    //     // if (language === 'katex') {
    //     //     try {
    //     //         return katex.renderToString(escape2Html(code), {
    //     //             throwOnError: true,
    //     //             displayMode: true,
    //     //             output: 'html'
    //     //         })
    //     //     } catch (error) {
    //     //         return `<p></p>`
    //     //     }
    //     // } else if (language === 'mermaid') {
    //     //     return '<p></p>'
    //     // } else if (language?.startsWith('markmap')) {
    //     //     return `<p><svg></svg></p>`
    //     // }
    //     // const lines: string[] = code.split(/\n|\r\n?|\n\n+/g)
    //     // let result = '<ol>'
    //     // for (let i = 0; i < lines.length; i++) {
    //     //     result += `<li></li>`
    //     // }
    //     // let lineNumbers = result + '</ol>'
    //     // return `<pre><code class="hljs language-${language}"></code>${lineNumbers}<div class="pre-copy">${language}</div></pre>`
    //     return `
    //     <div><button @click="console.log(111)">复制</button></div>
    //     <pre><code class="hljs language-${lang}"> ${text} </code></pre>
    //     `
    // },
    codespan(src: Tokens.Codespan): string {
        console.log(src)
        return renderCodespan(src)
    },
    image({ href, title, text }: Tokens.Image): string {
        return `<figure>
        <img class="md-image" src=${href} alt=${text} />
        <figcaption>${text}</figcaption>
        </figure>`
    },
    listitem({ type, raw, task, checked, loose, text, tokens }: Tokens.ListItem) {
        // 1. 处理任务列表的 checkbox
        let checkbox = '';
        if (task) {
            checkbox = `<input type="checkbox" ${checked ? 'checked' : ''} disabled> `;
        }

        // 2. 递归解析子 token（关键步骤）
        const content = simpleMarked.parser(tokens)

        // 3. 包裹内容结构
        return `
            <li>
            <div class="listitem">
            ${checkbox} ${content}
            </div>
            </li>
        `;
    }
}



const listRenderer = {
    listitem({ type, raw, task, checked, loose, text, tokens }: Tokens.ListItem) {

    }
}

const listItemRenderer = new marked.Renderer()

listItemRenderer.listitem = ({ type, raw, task, checked, loose, text, tokens }: Tokens.ListItem): string => {
    // 1. 处理任务列表的 checkbox
    let checkbox = '';
    if (task) {
        checkbox = `<input type="checkbox" ${checked ? 'checked' : ''} disabled> `;
    }

    // 2. 递归解析子 token（关键步骤）
    const content = marked.parser(tokens, {
        renderer: this // 保持其他元素的默认渲染方式
    });

    // 3. 包裹内容结构
    return `
    <li>
      <div class="list-item-container">
        ${checkbox}
        <span class="list-item-text">${content}</span>
      </div>
    </li>
  `;
}

//@ts-ignore
// simpleMarked.use({ renderer: listItemRenderer })
simpleMarked.use({ renderer: simpleRenderer })


//#endregion

export default marked

export { simpleMarked }