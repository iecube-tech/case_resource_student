<template>
    <div style="margin-top: 30px;">
        <el-card style="display: flex; flex-direction: column; "
            :body-style="{ display: 'flex', flexDirection: 'column', }">
            <div>
                <el-button @click="out()">输出</el-button>
            </div>
            <div>
                <el-form :model="table" label-width="100px" label-position="left" style="max-width: 500px">
                    <el-form-item label="表名：">
                        <el-input v-model="table.name" placeholder="请输入表名" />
                    </el-form-item>
                    <el-form-item label="固定参数：">
                        <el-button type="primary" size="small" @click="dialogFormVisible = true">添加</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-row>
                            <el-tag v-for="i in table.params.length" :key="i"
                                style="margin-right: 10px; margin-bottom: 20px  ;" closable @close="deleteParam(i - 1)">
                                {{ table.params[i - 1].name }}：{{ table.params[i - 1].value }}
                            </el-tag>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>

            <el-table style="margin-top: 10px; margin-bottom: 20px;" :data="table.rowData" border
                :row-style="{ flexGrow: 1 }">
                <el-table-column v-for="i in table.columnList.length" :key="table.columnList[i - 1].prop"
                    align="center">
                    <template #header>
                        <span>
                            {{ table.columnList[i - 1].label }}
                            <el-button style="margin-bottom: 2px;" v-if="i == table.columnList.length && i > 2"
                                type="danger" :icon="Delete" link @click="deleteColumn"></el-button>
                        </span>
                    </template>
                    <template #default="{ row }">
                        <el-input type="text" v-model="row[table.columnList[i - 1].prop]" @change="handleChange" />
                    </template>
                </el-table-column>
                <el-table-column align="center" width="200">
                    <template #header>
                        <el-button type="primary" size="small" @click="addRow">添加行</el-button>
                        <el-button type="primary" size="small" @click="addColumn">添加列</el-button>
                    </template>
                    <template #default="scoped">
                        <el-button type="danger" size="small" @click="deleteRow(scoped.$$index)">删除行</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>


        <el-dialog v-model="dialogFormVisible" title="添加固定参数" width="500">
            <el-form :model="param">
                <el-form-item label="参数名" label-width="100px">
                    <el-input v-model="param.name" placeholder="请输入参数名" />
                </el-form-item>
                <el-form-item label="参数值" label-width="100px">
                    <el-input v-model="param.value" placeholder="请输入参数值" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addParams()">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'
interface param {
    name: string
    value: any
}
interface table {
    name: string
    params: Array<param> | any
    columnList: Array<any> | [] | any
    rowData: Array<any> | [] | any
}
const table = ref<table>(
    {
        name: '',
        params: [],
        columnList: [
            { prop: "data0", label: '测量对象' },
            { prop: "data1", label: '测量值1' },
            { prop: "data2", label: '测量值2' },
            { prop: "data3", label: '测量值3' },
            { prop: "data4", label: '测量值4' },
            { prop: "data5", label: '测量值5' },
            { prop: "data6", label: '测量值6' },
            { prop: "data7", label: '测量值7' },
            { prop: "data8", label: '测量值8' },
            { prop: "data9", label: '测量值9' },
            { prop: "data10", label: '测量值10' }
        ],
        rowData: [
            {
                data0: null,
                data1: null,
                data2: null,
                data3: null,
                data4: null,
                data5: null,
                data6: null,
                data7: null,
                data8: null,
                data9: null,
                data10: null,
            }
        ]
    }
)

const handleChange = () => {
    // console.log(table.value)
}
const addRow = () => {
    table.value.rowData.push({})
    for (let i = 0; i < table.value.columnList.length; i++) {
        table.value.rowData.slice(-1)['data' + i] = null
    }
    handleChange()
}
const addColumn = () => {
    let size = table.value.columnList.length
    table.value.columnList.push({ prop: 'data' + size, label: '测量值' + size })
    for (let i = 0; i < table.value.rowData.length; i++) {
        table.value.rowData[i]['data' + size] = null
    }
    handleChange()
}
const deleteRow = (index: number) => {
    table.value.rowData.splice(index, 1)
    handleChange()
}

const deleteColumn = () => {
    let size = table.value.columnList.length
    table.value.columnList.splice(size - 1, 1)
    for (let i = 0; i < table.value.rowData.length; i++) {
        delete table.value.rowData[i]['data' + size]
    }
    handleChange()
}

const deleteParam = (index: number) => {
    table.value.params.splice(index, 1)
    handleChange()
}

// dialog
const dialogFormVisible = ref(false)
const param = ref({
    name: '',
    value: null
})
const addParams = () => {
    if (param.value.name != '' && param.value.value != null) {
        table.value.params.push(Object.assign({}, param.value))
        param.value.name = ''
        param.value.value = null
        dialogFormVisible.value = false
        handleChange()
    }
}
//

const out = () => {
    // console.log(JSON.stringify(table.value))
}
</script>

<style>
.el-input .el-input__wrapper .el-input__inner {
    text-align: center;
}
</style>