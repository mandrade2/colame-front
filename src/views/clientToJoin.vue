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
    <h1 class="title">
      Bienvenido!
    </h1>
    <qrcode-stream @decode="onDecode"></qrcode-stream>
    <div>
      <b-button
        class="join"
        variant="light"
        @click="joinRow"
      >
        Unirse a una fila!
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
      axios.post('https://colame-back.herokuapp.com/line/5cdbd6bebfc6b9003103105f', {})
        .then((response) => {
          this.$emit('queue', response.data);
          this.hasError = false;
          console.log('wut');
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

.title {
  padding-top: 25vh;
  font-size: 390%;
}

.join {
  margin-top: 10vh;
  width: 70%;
  font-weight: bold;
  color: #2e2e2e;
}

.main {
  width: 100wh;
  height: 90vh;
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
