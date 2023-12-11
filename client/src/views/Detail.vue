<template>
    <div class="container">
        <n-button @click="router.push('/')">返回首页</n-button>

        <n-h1 align-text>{{ article.title }}</n-h1>
        <n-space>
            <div>文章分类：{{ categoryName }}</div>

            <div>创建时间：{{ new Date(article.create_time).getFullYear() }}年{{ new Date(article.create_time).getMonth() +
                1
            }}月{{ new Date(article.create_time).getDate() }}日</div>
        </n-space>
        <div v-html="article.content"></div>

    </div>
</template>

<script setup>
import { AdminStore } from "../stores/AdminStore"
const adminStore = AdminStore()

import { ref, inject, reactive, h, onMounted } from "vue";
const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");

import { useRouter, useRoute, RouterLink, RouterView } from "vue-router"
const router = useRouter()
const route = useRoute()


const article = ref({})


onMounted(() => {
    getDetail()

})

const getDetail = async () => {
    let res = await axios.get("/blog/detail?id=" + route.query.id)

    if (res.data.code == 200) {
        // console.log(res.data.rows);
        article.value = res.data.rows[0]

        getCategory()
    }
}

const categoryName = ref("")
const getCategory = async () => {
    let res = await axios.get("/category/list")

    if (res.data.code == 200) {
        // console.log(res.data.rows);
        categoryName.value = res.data.rows.find((val) => val.id == article.value.category_id).name
    }
}

</script>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
</style>