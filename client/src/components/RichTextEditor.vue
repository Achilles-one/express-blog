<template>
  <div style="border: 1px solid #ccc">
     <Toolbar
       style="border-bottom: 1px solid #ccc"
       :editor="editorRef"
       :defaultConfig="toolbarConfig"
       :mode="mode"
     />
     <Editor
       style="height: 500px; overflow-y: hidden;"
       v-model="valueHtml"
       :defaultConfig="editorConfig"
       :mode="mode"
       @onCreated="handleCreated"
       @onChange="handleChange"
     />
   </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, watch, inject } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import { AdminStore } from "../stores/AdminStore"
const adminStore = AdminStore()

// 注入服务端url
const server_url = inject("server_url")


const mode = ref('default') // 或 'simple' 



// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()




// 接收父组件的值
const props = defineProps({
 artContent: {
   type: String
 }
})

// 内容 HTML
const valueHtml = ref("")
// 监听父组件的值, 将父组件的值传给valueHtml
watch(() => props.artContent, (newVal) => {
 valueHtml.value = newVal
},{immediate: true})




// 模拟 ajax 异步获取内容
onMounted(() => {
 // setTimeout(() => {
 //     // valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
 //     // valueHtml.value = props.artContent
 // }, 1500)
})

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 排除菜单组，写菜单组 key 的值即可
toolbarConfig.excludeKeys = [
  "uploadVideo",
]

// 实现上传图片
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
  server: server_url + '/upload/_token/rich_editor_upload',
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 10 * 1024, // 10kb
  // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
  // meta: {
  //   token: adminStore.token,
  // },
  // 自定义增加 http  header，header中加入token
  headers: {
    Accept: 'text/x-json',
    token: adminStore.token,
  },
}
// 转换图片链接
editorConfig.MENU_CONF['insertImage'] = {
  parseImageSrc: (src) => {
    if (src.indexOf('http') !== 0) {
      return `${server_url}${src}`
    }
    return src
  },
}






// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
 const editor = editorRef.value
 if (editor == null) return
 editor.destroy()
})

const handleCreated = (editor) => {
 editorRef.value = editor // 记录 editor 实例，重要！
}


// 将子组件的值传给父组件
const emits = defineEmits(["update:artContent"])
const handleChange = (editor) => {
 // console.log('change:', editor.children) 

 emits("update:artContent", valueHtml.value)
}



</script>

<style lang="scss" scoped>

</style>