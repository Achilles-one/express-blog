<template>
    <div>
        <n-space vertical>
            <n-layout has-sider>
                <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
                    show-trigger @collapse="collapsed = true" @expand="collapsed = false">
                    <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
                </n-layout-sider>
                <n-layout>
                    <RouterView />
                </n-layout>
            </n-layout>
        </n-space>
    </div>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore"
const adminStore = AdminStore()

import { ref, inject, reactive, h } from "vue";
const axios = inject("axios");
const message = inject("message");

import { useRouter, useRoute, RouterLink, RouterView } from "vue-router"
const router = useRouter()
const route = useRoute()


const menuOptions = [
    {
        label: () => h(RouterLink, { to: { path: "/dashboard/article", } }, { default: () => "文章管理" }),
        key: "article",
    },
    {
        label: () => h(RouterLink, { to: { path: "/dashboard/category", } }, { default: () => "分类管理" }),
        key: "category",
    },
    {
        label: () => h(RouterLink, { to: { path: "/login", } }, { default: () => "退出" }),
        key: "login",
    }
];

const collapsed = ref(false)


</script>

<style lang="scss" scoped>
.n-layout-sider {
    height: 100vh;
}
</style>