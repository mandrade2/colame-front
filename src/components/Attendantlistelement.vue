<template>
  <div
    class="main"
  >
    <b-card
      v-if="selected"
      bg-variant="dark"
      text-variant="white"
      :title="attendant.name"
    >
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
      <b-button
        variant="danger"
        @click="deleteAttendant()"
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
        v-b-toggle="attendant._id+'graphs'"
        variant="primary"
        block
      >
        Datos por dias
      </b-button>
      <b-collapse
        :id="attendant._id+'graphs'"
        class="mt-2"
      >
        <div
          :id="attendant._id +'client'"
          style="height: 360px; width: 100%;"
        />
        <div
          :id="attendant._id +'avgTime'"
          style="height: 360px; width: 100%;"
        />
        <div
          :id="attendant._id +'maxtime'"
          style="height: 360px; width: 100%;"
        />
        <div
          :id="attendant._id +'mintime'"
          style="height: 360px; width: 100%;"
        />
      </b-collapse>
      <b-button
        v-b-toggle="attendant._id+'line'"
        variant="primary"
        block
      >
        Datos por Lineas
      </b-button>
      <b-collapse
        :id="attendant._id+'line'"
        class="mt-2"
      >
        <b-table
          striped
          hover
          :items="itemsLine"
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
      :title="'Editando '+attendant.name"
    >
      <div class="center">
        <AttendantCreator
          :attendant="attendant"
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
import * as CanvasJs from 'canvasjs';
import AttendantCreator from '@/components/attendantCreator.vue';

export default {
  name: 'AttendantListElement',
  components: {
    AttendantCreator,
  },
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
      items: [],
      itemsLine: [],
      selected: true,
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
    await this.getAttInfo();
    this.chart = new CanvasJs.Chart(`${this.attendant._id}client`, this.charts[0]);
    this.chart.render();
    this.chart1 = new CanvasJs.Chart(`${this.attendant._id}avgTime`, this.charts[1]);
    this.chart1.render();
    this.chart3 = new CanvasJs.Chart(`${this.attendant._id}maxtime`, this.charts[2]);
    this.chart3.render();
    this.chart4 = new CanvasJs.Chart(`${this.attendant._id}mintime`, this.charts[3]);
    this.chart4.render();
  },
  methods: {
    deleteAttendant() {
      axios.delete(`http://127.0.0.1:3000/attendant/${this.attendant._id}`)
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
    getAttInfo() {
      axios.get(`http://127.0.0.1:3000/attendant/${this.attendant._id}/info`)
        .then((response) => {
          this.attInfo = response.data;
          this.items.push({
            type: '',
            clientes: this.attInfo.clients,
            tiempo_promedio: this.attInfo.avgTime.toFixed(2),
            clientes_por_dia: this.attInfo.clientPerDay.toFixed(2),
            tiempo_máximo: this.attInfo.maxtime,
            tiempo_mínimo: this.attInfo.mintime,
          });
          for (const i in this.attInfo.dataPerLine) {
            this.itemsLine.push({
              type: i,
              clientes: this.attInfo.dataPerLine[i].clients,
              tiempo_promedio: this.attInfo.dataPerLine[i].avgTime.toFixed(2),
              clientes_por_dia: this.attInfo.dataPerLine[i].clientPerDay.toFixed(2),
              tiempo_máximo: this.attInfo.dataPerLine[i].maxtime,
              tiempo_mínimo: this.attInfo.dataPerLine[i].mintime,
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
