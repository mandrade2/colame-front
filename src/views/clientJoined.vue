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
    <div
      v-if=" !data.line.attending.includes(data.client._id)"
      class="waiting"
    >
      <h3> Faltan: </h3>
      <h1> {{ position }} </h1>
    </div>
    <div
      v-else
      class="turn"
    >
      <h1> Te Toca! </h1>
    </div>
    <h5> Tu número: </h5>
    <h4> {{ data.client.number }} </h4>
    <div v-if=" !data.line.attending.includes(data.client._id)">
      <b-button
        v-b-modal.sure
        class="exit"
        variant="danger"
      >
        Salirse de la fila!
      </b-button>
    </div>
    <div v-else>
      <b-button
        class="exit"
        variant="danger"
        disabled
        @click="exitRow"
      >
        Salirse de la fila!
      </b-button>
    </div>
    <b-modal
      id="sure"
      class="sure"
      title="Seguro?"
      centered
      ok-variant="danger"
      ok-title="Salir!"
      @ok="exitRow"
    >
      Seguro que quiere salirse de la fila?
    </b-modal>
    <div>
      <div v-if=" !data.client.here">
        <p>
          No estoy aqui
        </p>
        <b-button
          class="here"
          variant="success"
          @click="imhere"
        >
          Estoy
        </b-button>
      </div>
      <div v-else>
        <p>
          Estoy aqui
        </p>
        <b-button
          class="here"
          variant="warning"
          @click="imhere"
        >
          Salir
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientJoined',
  props: {
    data: {
      type: Object,
      default() {
        return {
          line: {
            name: '__error__',
            companyId: -1,
            _id: -1,
            current: 1,
            done: true,
            clients: [],
            avgTimeWaiting: 0,
            attendants: [],
            currentNumber: 0,
            attending: [],
            __v: 0,
          },
          client: {
            _id: -1,
            __v: 0,
            number: -1,
            lineId: -1,
            position: -1,
            here: false,
          },
        };
      },
    },
  },
  data() {
    return {
      error: '',
      hasError: false,
      queueData: this.data,
      position: 9999,
      interval: 0,
      startDate: new Date(),
      sentTime: false,
    };
  },
  mounted() {
    console.log(this.data);
    this.getLine();
    this.loadData();
    this.loadDataInterval();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    loadDataInterval() {
      this.interval = setInterval(() => {
        this.loadData();
      }, 10000);
    },
    getLine() {
      axios.get(`http://127.0.0.1:3000/line/${this.data.client.lineId}`)
        .then((response) => {
          console.log(response);
          this.data.line = response.data;
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    imhere() {
      axios.patch(`http://127.0.0.1:3000/client/${this.data.client._id}`)
        .then(() => {
          this.data.client.here = !this.data.client.here;
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    exitRow() {
      axios.patch(`http://127.0.0.1:3000/line/${this.data.line._id}/${this.data.client._id}`, {})
        .then(() => {
          clearInterval(this.interval);
          this.$router.replace('/');
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    checkExit() {
      if (this.position < 0 && !this.data.line.attending.includes(this.data.client._id)) {
        clearInterval(this.interval);
        if (!this.sentTime) {
          this.sendTime();
        }
        this.$router.replace('/');
      }
    },
    getPosition() {
      this.position = this.data.line.clients.indexOf(this.data.client._id);
    },
    sendTime() {
      const newDate = new Date();
      const seconds = (newDate.getTime() - this.startDate.getTime()) / 1000;
      const response = {
        date: new Date(), seconds, clientId: this.data.client._id, lineId: this.data.line._id, attendants: this.data.line.attendants,
      };
      axios.post('http://127.0.0.1:3000/waittime', response)
        .then((response) => {
          this.sentTime = true;
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    checkTime() {
      if (!this.sentTime && this.data.line.attending.includes(this.data.client._id)) {
        this.sendTime();
      }
    },
    loadData() {
      axios.get(`http://127.0.0.1:3000/line/${this.data.line._id}/`)
        .then((response) => {
          this.data.line = response.data;
          this.hasError = false;
          this.getPosition();
          this.checkTime();
          this.checkExit();
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

.waiting {
  padding-top: 20vh;
}

.waiting h3,h1 {
  font-size: 300%;
}

.turn {
  padding-top: 20vh;
}

.turn h1 {
  font-size: 500%;
}

.exit {
  margin-top: 10vh;
  width: 70%;
  font-weight: bold;
}

.sure{
  color: black;
}

</style>
