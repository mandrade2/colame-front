<template>
  <div class="main">
    <h1>Lineas</h1>

    <div class="center">
      <b-card title="Crear Fila" bg-variant="light" text-variant="dark">
        <LineCreator :company-id="company._id" @done="getLines()" />
      </b-card>
    </div>
    <div v-for="(line, index) in lines" :key="line._id">
      <LineListElement :line="line" @done="getLines()" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import QRCode from "qrcode";
import LineCreator from "@/components/lineCreator.vue";
import LineListElement from "@/components/Linelistelement.vue";

export default {
  name: "CompanyLinesList",
  components: {
    LineCreator,
    LineListElement
  },
  props: {
    company: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      error: "",
      hasError: false,
      lines: [],
      qrcodes: [],
      selected: ""
    };
  },
  mounted() {
    console.log("hola");
    console.log(this.company);
    this.getLines();
  },
  methods: {
    getLines() {
      axios
        .get(`http://127.0.0.1:3000/company/${this.company._id}/lines`)
        .then(async lines => {
          this.lines = lines.data;
          this.selected = "";
          let qrcodes = lines.data.map(line =>
            QRCode.toDataURL(`http://127.0.0.1:3000/line/${line._id}`)
              .then(url => url)
              .catch(err => err)
          );
          qrcodes = await Promise.all(qrcodes);
          this.qrcodes = qrcodes;
        })
        .catch(err => {
          console.log(err);
          this.hasError = true;
          this.error = err;
        });
    },
    deleteLine(id) {
      axios
        .delete(`http://127.0.0.1:3000/line/${id}`)
        .then(() => {
          this.getLines();
        })
        .catch(err => {
          this.hasError = true;
          this.error = err;
        });
    },
    select(id) {
      this.selected = id;
    }
  }
};
</script>

<style scoped>
.card {
  margin: auto;
  margin-top: 1%;
  color: black;
  width: 66%;
}

.card img {
  margin: auto;
  margin-top: 1%;
  margin-bottom: 1%;
  width: 25vh;
}

.center {
  margin: auto;
  width: 50vw;
  padding: 10px;
}
</style>
