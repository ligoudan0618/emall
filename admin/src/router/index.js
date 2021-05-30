import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import CategoryEdit from "../views/CategoryEdit.vue";
import CategoryList from "../views/CategoryList.vue";
import ProductEdit from "../views/ProductEdit.vue";
import ProductList from "../views/ProductList.vue";
import ReviewEdit from "../views/ReviewEdit.vue";
import ReviewList from "../views/ReviewList.vue";

import AdminUserEdit from "../views/AdminUserEdit.vue";
import AdminUserList from "../views/AdminUserList.vue";

import UserList from "../views/UserList.vue";

import SwiperEdit from "../views/SwiperEdit.vue";
import SwiperList from "../views/SwiperList.vue";

import RecommendedationEdit from "../views/RecommendedationEdit.vue";
import RecommendedationList from "../views/RecommendedationList.vue";

import OrderList from "../views/OrderList.vue";

import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    // 允许直接访问
    meta: { isPublic: true },
  },
  {
    path: "/",
    name: "Main",
    component: Main,
    children: [
      {
        path: "/categories/edit",
        name: "create",
        component: CategoryEdit,
      },
      {
        path: "/categories/list",
        name: "list",
        component: CategoryList,
      },
      {
        path: "/categories/edit/:id",
        name: "edit",
        props: true,
        component: CategoryEdit,
      },

      {
        path: "/products/edit",
        name: "create",
        component: ProductEdit,
      },
      {
        path: "/products/list",
        name: "list",
        component: ProductList,
      },
      {
        path: "/products/edit/:id",
        name: "edit",
        component: ProductEdit,
        props: true,
      },
      // 轮播图
      {
        path: "/swipers/edit",
        name: "create",
        component: SwiperEdit,
      },
      {
        path: "/swipers/list",
        name: "list",
        component: SwiperList,
      },
      {
        path: "/swipers/edit/:id",
        name: "edit",
        component: SwiperEdit,
        props: true,
      },
      // 首页推荐
      {
        path: "/recommendedation/edit",
        name: "create",
        component: RecommendedationEdit,
      },
      {
        path: "/recommendedation/list",
        name: "list",
        component: RecommendedationList,
      },
      {
        path: "/recommendedation/edit/:id",
        name: "edit",
        component: RecommendedationEdit,
        props: true,
      },

      {
        path: "/orders/list",
        name: "orders",
        component: OrderList,
      },

      {
        path: "/reviews/edit",
        name: "create",
        component: ReviewEdit,
      },
      {
        path: "/reviews/edit/:id",
        name: "edit",
        component: ReviewEdit,
        props: true,
      },
      {
        path: "/reviews/list",
        name: "reviews",
        component: ReviewList,
      },

      {
        path: "/admin_users/create",
        name: "create",
        component: AdminUserEdit,
      },
      {
        path: "/admin_users/edit/:id",
        name: "edit",
        component: AdminUserEdit,
        props: true,
      },
      {
        path: "/admin_users/list",
        name: "admin_users",
        component: AdminUserList,
      },

      {
        path: "/users/list",
        name: "users",
        component: UserList,
      },
    ],
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = new VueRouter({
  routes,
});

// 路由守卫
router.beforeEach((to, form, next) => {
  if (!to.meta.isPublic && !sessionStorage.token) {
    next("/login");
  }
  next();
});

export default router;
