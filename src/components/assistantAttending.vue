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
      type: String,
      default() {
        return '01';
      },
    },
    attended: {
      type: Date,
    },
    client: {
      type: Boolean,
    },
    attendantId: {
      type: String,
      default() {
        return '01';
      },
    },
    lineId: {
      type: String,
      default() {
        return '01';
      },
    },

  },
  data() {
    return {
      error: '',
      hasError: false,
      startDate: new Date(),
    };
  },
  methods: {
    next() {
      axios.patch(`http://127.0.0.1:3000/line/${this.lineId}`, { clientId: this.clientId, client: this.client, time: new Date().getTime() - this.attended })
        .then((response) => {
          this.$emit('status', {
            status: 'waiting', currentNumber: response.data.number, clientId: response.data._id, time: null, client: false, lineId: this.lineId,
          });
          this.hasError = false;
          this.client = false;
          this.time = null;
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    sendTime() {
      const newDate = new Date();
      const seconds = (newDate.getTime() - startDate.getTime()) / 1000;
      const response = {
        date: new Date(), seconds, clientId: this.data.client._id, lineId: this.lineId, attendantId: this.attendantId,
      };
      axios.post('http://127.0.0.1:3000/atttime', response)
        .then((response) => {
          this.sentTime = true;
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
