<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceStore } from '../../stores/resource'
import { useUserStore } from '../../stores/user'

const store = useResourceStore()
const router = useRouter()
const userStore = useUserStore()
const activeUserDetail = reactive(userStore.activeUser)

onMounted(() => {
  checkActiveUser()
})

function checkActiveUser () {
  if (activeUserDetail.length > 0) {
  } else {
    router.push('/sign-in')
  }
}

let routeName = useRouter().currentRoute.value.name

let mode = ref(false)
let editId = ref(null)
const form = reactive({
  name: null,
  rid: null,
  ipAddress: null,
  type: null,
  status: null,
  dateIn: null,
  dateOut: null,
  bookingname: null,
  bookingemailId: null,
  team: null
})

function clear () {
  form.name = null
  form.rid = null
  form.ipAddress = null
  form.type = null
  form.status = null
  form.dateIn = null
  form.dateOut = null
  form.bookingname = null
  form.bookingemailId = null
  form.team = null
}

onMounted(() => {
  store.fetchResource()
})

async function submitResource () {
  if (
    !form.name ||
    !form.rid ||
    !form.ipAddress ||
    !form.type ||
    !form.status
  ) {
    return alert('Please enter the all fields')
  }
  if (editId.value != null) {
    await store.updateResource(form, editId.value)
    editId.value = null
    clear()
    formOpen()
  } else {
    await store.addResource(form)
    clear()
    formOpen()
  }
  store.fetchResource()
}

function deleteResource (id) {
  if (confirm('Do want to delete this resource') == true) {
    store.deleteResource(id)
  }
}

function editResource (id) {
  formOpen()
  editId.value = id
  let result = store.resources.find(res => res.id === id)
  form.name = result.name
  form.rid = result.rid
  form.ipAddress = result.ipAddress
  form.type = result.type
  form.status = result.status
  form.dateIn = result.dateIn
  form.dateOut = result.dateOut
  form.bookingname = result.bookingname
  form.bookingemailId = result.bookingemailId
  form.team = result.team
}

function formOpen () {
  mode.value = !mode.value
}
</script>

<template>
  <div class="pagetitle pb-2">
    <h1>Manage {{ routeName }}</h1>
  </div>
  <section class="section">
    <div class="row">
      <div class="col-lg-12" style="min-height: calc(100vh - 150px)">
        <div class="card" v-if="mode">
          <div class="card-body pb-5">
            <form @submit.prevent="submitResource">
              <div class="row g-3 pt-4">
                <div class="col-md-4">
                  <label for="inputName5" class="form-label">Name</label
                  ><input
                    type="text"
                    id="inputName5"
                    class="form-control"
                    v-model="form.name"
                  />
                </div>
                <div class="col-md-4">
                  <label for="inputName5" class="form-label">Id</label
                  ><input
                    type="text"
                    id="inputName5"
                    class="form-control"
                    v-model="form.rid"
                  />
                </div>
                <div class="col-md-4">
                  <label for="inputName5" class="form-label">IP Address</label
                  ><input
                    type="text"
                    id="inputName5"
                    class="form-control"
                    v-model="form.ipAddress"
                  />
                </div>
                <div class="col-md-6">
                  <label for="inputState" class="form-label">Type</label
                  ><select
                    id="inputState"
                    class="form-select"
                    v-model="form.type"
                  >
                    <option value="" disabled>Choose...</option>
                    <option value="Server">Server</option>
                    <option value="VM">VM</option>
                    <option value="Device">Device</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="inputState" class="form-label">Status</label
                  ><select
                    id="inputState"
                    class="form-select"
                    v-model="form.status"
                  >
                    <option value="" disabled>Choose...</option>
                    <option value="1">Available</option>
                    <option value="2">Not Available</option>
                    <option value="3" disabled>Booked</option>
                  </select>
                </div>
                <div class="pt-4">
                  <button type="submit" class="btn btn-primary">
                    {{ !editId ? 'Save' : 'Update' }}
                  </button>
                  <button
                    type="reset"
                    class="btn btn-secondary ms-3"
                    @click="formOpen"
                  >
                    Cencel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="card" v-else>
          <div class="card-body">
            <div class="d-flex justify-content-end align-items-center pt-4">
              <button
                class="btn btn-success btn-sm"
                type="button"
                @click="formOpen"
                v-if="activeUserDetail.length && activeUserDetail[0].roles == 'admin'"
              >
                <i class="bi bi-plus-circle" style="margin-right: 5px"></i>
                Add Resource
              </button>
            </div>
            <!-- Table with stripped rows -->
            <table class="table table-striped" style="vertical-align: middle">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Id</th>
                  <th scope="col">Type</th>
                  <th scope="col">IP Address</th>
                  <th scope="col">Status</th>
                  <th scope="col">Booked by</th>
                  <th scope="col">Period</th>
                  <th scope="col">Team</th>
                  <th scope="col" v-if="activeUserDetail.length && activeUserDetail[0].roles == 'admin'">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in store.resources" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.rid }}</td>
                  <td scope="row">{{ item.type }}</td>
                  <td>{{ item.ipAddress }}</td>
                  <td>
                    <button
                      v-if="item.status == 1"
                      type="button"
                      class="btn btn-success btn-sm"
                    >
                      Book Now
                    </button>
                    <p
                      v-else
                      class="fw-bolder m-0"
                      :class="item.status == 2 ? 'text-danger' : 'text-success'"
                    >
                      {{ item.status == 2 ? 'Not Avaiable' : 'Booked' }}
                    </p>
                  </td>
                  <td>
                    {{ item.bookingname }}<br /><span style="font-size: 12px">{{
                      item.bookingemailId
                    }}</span>
                  </td>
                  <td>{{ item.dateIn }} - {{ item.dateOut }}</td>
                  <td>{{ item.team }}</td>
                  <td v-if="activeUserDetail.length && activeUserDetail[0].roles == 'admin'">
                    <button
                      type="button"
                      class="btn btn-sm btn-secondary mx-1"
                      @click="editResource(item.id)"
                      :title="item.id"
                    >
                      <i class="bi bi-pencil-fill"></i>
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
              </tbody>
            </table>
            <!-- End Table with stripped rows -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
