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
      v-if=" queueData.yourNumber - queueData.current != 0"
      class="waiting"
    >
      <h3> Faltan: </h3>
      <h1> {{ queueData.yourNumber - queueData.current }} </h1>
    </div>
    <div
      v-else
      class="turn"
    >
      <h1> Te Toca! </h1>
    </div>
    <h5> Tu número: </h5>
    <h4> {{ queueData.yourNumber }} </h4>
    <div v-if=" queueData.yourNumber - queueData.current > 0">
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
      okVariant= 'danger'
      okTitle= 'Salir!'
      @ok="exitRow"
    >
      Seguro que quiere salirse de la fila?
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientJoined',
  props: {
    queue: {
      type: Object,
      default() {
        return {
          name: '__error__',
          yourNumber: 10,
          current: 1,
          done: true,
        };
      },
    },
  },
  data() {
    return {
      error: '',
      hasError: false,
      queueData: this.queue,
    };
  },
  mounted() {
    this.loadData();
    this.loadDataInterval();
  },
  beforeDestroy() {
    clearInterval(this.loadDataInterval);
  },
  methods: {
    loadDataInterval() {
      setInterval(() => {
        this.loadData();
      }, 10000);
    },
    exitRow() {
      axios.delete('mock')
        .then(() => {
          this.$router.replace('/');
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    checkExit() {
      if (this.queueData.done) {
        this.exitRow();
      }
    },
    loadData() {
      axios.get('mock')
        .then((response) => {
          this.queueData = response.data;
          this.hasError = false;
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
