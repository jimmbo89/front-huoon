<template>
  <v-snackbar
    class="mt-12"
    location="right top"
    :timeout="sb_timeout"
    :color="sb_type"
    elevation="24"
    :multi-line="true"
    vertical
    v-model="snackbar"
  >
    <v-row>
      <v-col md="2">
        <v-avatar :icon="sb_icon" color="sb_type" size="40"></v-avatar>
      </v-col>
      <v-col md="10">
        <h4>{{ sb_title }}</h4>
        {{ sb_message }}
      </v-col>
    </v-row>
  </v-snackbar>
  <v-container class="pa-4">
    <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <!-- Encabezado -->
        <v-row justify="space-between" align="center" class="mb-6">
          <h2 class="text-body-2 font-weight-bold">{{ $t("vitalSigns") }}</h2>
        </v-row>
        <v-row dense>
          <!-- Card: Presión Arterial -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'bloodPressure' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'bloodPressure', ...bloodPressureData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="indigo-darken-2 lighten-4" variant="tonal">
                <v-icon color="indigo-darken-2">mdi-heart-pulse</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("physicalExam.fields.blood_pressure") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ bloodPressureData?.bloodPressure || $t("no_definido") }} mmHg
                    </div>
                  </template>
                  <span>{{ bloodPressureData?.bloodPressure || $t("no_definido") }} mmHg</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(bloodPressureData?.exam_date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Pulso -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'pulse' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'pulse', ...heartRateData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="indigo-darken-2 lighten-4" variant="tonal">
                <v-icon color="indigo-darken-2">mdi-heart</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("physicalExam.fields.pulse") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ heartRateData?.pulse || $t("no_definido") }} bpm
                    </div>
                  </template>
                  <span>{{ heartRateData?.pulse || $t("no_definido") }} bpm</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(heartRateData?.exam_date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Temperatura -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'temperature' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'temperature', ...temperatureData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="indigo-darken-2 lighten-4" variant="tonal">
                <v-icon color="indigo-darken-2">mdi-thermometer</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("physicalExam.fields.temperature") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ temperatureData?.temperature || $t("no_definido") }} °C
                    </div>
                  </template>
                  <span>{{ temperatureData?.temperature || $t("no_definido") }} °C</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(temperatureData?.exam_date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Frecuencia Respiratoria -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'respiratoryRate' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'respiratoryRate', ...respiratoryRateData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="indigo-darken-2 lighten-4" variant="tonal">
                <v-icon color="indigo-darken-2">mdi-lungs</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("physicalExam.fields.respiratory_rate") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ respiratoryRateData?.respiratory_rate || $t("no_definido") }} rpm
                    </div>
                  </template>
                  <span>{{ respiratoryRateData?.respiratory_rate || $t("no_definido") }} rpm</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(respiratoryRateData?.exam_date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Peso 
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'weight' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'weight', ...weightData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="indigo-darken-2 lighten-4" variant="tonal">
                <v-icon color="indigo-darken-2">mdi-scale-bathroom</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("physicalExam.fields.weight") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ weightData?.weight || $t("no_definido") }} kg
                    </div>
                  </template>
                  <span>{{ weightData?.weight || $t("no_definido") }} kg</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(weightData?.exam_date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>-->

          <!-- Card: Medicamentos -->
          <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-2 d-flex align-center signo-card"
            :class="{ 'oscurecer-persistente': selectedView === 'treatment' }"
            elevation="1"
            rounded="lg"
            @click="abrirModal({ type: 'treatment', ...treatmentData })"
            style="cursor: pointer"
          >
            <v-avatar size="40" class="me-3" color="purple lighten-4" variant="tonal">
              <v-icon color="purple">mdi-pill</v-icon>
            </v-avatar>

            <div style="min-width: 0; flex: 1">
              <div class="text-body-2 font-weight-medium text-truncate">
                {{ $t("treatment.cardMedicamento") }}
              </div>

              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-caption text-grey-darken-1 text-truncate"
                  >
                    {{
                      treatmentData?.medication
                        ? [treatmentData.medication, treatmentData.dosage, treatmentData.typeName]
                            .filter(Boolean)
                            .join(" - ")
                        : $t("treatment.no_definido")
                    }}
                  </div>
                </template>
                <span>
                  {{
                    treatmentData?.medication
                      ? [treatmentData.medication, treatmentData.dosage, treatmentData.typeName]
                          .filter(Boolean)
                          .join(" - ")
                      : $t("treatment.no_definido")
                  }}
                </span>
              </v-tooltip>

              <div class="text-caption text-grey-lighten-1 mt-1">
                {{
                  formatoFecha(
                    treatmentData?.startDate || new Date().toISOString().split("T")[0]
                  )
                }}
              </div>
            </div>
          </v-card>
        </v-col>
        </v-row>
        <v-row dense class="mt-3">
        <v-col cols="12">
          <component
            :is="getComponentByType(selectedView)"
            v-if="selectedView"
            :key="selectedView"
            :selected-person="selectedPerson"
          />
          <v-alert v-else type="info" variant="tonal">
            {{ $t("vitalSignsnoData") }}
          </v-alert>
        </v-col>
      </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import { shallowRef } from "vue";
import Treatment from "./Treatment.vue";
import BloodPressure from "./BloodPressure.vue";
import HeartRate from "./HeartRate.vue";
import Temperature from "./Temperature.vue";
import RespiratoryRate from "./RespiratoryRate.vue";
import Weight from "./Weight.vue";

export default {
  components: {
    Treatment,
    BloodPressure,
    HeartRate,
    Temperature,
    RespiratoryRate,
    Weight
  },
   props: {
    selectedPerson: {
      type: Object,
      required: true
    },
  },
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    selectedView: 'bloodPressure',
    time: null,
    modal2: false,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    showDetails: false,
    dialog: false,
    dialogDelete: false,
    bloodPressureData: {},
    heartRateData: {},
    treatmentData: {},
    temperatureData: {},
    respiratoryRateData: {},
    weightData: {},
    tittlePerson: -1,
    selectedItems: {}, // Almacena las selecciones por rol
    home_id: "",
    data: {},
    person_id: "",
   
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    editedIndex: -1,
    search: "",
    title: "",
    description: "",
    date: "",
    module: "",
  }),
  computed: {

    /**Signos Vitales */
    /*signosVitalesTransformados() {
      const signosConfig = {
        bloodPressure: {
          nombre: this.$t("physicalExam.fields.blood_pressure"),
          unidad: "mmHg",
          icon: "mdi-heart-pulse",
          color: "indigo-darken-2",
          type: "bloodPressure",
        },
        pulse: {
          nombre: this.$t("physicalExam.fields.pulse"),
          unidad: "bpm",
          icon: "mdi-heart",
          color: "indigo-darken-2",
          type: "pulse",
        },
        temperature: {
          nombre: this.$t("physicalExam.fields.temperature"),
          unidad: "°C",
          icon: "mdi-thermometer",
          color: "indigo-darken-2",
          type: "temperature",
        },
        respiratoryRate: {
          nombre: this.$t("physicalExam.fields.respiratory_rate"),
          unidad: "rpm",
          icon: "mdi-lungs",
          color: "indigo-darken-2",
          type: "respitationRate",
        },
        weight: {
          nombre: this.$t("physicalExam.fields.weight"),
          unidad: "kg",
          icon: "mdi-scale-bathroom",
          color: "indigo-darken-2",
          type: "weight",
        },
      };

      const result = [];
      const examData = this.physicalExam || {};

      // Transformar cada propiedad relevante, mostrando "No definido" si no hay valor
      Object.keys(signosConfig).forEach((key) => {
        const valor = examData[key];
        const tieneValor = valor !== null && valor !== undefined && valor !== "";

        result.push({
          ...signosConfig[key],
          valor: tieneValor ? valor : this.$t("no_definido"),
          unidad: tieneValor ? signosConfig[key].unidad : "", // No mostrar unidad si no hay valor
          fecha:
            examData.examDate ||
            examData.exam_date ||
            new Date().toISOString().split("T")[0],
          originalKey: key,
        });
      });
      // Añadir medicamentos SIEMPRE, incluso si está vacío
      // 1. Normalizar los tratamientos (asegurar que siempre sea un array)
      const treatments = Array.isArray(this.treatment)
        ? this.treatment
        : [this.treatment || {}];

      // 2. Obtener el primer tratamiento para mostrar en la card
      const firstTreatment = treatments[0] || {};

      // 3. Construir la información médica (medicamento, dosis, tipo)
      const medInfo = [
        firstTreatment.medication,
        firstTreatment.dosage,
        firstTreatment.typeName,
      ]
        .filter(Boolean)
        .join(" - ");

      const tieneInfoMedicamento = medInfo.trim() !== "";
      const isSingleTreatment = treatments.length <= 1;

      // 4. Agregar al resultado final
      result.push({
        nombre: isSingleTreatment
          ? this.$t("treatment.cardMedicamento")
          : this.$t("treatment.cardMedicamentosPlural", { count: treatments.length }),
        valor: isSingleTreatment
          ? tieneInfoMedicamento
            ? medInfo
            : this.$t("treatment.no_definido")
          : this.$t("treatment.medicamentosActivos", { count: treatments.length }),
        unidad: "",
        icon: "mdi-pill",
        color: "purple",
        fecha: firstTreatment.startDate || new Date().toISOString().split("T")[0],
        originalKey: "medication",
        type: "treatment",
      });

      return result;
    },*/
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));

    this.initialize();
    /*const primerSignoValido = this.signosVitalesTransformados.find(
    (s) => s.valor !== this.$t("no_definido")
  );/*/
  this.selectedView = "bloodPressure";
  },
  methods: {
    formatoFecha(fecha) {
      if (!fecha) return "";

      const d = new Date(fecha);
      const locale = this.$i18n.locale;
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Forzar UTC
      };

      return d.toLocaleDateString(locale, options);
    },
    abrirModal(item) {
      this.selectedView = item.type;
      /*switch (item.type) {
        case "physicalExam":
          this.showAddPhysicalExam();
          break;
        case "treatment":
          this.showAddTreatment();
          break;
        case "backgroundPerson":
          this.showAddPerson();
          break;
        case "backgroundFamily":
          this.showAddFamily();
          break;
        case "medicalExam":
          this.showAddExam();
          break;
        case "diagnosis":
          this.showAddDiagnosis();
          break;
        case "consultation":
          this.showAddConsultations();
          break;
        default:
          break;
      }*/
    },
    getComponentByType(type) {
    switch (type) {
      case "bloodPressure":
        return BloodPressure; // Importa este componente
      case "pulse":
        return HeartRate;
      case "temperature":
        return Temperature;
      case "respiratoryRate":
        return RespiratoryRate;
      case "weight":
        return Weight;
      case "treatment":
        return Treatment; // Como mencionaste en tu ejemplo
      default:
        return null;
    }
  },
    getStatusById(statusId) {
      return this.status.find((status) => status.id === statusId);
    },
    close() {
      this.step = 0;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.file = null;
      this.imgMiniatura = "";
      this.editedIndex = -1;
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.data.person_id = this.selectedPerson.id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-profile-vital-signs",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.bloodPressureData = result.data?.bloodPressure || {};
          this.heartRateData = result.data?.heartRate || {};
          this.treatmentData = result.data?.treatment || {};
          this.temperatureData = result.data?.temperature || {};
          this.respiratoryRateData = result.data?.respiratoryRate || {};
          this.weightData = result.data?.weight || {};
        } else {
          // Si no hay datos, asignamos un array vacío
          this.bloodPressureData = {};
          this.heartRateData = {};
          this.treatmentData = {};
          this.temperatureData = {};
          this.respiratoryRateData = {};
          this.weightData = {};
          //this.showAlert('success', result.message || 'No hay tareas disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las tareas.",
          3000
        );
      } finally {
        this.loading = false;
      }
    },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "error") {
        this.sb_title = "Error";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },
  },
};
</script>
<style scoped>
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
}

.icono-concavo::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 8px;
  background: transparent;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.oscurecer-persistente {
  background-color: rgba(0, 0, 0, 0.04) !important; /* Sutil gris claro */
  border-color: rgba(0, 0, 0, 0.12) !important;     /* Borde más marcado */
  transform: translateY(-1px) !important;           /* Efecto leve de elevación */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12) !important;
}

/* Si quieres un efecto más fuerte (ej. si usas tema oscuro) */
.oscurecer-persistente.v-card--light {
  background-color: rgba(0, 0, 0, 0.08) !important;
}
</style>
