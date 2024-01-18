<template>
    <el-container style="padding: 0;">
        <header :class="headrClass">
            <a href="/" class="logo"><img src="@/assets/images/产业资源管理平台.svg" alt=""></a>
            <div class="menu">
                <div class="navs">
                    <div class="item">
                        <a href="/">我的项目</a>
                    </div>
                    <div class="item hasnav">
                        <a href="/mycourse">我的课程</a>
                    </div>
                    <div class="item hasnav">
                        <a href="/grade">我的成绩</a>
                    </div>
                </div>
            </div>
            <div>
                <el-dropdown trigger="click">
                    <el-icon size="40px">
                        <UserFilled />
                    </el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <router-link to="/account"><el-dropdown-item>账户信息</el-dropdown-item></router-link>
                            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </header>
        <el-main style="margin-top: 100px; ">
            <!-- <div v-if="windowWidth > 1000" class="left-aside"> </div> -->
            <div class="maincontainer">
                <RouterView :key="$route.path" />
            </div>
            <!-- <div v-if="windowWidth > 1000" class="right-aside"></div> -->
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import router from '@/router';
import { Logout } from '@/apis/logout'
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';


const logout = async () => {
    await Logout().then(res => {
        if (res.state == 200) {
            ElMessage.success("退出成功")
        } else {
            ElMessage.error("退出失败")
        }
        router.push('/login')
    })
}

const down = ref({
    top: 20,
    background: "",
})
const headrClass = ref('')

const handleScroll = () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop) {
        headrClass.value = "down"
    } else {
        headrClass.value = ""
    }
}
// 屏幕宽度
const windowWidth = ref(0)
// 屏幕高度
const windowHeight = ref(0)
// 生命周期
onMounted(() => {
    getWindowResize()
    window.addEventListener('resize', getWindowResize)
})
// 获取屏幕尺寸
const getWindowResize = function () {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
}

window.addEventListener("scroll", handleScroll)
</script>

<style scoped>
@import "@/styles/mainPadding/padding.css";

.left-aside,
.right-aside {
    min-width: 13.8021vw;
}

.maincontainer {
    min-height: 100%;
    flex-grow: 1;
    padding-top: 10px;
}

/* .maincontainer::-webkit-scrollbar {
    width: 3px
} */

.el-container,
.el-main {
    min-height: 100%;
    background: #f2faff;
    display: flex;
    flex-direction: row;
    padding: 20px 3.125vw;
}

/* .el-main::-webkit-scrollbar {
    color: #33b8b9;
} */

header {
    width: 100%;
    position: fixed;
    height: 100px;
    /* border-bottom: 1px solid var(--el-border-color); */
    margin-right: 10px;
    top: 20px;
    z-index: 999;
    display: flex;
    align-items: center;
    padding: 0 3.125vw;
    transition: all 0.3s;
}

header .logo {
    width: 164px;
    display: block;
    margin-right: calc(13.8021vw - 164px);
}

.down {
    top: 0;
    background: #fff;
    box-shadow: 0 3px 6px 0px rgb(0 0 0 / 5%);
}

.menu {
    display: flex;
    height: 100px;
    flex: 1;
    font-size: 16px;
}

.navs,
.item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 2.5vw;
    position: relative;
    height: 100px;
}

.hasnav {
    position: static !important;
}

header .navs .item>a {
    font-size: 16px;
    color: #333;
    transition: all .3s;
    position: relative;
    display: block;
}

header .navs .item>a::after {
    content: '';
    right: 0;
    transition: all .5s;
    bottom: -8px;
    height: 2px;
    background: #33b8b9;
    position: absolute;
    width: 0;
}

a,
a:link,
a:visited,
a:hover,
a:active {
    outline: 0;
    text-decoration: none;
    background: none;
}



@media (min-width:1200px) {
    header .navs .item>a:hover {
        color: #33b8b9;
    }

    header .navs .item>a:hover:after {
        width: 100%;
        right: auto;
        left: 0;
    }

    header .language a:hover {
        color: #33b8b9;
    }

    .foot1 dd a:hover {
        color: #33b8b9;
    }

    .linkbox .after a:hover {
        color: #33b8b9;
    }

    .pages a:hover {
        color: #33b8b9;
    }

    .page1:hover {
        color: #33b8b9;
    }

    .right-menu .item:hover:after {
        transform: translateY(0);
    }

    .right-menu .item:hover img:nth-child(1) {
        opacity: 0;
    }

    .right-menu .item:hover img:nth-child(2) {
        opacity: 1;
    }
}
</style>