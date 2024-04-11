<template>
  <body class="start">
    <div class="start-page">
      <div class="logo">
        <img
          src="../assets/logo.png"
          alt="logo"
        >
      </div>
      <div class="top-row-buttons">
        <button
          class="login-button"
          @click="goToLogIn"
        >
          <span>Log in</span>
        </button>
        <button
          class="sign-up-button"
          @click="goToSignUp"
        >
          <span>Sign up</span>
        </button>
      </div>
      <div class="text-and-sign-up">
        <div class="start-page-text">
          <h1>Welcome!</h1>
          <p>
            Test your knowledge with our quizzes and have fun while learning something new!
            Our quizzes are created by users like you, so feel free to create your own quiz and share it with the world.
          </p>
          <p>If you don't have an account yet, sign up today and start exploring!</p>
        </div>
        <div class="sign-up-today-button">
          <button @click="goToSignUp">
            Sign up today!
          </button>
        </div>
      </div>
      <div class="big-logo">
        <img
          src="../assets/logo.png"
          alt="big-logo"
        >
      </div>
    </div>
    <div class="copyright">
      © Malin H. Høli, Eline Evje & Ina Martini, 2024
    </div>
  </body>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();

function goToLogIn() {
  router.push("/login");
}

function goToSignUp() {
  router.push("/signup");
}

</script>

<style scoped>

.start {
  background-color: white;
}

.start-page {
  display: flex;
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

.top-row-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}


.sign-up-today-button button {
  background-color: #f7567c;
}

.login-button, .sign-up-button, .sign-up-today-button button {
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Karla', sans-serif;
  font-weight: bold;
}

.login-button, .sign-up-button {
  display: inline-block;
  background-color: #6320EE;
  text-align: center;
  width: auto;
  transition: all 0.5s;
  margin: 5px;
  overflow: hidden;
}

.login-button span, .sign-up-button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.login-button span:after, .sign-up-button span:after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.login-button:hover span, .sign-up-button:hover span {
  padding-right: 25px;
}

.login-button:hover span:after, .sign-up-button:hover span:after {
  opacity: 1;
  right: 0;
}

.login-button:hover, .sign-up-button:hover {
  background-color: #7E41FDFF;
}

.sign-up-today-button button:hover {
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
}

.sign-up-today-button button:active {
  box-shadow: 0 4px #d73f63;
  transform: translateY(3px);
}

.text-and-sign-up {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 20px;
  margin-left: 20px;
  text-align: left;
}

.start-page-text h1, .start-page-text p, .sign-up-today-button {
  text-align: left;
  padding-left: 40px;
}

.start-page-text h1 {
  font-size: 3.2rem;
  margin-bottom: 0.5rem;
}

.start-page-text p {
  font-size: 1.4rem;
}

.sign-up-today-button {
  margin-top: 20px;
  align-self: start;
  width: auto;
}

.big-logo {
  width: 50%;
  display: flex;
  align-items: center;
  margin-top: 10%;
}

.big-logo img {
  max-width: 96%;
  height: auto;
  margin-top: 20px;
}

.copyright {
  position: fixed;
  bottom: 10px;
  left: 10px;
  font-size: 12px;
  color: #666;
  font-family: 'Karla', sans-serif;
}

@media (max-width: 768px) {
  .start-page {
    flex-direction: column;
  }

  .text-and-sign-up {
    width: 100%;
    margin-left: 0;
    margin-top: 30%;
    padding: 0 20px;
  }

  .sign-up-today-button {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .big-logo {
    width: 100%;
  }
}
</style>