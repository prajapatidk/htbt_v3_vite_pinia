<script setup>
import validateRegister from '@/validation/validateRegister'
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useResourceStore } from '../../stores/resource'

const userStore = useUserStore()
const resourceStore = useResourceStore()
let errorsMsg = ref({})
let serverMsg = reactive({ type: '', msg: '' })
let mode = ref(false)
let editId = ref(null)

onMounted(() => {
  userStore.fetchUser()
  resourceStore.assignedResource()
})

const removeResource = async id => {
  try {
    if (confirm('Do want to release the resource') == true) {
      const result = await resourceStore.releaseResource(id)
    }
  } catch (err) {
    serverMsg = {
      type: 'failed',
      msg: err.response.data.message
    }
  }
}
</script>

<template>
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
  <section class="section profile">
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

                <div class="col-md-6">
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

                <div class="col-md-6">
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
            <div
              class="tab-pane fade show active profile-overview"
              id="profile-overview"
            >
              <h5 class="card-title">Profile Details</h5>

              <div class="row">
                <div class="col-lg-3 col-md-4 label">Name</div>
                <div class="col-lg-9 col-md-8">
                  {{ userStore.activeUserDetail.username }}
                </div>
              </div>

              <div class="row">
                <div class="col-lg-3 col-md-4 label">Email</div>
                <div class="col-lg-9 col-md-8">
                  {{ userStore.activeUserDetail.email }}
                </div>
              </div>
            </div>
            <!-- End Table with stripped rows -->
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Booked Resources</h5>

            <!-- Table with stripped rows -->
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">IP Address</th>
                  <th scope="col">Release Device</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in resourceStore.assignedResourceItems"
                  :key="index"
                  v-if="resourceStore.assignedResourceItems.length > 0"
                >
                  <th scope="row">1</th>
                  <td>{{ item.name }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.ipAddress }}</td>
                  <td>
                    <button
                      v-on:click="removeResource(item.id)"
                      type="button"
                      class="btn btn-sm btn-danger mx-1"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-else>
                  <td align="center" colspan="5">No Resources Assigned</td>
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
