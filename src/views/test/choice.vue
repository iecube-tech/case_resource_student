<template>
    <div class="choice-edit" @blur="saveBlock">
        <div ref="tableConf" class="table-conf">
            <div class="table-conf-item" style="display: flex; flex-direction: row; justify-content: center;">
                <h3>选择题配置</h3>
            </div>
            <div class="table-conf-item">
                <el-input class="content-input" type="textarea" autosize v-model="blockDetail.content"
                    @change="blockContentChange" placeholder="表格必要说明内容,支持mnarkdown语法,可不填"></el-input>
            </div>

            <div class="table-conf-item">
                <el-input class="table-tilte-input" v-model="ConfData.title" placeholder="表名,支持mnarkdown语法,可不填">
                </el-input>
            </div>

            <div class="table-conf-item " style="width: 240px;">
                <el-form-item :label="'行数：' + ConfData.rowNum">
                    <el-button circle :icon="Minus" size="small" @click="delRow"></el-button>
                    <el-button circle :icon="Plus" size="small" @click="addRow"></el-button>
                </el-form-item>
            </div>

            <div class="table-conf-item " style="width: 240px;">
                <el-form-item :label="'列数：' + ConfData.colNum">
                    <el-button circle :icon="Minus" size="small" @click="delCol"></el-button>
                    <el-button circle :icon="Plus" size="small" @click="addCol"></el-button>
                </el-form-item>
            </div>
        </div>
        <div class="table-conf-fold">
            <el-button v-if="ConfData.openConfDiv" link :icon="ArrowUpBold" @click="configDivClose"></el-button>
            <el-button v-else link :icon="ArrowDownBold" @click="configDivOpen"></el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import empPreview from '@/views/course/EMDCourse/EMDLab/EMDLabDetail/Block/emdPreview/emdPreview.vue'

const blockVo = ref({
    id: 2,
    parentId: 1,
    type: "CHOICE",
    content: "",
    catalogue: "",
    title: "",
    payload: {
        question: "",
        options: [],
        cell: {
            id: "",
            isInput: false,
            autoGet: false,
            needCheck: true,
            type: "array",
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
                string: "",
                number: 0,
                date: "",
                time: "",
                datetime: "",
                boolean: false,
                array: [

                ],
                object: {

                }
            },
            stuValue: {
                string: "",
                number: 0,
                date: "",
                time: "",
                datetime: "",
                boolean: false,
                array: [

                ],
                object: {

                }
            },
            checkRule: {
                string: {
                    useAiCheck: {
                        canEdit: true,
                        value: true
                    },
                    similarity: {
                        canEdit: true,
                        value: 1
                    }
                },
                number: {
                    useAiCheck: {
                        canEdit: true,
                        value: true
                    },
                    min: {
                        canEdit: true,
                        value: null
                    },
                    max: {
                        canEdit: true,
                        value: null
                    },
                    relativeError: {
                        canEdit: true,
                        value: 0.2
                    }
                },
                date: {
                    useAiCheck: {
                        canEdit: true,
                        value: false
                    },
                    isEqual: {
                        canEdit: false,
                        value: true
                    }
                },
                time: {
                    useAiCheck: {
                        canEdit: true,
                        value: false
                    },
                    isEqual: {
                        canEdit: false,
                        value: true
                    }
                },
                datetime: {
                    useAiCheck: {
                        canEdit: true,
                        value: false
                    },
                    isEqual: {
                        canEdit: false,
                        value: true
                    }
                },
                boolean: {
                    useAiCheck: {
                        canEdit: true,
                        value: false
                    },
                    isEqual: {
                        canEdit: false,
                        value: true
                    }
                },
                array: {
                    useAiCheck: {
                        canEdit: true,
                        value: false
                    },
                    isEqual: {
                        canEdit: false,
                        value: true
                    }
                },
                object: {
                    useAiCheck: {
                        canEdit: true,
                        value: false
                    },
                    isEqual: {
                        canEdit: false,
                        value: true
                    }
                }
            }
        }
    }
})

const saveBlock = () => {

}

const deleteBlock = () => {

}

const addOption = () => {

}

</script>
<style scoped></style>