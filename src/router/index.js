// Composables
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Login.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/DashboardView.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
      {
        path: "/category",
        name: "Category",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/category/Categories.vue"
          ),
      },
      {
        path: "/priority",
        name: "Priority",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/priority/Priorities.vue"
          ),
      },
      {
        path: "/role",
        name: "Role",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/role/Role.vue"),
      },
      {
        path: "/warehouse",
        name: "WareHouse",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/warehouse/WareHouse.vue"
          ),
      },
      {
        path: "/status",
        name: "Status",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/status/Statuses.vue"),
      },
      {
        path: "/type",
        name: "Type",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/type/Types.vue"),
      },
      {
        path: "/personwarehouse",
        name: "PersonWareHouse",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/personwarehouse/PersonWareHouse.vue"
          ),
      },
      {
        path: "/product",
        name: "Product",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/product/Product.vue"),
      },
      {
        path: "/task",
        name: "Task",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/task/Tasks.vue"),
      },
      {
        path: "/goals",
        name: "Goals",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/goal/Goals.vue"),
      },
      {
        path: "/goals-data",
        name: "GoalsData",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/goal/GoalsData.vue"),
      },
      {
        path: "/health",
        name: "Health",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/salud/History.vue"),
      },
      {
        path: "/finance",
        name: "Finance",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/finance/Finance.vue"),
      },
      {
        path: "/desire",
        name: "Desire",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/desire/Desire.vue"),
      },
      {
        path: "/file",
        name: "File",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/file/File.vue"),
      },
      {
        path: "/chat",
        name: "Chat",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/chat/Chat.vue"),
      },
      {
        path: "/homes",
        name: "Homes",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/home/Home.vue"),
      },
      {
        path: "/hometype",
        name: "Hometype",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/hometype/HomeType.vue"
          ),
      },
      {
        path: "/pets",
        name: "Pets",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/pet/Pet.vue"),
      },
      {
        path: "/suggestions",
        name: "Suggestions",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/suggestion/Suggestion.vue"
          ),
      },
      {
        path: "/initiatives",
        name: "Initiatives",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/initiative/Initiative.vue"
          ),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export default router;
