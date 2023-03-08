<script setup>
import { useRouter } from 'vue-router'
import validateRegister from '@/validation/validateRegister'
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { roles } from '@/utils/constant'

let routeName = useRouter().currentRoute.value.name
let store = useUserStore()
let router = useRouter()
let userDetail = ref({})
let errorsMsg = ref({})
let serverMsg = reactive({ type: '', msg: '' })
let mode = ref(false)
let editId = ref(null)

let form = reactive({
  username: '',
  email: '',
  roles: '',
  password: '',
  confirmPassword: ''
})

onMounted(() => {
  store.fetchUser()
  checkActiveUser()
})

let checkActiveUser = async () => {
  await store.activeUser()
  userDetail.value = store.activeUserDetail
  if (userDetail.value.roles == 'USER') {
    return router.push('/')
  }
}

let submitUser = async () => {
  try {
    let { isInvalid, errors } = await validateRegister(form)
    if (isInvalid) {
      return (errorsMsg.value = errors)
    }
    errorsMsg.value = {}

    if (editId.value != null) {
      let result = await store.updateUser(form, editId.value)
      if (result) {
        serverMsg = {
          type: 'success',
          msg: 'User updated successfully'
        }
      }
      editId.value = null
    } else {
      let result = await store.addUser(form)
      if (result) {
        serverMsg = {
          type: 'success',
          msg: 'User created successfully'
        }
      }
    }
    formOpen()
  } catch (err) {
    serverMsg = {
      type: 'failed',
      msg: err.response.data.message
    }
  }
}

let deleteUser = async id => {
  try {
    if (confirm('Do want to delete this user') == true) {
      let result = await store.deleteUser(id)
      console.log(result)
      if (result.status == 204) {
        serverMsg = {
          type: 'success',
          msg: 'User removed successfully'
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

let editUser = async id => {
  formOpen()
  editId.value = id
  let result = store.users.find(res => res.id === id)
  form.username = result.username
  form.email = result.email
  form.roles = result.roles
  form.password = '****'
  form.confirmPassword = '****'
}

let formOpen = () => {
  mode.value = !mode.value
  errorsMsg.value = {}
  clear()
}

let clear = () => {
  editId.value = null
  form.username = ''
  form.email = ''
  form.roles = ''
  form.password = ''
  form.confirmPassword = ''
}
</script>

<template>
  <div class="d-flex align-items-center pagetitle pb-2" style="height: 32px">
    <h1>Manage {{ routeName }}</h1>
    <p
      class="m-0 mt-1 mx-3 text-success"
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
            <form @submit.prevent="submitUser">
              <div class="row g-3 pt-4">
                <div class="col-md-6">
                  <label for="yourName" class="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    :class="`${errorsMsg.username ? 'is-invalid' : ''}`"
                    v-model="form.username"
                    placeholder="User Name"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.username }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="yourEmail" class="form-label">Your Email</label>
                  <input
                    type="text"
                    name="email"
                    class="form-control"
                    :class="`${errorsMsg.email ? 'is-invalid' : ''}`"
                    v-model="form.email"
                    placeholder="Email Id"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.email }}
                  </div>
                </div>

                <div class="col-md-6" v-if="editId != null">
                  <label class="form-label">Roles</label>

                  <select
                    class="form-select"
                    :class="`${errorsMsg.roles ? 'is-invalid' : ''}`"
                    v-model="form.roles"
                  >
                    <option disabled>Choose...</option>
                    <option
                      v-for="(item, index) in roles"
                      :key="index"
                      :value="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                  <div class="invalid-feedback">
                    {{ errorsMsg.roles }}
                  </div>
                </div>

                <div class="col-md-6" v-if="editId == null">
                  <label for="yourPassword" class="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    class="form-control"
                    :class="`${errorsMsg.password ? 'is-invalid' : ''}`"
                    v-model="form.password"
                    placeholder="Password"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.password }}
                  </div>
                </div>

                <div class="col-md-6" v-if="editId == null">
                  <label for="yourPassword" class="form-label"
                    >Confirm password</label
                  >
                  <input
                    type="password"
                    name="password"
                    class="form-control"
                    :class="`${errorsMsg.confirmPassword ? 'is-invalid' : ''}`"
                    v-model="form.confirmPassword"
                    placeholder="Confirm Password"
                  />
                  <div class="invalid-feedback">
                    {{ errorsMsg.confirmPassword }}
                  </div>
                </div>
                <div class="pt-4">
                  <button
                    type="reset"
                    class="btn btn-secondary"
                    @click="formOpen"
                  >
                    Cancel
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
                class="btn btn-success btn-sm"
                type="button"
                @click="formOpen"
              >
                <i class="bi bi-plus-circle" style="margin-right: 5px"></i>
                Add User
              </button>
            </div>
            <!-- Table with stripped rows -->
            <table class="table table-striped" style="vertical-align: middle">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in store.users"
                  :key="item.id"
                  v-if="store.users.length > 0"
                >
                  <td>{{ index + 1 }}</td>
                  <td class="text-capitalize">{{ item.username }}</td>
                  <td>{{ item.email }}</td>
                  <td class="text-capitalize">{{ item.roles }}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-sm btn-secondary mx-1"
                      @click="editUser(item.id)"
                      :title="item.id"
                    >
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      v-if="item.roles != 'ADMIN'"
                      type="button"
                      class="btn btn-sm btn-danger mx-1"
                      @click="deleteUser(item.id)"
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
            <!-- End Table with stripped rows -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
