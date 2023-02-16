<script setup>
import validateResource from '@/validation/validateResource'
import validateBookingResource from '@/validation/validateBookingResource'
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { useResourceStore } from '../../stores/resource'

let userStr = useUserStore()
let store = useResourceStore()
let userDetail = ref({})
let errorsMsg = ref({})
let serverMsg = reactive({ type: '', msg: '' })
let mode = ref(false)
let editId = ref(null)
let bookId = ref(null)

let form = reactive({
  name: '',
  ipAddress: '',
  type: ''
})

let bookform = reactive({
  dateIn: '',
  dateOut: '',
  team: ''
})

onMounted(() => {
  store.fetchResource()
  checkActiveUser()
})

let checkActiveUser = async () => {
  await userStr.activeUser()
  userDetail.value = userStr.activeUserDetail
}

let submitResource = async () => {
  try {
    let { isInvalid, errors } = await validateResource(form)
    if (isInvalid) {
      return (errorsMsg.value = errors)
    }
    errorsMsg.value = {}

    if (editId.value != null) {
      let result = await store.updateResource(form, editId.value)
      console.log(result)
      if (result.status == 200) {
        serverMsg = {
          type: 'success',
          msg: 'Resource updated successfully'
        }
      }
      editId.value = null
      formOpen()
    } else {
      let result = await store.addResource(form)
      if (result) {
        serverMsg = {
          type: 'success',
          msg: 'Resource created successfully'
        }
      }
      formOpen()
    }
  } catch (err) {
    console.log(err)
  }
}

let openBookingDialog = id => {
  bookId.value = id
}

let bookResource = async () => {
  try {
    let { isInvalid, errors } = await validateBookingResource(bookform)
    if (isInvalid) {
      return (errorsMsg.value = errors)
    }
    errorsMsg.value = {}
    let result = await store.bookResource(bookform, bookId.value)
    if (result) {
      serverMsg = {
        type: 'success',
        msg: 'Resource booked successfully'
      }
    }
  } catch (err) {
    serverMsg = {
      type: 'failed',
      msg: err.response.data.message
    }
  }
}

let deleteResource = async id => {
  try {
    if (confirm('Do want to delete this resource') == true) {
      let result = await store.deleteResource(id)
      if (result.status == 200) {
        serverMsg = {
          type: 'success',
          msg: 'Resource removed successfully'
        }
      }
    }
  } catch (err) {
    serverMsg = {
      type: 'failed',
      msg: err.response.data.message
    }
  }
}

let editResource = async id => {
  formOpen()
  editId.value = id
  let result = store.resources.find(res => res.id === id)
  form.name = result.name
  form.ipAddress = result.ipAddress
  form.type = result.type
}

let formOpen = () => {
  mode.value = !mode.value
  errorsMsg.value = {}
  clear()
}

let clear = () => {
  bookId.value = null
  form.name = ''
  form.ipAddress = ''
  form.type = ''
  ;(bookform.dateIn = ''), (bookform.dateOut = ''), (bookform.team = '')
}
</script>

