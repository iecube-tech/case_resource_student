import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp, ref } from 'vue';
import SummingUnitA from '../module/operate/summingUnitA.vue'
import SummingUnitB from '../module/operate/summingUnitB.vue'
import InputTable from '../module/common/inputTable.vue'
import UserInput from "../module/common/input.vue"
import NiOSCPic from "../module/common/nioscpic.vue"
import SingleChoice from "../module/common/singleChoice.vue"
import MultipleChoice from "../module/common/multipleChoice.vue"

const targetRepalce = {
    '问答': (newDiv: Element, props: any) => { return UserInputReplace(newDiv, props) },
    '表格': (newDiv: Element, props: any) => { return InputTableReplace(newDiv, props) },
    '图片': (newDiv: Element, props: any) => { return NiOSCPicReplace(newDiv, props) },
    '单选': (newDiv: Element, props: any) => { return SingleChoiceReplace(newDiv, props) },
    '多选': (newDiv: Element, props: any) => { return MultipleChoiceReplace(newDiv, props) },
    '加法器a': (newDiv: Element, props: any) => { return SummingUnitAReplace(newDiv, props) },
    '加法器b': (newDiv: Element, props: any) => { return SummingUnitBReplace(newDiv, props) },
}
/**
 * 
 * @param articleId markdown文章的id
 * @param composeEdit 组件是否可以进行值的预设和答案分数预设
 * @param canEdit 组件是否可以被用户编辑
 * @returns 
 */
export function replace(articleId: number | null | undefined, composeEdit: boolean | null | undefined, canEdit: boolean | null | undefined, elementId = null) {
    let element = null
    if (elementId) {
        element = document.getElementById(elementId)
    }
    else {
        element = document.getElementsByClassName("md-editor-preview-wrapper")[0]
    }
    const replacedList = []
    if (element) {
        const willRepaleElement = findElementByString(element, [])
        // console.log(willRepaleElement)
        willRepaleElement.forEach((item, index) => {
            try {
                // console.log(item.textContent)
                // console.log(index)
                const regex = /^<iecube>(.*)<\/iecube>$/;
                const text = item.textContent.match(regex)[1]
                let editParam = text.split('|')
                const target = editParam[0].trim()
                let newDiv = document.createElement('div')
                newDiv.id = index + target
                newDiv.className = "student_report"
                if (!canEdit) {
                    newDiv.className = 'student_report_cannot_edit'
                }
                item.replaceWith(newDiv)
                const props = {
                    editParam: editParam,
                    articleId: articleId,
                    index: index,
                    composeEdit: composeEdit,
                    canEdit: canEdit,
                    compose: null,
                    isAnswer: false,
                    readOver: false,
                }
                if (targetRepalce[target]) {
                    const instance = targetRepalce[target](newDiv, props)
                    const replaced = {
                        index: index,
                        name: text,
                        val: instance.val,
                        subjective: instance.subjective,
                        qType: instance.qType,
                        question: instance.question
                    }
                    replacedList.push(replaced)
                }
            }
            catch {
                console.log('组件' + index + '加载失败')
            }
        })
    }
    return replacedList // 返回值的作用， 文档中第一次创建组件时设定初始值
}
/**
 * 
 * @param elementId div id
 * @param isAnswer 是否只显示答案
 * @param compose compose
 */
export function readOver(elementId = null, isAnswer = false, compose: any) {
    let element = null
    if (elementId) {
        element = document.getElementById(elementId)
    }
    else {
        element = document.getElementsByClassName("md-editor-preview-wrapper")[0]
    }
    if (element) {
        const willRepaleElement = findElementByString(element, [])
        // console.log(willRepaleElement)
        willRepaleElement.forEach((item, index) => {
            try {
                // console.log(item.textContent)
                // console.log(index)
                const regex = /^<iecube>(.*)<\/iecube>$/;
                const text = item.textContent.match(regex)[1]
                let editParam = text.split('|')
                const target = editParam[0].trim()
                let newDiv = document.createElement('div')
                newDiv.id = index + target
                newDiv.className = "student_report"
                item.replaceWith(newDiv)
                const props = {
                    editParam: editParam,
                    articleId: null,
                    index: null,
                    composeEdit: false,
                    canEdit: false,
                    compose: compose,
                    isAnswer: isAnswer,
                    readOver: true,
                }
                if (targetRepalce[target]) {
                    targetRepalce[target](newDiv, props)
                }
            }
            catch {
                console.log('组件' + index + '加载失败')
            }
        })
    }
}

const findElementByString = (node: any, res: Element[]) => {
    if (node.nodeType === Node.TEXT_NODE) {
        // if (targetString.includes(node.textContent)) {
        //     res.push(node.parentElement)
        // }
        if (isIecubeString(node.textContent)) {
            res.push(node.parentElement)
        }
    } else {
        node.childNodes.forEach(item => findElementByString(item, res))
    }
    return res
}

function isIecubeString(str) {
    // 定义正则表达式
    const regex = /^<iecube>.*<\/iecube>$/;

    // 使用test方法判断是否匹配
    return regex.test(str);
}

function UserInputReplace(newDiv: Element, props: any) {
    const app = createApp(UserInput, props)
    app.use(ElementPlus)
    return <any>app.mount(newDiv)
}

function InputTableReplace(newDiv: Element, props: any) {
    const app = createApp(InputTable, props)
    app.use(ElementPlus)
    return <any>app.mount(newDiv)
}

function NiOSCPicReplace(newDiv: Element, props: any) {
    const app = createApp(NiOSCPic, props)
    app.use(ElementPlus)
    return <any>app.mount(newDiv)
}

function SingleChoiceReplace(newDiv: Element, props: any) {
    const app = createApp(SingleChoice, props)
    app.use(ElementPlus)
    return <any>app.mount(newDiv)
}

function MultipleChoiceReplace(newDiv: Element, props: any) {
    const app = createApp(MultipleChoice, props)
    app.use(ElementPlus)
    return <any>app.mount(newDiv)
}


function SummingUnitAReplace(newDiv: Element, props: any) {
    const app = createApp(SummingUnitA, props)
    app.use(ElementPlus)
    return <any>app.mount(newDiv)
}

function SummingUnitBReplace(newDiv: Element, props: any) {
    const app = createApp(SummingUnitB, props)
    app.use(ElementPlus)
    return <any>app.mount(newDiv)
}


