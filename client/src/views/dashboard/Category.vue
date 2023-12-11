<template>
    <div>
        <n-button type="primary" @click="showAddModal = true">新增</n-button>

        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>名称</th>
                    <th>操作</th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in categoryList" :key="index">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button type="primary" @click="handleUpdate(category)">编辑</n-button>
                            <n-button type="error" @click="deleteCategory(category)">删除</n-button>
                        </n-space>
                    </td>

                </tr>

            </tbody>
        </n-table>

        <n-modal v-model:show="showAddModal">
            <n-card style="width: 600px" title="新增分类" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-input v-model:value="addCategory.name" @keydown.enter.prevent placeholder="请输入分类名称" />
                <template #footer>
                    <n-space>
                        <n-button type="primary" @click="handleAdd">确认</n-button>
                        <n-button type="error" @click="showAddModal = false">取消</n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>

        <n-modal v-model:show="showUpdateModal">
            <n-card style="width: 600px" title="编辑分类" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-input v-model:value="updateCategory.name" @keydown.enter.prevent placeholder="请输入分类名称" />
                <template #footer>
                    <n-space>
                        <n-button type="primary" @click="updateMsg">确认</n-button>
                        <n-button type="error" @click="showUpdateModal = false">取消</n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
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

const categoryList = ref([])
const showAddModal = ref(false)
const addCategory = reactive({
    name: ""
})


const showUpdateModal = ref(false)
const updateCategory = reactive({
    name: "",
    id: 0
})

onMounted(() => {
    loadDatas()
})

const loadDatas = async () => {
    let res = await axios.get("/category/list")

    if (res.data.code == 200) {
        categoryList.value = res.data.rows
    }
}

// 新增
const handleAdd = async () => {
    // 需要将token一起传过去
    // , { headers: { token: adminStore.token } }
    let res = await axios.post("/category/_token/add", { name: addCategory.name })
    console.log(res);
    if (res.data.code == 200) {
        loadDatas()
        showAddModal.value = false
        message.success("新增成功")

    } else {
        message.error("新增失败" + res.data.msg)

    }
}

// 删除
const deleteCategory = async (category) => {

    dialog.warning({
        title: "删除",
        content: "你确定删除" + category.name,
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {

            let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
            console.log(res);
            if (res.data.code == 200) {
                loadDatas()
                message.success("删除成功")
            } else {
                message.error("删除失败" + res.data.msg)
            }
        },
        onNegativeClick: () => { }
    });
}


// 修改
const handleUpdate = (category) => {
    updateCategory.name = category.name
    updateCategory.id = category.id

    showUpdateModal.value = true
}

const updateMsg = async () => {
    let res = await axios.put("/category/_token/update", { id: updateCategory.id, name: updateCategory.name })
    console.log(res);
    if (res.data.code == 200) {
        loadDatas()
        showUpdateModal.value = false
        message.success("编辑成功")
    } else {
        message.error("编辑失败" + res.data.msg)
    }
}



</script>

<style lang="scss" scoped></style>