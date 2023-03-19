import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/landing/LoginView.vue";
import RegisterView from "../views/landing/RegisterView.vue";
import AdminLayout from "../views/admin/AdminLayout.vue";
import DashboardView from "../views/admin/DashboardView.vue";
import ResourceList from "../views/admin/ResourceList.vue";
import DraftResource from "../views/admin/DraftResource.vue";
import UserList from "../views/admin/UserList.vue";
import ProfileView from "../views/admin/ProfileView.vue";
import ForgetPassword from "../views/landing/ForgetPassword.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/sign-in",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/sign-up",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/forget-password",
      name: "Forget Password",
      component: ForgetPassword,
    },
    {
      path: "/",
      name: "Admin",
      component: AdminLayout,
      children: [
        {
          path: "",
          name: "Dashboard",
          component: DashboardView,
        },
        {
          path: "/resource",
          name: "Resources",
          component: ResourceList,
        },
        {
          path: "/users",
          name: "Users",
          component: UserList,
        },
        {
          path: "/profile",
          name: "Profile",
          component: ProfileView,
        },
        {
          path: "/draft-resources",
          name: "Draft",
          component: DraftResource,
        },
      ],
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
