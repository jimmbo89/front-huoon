<template>
  <v-card class="mx-auto flex-grow-1" elevation="1" rounded="lg" border flat>
    <v-card-title class="d-flex align-center text-subtitle-2">
      <v-icon icon="mdi-chart-line" class="mr-2 text-primary"></v-icon>
      {{ $t("finances.charts.incomeVsSpent") }} - {{ currentYear }}
    </v-card-title>

    <v-card-text class="flex-grow-1">
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { toRaw } from "vue";

export default {
  name: "IncomeSpentChart",
  props: {
    incomeData: {
      type: Array,
      default: () => Array(12).fill(0),
    },
    spentData: {
      type: Array,
      default: () => Array(12).fill(0),
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  watch: {
  incomeData() {
    this.updateChart();
  },
  spentData() {
    this.updateChart();
  }
},
  computed: {
    currentYear() {
      return this.year;
    },

    months() {
      return [
        this.$t("finances.months.jan"),
        this.$t("finances.months.feb"),
        this.$t("finances.months.mar"),
        this.$t("finances.months.apr"),
        this.$t("finances.months.may"),
        this.$t("finances.months.jun"),
        this.$t("finances.months.jul"),
        this.$t("finances.months.aug"),
        this.$t("finances.months.sep"),
        this.$t("finances.months.oct"),
        this.$t("finances.months.nov"),
        this.$t("finances.months.dec"),
      ];
    },

    totalIncome() {
      return this.incomeData.reduce((sum, value) => sum + value, 0);
    },

    totalSpent() {
      return this.spentData.reduce((sum, value) => sum + value, 0);
    },

    totalBalance() {
      return this.totalIncome - this.totalSpent;
    },

    balanceColor() {
      return this.totalBalance >= 0 ? "blue-lighten-1" : "orange-lighten-1";
    },

    balanceTextColor() {
      return this.totalBalance >= 0 ? "text-blue" : "text-orange";
    },

    chartConfig() {
      return {
        type: "line",
        data: {
          labels: this.months,
          datasets: [
            {
              label: this.$t("finances.fields.income"),
              data: this.incomeData,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderWidth: 3,
              tension: 0.4,
              fill: true,
            },
            {
              label: this.$t("finances.fields.spent"),
              data: this.spentData,
              borderColor: "#F44336",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderWidth: 3,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 13,
              },
              callbacks: {
                label: (context) => {
                  return `${
                    context.dataset.label
                  }: $${context.parsed.y.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                callback: (value) => `$${value.toLocaleString()}`,
                font: {
                  size: 12,
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
          interaction: {
            mode: "index",
            intersect: false,
          },
        },
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  },
  methods: {
    initChart() {
      Chart.register(...registerables);

      if (this.$refs.chartCanvas) {
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        // Usar toRaw desde el inicio
        const config = { ...this.chartConfig };
        config.data.datasets[0].data = [...toRaw(this.incomeData)];
        config.data.datasets[1].data = [...toRaw(this.spentData)];

        this.chartInstance = new Chart(this.$refs.chartCanvas, config);
      }
    },

   updateChart() {
  if (!this.chartInstance) return;

  try {
    // Usar structuredClone para mayor seguridad
    const incomeData = structuredClone(toRaw(this.incomeData));
    const spentData = structuredClone(toRaw(this.spentData));
    
    this.chartInstance.data.datasets[0].data = incomeData;
    this.chartInstance.data.datasets[1].data = spentData;
    
    this.chartInstance.update('none');
  } catch (error) {
    console.error('Error updating chart:', error);
    // Fallback seguro
    this.chartInstance.data.datasets[0].data = Array(12).fill(0);
    this.chartInstance.data.datasets[1].data = Array(12).fill(0);
    this.chartInstance.update('none');
  }
},
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  margin-bottom: 10px;
}

.text-green {
  color: #4caf50 !important;
}

.text-red {
  color: #f44336 !important;
}

.text-blue {
  color: #2196f3 !important;
}

.text-orange {
  color: #ff9800 !important;
}
</style>
