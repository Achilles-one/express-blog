<template>
  <div class="container">
    <n-menu mode="horizontal" :options="menuOptions" default-value="home" />




    <n-divider />
    <!-- 分类查询 -->
    <n-popselect v-model:value="pageInfo.categoryId" @update:value="getBlogs" :options="formatOptions" trigger="click"
      scrollable>
      <n-button>{{ categoryName }}</n-button>
      <template #action>
        <div @click="backDefault">清空</div>
      </template>
    </n-popselect>


    <!-- 查询框 -->
    <n-form-item>
      <n-input v-model:value="pageInfo.keyword" clearable placeholder="请输入关键字查询" />
      <n-button style="margin-left: 12px" @click="getBlogs">搜索</n-button>
    </n-form-item>




    <div v-for="(blog, index) in blogs" :key="index" style="margin-bottom: 15px;">
      <n-card :title="blog.title" @click="goDetail(blog.id)">
        <div class="content" v-html="blog.content"></div>
        <!-- <div class="content">{{ blog.content }}</div> -->
        <!-- <div>文章分类：{{ blog.category_id }}</div> -->
        <div>文章分类：{{ blog.category_name }}</div>
        <div>创建时间：{{ new Date(blog.create_time).getFullYear() }}年{{ new Date(blog.create_time).getMonth() +
          1
        }}月{{ new Date(blog.create_time).getDate() }}日</div>
      </n-card>
    </div>

    <n-pagination v-model:page="pageInfo.currentPage" :page-count="pageInfo.allPageCount"
      v-model:page-size="pageInfo.pageSize" :on-update:page="changePage" />
    <n-divider />



    <div class="footer">
      <div>Power by XXX</div>
      <div>XICP备XXXXXXXX号</div>
    </div>
  </div>
</template>

<script setup>
import { AdminStore } from "../stores/AdminStore"
const adminStore = AdminStore()

import { ref, inject, reactive, h, onMounted, computed } from "vue";
const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");

import { useRouter, useRoute, RouterLink, RouterView } from "vue-router"
const router = useRouter()
const route = useRoute()



const menuOptions = [
  {
    label: () => h(RouterLink,
      { to: { path: "/" } },
      { default: () => "首页" }
    ),
    key: "home",
  },
  {
    label: () => h(RouterLink,
      { to: { path: "/login" } },
      { default: () => "后台" }
    ),
    key: "login",
  }
]


onMounted(() => {
  getBlogs()
  getCategory()
})
const blogs = ref([])
const getBlogs = async () => {
  let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.currentPage}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)

  console.log(res.data);
  if (res.data.code == 200) {
    blogs.value = res.data.data.rows

    pageInfo.allPageCount = Math.ceil(res.data.data.count / pageInfo.pageSize)

    if (formatOptions.value) {
      for (var m = 0; m < blogs.value.length; m++) {
        let temp = formatOptions.value.find((option) => option.value == blogs.value[m].category_id)

        if (temp) {
          blogs.value[m].category_name = temp.label
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
  allPageCount: 10,
  keyword: "",
  categoryId: 0
})

const changePage = (currentPage) => {
  pageInfo.currentPage = currentPage
  getBlogs()
}

// 获取分类
const formatOptions = ref([])
const getCategory = async () => {
  let res = await axios.get("/category/list")

  // console.log(res.data.rows);
  if (res.data.code == 200) {
    formatOptions.value = res.data.rows.map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  }
}

const categoryName = computed(() => {
  //获取选中的分类
  let selectedOption = formatOptions.value.find((option) => { return option.value == pageInfo.categoryId })
  console.log("com", selectedOption);
  //返回分类的名称
  return selectedOption ? selectedOption.label : "选择分类"
})


const backDefault = () => {
  pageInfo.categoryId = 0
  getBlogs()
}

const goDetail = (id) => {
  router.push({ path: "/detail", query: { id: id } })
}



</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}

.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>