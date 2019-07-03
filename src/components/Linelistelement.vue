<template>
  <div
    class="main"
  >
    <b-card
      v-if="selected"
      bg-variant="dark"
      text-variant="white"
      :title="line.name"
    >
      <div>
        <b-card-img :src="qrcode" />
      </div>
      <div>
        <b-table
          striped
          hover
          :items="items"
          :fields="fields"
          :dark="true"
          :responsive="true"
        />
      </div>
      <div>
        <b-button
          :href="'data:image/png;'+qrcode"
          :download="line.name+'.png'"
        >
          Descargar Código QR
        </b-button>
      </div>
      <b-button
        variant="danger"
        @click="deleteLine()"
      >
        Delete
      </b-button>
      <b-button
        variant="warning"
        @click="select()"
      >
        Editar
      </b-button>
      <b-button
        v-b-toggle="line._id+'graphs'"
        variant="primary"
        block
      >
        Datos por dias
      </b-button>
      <b-collapse
        :id="line._id+'graphs'"
        class="mt-2"
      >
        <div
          :id="line._id +'client'"
          style="height: 360px; width: 100%;"
        />
        <div
          :id="line._id +'avgTime'"
          style="height: 360px; width: 100%;"
        />
        <div
          :id="line._id +'maxtime'"
          style="height: 360px; width: 100%;"
        />
        <div
          :id="line._id +'mintime'"
          style="height: 360px; width: 100%;"
        />
      </b-collapse>
      <b-button
        v-b-toggle="line._id+'att'"
        variant="primary"
        block
      >
        Datos por Atendedores
      </b-button>
      <b-collapse
        :id="line._id+'att'"
        class="mt-2"
      >
        <b-table
          striped
          hover
          :items="itemsAtt"
          :fields="fields"
          :dark="true"
          :responsive="true"
        />
      </b-collapse>
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
          :is-new="false"
          :company-id="'5cd6f9ce14f8aa4a7a2928ba'"
          @cancel="select()"
          @done="done()"
        />
      </div>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios';
import QRCode from 'qrcode';
import * as CanvasJs from 'canvasjs';
import LineCreator from '@/components/lineCreator.vue';

export default {
  name: 'LineListElement',
  components: {
    LineCreator,
  },
  props: {
    line: {
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
      qrcode: [],
      items: [],
      itemsAtt: [],
      selected: true,
      waitInfo: {
        clients: 0, avgTime: 0, clientPerDay: 0, maxtime: 0, mintime: 0,
      },
      attInfo: {
        clients: 0, avgTime: 0, clientPerDay: 0, maxtime: 0, mintime: 0,
      },
      chartData: {
        animationEnabled: true,
        toolTip: {
          shared: true,
        },
        title: {
          text: '',
        },
        data: [],
      },
      fields: {
        type: {
          label: '',
          class: 'font-weight-bold',
        },
        clientes: {
          label: 'Clientes',
        },
        clientes_por_dia: {
          label: 'Clientes por Dia',
        },
        tiempo_promedio: {
          label: 'Tiempo Promedio',
        },
        tiempo_máximo: {
          label: 'Tiempo Máximo',
        },
        tiempo_mínimo: {
          label: 'Tiempo Mínimo',
        },
      },
      charts: [],
      chart: null,
      chart1: null,
      chart3: null,
      chart4: null,
    };
  },
  async mounted() {
    this.charts.push(JSON.parse(JSON.stringify(this.chartData)));
    this.charts.push(JSON.parse(JSON.stringify(this.chartData)));
    this.charts.push(JSON.parse(JSON.stringify(this.chartData)));
    this.charts.push(JSON.parse(JSON.stringify(this.chartData)));
    this.getQRcode();
    await this.getWaitInfo();
    await this.getAttInfo();
    this.chart = new CanvasJs.Chart(`${this.line._id}client`, this.charts[0]);
    this.chart.render();
    this.chart1 = new CanvasJs.Chart(`${this.line._id}avgTime`, this.charts[1]);
    this.chart1.render();
    this.chart3 = new CanvasJs.Chart(`${this.line._id}maxtime`, this.charts[2]);
    this.chart3.render();
    this.chart4 = new CanvasJs.Chart(`${this.line._id}mintime`, this.charts[3]);
    this.chart4.render();
  },
  methods: {
    getQRcode() {
      QRCode.toDataURL(`http://127.0.0.1:3000/line/${this.line._id}`)
        .then((url) => {
          this.qrcode = url;
        })
        .catch((err) => {
          this.hasError = true;
          this.error = err;
        });
    },
    deleteLine() {
      axios.delete(`http://127.0.0.1:3000/line/${this.line._id}`)
        .then(() => {
          this.$emit('done');
        })
        .catch((err) => {
          this.hasError = true;
          this.error = err;
        });
    },
    select() {
      this.selected = !this.selected;
    },
    done() {
      this.selected = !this.selected;
      this.$emit('done');
    },
    getWaitInfo() {
      axios.get(`http://127.0.0.1:3000/line/${this.line._id}/waitinfo`)
        .then((response) => {
          this.waitInfo = response.data;
          this.items.push({
            type: 'Espera',
            clientes: this.waitInfo.clients,
            tiempo_promedio: this.waitInfo.avgTime.toFixed(2),
            clientes_por_dia: this.waitInfo.clientPerDay.toFixed(2),
            tiempo_máximo: this.waitInfo.maxtime,
            tiempo_mínimo: this.waitInfo.mintime,
          });
          const keys = ['clients', 'avgTime', 'maxtime', 'mintime'];
          for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].title.text = keys[i];
            const dataPoints = [];
            for (const x in this.waitInfo.dataPerDate) {
              dataPoints.push({ label: x, y: this.waitInfo.dataPerDate[x][keys[i]] });
            }
            this.charts[i].data.push({ name: 'Espera', type: 'column', dataPoints });
          }
        })
        .catch((err) => {
          this.hasError = true;
          this.error = err;
        });
    },
    getAttInfo() {
      axios.get(`http://127.0.0.1:3000/line/${this.line._id}/attinfo`)
        .then((response) => {
          this.attInfo = response.data;
          this.items.push({
            type: 'Atención',
            clientes: this.attInfo.clients,
            tiempo_promedio: this.attInfo.avgTime.toFixed(2),
            clientes_por_dia: this.attInfo.clientPerDay.toFixed(2),
            tiempo_máximo: this.attInfo.maxtime,
            tiempo_mínimo: this.attInfo.mintime,
          });
          for (const i in this.attInfo.dataPerAttendant) {
            this.itemsAtt.push({
              type: i,
              clientes: this.attInfo.dataPerAttendant[i].clients,
              tiempo_promedio: this.attInfo.dataPerAttendant[i].avgTime.toFixed(2),
              clientes_por_dia: this.attInfo.dataPerAttendant[i].clientPerDay.toFixed(2),
              tiempo_máximo: this.attInfo.dataPerAttendant[i].maxtime,
              tiempo_mínimo: this.attInfo.dataPerAttendant[i].mintime,
            });
          }
          const keys = ['clients', 'avgTime', 'maxtime', 'mintime'];
          for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].title.text = keys[i];
            const dataPoints = [];
            for (const x in this.attInfo.dataPerDate) {
              dataPoints.push({ label: x, y: this.attInfo.dataPerDate[x][keys[i]] });
            }
            this.charts[i].data.push({ name: 'Atendidos', type: 'column', dataPoints });
          }
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
