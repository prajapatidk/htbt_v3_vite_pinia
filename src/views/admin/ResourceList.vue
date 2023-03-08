<script setup>
import validateResource from '@/validation/validateResource'
import validateBookingResource from '@/validation/validateBookingResource'
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { useResourceStore } from '../../stores/resource'
import { msgType, confirmationMsg, team } from '@/utils/constant'

let routeName = useRouter().currentRoute.value.name
let userStr = useUserStore()
let resourceStr = useResourceStore()
let userDetail = ref({})
let errorsMsg = ref({})
let responseMsg = ref({})
let mode = ref(false)
let disabledEvent = ref(false)
let editId = ref(null)
let bookId = ref(null)

let form = reactive({
  name: '',
  type: '',
  ipAddress: '',
  console: '',
  mgmtport: '',
  model: '',
  aca: ''
})

let bookform = reactive({
  dateIn: '',
  dateOut: '',
  team: '',
  description: ''
})

onMounted(() => {
  resourceStr.fetchAll()
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
    disabledEvent.value = true
    if (editId.value != null) {
      let result = await resourceStr.updateResource(form, editId.value)
      console.log(result)
      if (result.status == 200) {
        responseMsg.value = {
          type: msgType.success,
          msg: result.data
        }
      }
      disabledEvent.value = false
      editId.value = null
      formOpen()
    } else {
      disabledEvent.value = true
      let result = await resourceStr.addResource(form)
      if (result) {
        responseMsg.value = {
          type: msgType.success,
          msg: result.data
        }
      }
      disabledEvent.value = false
      formOpen()
    }
  } catch (err) {
    responseMsg.value = {
      type: msgType.failed,
      msg: err.response.data.message
    }
  }
}

let resourceDetail = async id => {
  try {
    let result = await resourceStr.itemDetails(id)
    console.log(result)
  } catch (err) {
    responseMsg.value = {
      type: msgType.failed,
      msg: err.response.data.message
    }
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
    disabledEvent.value = true
    errorsMsg.value = {}
    let result = await resourceStr.bookResource(bookform, bookId.value)
    if (result) {
      responseMsg.value = {
        type: msgType.success,
        msg: result.data
      }
    }
    disabledEvent.value = false
  } catch (err) {
    responseMsg.value = {
      type: msgType.failed,
      msg: err.response.data.message
    }
  }
  clear()
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

let editResource = async id => {
  formOpen()
  editId.value = id
  let result = resourceStr.resources.find(res => res.id === id)
  form.name = result.name
  form.ipAddress = result.ipAddress
  form.type = result.type
  form.console = result.console
  form.mgmtport = result.mgmtport
  form.model = result.model
  form.aca = result.aca
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
  ;(form.type = ''),
    (form.console = ''),
    (form.mgmtport = ''),
    (form.model = ''),
    (form.aca = ''),
    //booking form
    (bookform.dateIn = ''),
    (bookform.dateOut = ''),
    (bookform.team = ''),
    (bookform.description = '')
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
            :disabled="disabledEvent"
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
              <option v-for="(item, index) in team" :key="index" :value="item">
                {{ item }}
              </option>
            </select>
            <div class="invalid-feedback">
              {{ errorsMsg.team }}
            </div>
          </div>
          <div class="mt-2 mb-3">
            <label class="form-label">Description</label>
            <textarea
              type="text"
              name="name"
              class="form-control"
              :class="`${errorsMsg.description ? 'is-invalid' : ''}`"
              v-model="bookform.description"
              placeholder="Description"
            ></textarea>
            <div class="invalid-feedback">
              {{ errorsMsg.description }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            :disabled="disabledEvent"
            type="submit"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="clear"
          >
            Close
          </button>
          <button
            class="btn btn-primary"
            type="button"
            :disabled="disabledEvent"
            v-on:click="bookResource"
          >
            <span
              v-if="disabledEvent"
              class="spinner-grow spinner-grow-sm"
            ></span>
            Book Resourse
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="modal fade"
    id="deviceDetailsModal"
    tabindex="-1"
    aria-labelledby="showDeviceDtails"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="showDeviceDtails">Device Details</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ resourceStr.itemDetails.name }}
        </div>
        <div class="modal-footer">
          <button
            type="submit"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="clear"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
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
          <div class="card-body pb-5" v-if="mode">
            <form @submit.prevent="submitResource">
              <div class="row g-3 pt-4">
                <div class="col-md-4">
                  <label class="form-label">Name</label>
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
                  <label class="form-label">Type</label
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
                  <label class="form-label">IP Address</label>
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

                <div class="col-md-4">
                  <label class="form-label">Console</label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    :class="`${errorsMsg.console ? 'is-invalid' : ''}`"
                    v-model="form.console"
                    placeholder="Console"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.console }}
                  </div>
                </div>

                <div class="col-md-4">
                  <label class="form-label">MGMT port</label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    :class="`${errorsMsg.mgmtport ? 'is-invalid' : ''}`"
                    v-model="form.mgmtport"
                    placeholder="MGMT port"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.mgmtport }}
                  </div>
                </div>

                <div class="col-md-4">
                  <label class="form-label">Model</label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    :class="`${errorsMsg.model ? 'is-invalid' : ''}`"
                    v-model="form.model"
                    placeholder="Model"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.model }}
                  </div>
                </div>

                <div class="col-md-4">
                  <label class="form-label">ACA</label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    v-model="form.aca"
                    placeholder="ACA"
                  />
                </div>

                <div class="pt-4">
                  <button
                    type="reset"
                    class="btn btn-secondary"
                    @click="formOpen"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn btn-primary ms-3"
                    type="submit"
                    :disabled="disabledEvent"
                    v-on:click="bookResource"
                  >
                    <span
                      v-if="disabledEvent"
                      class="spinner-grow spinner-grow-sm"
                    ></span>
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
                    <th scope="col">Console</th>
                    <th scope="col">MGMT Pport</th>
                    <th scope="col">Model</th>
                    <th scope="col">ACA</th>
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
                    v-if="resourceStr.resources.length > 0"
                    v-for="(item, index) in resourceStr.resources"
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
                      <!-- <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#deviceDetailsModal"
                        class="btn btn-sm btn-danger mx-1"
                        @click="resourceDetail(item.id)"
                      >
                        <i class="bi bi-eye"></i>
                      </button> -->
                      <button
                        type="button"
                        class="btn btn-sm btn-secondary mx-1"
                        @click="editResource(item.id)"
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
                    <td align="center" colspan="13">No data available</td>
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