<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Booking resource time period
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <label for="yourName" class="form-label">Date In</label>
              <input
                type="date"
                class="form-control"
                :class="`${errorsMsg.dateIn ? 'is-invalid' : ''}`"
                v-model="bookform.dateIn"
                placeholder="Resource name"
              />
              <div class="invalid-feedback">
                {{ errorsMsg.dateIn }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="yourName" class="form-label">Date Out</label>
              <input
                type="date"
                class="form-control"
                :class="`${errorsMsg.dateOut ? 'is-invalid' : ''}`"
                v-model="bookform.dateOut"
                placeholder="Resource name"
              />
              <div class="invalid-feedback">
                {{ errorsMsg.dateOut }}
              </div>
            </div>
          </div>
          <div class="mt-2 mb-3">
            <label for="exampleInputPassword1" class="form-label">Team</label>
            <select
              id="inputState"
              class="form-select"
              :class="`${errorsMsg.team ? 'is-invalid' : ''}`"
              v-model="bookform.team"
            >
              <option value="" disabled>Choose...</option>
              <option value="Hios">Hios</option>
              <option value="HiSecOS">HiSecOS</option>
              <option value="HiLCOS">HiLCOS</option>
              <option value="Provize">Provize</option>
              <option value="Wireless">Wireless</option>
              <option value="Grtcomm">Grtcomm</option>
            </select>
            <div class="invalid-feedback">
              {{ errorsMsg.team }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="submit"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            v-on:click="bookResource"
            class="btn btn-primary"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="d-flex justify-content-between pagetitle pb-2"
    style="height: 32px"
  >
    <p
      class="m-0"
      :class="serverMsg.type == 'success' ? 'text-success' : 'text-danger'"
    >
      {{ serverMsg.msg }}
    </p>
  </div>
  <section class="section">
    <div class="row">
      <div class="col-lg-12" style="min-height: calc(100vh - 125px)">
        <div class="card">
          <div class="card-body pb-5" v-if="mode">
            <form @submit.prevent="submitResource">
              <div class="row g-3 pt-4">
                <div class="col-md-4">
                  <label for="yourName" class="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    :class="`${errorsMsg.name ? 'is-invalid' : ''}`"
                    v-model="form.name"
                    placeholder="Resource name"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.name }}
                  </div>
                </div>

                <div class="col-md-4">
                  <label for="inputState" class="form-label">Type</label
                  ><select
                    id="inputState"
                    class="form-select"
                    :class="`${errorsMsg.type ? 'is-invalid' : ''}`"
                    v-model="form.type"
                  >
                    <option value="" disabled>Choose...</option>
                    <option value="Server">Server</option>
                    <option value="VM">VM</option>
                    <option value="Device">Device</option>
                  </select>
                  <div class="invalid-feedback">
                    {{ errorsMsg.type }}
                  </div>
                </div>

                <div class="col-md-4">
                  <label for="yourName" class="form-label">IP Address</label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    :class="`${errorsMsg.ipAddress ? 'is-invalid' : ''}`"
                    v-model="form.ipAddress"
                    placeholder="IP address"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.ipAddress }}
                  </div>
                </div>

                <div class="pt-4">
                  <button
                    type="reset"
                    class="btn btn-secondary"
                    @click="formOpen"
                  >
                    Cencel
                  </button>
                  <button type="submit" class="btn btn-primary ms-3">
                    {{ !editId ? 'Save' : 'Update' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="card-body" v-else>
            <div class="d-flex align-items-center py-3">
              <button
                v-if="userDetail.roles == 'ADMIN'"
                class="btn btn-success btn-sm"
                type="button"
                @click="formOpen"
              >
                <i class="bi bi-plus-circle" style="margin-right: 5px"></i>
                Add Resource
              </button>
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
                    <th scope="col">Status</th>
                    <th scope="col">Booked by</th>
                    <th scope="col">Period</th>
                    <th scope="col">Team</th>
                    <th scope="col" v-if="userDetail.roles == 'ADMIN'">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="store.resources.length > 0"
                    v-for="(item, index) in store.resources"
                    :key="item.id"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td scope="row">{{ item.type }}</td>
                    <td>{{ item.ipAddress }}</td>
                    <td>
                      <button
                        v-if="item.status == 1"
                        type="button"
                        class="btn btn-success btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        @click="openBookingDialog(item.id)"
                      >
                        Book Now
                      </button>
                      <p
                        v-else
                        class="fw-bolder m-0"
                        :class="
                          item.status == 2 ? 'text-success' : 'text-danger'
                        "
                      >
                        {{ item.status == 2 ? 'Booked' : 'Not available' }}
                      </p>
                    </td>
                    <td>
                      {{ item.bookingname }}<br /><span
                        style="font-size: 12px"
                        >{{ item.bookingemailId }}</span
                      >
                    </td>
                    <td>
                      {{ item.dateIn }} {{ item.dateIn ? ' - ' : ''
                      }}{{ item.dateOut }}
                    </td>
                    <td>{{ item.team }}</td>
                    <td v-if="userDetail.roles == 'ADMIN'">
                      <button
                        type="button"
                        class="btn btn-sm btn-secondary mx-1"
                        @click="editResource(item.id)"
                        :title="item.id"
                      >
                        <i class="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        :disabled="item.status == 2"
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
