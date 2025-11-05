import { marked } from "marked";
import { v5 as uuidv5 } from 'uuid';

export interface CHIOCEOPTION {
    label: string
    value: string
}

export const CHIOCEOPTIONLabelList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']

export interface QUESTION {
    id: any
    stage: string
    question: string
    options: Array<CHIOCEOPTION> | []
    images: Array<string> | []
    answer: string
    min: number
    max: number
    tag: string
    answerOption: Array<CHIOCEOPTION> | []
    analysis: string
    hintWhenWrong: string
    difficulty: any
    score: any
}

/**
 * BLOCK 的类型 = question 的类型
 */
export enum BlockType {
    TEXT = 'TEXT',
    QA = 'QA',
    MULTIPLECHOICE = 'MULTIPLECHOICE',
    CHOICE = 'CHOICE',
    TABLE = 'TABLE',
    TRACELINE = 'TRACELINE',
    CIRCUIT = 'CIRCUIT', // 电路检查
    RANGE = 'RANGE',
    UPLOAD = 'UPLOAD',
}

export enum StageType {
    befor = 'before-class',
    after = 'after-class',
    experiment = 'experiment',
}

export interface STUANSWER {
    id: string
    images: Array<string> | []
    answer: string
    answerOption: Array<CHIOCEOPTION> | []
    datetime: string | Date
}

export interface THCELL {
    value: string
    colIsNeedInput: boolean
    colIsAutoGet: boolean
    question: QUESTION | null
}

export interface CELL {
    id: string
    value: string
    isNeedInput: boolean
    isAutoGet: boolean
    stuVlaue: any
    result: QRESULT | null
}

export interface TABLECONFIG {
    col: number
    row: number
    tableName: string
    tableHeader: THCELL[]
    tableRow: CELL[][]
}

export interface QRESULT {
    student_answer: string
    score: number | null
    full_mark: number
    remark: string
    datetime: string | Date
}

export interface CIRCUIT {
    imageUrl: string | null
    data: Array<any>
}

//**PAYLOAD */
export interface PAYLOAD {
    type: string
    question: QUESTION | null
    stuAnswer: STUANSWER | null
    result: QRESULT | null
    table: TABLECONFIG | null
    circuit: CIRCUIT | null
    uploadFile: any
}

/**
 * 创建问题模版用的payloadQo 
 */
export interface PAYLOADQo {
    id: number
    parentId: number | null
    payload: PAYLOAD
}

/**
 * 指导书中block创建用的声明
 */
export interface BlockQo {
    sectionId: number;
    sort: number;
    type: string;
    payload: string;  // question template 的payload
}

/**
 * BlockVo 指导书中的block 
 */
export interface BlockVo {
    blockId: number;      // blockId
    sectionId: number;
    sort: number;
    type: string;
    title: string;
    content: string;
    catalogue: string;
    confData: string;
    referenceData: string;
    payload: string;  // question template 的payload
}

/**
 * block 详细数据
 */
export interface BlockDetail {
    id: number;   // blockDetailId
    parentId: number;  // blockId
    type: string;
    title: string;
    content: string;
    catalogue: string;
    confData: string;
    referenceData: string;
    dataTemplate: string;
    payload: string;
}

// export interface sectionVo {
//     id: number | null
//     parentId: number | null
//     name: string | null
//     sort: number | null
//     hasChildren: boolean
//     blockList: BlockVo[] | null
// }

export interface sectionVo {
    sort: number | null
    status: number | null
    stsid: number | null
    studentTaskId: number | null
    blockVoList: blockVo[] | null
}

export interface taskDetailVo {
    taskId: number | null
    sectionVoList: sectionVo[]
}


export interface blockVo {
    id: number
    STSId: number
    status: number
    sort: number
    type: string
    title: string
    content: string
    catalogue: string
    payload: string
}


/**
 * 生成新的问题 用于问题模版
 * @returns 
 */
export function GetNewQuestion() {
    const question = <QUESTION>{
        id: '',
        stage: StageType.befor,
        question: '',
        options: [],
        images: [],
        tag: '',
        answer: '',
        min: 0,
        max: 0,
        answerOption: [],
        analysis: '',
        hintWhenWrong: '',
        difficulty: 5,
        score: 5
    }
    let id = generatePreciseId()
    question.id = id
    return question
}

export function GetNewPayload() {
    let question = GetNewQuestion()

    const stuAnswer = <STUANSWER>{
        id: '',
        images: [],
        answer: '',
        answerOption: [],
        datetime: ''
    }
    let id = generatePreciseId()
    stuAnswer.id = id

    const result = <QRESULT>{
        student_answer: '',
        score: null,
        full_mark: 5,
        remark: '',
        datetime: ''
    }

    const circuit = <CIRCUIT>{
        imageUrl: '',
        data: []
    }

    const payload = <PAYLOAD>{
        type: '',
        question: question,
        stuAnswer: stuAnswer,
        table: null,
        result: result,
        circuit: circuit,
    }
    return payload
}

export function GetNewTablePayload() {
    const tableConfig = <TABLECONFIG>{
        col: 2,
        row: 1,
        tableName: '',
        tableHeader: [],
        tableRow: []
    }

    const payload = <PAYLOAD>{
        type: '',
        question: null,
        stuAnswer: null,
        table: tableConfig,
        circuit: null,
        result: null,
    }
    return payload
}

export function getNewThCell() {
    const thcell = <THCELL>{
        value: '',
        colIsNeedInput: false,
        colIsAutoGet: false,
        question: null
    }
    return thcell
}

export function getNewCell() {
    const result = <QRESULT>{
        student_answer: '',
        score: null,
        full_mark: 5,
        remark: '',
        datetime: ''
    }

    const cell = <CELL>{
        id: '',
        value: '',
        isNeedInput: false,
        isAutoGet: false,
        stuVlaue: '',
        result: result
    }
    let id = generatePreciseId()
    cell.id = id
    return cell
}

/**
 * 生成随机的id
 * @returns 生成的随机id
 */
export function generatePreciseId() {
    const perf = performance.now().toString(36).replace('.', '');
    const rand = Math.random().toString(36).substring(2);
    return `${perf}-${rand}`.substring(0, 24);
}

/**
 * 根据markdown文本获取大纲
 * @param markdown markdown文本
 * @returns 
 */
export function getOutline(markdown: string): string {
    const tokens = <any>marked.lexer(markdown);
    console.log(tokens);
    const outline = tokens
        .filter((token: { type: string; }) => token.type === 'heading')
        .map((token: { depth: any; text: any; }) => ({
            level: token.depth,
            text: token.text
        }));
    console.log(outline);
    return outline;
}