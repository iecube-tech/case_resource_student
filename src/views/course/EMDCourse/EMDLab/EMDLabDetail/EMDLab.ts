import { v5 as uuidv5 } from 'uuid';
import { UpCell } from '@/apis/EMDProject/upCell';
import { ElMessage } from 'element-plus';
const CELLNAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
const GENNAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export enum blockType {
    TEXT = 'TEXT',
    QA = 'QA',
    CHOICE = 'CHOICE',
    TABLE = 'TABLE',
    TRACELINE = 'TRACELINE'

}

export enum ValueType {
    Number = 'number',
    String = 'string'
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



// 表头单元格类型
export interface ThCell {
    id: string,
    colName: string,
    colConf: {
        type: string,
        typeEnum: [
            "string",
            "number",
            "date",
            "time",
            "datetime",
            "boolean",
            "array",
            "object"
        ],
        isInput: boolean,
        autoGet: boolean,
        needCheck: boolean
    }
}

// 最小输入单元的类型
export interface CELL {
    id: string,
    isInput: boolean,
    autoGet: boolean,
    needCheck: boolean,
    type: string,
    typeEnum: [
        "string",
        "number",
        "date",
        "time",
        "datetime",
        "boolean",
        "array",
        "object"
    ],
    presetValue: {
        string: string | null,
        number: number | null,
        date: string | null,
        time: string | null,
        datetime: string | null,
        boolean: boolean | null,
        array: any[] | null,
        object: Object | null
    },
    stuValue: {
        string: string | null,
        number: number | null,
        date: string | null,
        time: string | null,
        datetime: string | null,
        boolean: boolean | null,
        array: any[],
        object: Object | null
    },
    checkRule: {
        string: {
            useAiCheck: {
                canEdit: boolean,
                value: boolean
            },
            similarity: {
                canEdit: boolean,
                value: 1
            }
        } | null,
        number: {
            useAiCheck: {
                canEdit: boolean,
                value: boolean
            },
            min: {
                canEdit: boolean,
                value: number | null
            },
            max: {
                canEdit: boolean,
                value: number | null
            },
            relativeError: {
                canEdit: boolean,
                value: number | null
            }
        } | null,
        date: {
            useAiCheck: {
                canEdit: boolean,
                value: boolean
            },
            isEqual: {
                canEdit: boolean,
                value: boolean
            }
        } | null,
        time: {
            useAiCheck: {
                canEdit: boolean,
                value: boolean
            },
            isEqual: {
                canEdit: boolean,
                value: boolean
            }
        } | null,
        datetime: {
            useAiCheck: {
                canEdit: boolean,
                value: boolean
            },
            isEqual: {
                canEdit: boolean,
                value: boolean
            }
        } | null,
        boolean: {
            useAiCheck: {
                canEdit: boolean,
                value: boolean
            },
            isEqual: {
                canEdit: boolean,
                value: boolean
            }
        } | null,
        array: {
            useAiCheck: {
                canEdit: boolean,
                value: boolean
            },
            isEqual: {
                canEdit: boolean,
                value: boolean
            }
        } | null,
        object: {
            useAiCheck: {
                canEdit: boolean,
                value: boolean
            },
            isEqual: {
                canEdit: boolean,
                value: boolean
            }
        } | null
    }
}

// payload 类型
export interface PAYLOAD {
    question: string,
    isMultiple: boolean | null
    options: Array<any> | null,
    table: {
        row: number,
        col: number,
        tableName: string,
        tableHeader: ThCell[],
        tableColnum: CELL[][],
    } | null,
    cell: CELL
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

export function upCell(block: any, taskId: number, cellId: string) {
    return new Promise<void>((resolve, reject) => {
        UpCell(block, taskId, cellId).then(res => {
            if (res.state != 200) {
                ElMessage.error(res.message)
                reject()
            } else {
                resolve()
            }
        })
    })
}

export function checkSection(sectionVo: sectionVo) {
    if (sectionVo.blockVoList == null) {
        return true
    }
    const result = <boolean[]>[]
    for (let i = 0; i < sectionVo.blockVoList.length - 1; i++) {
        switch (sectionVo.blockVoList[i].type) {
            case blockType.TEXT:
                return true;
            case blockType.QA:
                result.push(checkQA(sectionVo.blockVoList[i]));
            case blockType.CHOICE:
                return false;
            case blockType.TABLE:
                return false;
            case blockType.TRACELINE:
                return false;
            default:
                return false;
        }
    }
}

function checkQA(block: blockVo) {
    const payload = <PAYLOAD>JSON.parse(block.payload)
    const cell = payload.cell

    if (!cell.needCheck) {
        return true
    }


    if (cell.type == 'string') {
        if (!cell.stuValue.string || cell.stuValue.string == '') {
            return false
        }
        if (cell.checkRule.string?.useAiCheck) {
            // use aiCheck
            return true
        }
        if (cell.stuValue.string != cell.presetValue.string) {
            return false
        }
    }

    if (cell.type == 'number') {
        if (!cell.stuValue.number) {
            return false
        }
        if (!cell.checkRule.number) {
            return true
        }
        if (cell.checkRule.number.useAiCheck) {
            //use aiCheck
            return true
        }
        let numCheck = []
        if (cell.checkRule.number.max.value) {
            numCheck.push(cell.stuValue.number <= cell.checkRule.number.max.value)
        }
        if (cell.checkRule.number.min.value) {
            numCheck.push(cell.stuValue.number >= cell.checkRule.number.min.value)
        }
        if (cell.checkRule.number.relativeError) {

        }
    }
    return true
}

function checkChoice(block: blockVo) {
    const payload = <PAYLOAD>JSON.parse(block.payload)
    const cell = payload.cell
    if (!cell.needCheck) {
        return true
    }
    if (cell.type == 'array') {

    }
}
