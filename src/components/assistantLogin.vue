<template>
  <div class="main">
    <div v-if="hasError">
      <b-alert variant="danger" dismissible show>{{ error }}</b-alert>
    </div>
    <h1 class="title">Bienvenido!</h1>
    <b-form-input class="inp-name" v-model="username" placeholder="Username" />
    <b-form-input class="inp-name" v-model="password" type="password" placeholder="Contrasena" />
    <div>
      <b-button block class="begin" variant="light" @click="login(username,password)">Ingresar</b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AssistantLogin",
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
        .post("http://127.0.0.1:3000/attendant/login", { username, password })
        .then(response => {
          localStorage.setItem("JWT-assistant", response.data.data.jwt);
          localStorage.setItem("attendant", JSON.stringify(response.data.data.user));
          this.$emit("status", {
            status: "notStarted",
            currentNumber: null,
            clientId: null,
            client: false,
            attended: null,
            lineId: null,
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
  width: 300px;
  margin: 10vh auto;
}

.inp-name {
  width: 500px;
  margin: 3vh auto;
}
</style>
