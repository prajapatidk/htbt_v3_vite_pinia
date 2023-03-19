<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useResourceStore } from '../../stores/resource'
import { msgType, confirmationMsg } from '@/utils/constant'

let router = useRouter()
let routeName = useRouter().currentRoute.value.name
let userStr = useUserStore()
let resourceStr = useResourceStore()
let userDetail = ref({})
let responseMsg = ref({})
let search = ref('')

onMounted(() => {
  resourceStr.fetchAlldraft()
  checkActiveUser()
})

let checkActiveUser = async () => {
  await userStr.activeUser()
  userDetail.value = userStr.activeUserDetail
  if (userDetail.value.roles == 'USER') {
    return router.push('/')
  }
}

let restoreResource = async id => {
  try {
    if (confirm(confirmationMsg.restore) == true) {
      let result = await resourceStr.restoreResource(id)
      if (result.status == 200) {
        responseMsg.value = {
          type: msgType.success,
          msg: result.data
        }
      }
    }
  } catch (err) {
    responseMsg.value = {
      type: msgType.failed,
      msg: err.response.data.message
    }
  }
}

let deleteResource = async id => {
  try {
    if (confirm(confirmationMsg.delete) == true) {
      let result = await resourceStr.deleteResource(id)
      if (result.status == 200) {
        responseMsg.value = {
          type: msgType.success,
          msg: result.data
        }
      }
    }
  } catch (err) {
    responseMsg.value = {
      type: msgType.failed,
      msg: err.response.data.message
    }
  }
}

const resourceData = computed(() => {
  return search.value
    ? resourceStr.draftResources.filter(
        item =>
          item.name.toLowerCase().includes(search.value) ||
          item.type.toLowerCase().includes(search.value) ||
          item.ipAddress.toLowerCase().includes(search.value) ||
          item.console.toLowerCase().includes(search.value) ||
          item.mgmtport.toLowerCase().includes(search.value) ||
          item.model.toLowerCase().includes(search.value) ||
          item.aca.toLowerCase().includes(search.value)
      )
    : resourceStr.draftResources
})
</script>

<template>
  <div class="d-flex align-items-center pagetitle pb-2" style="height: 32px">
    <h1>Manage {{ routeName }}</h1>
    <p
      class="m-0 mt-1 mx-3 text-success"
      :class="responseMsg.type == 'success' ? 'text-success' : 'text-danger'"
    >
      {{ responseMsg.msg }}
    </p>
  </div>
  <section class="section">
    <div class="row">
      <div class="col-lg-12" style="min-height: calc(100vh - 125px)">
        <div class="card">
          <div class="card-body py-3">
            <div class="d-flex justify-content-end py-3">
              <div class="col-auto">
                <input
                  type="text"
                  class="form-control ml-auto"
                  v-model="search"
                />
              </div>
            </div>
            <!-- Table with stripped rows -->
            <div class="table-responsive" style="max-height: 75vh">
              <table class="table table-striped" style="vertical-align: middle">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">IP Address</th>
                    <th scope="col">Console</th>
                    <th scope="col">MGMT Pport</th>
                    <th scope="col">Model</th>
                    <th scope="col">ACA</th>
                    <th scope="col" v-if="userDetail.roles == 'ADMIN'">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="resourceData.length > 0"
                    v-for="(item, index) in resourceData"
                    :key="item.id"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td scope="row">{{ item.type }}</td>
                    <td>{{ item.ipAddress }}</td>
                    <td>{{ item.console }}</td>
                    <td>{{ item.mgmtport }}</td>
                    <td>{{ item.model }}</td>
                    <td>{{ item.aca }}</td>
                    <td>
                      <button
                        :disabled="item.status == 2"
                        type="button"
                        class="btn btn-sm btn-success mx-1"
                        @click="restoreResource(item.id)"
                      >
                        Restore
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger mx-1"
                        @click="deleteResource(item.id)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-else>
                    <td align="center" colspan="10">No data available</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- End Table with stripped rows -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
