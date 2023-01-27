<script setup>
import validateRegister from '@/validation/validateRegister'
import { RouterLink, RouterView } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'

const store = useUserStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  roles: 'user',
  status: 0
})

let errorsMsg = ref({})

async function submitUser () {
  try {
    const { isInvalid, errors } = await validateRegister(form)
    if (isInvalid) {
      errorsMsg.value = errors
    } else {
      errorsMsg.value = {}
      await store.adduser(form)
      clear()
    }
  } catch (err) {
    console.log(err)
  }
}

function clear () {
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
}
</script>

<template>
  <main>
    <div class="container">
      <section
        class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4"
      >
        <div class="container">
          <div class="row justify-content-center">
            <div
              style="min-width: 432px"
              class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center"
            >
              <div class="d-flex justify-content-center py-4">
                <a class="text-center">
                  <img src="@/assets/img/hrbt-new.webp" alt="" />
                  <span class="d-none d-lg-block mt-1" style="color: #012970"
                    >Hardware Resource Booking Tool</span
                  >
                </a>
              </div>
              <!-- End Logo -->

              <div class="card mb-3">
                <div class="card-body">
                  <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">
                      Create an Account
                    </h5>
                    <p class="text-center small">
                      Enter your personal details to create account
                    </p>
                  </div>
                  <form
                    class="row g-3 needs-validation"
                    @submit.prevent="submitUser"
                  >
                    <div class="col-12 mt-1">
                      <label for="yourName" class="form-label">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        class="form-control"
                        :class="`${errorsMsg.name ? 'is-invalid' : ''}`"
                        v-model="form.name"
                        placeholder="User Name"
                      />
                      <div class="invalid-feedback">
                        {{ errorsMsg.name }}
                      </div>
                    </div>

                    <div class="col-12 mt-2">
                      <label for="yourEmail" class="form-label"
                        >Your Email</label
                      >
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

                    <div class="col-12 mt-2">
                      <label for="yourPassword" class="form-label"
                        >Password</label
                      >
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

                    <div class="col-12 mt-2">
                      <input
                        type="password"
                        name="password"
                        class="form-control"
                        :class="`${
                          errorsMsg.confirmPassword ? 'is-invalid' : ''
                        }`"
                        v-model="form.confirmPassword"
                        placeholder="Confirm Password"
                      />
                      <div class="invalid-feedback">
                        {{ errorsMsg.confirmPassword }}
                      </div>
                    </div>
                    <div class="col-12 mt-4">
                      <button class="btn btn-primary w-100" type="submit">
                        Create Account
                      </button>
                    </div>
                    <div class="col-12">
                      <p class="small mb-0">
                        <router-link to="/sign-in">
                          Already have an account?</router-link
                        >
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
  <!-- End #main -->
</template>
