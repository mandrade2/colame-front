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
    <div class="title">
      <h3> Atendiendo número: </h3>
      <h1> {{ currentNumber }} </h1>
    </div>
    <div>
      <b-button
        class="done"
        variant="light"
        @click="next"
      >
        Listo!
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AssistantAttending',
  props: {
    currentNumber: {
      type: Number,
      default() {
        return -1;
      },
    },
    clientId: {
      type: Number,
      default() {
        return -1;
      },
    },
    attended: {
      type: Date
    },
    client: {
      type: Boolean
    }
  },
  data() {
    return {
      error: '',
      hasError: false,
    };
  },
  methods: {
    next() {
      console.log({ clientId: this.clientId, client: this.client, time: new Date().getTime() - this.attended})
      axios.patch('http://127.0.0.1:3000/line/5d0e4e71a68a2c2d983cbb62', { clientId: this.clientId, client: this.client, time: new Date().getTime() - this.attended})
        .then((response) => {
          this.$emit('status', { status: 'waiting', currentNumber: response.data.number, clientId: response.data._id, time: null, client: false });
          this.hasError = false;
          this.client = false;
          this.time = null
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

.title{
  padding-top: 20vh;
}

.done{
  margin-top: 5vh;
  width: 70%;
}

</style>
