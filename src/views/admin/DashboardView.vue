<script setup>
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { useResourceStore } from '../../stores/resource'

let userStr = useUserStore()
let resourceStr = useResourceStore()

onMounted(() => {
  resourceStr.fetchAll()
  resourceStr.fetchAlldraft()
  userStr.fetchUser()
})

// Resource
const totalResources = computed(() => {
  return resourceStr.resources.length
})

const bookedResources = computed(() => {
  let result = resourceStr.resources.filter(item => item.status == 2)
  return result.length
})

const availableResources = computed(() => {
  let result = resourceStr.resources.filter(item => item.status == 1)
  return result.length
})

// Draft
const draftResources = computed(() => {
  return resourceStr.draftResources.length
})

//Users
const totalUsers = computed(() => {
  return userStr.users.length
})

const activeUsers = computed(() => {
  let result = userStr.users.filter(item => item.status == "ACTIVE")
  return result.length
})

const inactiveUsers = computed(() => {
  let result = userStr.users.filter(item => item.status == "INACTIVE")
  return result.length
})
</script>

<template>
  <section class="section dashboard">
    <div class="row" style="min-height: calc(100vh - 80px)">
      <div class="col-lg-8">
        <div class="row">
          <!-- Sales Card -->
          <div class="col-xxl-4 col-md-6">
            <div class="card info-card sales-card">
              <div class="card-body">
                <h5 class="card-title">Resoures</h5>
                <div class="d-flex align-items-center">
                  <div
                    class="card-icon rounded-circle d-flex align-items-center justify-content-center"
                  >
                    <!-- <i class="bi bi-cart"></i> -->
                    <i class="bi bi-tools"></i>
                  </div>
                  <div class="ps-3">
                    <h6>{{ totalResources }}</h6>
                    <span class="text-success small pt-1 fw-bold">{{
                      availableResources
                    }}</span>
                    <span class="text-muted small pt-2 ps-1">Available</span> |
                    <span class="text-success small pt-1 fw-bold">{{
                      bookedResources
                    }}</span>
                    <span class="text-muted small pt-2 ps-1">Booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Sales Card -->
          <!-- Revenue Card -->
          <div class="col-xxl-4 col-md-6">
            <div class="card info-card customers-card">
              <div class="card-body">
                <h5 class="card-title">Draft Resoures</h5>
                <div class="d-flex align-items-center">
                  <div
                    class="card-icon rounded-circle d-flex align-items-center justify-content-center"
                  >
                    <i class="bi bi-tools"></i>
                  </div>
                  <div class="ps-3">
                    <h6>{{ draftResources }}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Revenue Card -->
          <div class="col-xxl-4 col-xl-12">
            <div class="card info-card revenue-card">
              <div class="card-body">
                <h5 class="card-title">Users</h5>
                <div class="d-flex align-items-center">
                  <div
                    class="card-icon rounded-circle d-flex align-items-center justify-content-center"
                  >
                    <i class="bi bi-people"></i>
                  </div>
                  <div class="ps-3">
                    <h6>{{ totalUsers }}</h6>
                    <span class="text-success small pt-1 fw-bold">{{ activeUsers }}</span>
                    <span class="text-muted small pt-2 ps-1">Active</span> |
                    <span class="text-success small pt-1 fw-bold">{{ inactiveUsers }}</span>
                    <span class="text-muted small pt-2 ps-1">Inactive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="card top-selling overflow-auto">
              <div class="filter">
                <a class="icon" href="#" data-bs-toggle="dropdown"
                  ><i class="bi bi-three-dots"></i
                ></a>
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li class="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>
                  <li><a class="dropdown-item" href="#">Today</a></li>
                  <li><a class="dropdown-item" href="#">This Month</a></li>
                  <li><a class="dropdown-item" href="#">This Year</a></li>
                </ul>
              </div>
              <div class="card-body pb-0">
                <h5 class="card-title">Top Selling <span>| Today</span></h5>
                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Preview</th>
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      <th scope="col">Sold</th>
                      <th scope="col">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        <a href="#"
                          ><img src="@/assets/img/product-1.jpg" alt=""
                        /></a>
                      </th>
                      <td>
                        <a href="#" class="text-primary fw-bold"
                          >Ut inventore ipsa voluptas nulla</a
                        >
                      </td>
                      <td>$64</td>
                      <td class="fw-bold">124</td>
                      <td>$5,828</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#"
                          ><img src="@/assets/img/product-2.jpg" alt=""
                        /></a>
                      </th>
                      <td>
                        <a href="#" class="text-primary fw-bold"
                          >Exercitationem similique doloremque</a
                        >
                      </td>
                      <td>$46</td>
                      <td class="fw-bold">98</td>
                      <td>$4,508</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#"
                          ><img src="@/assets/img/product-3.jpg" alt=""
                        /></a>
                      </th>
                      <td>
                        <a href="#" class="text-primary fw-bold"
                          >Doloribus nisi exercitationem</a
                        >
                      </td>
                      <td>$59</td>
                      <td class="fw-bold">74</td>
                      <td>$4,366</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#"
                          ><img src="@/assets/img/product-4.jpg" alt=""
                        /></a>
                      </th>
                      <td>
                        <a href="#" class="text-primary fw-bold"
                          >Officiis quaerat sint rerum error</a
                        >
                      </td>
                      <td>$32</td>
                      <td class="fw-bold">63</td>
                      <td>$2,016</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#"
                          ><img src="@/assets/img/product-5.jpg" alt=""
                        /></a>
                      </th>
                      <td>
                        <a href="#" class="text-primary fw-bold"
                          >Sit unde debitis delectus repellendus</a
                        >
                      </td>
                      <td>$79</td>
                      <td class="fw-bold">41</td>
                      <td>$3,239</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- End Customers Card -->
        </div>
      </div>
      <div class="col-lg-4">
        <!-- Recent Activity -->

        <div class="card">
          <div class="filter">
            <a class="icon" href="#" data-bs-toggle="dropdown"
              ><i class="bi bi-three-dots"></i
            ></a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li class="dropdown-header text-start">
                <h6>Filter</h6>
              </li>
              <li><a class="dropdown-item" href="#">Today</a></li>
              <li><a class="dropdown-item" href="#">This Month</a></li>
              <li><a class="dropdown-item" href="#">This Year</a></li>
            </ul>
          </div>
          <div class="card-body pb-0">
            <h5 class="card-title">News &amp; Updates <span>| Today</span></h5>
            <div class="news">
              <div class="post-item clearfix">
                <img src="@/assets/img/news-1.jpg" alt="" />
                <h4><a href="#">Nihil blanditiis at in nihil autem</a></h4>
                <p>
                  Sit recusandae non aspernatur laboriosam. Quia enim eligendi
                  sed ut harum...
                </p>
              </div>
              <div class="post-item clearfix">
                <img src="@/assets/img/news-2.jpg" alt="" />
                <h4><a href="#">Quidem autem et impedit</a></h4>
                <p>
                  Illo nemo neque maiores vitae officiis cum eum turos elan
                  dries werona nande...
                </p>
              </div>
              <div class="post-item clearfix">
                <img src="@/assets/img/news-3.jpg" alt="" />
                <h4>
                  <a href="#">Id quia et et ut maxime similique occaecati ut</a>
                </h4>
                <p>
                  Fugiat voluptas vero eaque accusantium eos. Consequuntur sed
                  ipsam et totam...
                </p>
              </div>
              <div class="post-item clearfix">
                <img src="@/assets/img/news-4.jpg" alt="" />
                <h4><a href="#">Laborum corporis quo dara net para</a></h4>
                <p>
                  Qui enim quia optio. Eligendi aut asperiores enim
                  repellendusvel rerum cuder...
                </p>
              </div>
              <div class="post-item clearfix">
                <img src="@/assets/img/news-5.jpg" alt="" />
                <h4>
                  <a href="#">Et dolores corrupti quae illo quod dolor</a>
                </h4>
                <p>
                  Odit ut eveniet modi reiciendis. Atque cupiditate libero
                  beatae dignissimos eius...
                </p>
              </div>
            </div>
            <!-- End sidebar recent posts-->
          </div>
        </div>
        <!-- End Recent Activity -->
      </div>
    </div>
  </section>
</template>
