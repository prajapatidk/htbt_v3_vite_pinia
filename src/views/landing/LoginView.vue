<script setup>
import validateLogin from "@/validation/validateLogin";
import { RouterLink, useRouter } from "vue-router";
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import { avoidHeader } from "@/utils/constant";

// Access the stores
const router = useRouter();

// Declare the variable
let errorsMsg = ref({});
let responseMsg = ref({});
let disabledEvent = ref(false);
let showPass = ref(false);
let form = reactive({
  email: "",
  password: "",
});

// Mount functiion
onMounted(async () => {
  await checkActiveUser();
});

// Check if user already logged in the move to dashboard page
let checkActiveUser = async () => {
  if (localStorage.hasOwnProperty("token")) {
    return router.push("/");
  }
};

// Login authentication of the user
async function loginUser() {
  try {
    let { isInvalid, errors } = await validateLogin(form);
    if (isInvalid) {
      return (errorsMsg.value = errors);
    }
    errorsMsg.value = {};
    disabledEvent.value = true;

    let response = await axios.post("login", form, avoidHeader);
    localStorage.setItem("token", response.data.jwtToken);
    disabledEvent.value = false;
    // router.push('/')
    window.location = "/";
    clear();
  } catch (err) {
    disabledEvent.value = false;
    responseMsg.value = {
      type: "failed",
      msg: "Bad credentials or Please check your mail to activate account",
    };
  }
}

function showPassword() {
  showPass.value = !showPass.value;
}

// Clear the filled inputs
let clear = () => {
  form.email = "";
  form.password = "";
};
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
              style="min-width: 450px"
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
                        :type="showPass == true ? 'text' : 'password'"
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
                          @click="showPassword"
                        />
                        <label class="form-check-label" for="rememberMe"
                          >Show password</label
                        >
                      </div>
                    </div>
                    <div class="col-12">
                      <button
                        class="btn btn-primary w-100"
                        type="submit"
                        :disabled="disabledEvent"
                      >
                        <span
                          v-if="disabledEvent"
                          class="spinner-grow spinner-grow-sm"
                        ></span>
                        Login
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
                        Don't have account?
                        <router-link to="/sign-up"> Create account</router-link>
                        or
                        <router-link to="/forget-password"
                          >forget password?</router-link
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
