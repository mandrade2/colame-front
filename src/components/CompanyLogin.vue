<template>
  <div class="main">
    <div v-if="hasError">
      <b-alert variant="danger" dismissible show>{{ error }}</b-alert>
    </div>
    <h1 class="title">Bienvenido!</h1>
    <b-form-input v-model="username" />
    <b-form-input v-model="password" type="password" />
    <div>
      <b-button block class="begin" variant="light" @click="login(username,password)">Ingresar</b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CompanyLogin",
  data() {
    return {
      error: "",
      hasError: false,
      username: "",
      password: ""
    };
  },
  mounted() {},
  methods: {
    login(username, password) {
      console.log(username, password);
      axios
        .post("http://127.0.0.1:3000/company/login", { username, password })
        .then(response => {
          localStorage.setItem("JWT-company", response.data.data.jwt);
          localStorage.setItem("company", JSON.stringify(response.data.data.user));
          this.$emit("status", {
            status: "AlreadyLogged"
          });
          this.hasError = false;
        })
        .catch(error => {
          this.error = error;
          this.hasError = true;
        });
    }
  }
};
</script>

<style scoped>
.main {
  margin: 0 auto;
  padding-top: 25vh;
}
.title {
  padding-top: 25 vh;
  font-size: 400%;
}

.begin {
  width: 70%;
  margin: 10vh auto;
}
</style>
