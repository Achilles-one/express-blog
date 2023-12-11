<template>
    <div class="login-panel">
        <n-card title="管理后台登录">

            <n-form ref="formRef" :model="admin" :rules="rules">
                <n-form-item path="account" label="账号">
                    <n-input v-model:value="admin.account" @keydown.enter.prevent placeholder="请输入账号" />
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="admin.password" type="password" @keydown.enter.prevent placeholder="请输入密码" />
                </n-form-item>
            </n-form>

            <template #footer>
                <n-space>
                    <n-checkbox v-model:checked="admin.remeber" label="记住我" />
                    <n-button @click="login">登录</n-button>
                    <n-button @click="router.push('/')">回到首页</n-button>
                </n-space>
            </template>
        </n-card>
    </div>
</template>

<script setup>
import { AdminStore } from "../stores/AdminStore"
const adminStore = AdminStore()

import { inject, reactive } from "vue";
const axios = inject("axios");
const message = inject("message");

import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()

let rules = {
    account: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur" }
    ],
}

const admin = reactive({
    account: localStorage.getItem("account") || "",
    password: localStorage.getItem("password") || "",
    remeber: localStorage.getItem("remeber") == 1 || false,
})


const login = async () => {
    let result = await axios.post("/admin/login", {
        account: admin.account,
        password: admin.password
    })

    if (result.data.code == 200) {
        adminStore.token = result.data.data.token;
        adminStore.account = result.data.data.account;
        adminStore.id = result.data.data.id;

        if (admin.remeber) {
            localStorage.setItem("account", admin.account)
            localStorage.setItem("password", admin.password)
            localStorage.setItem("remeber", admin.remeber ? 1 : 0)
        }
        message.success("登录成功")

        router.push("/dashboard")
    } else {
        message.error("登录失败")
    }
}

</script>

<style lang="scss" scoped>
.login-panel {
    width: 500px;
    margin: 0 auto;
    margin-top: 150px;
}
</style>