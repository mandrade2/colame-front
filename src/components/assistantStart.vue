<template>
  <div class="main">
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
      Ingresa a una línea par atender
    </h1>
    <div>
    </div>
    <div
      v-for="(line) in lines"
      :key="line._id"
    >
      <b-button
        block
        class="begin"
        variant="light"
        @click="begin(line._id)"
      >
        {{ line.name }}
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AssistantStart',
  props: {
    attendant: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      error: '',
      hasError: false,
      lines: [],
    };
  },
  mounted() {
    this.getLines();
  },
  methods: {
    begin(lineId) {
      axios
        .post(`http://127.0.0.1:3000/line/${lineId}/attendant`)
        .then(() => {
          this.$emit('status', {
            status: 'waiting',
            currentNumber: null,
            clientId: null,
            client: false,
            attended: null,
            lineId,
          });
          this.hasError = false;
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    getLines() {
      axios
        .get(`http://127.0.0.1:3000/company/${this.attendant.companyId}/lines`) // TODO: desharcodear
        .then(async (lines) => {
          this.lines = lines.data;
        })
        .catch((err) => {
          this.hasError = true;
          this.error = err;
        });
    },
  },
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
