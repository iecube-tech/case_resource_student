<template>
    <div class="main">
        <div class="left">
            <div class="left-title">
                <h1>IECUBE<br>产业案例资源管理平台</h1>
            </div>
            <div class="left-img">
                <img src="@/assets/images/homeBackGround.png" alt="">
            </div>
        </div>
        <div class="right">
            <div class="right-logo">
                <img class="logo" src="@/assets/images/产业资源管理平台.svg" alt="">
            </div>
            <div class="right-index">
                <h1>欢迎回来。</h1>
            </div>
            <div class="right-form">
                <el-form class="logform" ref="ruleFormRef" status-icon :model="ruleForm" :rules="rules" :size="formSize">
                    <el-row class="input" style="text-align: left;">
                        <h4>请输入您的邮箱</h4>
                    </el-row>
                    <el-row style="margin-top: 8px; display: block; text-align: center;" class="input">
                        <el-form-item prop="email">
                            <el-input prefix-icon="User" placeholder="请输入您的邮箱" v-model="ruleForm.email">
                            </el-input>
                        </el-form-item>
                    </el-row>


                    <el-row class="input" style="text-align: left; margin-top: 5vh;">
                        <h4>请输入您的密码</h4>
                    </el-row>
                    <el-row style="margin-top: 8px; display: block; text-align: center;" class="input">
                        <el-form-item prop="password">
                            <el-input type="password" show-password prefix-icon="Lock" placeholder="请输入密码,区分大小写"
                                v-model="ruleForm.password" @keyup.enter="submitForm(ruleFormRef)"></el-input>
                        </el-form-item>
                    </el-row>
                    <!-- <el-row class="input" style="text-align: left; display: block;">
                    <el-form-item prop="clause">
                        <el-checkbox name="clause" v-model="loginfo.clause"></el-checkbox>
                        <span style="">我已阅读并同意
                            <a style="color:#409EFF" href="">服务协议</a>
                            和
                            <a style="color:#409EFF" href="">隐私政策</a>
                        </span>
                    </el-form-item>
                </el-row> -->
                    <el-row style="margin-top: 10vh;" class="input">
                        <el-button class="login" @click="submitForm(ruleFormRef)"
                            style="height: 40px; width: 18vw; background-color: #33b8b9; color: white; border-radius: 10px; box-shadow: var(--el-box-shadow-light);">
                            <h2>登 录</h2>
                        </el-button>
                    </el-row>
                    <!-- <el-row style="margin-top: 20px; display: block; text-align: center;" class="input">
                        <a style="color:#409EFF" href="/forget">忘记密码?</a>
                    </el-row> -->
                </el-form>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Login } from '@/apis/login'
import router from '@/router';
import { ElMessage } from 'element-plus';
interface RuleForm {
    email: string
    password: string
    clause: boolean
}
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    email: '',
    password: '',
    clause: true

})

const rules = reactive<FormRules>({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {
            validator: function (rule, value, callback) {
                const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (regEmail.test(value) == false) {
                    callback(new Error("请输入正确的邮箱号"));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        },
    ],
    password: [
        { required: true, min: 6, max: 20, message: '密码长度6-20', trigger: 'blur' }
    ],
    clause: [
        {
            required: true,
            validator: function (rule, value, callback) {
                if (value != true) {
                    callback(new Error('请同意服务协议和隐私条款'));
                } else {
                    callback()
                }
            }, trigger: 'change'
        }
    ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            Login(ruleForm).then(res => {
                if (res.state == 200) {
                    router.push("/")
                } else {
                    ElMessage.error(res.message)
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>
<style>
.logo {
    width: 164px;
    display: block;
    margin-right: 3vw;
}

.count,
.password {
    /* height: 10vh; */
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.input {
    width: 18vw;
    display: flex;
}

.login h2 {
    font-size: 16px;
}

.login:hover {}

.input h4 {
    font-size: 16px;
    font-weight: bold;
}

.logform {
    /* margin-top: 40px; */
}

.logo {
    width: 200px;
}

.login {
    /* margin: auto; */
    width: 500px;
    height: 600px;
    /* 垂直居中对齐的方式 */
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.main {
    /* position: absolute; */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    background: #f2faff;
}

.left {
    width: 55%;
    display: flex;
    flex-direction: column;
    padding: 4vw;
    flex-grow: 1;
}

.left h1 {
    font-size: 46px;
    color: #33b8b9;
}

.left-img {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    object-fit: cover;
}

.left-img img {
    max-width: 100%;
    /* display: block; */
    border: 0;
    width: 90%;
    height: 90%;

}

.right {
    width: 45%;
    background-color: #fff;
    padding: 5vw;
    display: flex;
    flex-direction: column;
}

.right-logo {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.right-index {
    height: 30vh;
    display: flex;
    align-items: center;
}

.right-index h1 {
    font-size: 46px;
    color: #33b8b9;
}

.right-form {
    /* flex-grow: 1; */
    justify-content: center;
    display: flex;
    flex-direction: column;
}
</style>