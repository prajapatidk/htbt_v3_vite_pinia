<script setup>
import validateLogin from '@/validation/validateLogin'
import { RouterLink, useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import axios from 'axios'

const store = useUserStore()
const router = useRouter()
let errorsMsg = ref({})
const activeUser = localStorage.length

const form = reactive({
  email: '',
  password: ''
})

onMounted(() => {
  checkActiveUser()
})


function checkActiveUser () {
  // if(activeUser > 0){
  //   router.push('/')
  // }
}


async function loginUser () {
  try {
    const { isInvalid, errors } = await validateLogin(form)
    if (isInvalid) {
      errorsMsg.value = errors
    } else {
      await axios
        .get(
          `http://localhost:3000/users?email=${form.email}&password=${form.password}`
        )
        .then(res => {
          errorsMsg.value = {}
          // let authenticateUser = {
          //   id: res.data[0]['id'],
          //   name: res.data[0]['name'],
          //   email: res.data[0]['email'],
          //   roles: res.data[0]['roles']
          // }
          // localStorage.setItem('activeUser', JSON.stringify(authenticateUser))
          store.userLogin(res.data)
          router.push('/')
          clear()
        })
    }
  } catch (err) {
    console.log(err)
  }
}

function clear () {
  form.email = ''
  form.password = ''
}

// http://localhost:3000/users?email=anshu@gmail.com&password=123456
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
                      Login to Your Account
                    </h5>
                    <p class="text-center small">
                      Enter your username &amp; password to login
                    </p>
                  </div>

                  <form
                    class="row g-3 needs-validation"
                    @submit.prevent="loginUser"
                  >
                    <div class="col-12">
                      <label for="yourUsername" class="form-label"
                        >Username</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        :class="`${errorsMsg.email ? 'is-invalid' : ''}`"
                        v-model="form.email"
                      />
                      <div class="invalid-feedback">
                        {{ errorsMsg.email }}
                      </div>
                    </div>

                    <div class="col-12">
                      <label for="yourPassword" class="form-label"
                        >Password</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        :class="`${errorsMsg.password ? 'is-invalid' : ''}`"
                        v-model="form.password"
                      />
                      <div class="invalid-feedback">
                        {{ errorsMsg.password }}
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          name="remember"
                          value="true"
                          id="rememberMe"
                        />
                        <label class="form-check-label" for="rememberMe"
                          >Remember me</label
                        >
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary w-100" type="submit">
                        Login
                      </button>
                    </div>
                    <div class="col-12">
                      <p class="small mb-0">
                        Don't have account?
                        <router-link to="/sign-up">
                          Create an account</router-link
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
