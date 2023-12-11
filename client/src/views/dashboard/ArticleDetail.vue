<template>
    <n-form ref="formRef" :model="article" :rules="rules">
        <n-form-item path="title" label="题目">
            <n-input v-model:value="article.title" @keydown.enter.prevent placeholder="请输入题目" />
        </n-form-item>


        <n-form-item path="categoryId" label="分类">
            <n-select v-model:value="article.categoryId" :options="options" label-field="name" value-field="id"
                placeholder="请选择分类" />
        </n-form-item>

        <RichTextEditor v-model:artContent="article.content"></RichTextEditor>

        <n-form-item>
            <n-space>
                <n-button @click="updateArticle"> 提交修改 </n-button>
                <n-button @click="router.push('/dashboard/article')"> 返回列表 </n-button>
            </n-space>
        </n-form-item>

    </n-form>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore"
const adminStore = AdminStore()

import { ref, inject, reactive, h, onMounted } from "vue";
const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");

import { useRouter, useRoute, RouterLink, RouterView } from "vue-router"
const router = useRouter()
const route = useRoute()

// 引入组件
import RichTextEditor from "../../components/RichTextEditor.vue"



const article = reactive({
    title: "",
    content: "",
    categoryId: null,
    id: localStorage.getItem("blogId") || null
})

let rules = {
    title: [
        { required: true, message: "请输入题目", trigger: "blur" },
        { min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur" }
    ],
}

onMounted(() => {
    getDetail()
    getCategory()
})

const getDetail = async () => {
    let res = await axios.get(`/blog/detail?id=${article.id}`)

    if (res.data.code == 200) {
        // console.log(res.data.rows);

        article.title = res.data.rows[0].title
        article.content = res.data.rows[0].content
        article.categoryId = res.data.rows[0].category_id
    }
}


const options = ref([])
const getCategory = async () => {
    let res = await axios.get("/category/list")

    if (res.data.code == 200) {
        options.value = res.data.rows
    }
}



const updateArticle = async () => {
    let res = await axios.put("/blog/_token/update", article)
    // console.log(res);
    if (res.data.code == 200) {
        message.success("修改成功")
        router.push('/dashboard/article')
    } else {
        message.error("修改失败" + res.data.msg)
    }

}
</script>

<style lang="scss" scoped></style>