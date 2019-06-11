<template>
  <div
    class="main"
  >
    <h1>Lineas</h1>

    <div class="center">
      <b-card
        title="Crear Fila"
        bg-variant="light"
        text-variant="dark"
      >
        <LineCreator
          :companyId="'5cd6f9ce14f8aa4a7a2928ba'"
          @done="getLines()"
        />
      </b-card>
    </div>
    <div
      v-for="(line, index) in lines"
      :key="line._id"
    >
      <b-card
        v-if="selected != line._id"
        bg-variant="dark"
        text-variant="white"
        :title="line.name"
      >
        <div>
          <b-card-img :src="qrcodes[index]" />
        </div>
        <div>
          <b-button
            :href="'data:image/png;'+qrcodes[index]"
            :download="line.name+'.png'"
          >
            Descargar Código
          </b-button>
        </div>
        <b-button
          variant="danger"
          @click="deleteLine(line._id)"
        >
          Delete
        </b-button>
        <b-button
          variant="warning"
          @click="select(line._id)"
        >
          Editar
        </b-button>
      </b-card>
      <b-card
        v-else
        bg-variant="dark"
        text-variant="white"
        :title="'Editando '+line.name"
      >
        <div class="center">
          <LineCreator
            :line="line"
            :isNew="false"
            :companyId="'5cd6f9ce14f8aa4a7a2928ba'"
            @done="getLines()"
          />
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import QRCode from 'qrcode';
import LineCreator from '@/components/lineCreator.vue';

export default {
  name: 'CompanyLinesList',
  components: {
    LineCreator,
  },
  data() {
    return {
      error: '',
      hasError: false,
      lines: [],
      qrcodes: [],
      selected: '',
    };
  },
  mounted() {
    this.getLines();
  },
  methods: {
    getLines() {
      axios.get('http://127.0.0.1:3000/company/5cd6f9ce14f8aa4a7a2928ba/lines')
        .then(async (lines) => {
          this.lines = lines.data;
          this.selected = '';
          let qrcodes = lines.data.map((line) => {
            return QRCode.toDataURL(`http://127.0.0.1:3000/line/${line._id}`)
              .then((url) => {
                return url;
              })
              .catch((err) => {
                return err;
              });
          });
          qrcodes = await Promise.all(qrcodes);
          this.qrcodes = qrcodes;
        })
        .catch((err) => {
          console.log(err);
          this.hasError = true;
          this.error = err;
        });
    },
    deleteLine(id) {
      axios.delete(`http://127.0.0.1:3000/line/${id}`)
        .then(() => {
          this.getLines();
        })
        .catch((err) => {
          this.hasError = true;
          this.error = err;
        });
    },
    select(id) {
      this.selected = id;
    },
  },
};


</script>

<style scoped>
.card {
  margin: auto;
  margin-top: 1%;
  color: black;
  width:66%;
}

.card img {
  margin: auto;
  margin-top: 1%;
  margin-bottom: 1%;
  width: 25vh;
}

.center{
  margin: auto;
  width: 50vw;
  padding: 10px;
}

</style>
