<script setup>
import validateRegister from '@/validation/validateRegister'
import { RouterLink } from 'vue-router'
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'

// Access the store
let store = useUserStore()

// assign variables
let errorsMsg = ref({})
let emailMsg = ref()
let responseMsg = ref({})
let disabledEvent = ref(false)

// create form object
let form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

//Form validation
// let validateForm = () => {
//   let { isInvalid, errors } = validateRegister(form)
//   if (isInvalid) {
//     return (errorsMsg.value = errors)
//   }
//   errorsMsg.value = {}
// }

// Register new user
let registerUser = async () => {
  try {
    validateEmail()
    let { isInvalid, errors } = await validateRegister(form)
    if (isInvalid) {
      return (errorsMsg.value = errors)
    }
    errorsMsg.value = {}
    disabledEvent.value = true
    let result = await store.addUser(form)
    clear()
    responseMsg = {
      type: 'success',
      msg: result.data
    }
    disabledEvent.value = false
  } catch (err) {
    responseMsg.value = {
      type: 'failed',
      msg: err.response.data.message
    }
    disabledEvent.value = false
  }
}

// Clear the filled inputs
let clear = () => {
  form.username = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
}

let validateEmail = () => {
  if (form.email == '') {
    console.log('empty')
    emailMsg.value = 'Email field is required.'
  } else if (
    !/^(([^<>()[\]\\.,;:\s@#!$%^&*()-_="]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@incedoinc\.com$/.test(
      form.email
    )
  ) {
    emailMsg.value = 'Please enter incedo email id'
  } else {
    emailMsg.value = ''
  }
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
                    @submit.prevent="registerUser"
                  >
                    <div class="col-12 mt-1">
                      <label for="yourName" class="form-label">Your Name</label>
                      <input
                        v-on:keyup="validateForm"
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

                    <div class="col-12 mt-1">
                      <label for="yourName" class="form-label">Email</label>
                      <input
                        v-on:keyup="validateEmail"
                        v-on:blur="validateEmail"
                        type="text"
                        name="name"
                        class="form-control"
                        :class="`${emailMsg ? 'is-invalid' : ''}`"
                        v-model="form.email"
                        placeholder="Email"
                      />
                      <div class="invalid-feedback">
                        {{ emailMsg }}
                      </div>
                    </div>

                    <!-- <div
                      class="col-12 mt-2"
                      :class="`${errorsMsg.email ? 'was-validated' : ''}`"
                    >
                      <label for="yourEmail" class="form-label"
                        >Your Email</label
                      >

                      <div class="input-group">
                        <input
                          v-on:keyup="validateForm"
                          type="text"
                          v-model="form.email"
                          placeholder="Email Id"
                          class="form-control"
                          required=""
                        />
                        <span class="input-group-text" id="basic-addon2"
                          >@incedoinc.com</span
                        >
                        <div class="invalid-feedback">
                          {{ errorsMsg.email }}
                        </div>
                      </div>
                    </div> -->

                    <div class="col-12 mt-2">
                      <label for="yourPassword" class="form-label"
                        >Password</label
                      >
                      <input
                        v-on:keyup="validateForm"
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
                        v-on:keyup="validateForm"
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
                      <button
                        class="btn btn-primary w-100"
                        type="submit"
                        :disabled="disabledEvent || emailMsg != ''"
                      >
                        <span
                          v-if="disabledEvent"
                          class="spinner-grow spinner-grow-sm"
                        ></span>
                        Create Account
                      </button>
                    </div>
                    <p
                      class="mt-2 mb-0"
                      :class="
                        responseMsg.type == 'success'
                          ? 'text-success'
                          : 'text-danger'
                      "
                    >
                      {{ responseMsg.msg }}
                    </p>
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
