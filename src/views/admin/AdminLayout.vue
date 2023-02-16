<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'

let router = useRouter()
let store = useUserStore()
let userDetail = ref({})

onMounted(() => {
  checkActiveUser()
})

let checkActiveUser = async () => {
  try {
    if (!localStorage.hasOwnProperty('token')) {
      return router.push('/sign-in')
    }
    await store.activeUser()
    userDetail.value = store.activeUserDetail
  } catch (err) {
    console.log(err)
  }
}

let logOut = () => {
  localStorage.removeItem('token')
  router.push('/sign-in')
}
</script>

<template>
  <div class="admin_layout">
    <header id="header" class="header fixed-top d-flex align-items-center">
      <div class="d-flex align-items-center justify-content-between">
        <a href="index.html" class="logo d-flex align-items-center">
          <img src="@/assets/img/hrbt.webp" alt="" />
          <span class="d-none d-lg-block">HRBT</span>
        </a>
      </div>

      <nav class="header-nav ms-auto">
        <ul class="d-flex align-items-center">
          <li class="nav-item dropdown pe-3">
            <a
              class="nav-link nav-profile d-flex align-items-center pe-0"
              href="#"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle" style="font-size: 20px"></i>
              <span class="d-none d-md-block ps-2">{{
                userDetail.username
              }}</span>
            </a>

            <ul
              class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
            >
              <!-- <li>
                <a
                  class="dropdown-item d-flex align-items-center"
                  href="users-profile.html"
                >
                  <i class="bi bi-person"></i>
                  <span>My Profile</span>
                </a>
              </li>

              <li>
                <hr class="dropdown-divider" />
              </li> -->

              <li>
                <a
                  class="dropdown-item d-flex align-items-center"
                  v-on:click="logOut"
                  href="javascript:;"
                >
                  <i class="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <aside id="sidebar" class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <!-- <li class="nav-item">
          <router-link to="/" class="nav-link collapsed">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </router-link>
        </li> -->

        <li class="nav-item">
          <router-link to="/" class="nav-link collapsed">
            <i class="bi bi-tools"></i>
            <span>Resources</span>
          </router-link>
        </li>
        <li class="nav-heading">Pages</li>

        <!-- v-if="activeUserDetail.length && activeUserDetail[0].roles == 'admin'" -->
        <li class="nav-item" v-if="userDetail.roles =='ADMIN'">
          <router-link to="/users" class="nav-link collapsed">
            <i class="bi bi-people"></i>
            <span>Users</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/profile" class="nav-link collapsed">
            <i class="bi bi-person"></i>
            <span>Profile</span>
          </router-link>
        </li>

        <!-- End Profile Page Nav -->
      </ul>
    </aside>
    <!-- End Sidebar-->

    <main id="main" class="main">
      <!-- Content body -->
      <router-view />
    </main>
    <!-- End #main -->
    <!-- End #main -->

    <!-- ======= Footer ======= -->
    <!-- End Footer -->
    <a
      href="#"
      class="back-to-top d-flex align-items-center justify-content-center"
      ><i class="bi bi-arrow-up-short"></i
    ></a>
  </div>
</template>
<style>
.admin_layout {
  font-family: 'Open Sans', sans-serif;
  background: #f6f9ff;
  color: #444444;
}
</style>
