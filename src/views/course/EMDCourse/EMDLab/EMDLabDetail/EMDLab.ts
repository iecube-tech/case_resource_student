import { v5 as uuidv5 } from 'uuid';
const CELLNAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
const GENNAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export interface tableItem {
    itemType: number
    id: string
    autoData: boolean;
    valueType: string;
    value: string | number;
}


export interface confData {
    openConfDiv: boolean,
    openRefDiv: boolean,
    rowNum: number,
    colNum: number,
    title: string,
    tableData: tableItem[][]
}

export interface referenceData {
    id: string,
    row: number,
    col: number,
    value: string | number,
    maxVal: number,
    minVal: number,
    stuVal: string | number,
}

export enum blockType {
    TEXT = 'TEXT',
    TABLE = 'TABLE',
    TRACELINE = 'TRACELINE'
}

export enum ValueType {
    Number = 'number',
    String = 'string'
}

/**
 * table 单元格的类型，用户交互还是展示内容
 */
export enum TableItemType {
    Show = 0,  // 静态展示
    Edit = 1  // 用户输入
}

export interface blockVo {
    blockId: number
    catalogue: string | null
    confData: string | null
    content: string | null
    dataTemplate: string | null
    referenceData: string | null
    result: number | null
    stuData: string | null
    title: string | null
    type: string
}

export interface sectionVo {
    sort: number | null
    status: number | null
    stsid: number | null
    blockVoList: blockVo[] | null
}

export interface taskDetailVo {
    labProcId: number | null
    sectionVoList: sectionVo[]
}

/**
 * 
 * @param blockId blockId
 * @param rowNum rowNum
 * @param colNumbe colNumbe
 * @returns 生成表格中一个单元格的id
 */
export function generateCellId(blockId: number, rowNum: number, colNumbe: number): string {
    // 将三个数字组合成一个字符串作为名称
    const name = `${blockId}-${rowNum}-${colNumbe}`;
    // 使用 v5 版本生成 UUID
    const uuid = uuidv5(name, CELLNAMESPACE);
    return uuid;
}

export const generateShortUUID = (num: number) => {
    // 使用 num 生成特定的 UUID
    return uuidv5(num.toString(), GENNAMESPACE);
};

export const generateUUID = (num: number) => {
    // 使用 num 生成特定的 6 位字符串
    const hash = num.toString().split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
    }, 0);
    return hash.toString(36).substring(0, 6);
};