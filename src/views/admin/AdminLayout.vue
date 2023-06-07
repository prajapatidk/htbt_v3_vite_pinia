<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted, reactive } from "vue";
import * as XLSX from "xlsx";
import axios from "axios";
import { useUserStore } from "../../stores/user";
import { useResourceStore } from "../../stores/resource";

let resourceStr = useResourceStore();
let router = useRouter();
let store = useUserStore();
let disabledEvent = ref(false);
let userDetail = ref({});
let formData = reactive();

onMounted(() => {
  checkActiveUser();
});

let checkActiveUser = async () => {
  try {
    if (!localStorage.hasOwnProperty("token")) {
      return router.push("/sign-in");
    }
    await store.activeUser();
    userDetail.value = store.activeUserDetail;
  } catch (err) {
    logOut();
  }
};

let importFile = (event) => {
  let file = event.target.files[0];
  formData = new FormData();
  formData.append("file", file);
};
let uploadExcelFile = () => {
  disabledEvent.value = true;
  axios
    .post("upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(() => {
      resourceStr.fetchAll();
      disabledEvent.value = false;
    });
};

let logOut = () => {
  localStorage.removeItem("token");
  router.push("/sign-in");
};
</script>

<template>
  <div
    class="modal fade"
    id="uploadExcelFile"
    tabindex="-1"
    aria-labelledby="uploadExcelFile"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Upload File</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="col-12 pt-2 pb-4">
            <label for="inputPassword4" class="form-label">Excel File</label>
            <input class="form-control" type="file" v-on:change="importFile" />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="reset"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <button
            class="btn btn-primary"
            type="submit"
            :disabled="disabledEvent"
            @click="uploadExcelFile"
          >
            <span
              v-if="disabledEvent"
              class="spinner-grow spinner-grow-sm"
            ></span>
            Upload file
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="admin_layout">
    <header id="header" class="header fixed-top d-flex align-items-center">
      <div class="d-flex align-items-center justify-content-between">
        <router-link to="/" class="logo d-flex align-items-center">
          <img src="@/assets/img/hrbt.webp" alt="" />
          <span class="d-none d-lg-block">HRBT</span>
        </router-link>
      </div>

      <nav class="header-nav ms-auto">
        <ul class="d-flex align-items-center">
          <li class="nav-item dropdown" v-if="userDetail.roles == 'ADMIN'">
            <a
              href="javascript:;"
              class="nav-link nav-icon"
              data-bs-toggle="modal"
              data-bs-target="#uploadExcelFile"
            >
              <i class="bi bi-upload"></i>
            </a>
          </li>
          <li class="nav-item dropdown" v-if="userDetail.roles == 'ADMIN'">
            <a
              href="http://localhost:7788/download"
              download=""
              class="nav-link nav-icon"
            >
              <i class="bi bi-download"></i>
            </a>
          </li>
          <!-- <li class="nav-item dropdown" v-if="userDetail.roles == 'ADMIN'">
            <a href="javascript:;" v-on:click="download" class="nav-link nav-icon">
              <i class="bi bi-download"></i>
            </a>
          </li> -->
          <li class="nav-item dropdown pe-3">
            <a
              class="nav-link nav-profile d-flex align-items-center pe-0"
              href="#"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle" style="font-size: 20px"></i>
              <span class="d-none d-md-block ps-2 text-capitalize">{{
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
        <li class="nav-item">
          <router-link to="/" class="nav-link" exact-active-class="collapsed">
            <i class="bi bi-house-door"></i>
            <span>Home</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/resource"
            class="nav-link"
            exact-active-class="collapsed"
          >
            <i class="bi bi-tools"></i>
            <span>Resources</span>
          </router-link>
        </li>

        <li class="nav-item" v-if="userDetail.roles == 'ADMIN'">
          <router-link
            to="/draft-resources"
            class="nav-link"
            exact-active-class="collapsed"
          >
            <i class="bi bi-trash"></i>
            <span>Draft Items</span>
          </router-link>
        </li>

        <li class="nav-heading">Pages</li>

        <!-- v-if="activeUserDetail.length && activeUserDetail[0].roles == 'admin'" -->
        <li class="nav-item" v-if="userDetail.roles == 'ADMIN'">
          <router-link
            to="/users"
            class="nav-link"
            exact-active-class="collapsed"
          >
            <i class="bi bi-people"></i>
            <span>Users</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/profile"
            class="nav-link"
            exact-active-class="collapsed"
          >
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
  background: #f6f9ff;
  color: #444444;
}
</style>
