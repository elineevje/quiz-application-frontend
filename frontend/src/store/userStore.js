import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useStore = defineStore("token", () => {
  const jwtToken = ref(null);
  const loggedInUser = ref(null);


  function saveToken(username, token) {
    loggedInUser.value = username;
    jwtToken.value = token;
  }

  function clearToken() {
    jwtToken.value = null;
    loggedInUser.value = null;
  }

  async function renewToken() {
    await axios.get("http://localhost:8080/api/refreshToken", {
      headers: {
        Authorization: "Bearer " + jwtToken.value.refreshToken,
      },
    }).then((response) => {
      if(response.status === 200){
        jwtToken.value.accessToken = response.data;
        return true;
      }
    });
    return false;
  }

  async function fetch(path){
    return axios.get(path, {
      headers: {
        Authorization: "Bearer " + jwtToken.value.accessToken,
      },
    })
  }

  async function fetchData(path) {
    const res = await fetch(path);
    if(res.status === 200){
      return res;
    }
    else if(res.status === 403){
      if(await renewToken()){
        const res2 = await fetch(path);
        return res2;
      }
    }
    else {
      return res
    }

  }

  return { jwtToken, loggedInUser, saveToken, clearToken, fetchData, fetch, renewToken};
}, 
{
  persist: {
    storage: sessionStorage,
    enabled: true
  }
});