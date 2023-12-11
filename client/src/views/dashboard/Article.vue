<template>
    <div class="container">
        <n-tabs default-value="list" type="line" justify-content="start" animated>
            <n-tab-pane name="list" tab="文章列表" style="margin: 20px;">
                <div v-for="(blog, index) in blogs" :key="index" style="margin-bottom: 15px;">
                    <n-card :title="blog.title">
                        <div class="content" v-html="blog.content"></div>
                        <!-- <div class="content">{{ blog.content }}</div> -->
                        <!-- <div>文章分类：{{ blog.category_id }}</div> -->
                        <div>文章分类：{{ blog.category_name }}</div>
                        <div>创建时间：{{ new Date(blog.create_time).getFullYear() }}年{{ new Date(blog.create_time).getMonth() +
                            1
                        }}月{{ new Date(blog.create_time).getDate() }}日</div>
                        <template #footer>
                            <n-space>
                                <n-button @click="articleDetail(blog.id)"> 详情 </n-button>
                                <n-button @click="deleteArticle(blog)"> 删除 </n-button>
                            </n-space>
                        </template>
                    </n-card>
                </div>

                <n-pagination v-model:page="pageInfo.currentPage" :page-count="pageInfo.allPageCount"
                    v-model:page-size="pageInfo.pageSize" :on-update:page="changePage" />
            </n-tab-pane>



            <n-tab-pane name="add" tab="新增文章">
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
                        <n-button @click="addArticle"> 提交 </n-button>
                    </n-form-item>

                </n-form>
            </n-tab-pane>
        </n-tabs>
    </div>
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
    categoryId: null
})

let rules = {
    title: [
        { required: true, message: "请输入题目", trigger: "blur" },
        { min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur" }
    ],
}


onMounted(() => {
    getBlogs()
    getCategory()
})
const blogs = ref([])
const getBlogs = async () => {
    let res = await axios.get(`/blog/search?page=${pageInfo.currentPage}&pageSize=${pageInfo.pageSize}`)

    console.log(res.data);
    if (res.data.code == 200) {
        blogs.value = res.data.data.rows

        pageInfo.allPageCount = Math.ceil(res.data.data.count / pageInfo.pageSize)

        if (options.value) {
            for (var m = 0; m < blogs.value.length; m++) {
                let temp = options.value.find((option) => option.id == blogs.value[m].category_id)

                if (temp) {
                    blogs.value[m].category_name = temp.name
                } else {
                    blogs.value[m].category_name = ""
                }
            }
        }
    }
}


// 分页
const pageInfo = reactive({
    currentPage: 1,
    pageSize: 4,
    allPageCount: 10
})

const changePage = (currentPage) => {
    pageInfo.currentPage = currentPage
    getBlogs()
}







const options = ref([])
const getCategory = async () => {
    let res = await axios.get("/category/list")

    if (res.data.code == 200) {
        options.value = res.data.rows
    }
}

const addArticle = async () => {
    let res = await axios.post("/blog/_token/add", article)
    console.log(res);
    if (res.data.code == 200) {
        message.success("新增成功")

        article.title = ""
        article.content = ""
        article.categoryId = null
    } else {
        message.error("新增失败" + res.data.msg)
    }
}


const articleDetail = (id) => {
    localStorage.setItem("blogId", id)
    router.push("/dashboard/articledetail")
}


const deleteArticle = async (blog) => {
    dialog.warning({
        title: "删除",
        content: "你确定删除" + blog.title,
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {

            let res = await axios.delete(`/blog/_token/delete?id=${blog.id}`)
            console.log(res);
            if (res.data.code == 200) {
                getBlogs()
                message.success("删除成功")
            } else {
                message.error("删除失败" + res.data.msg)
            }
        },
        onNegativeClick: () => { }
    });
}


</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    overflow-y: scroll;
}

.content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>