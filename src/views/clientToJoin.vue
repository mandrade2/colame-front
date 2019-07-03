<template>
  <div
    class="main"
  >
    <div v-if="hasError">
      <b-alert
        variant="danger"
        dismissible
        show
      >
        {{ error }}
      </b-alert>
    </div>
    <div class="d1">
      <h1 class="title">
        CÓLAME
      </h1>
    </div>
    <div class="qr">
      <qrcode-stream @decode="onDecode" />
    </div>
    <div class="d2">
      <b-button
        class="join"
        variant="light"
        href="#/assistant"
      >
        Acceso Atendedor
      </b-button>
      <b-button
        class="join"
        variant="light"
        href="#/company"
      >
        Acceso Empresa
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader';

export default {
  name: 'ClientToJoin',
  components: {
    QrcodeStream,
  },
  data() {
    return {
      error: '',
      hasError: false,
    };
  },
  methods: {
    joinRow() {
      axios.post('http://127.0.0.1:3000/line/5d0e4e71a68a2c2d983cbb62', {})
        .then((response) => {
          this.$emit('queue', response.data);
          this.hasError = false;
          this.$router.push({ name: 'line', params: { data: response.data } });
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    onDecode(decodedString) {
      axios.post(decodedString, {})
        .then((response) => {
          this.$emit('queue', response.data);
          this.hasError = false;
          this.$router.push({ name: 'line', params: { data: response.data } });
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
  },
};


</script>

<style scoped>

.qr {
  padding: 30px;
}

.d1 {
  height: 20vh;
}
.title {
  padding-top: 5%;
  font-size: 390%;
}
.join {
  height: 10vh;
  width: 30vh;
  margin: 80px;
  font-weight: bold;
  font-size: 150%;
  color: #2e2e2e;
  display: inline;
  border-color: orange;
}
.main {
  width: 100wh;
  height: 100vh;
  color: #fff;
  background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
  background-size: 400% 400%;
  -webkit-animation: Gradient 15s ease infinite;
  -moz-animation: Gradient 15s ease infinite;
  animation: Gradient 15s ease infinite;
}

@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%
   }
   50% {
     background-position: 100% 50%
   }
   100% {
     background-position: 0% 50%
   }
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

</style>
