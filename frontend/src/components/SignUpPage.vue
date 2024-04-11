<template>
  <body class="signup">
    <div class="sign-up-page">
      <div class="logo">
        <img
          src="../assets/logo.png"
          alt="logo"
          @click="goBack"
        >
      </div>
      <div class="sign-up-box">
        <h1>Sign up</h1>
        <div class="sign-up-form">
          <form>
            <div class="email-input">
              <font-awesome-icon
                id="at"
                icon="at"
              />
              <input
                id="envelope-icon"
                v-model="email"
                type="email"
                placeholder="email"
              >
            </div>
            <div class="username-input">
              <font-awesome-icon
                id="user"
                icon="user"
              />
              <input
                id="user-icon"
                v-model="username"
                type="text"
                placeholder="username"
              >
            </div>
            <div class="password-input">
              <font-awesome-icon
                id="password"
                icon="lock"
              />
              <input
                id="lock-icon"
                v-model="password"
                type="password"
                name="password"
                placeholder="password"
              >
            </div>
            <div class="password-input">
              <font-awesome-icon
                id="repeatIcon"
                icon="repeat"
              />
              <input
                id="passwordRepeat"
                v-model="passwordRepeat"
                type="password"
                name="passwordRepeat"
                placeholder="repeat password"
              >
            </div>
            <div
              v-if="passwordError"
              class="error-message"
            >
              <p>{{ passwordError }}</p>
            </div>
            <button
              type="submit"
              class="sign-up-button"
              @click="signUp"
            >
              Sign up
            </button>
          </form>
          <p class="log-in-text">
            If you already have a user, click <a @click="goToLogIn">here</a> to log in
          </p>
          <div
            v-if="showError"
            class="error-message"
          >
            <p> {{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from '/src/store/userStore';

const email = ref('');
const username = ref('');
const password = ref('');
const passwordRepeat = ref('');
const passwordError = ref('');

onMounted(() => {
  document.body.classList.add('signup');
});

onBeforeUnmount(() => {
  document.body.classList.remove('signup');
});

const errorMessage = ref("oops! something went wrong!");
const showError = ref(false);

const router = useRouter();
const store = useStore();

const signUp = async (event) => {
  event.preventDefault();

  passwordError.value = '';

  if (email.value.trim() === '' || username.value.trim() === '' || password.value.trim() === '') {
    errorMessage.value = "Email, username, and password are required.";
    showError.value = true;
    return;
  }

  if (password.value !== passwordRepeat.value) {
    passwordError.value = 'Passwords do not match.';
    password.value = '';
    passwordRepeat.value = '';
  } else {

    try {
      const response = await axios.post('http://localhost:8080/api/createUser', {
        email: email.value,
        username: username.value,
        password: password.value
      });
      store.saveToken(username.value, response.data);
      await goToLogIn();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        errorMessage.value = "Sign up failed: Username or email already in use.";
      }
      if (error.response && error.response.status === 500) {
        errorMessage.value = "Something went wrong. Please try again.";
      } else {
        errorMessage.value = "An error occurred. Please try again later.";
      }
      showError.value = true;
    }
  }
}
const goToLogIn = () => {
  router.push("/login");
};

const goBack = () => {
  router.push("/");
};

</script>

<style scoped>
.signup {
  background-image: linear-gradient(120deg, #bcb6ff 20%, #6320EE 80%);
}

.sign-up-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
}

.logo {
    position: absolute;
    top: -10px;
    left: -20px;
}

.logo img {
    width: 130px;
}

.sign-up-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.3);
    padding: 20px;
    border-radius: 35px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
    color: white;
}

.sign-up-form {
    margin-bottom: -20px;
    position: relative;
}

h1 {
    margin-bottom: 30px;
    font-size: 4rem;
}

.email-input, .username-input, .password-input {
  display: flex;
  align-items: center; 
  margin-bottom: 20px;
}

.username-input input, .password-input input, .email-input input {
    padding: 8px;
    font-size: 1rem;
    width: 255px;
    background-color: rgba(255, 255, 255, 0);
    border-bottom: 1px solid white;
    border-left: none;
    border-right: none;
    border-top: none;
    color: white;
}

.username-input input:focus, .password-input input:focus, .email-input input:focus {
    outline: none;
    border-bottom: 1px solid #f7567c;
}

#envelope-icon, #user-icon, #lock-icon {
  margin-right: 10px;
  color: white; 
}


.email-input input, .username-input input, .password-input input {
  flex-grow: 1;
  padding: 8px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-bottom: 1px solid white;
  margin-left: 5px; 
}

.email-input input::placeholder, .username-input input::placeholder, .password-input input::placeholder {
  color: white;
}

.sign-up-button {
    position: absolute;
    bottom: -59px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    border: none;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    width: 280px;
    padding: 20px 20px;
    font-size: 1rem;
    color: white;
}

.sign-up-button:hover {
    background-color: #6320EE;
    color: white;
    cursor: pointer;
}

.log-in-text {
    margin-top: 30px;
    margin-bottom: 40px;
}

.log-in-text a {
    text-decoration: underline;
    color: white;
    font-weight: bolder;
    cursor: pointer;
}

.error-message {
    color: #ff3860;
    font-weight: bold;
    font-size: 12px;
}
</style>
