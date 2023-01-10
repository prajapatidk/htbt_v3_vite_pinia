<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const store = useUserStore()

let routeName = useRouter().currentRoute.value.name

let mode = ref(false)
let editId = ref(null)
const form = reactive({
  name: null,
  email: null,
  password: null,
  roles: 'user',
  status: 0
})

function clear () {
  form.name = null
  form.email = null
  form.password = null
  form.roles = null
  form.status = null
}

onMounted(() => {
  store.fetchUser()
})

async function submitUser () {
  if (!form.name || !form.email || !form.password) {
    return alert('Please enter the all fields')
  }
  if (editId.value != null) {
    await store.updateUser(form, editId.value)
    editId.value = null
    clear()
    formOpen()
  } else {
    await store.adduser(form)
    clear()
    formOpen()
  }
  store.fetchUser()
}

function deleteUser (id) {
  if (confirm('Do want to delete this user') == true) {
    store.deleteUser(id)
  }
}

function editUser (id) {
  formOpen()
  editId.value = id
  let result = store.users.find(res => res.id === id)
  form.name = result.name
  form.email = result.email
  form.password = result.password
  form.roles = result.roles
  form.status = result.status
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
            <form @submit.prevent="submitUser">
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
                  <label for="inputName5" class="form-label">Email</label
                  ><input
                    type="text"
                    id="inputName5"
                    class="form-control"
                    v-model="form.email"
                  />
                </div>
                <div class="col-md-4">
                  <label for="inputName5" class="form-label">Password</label
                  ><input
                    type="text"
                    id="inputName5"
                    class="form-control"
                    v-model="form.password"
                  />
                </div>
                <div class="col-md-6">
                  <label for="inputState" class="form-label">Role</label
                  ><select
                    id="inputState"
                    class="form-select"
                    v-model="form.roles"
                  >
                    <option value="" disabled>Choose...</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="inputState" class="form-label">Type</label
                  ><select
                    id="inputState"
                    class="form-select"
                    v-model="form.status"
                  >
                    <option value="" disabled>Choose...</option>
                    <option value="1">Enable</option>
                    <option value="0">Disable</option>
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
            <div class="d-flex justify-content-end align-items-center pt-3">
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
                  <th scope="col">Password</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in store.users" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.email }}</td>
                  <td scope="row">{{ item.password }}</td>
                  <td class="text-capitalize">{{ item.roles }}</td>
                  <td class="text-align-center">
                    <i
                      v-if="item.status == 1"
                      class="bi bi-check-circle-fill text-success"
                    ></i>
                    <i v-else class="bi bi-x-circle-fill text-danger"></i>
                  </td>
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
                      type="button"
                      class="btn btn-sm btn-danger mx-1"
                      @click="deleteUser(item.id)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-success mx-1">
                      <i class="bi bi-eye"></i>
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
