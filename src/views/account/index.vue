<template>
    <pageHeader :route=route />
    <main>
        <div class="resource">
            <el-card shadow="never">
                <template #header>
                    <div class="card-header">
                        <el-button type="primary" link :icon="Back" :size="'large'" @click="goback">返回</el-button>
                        <div>
                            <el-button type="primary" link @click="changePasswordDialog = true"> 修改密码</el-button>
                        </div>
                    </div>

                </template>
                <el-row style="padding-left: 20px;">
                    <el-col :span="8">
                        学号：{{ student.studentId }}
                    </el-col>
                    <el-col :span="8">
                        姓名：{{ student.studentName }}
                    </el-col>
                    <el-col :span="8">
                        账号信息：{{ student.email }}
                    </el-col>
                </el-row>
                <el-row style="padding-left: 20px; margin-top: 20px;">
                    <el-col :span="8">
                        学院：{{ student.collage }}
                    </el-col>
                    <el-col :span="8">
                        专业：{{ student.major }}
                    </el-col>
                    <el-col :span="8">
                        班级：{{ student.studentClass }}
                    </el-col>
                </el-row>
            </el-card>
        </div>

        <el-dialog v-model="changePasswordDialog" title="修改密码" width="50%">
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="原密码:" prop="oldPassword">
                    <el-input v-model="ruleForm.oldPassword" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="新密码:" prop="newPassword">
                    <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="确认密码:" prop="checkPass">
                    <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        保存
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </main>
</template>

<script setup lang="ts">
import pageHeader from '@/components/breadcrumb/index.vue'
import { onBeforeMount, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { Back } from '@element-plus/icons-vue';
import router from '@/router';
import { getAccount } from '@/apis/student/getAccount';
import { changePassword } from '@/apis/student/changePassword';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';


const route = useRoute()

const changePasswordDialog = ref(false)

const student = ref({
    studentName: '',
    email: '',
    collage: '',
    id: null,
    major: "",
    studentClass: "",
    studentGrade: null,
    studentId: "",

})
const studentCollage = ref({
    schoolName: '',
    collageName: '',
})
const goback = () => {
    router.go(-1)
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    oldPassword: '',
    newPassword: '',
    checkPass: '',
})
const checkOldPassword = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (value.length < 6 || value.length > 20) {
            callback(new Error('密码长度6到20位'))
        }
    }
    callback()
}
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入新密码'))
    } else {
        if (value.length < 6 || value.length > 20) {
            callback(new Error('密码长度6到20位'))
        }
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请确认密码'))
    } else if (value !== ruleForm.newPassword) {
        callback(new Error("两次密码不一致!"))
    } else {
        callback()
    }
}
const rules = reactive<FormRules<typeof ruleForm>>({
    oldPassword: [{ validator: checkOldPassword, trigger: 'blur' }],
    newPassword: [{ validator: validatePass, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],

})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            const data = Object.assign({}, ruleForm)
            changePassword(data).then(res => {
                if (res.state == 200) {
                    changePasswordDialog.value = false
                    ruleForm.oldPassword = ''
                    ruleForm.newPassword = ''
                    ruleForm.checkPass = ''
                    ElMessage({
                        message: '修改成功',
                        type: 'success'
                    })
                } else {
                    ElMessage.error(res.message)
                }
            })
        } else {
            ElMessage({
                message: '请正确完善表单内容',
                type: 'warning'
            })
            return false
        }
    })
}

const changeValue = () => {
    ruleForm.oldPassword = ''
    ruleForm.newPassword = ''
    ruleForm.checkPass = ''
}

onBeforeMount(async () => {
    await getAccount().then(res => {
        if (res.state == 200) {
            student.value = res.data
        }
    })
})
</script>

<style scoped>
main {
    width: 100%;
    height: 100%;
    display: flex;
}

.aside {
    width: calc(164px + 4.8vw);
}


.resource {
    flex-grow: 1;
}

.right_aside {
    width: calc(164px + 4.8vw);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>