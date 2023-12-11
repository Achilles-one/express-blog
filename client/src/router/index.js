import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/detail",
      name: "detail",
      component: () => import("../views/Detail.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/dashboard/Dashboard.vue"),
      children: [
        {
          path: "/dashboard/category",
          name: "category",
          component: () => import("../views/dashboard/Category.vue"),
        },
        {
          path: "/dashboard/article",
          name: "article",
          component: () => import("../views/dashboard/Article.vue"),
        },
        {
          path: "/dashboard/articledetail",
          name: "articledetail",
          component: () => import("../views/dashboard/ArticleDetail.vue"),
        },
      ],
    },

    {
      path: "/test",
      name: "test",
      component: () => import("../views/Test.vue"),
    },
  ],
});

export default router;
