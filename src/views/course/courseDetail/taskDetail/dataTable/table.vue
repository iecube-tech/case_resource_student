<template>
    <div style="margin-top: 30px;">

        <div>
            <el-row>
                <span>{{ table.name }}</span>
            </el-row>

            <el-row>
                <span v-for="(item, i) in table.params" style="margin-right: 10px;">
                    {{ item.name }}:{{ item.value }}
                </span>
            </el-row>
        </div>

        <el-table style="margin-top: 10px; margin-bottom: 20px;" :data="table.rowData" border
            :row-style="{ flexGrow: 1 }">
            <el-table-column v-for="i in table.columnList.length" :key="table.columnList[i - 1].prop" align="center">
                <template #header>
                    <span>
                        {{ table.columnList[i - 1].label }}
                    </span>
                </template>

                <template #default="{ row }">
                    <span v-if="i == 1">{{ row[table.columnList[i - 1].prop] }}</span>
                    <el-input v-else type="text" v-model="row[table.columnList[i - 1].prop]" @change="handleChange" />
                    <!-- {{ scoped.row }} -->
                </template>
            </el-table-column>
        </el-table>
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
import { onBeforeMount, ref } from 'vue'

interface Table {
    id: number | null
    name: string
    params: Array<param> | any
    columnList: Array<any> | [] | any
    rowData: Array<any> | [] | any
}

onBeforeMount(() => {
    table.value = <Table>props.tableDate
})

const props = defineProps({
    tableDate: {}
})

interface param {
    name: string
    value: any
}

const table = ref<Table>({
    id: null,
    name: '',
    params: [],
    columnList: [],
    rowData: [],
})


const emit = defineEmits(['tableChanged'])

const handleChange = () => {
    emit("tableChanged")
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
    console.log(JSON.stringify(table))
}
</script>

<style>
.el-input .el-input__wrapper .el-input__inner {
    text-align: center;
}
</style>