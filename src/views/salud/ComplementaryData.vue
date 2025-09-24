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
          <h2 class="text-body-2 font-weight-bold">{{ $t("complementaryData") }}</h2>
        </v-row>
        <v-row dense>
          <!-- Card: Presión Altura -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'height' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'height', ...heightData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="grey-darken-1 lighten-4" variant="tonal">
                <v-icon color="grey-darken-1">mdi-human-male-height</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("physicalExam.fields.height") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ heightData?.height || $t("no_definido") }} m
                    </div>
                  </template>
                  <span>{{ heightData?.height || $t("no_definido") }} m</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(heightData?.exam_date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Peso -->
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
          </v-col>

          <!-- Card: imc -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'bmi' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'bmi', ...bmiData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" :color="getImcColor(bmiData?.bmi)" variant="tonal">
                <v-icon :color="getImcColor(bmiData?.bmi)">mdi-calculator-variant-outline</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("physicalExam.fields.bmi") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ bmiData?.bmi || $t("no_definido") }}
                    </div>
                  </template>
                  <span>{{ bmiData?.bmi || $t("no_definido") }}</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(bmiData?.exam_date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Vacunación -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'vacunacion' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'vacunacion', ...firstVaccinationData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="green-darken-1 lighten-4" variant="tonal">
                <v-icon color="green-darken-1">mdi-needle</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("cardPlanVacunacion") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ firstVaccinationData?.description || $t("no_definido") }}
                    </div>
                  </template>
                  <span>{{ firstVaccinationData?.description || $t("no_definido") }}</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(firstVaccinationData?.startDate || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Diagnósticos -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'diagnosis' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'diagnosis', ...diagnosisData })"
              style="cursor: pointer"
            >
              <!-- Ícono a la izquierda -->
              <v-avatar size="40" class="me-3" color="red-darken-1 lighten-4" variant="tonal">
                <v-icon color="red-darken-1">mdi-heart-pulse</v-icon>
              </v-avatar>

              <!-- Texto a la derecha -->
              <div style="min-width: 0; flex: 1">
                <!-- Título -->
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("cardDiagnostico") }}
                </div>

                <!-- Valor con tooltip -->
                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ `${diagnosisData?.typeName} (${diagnosisData?.cie10Code || $t('sin_codigo')})` || $t('no_definido') }}
                    </div>
                  </template>
                  <span>{{ `${diagnosisData?.typeName} (${diagnosisData?.cie10Code || $t('sin_codigo')})` || $t('no_definido') }}</span>
                </v-tooltip>

                <!-- Fecha -->
                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(diagnosisData?.date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>


          <!-- Consultas médicas -->
        <v-col cols="12" sm="6" md="3">
  <v-card
    class="pa-2 d-flex align-center signo-card"
    :class="{ 'oscurecer-persistente': selectedView === 'consultation' }"
    elevation="1"
    rounded="lg"
    @click="abrirModal({ type: 'consultation', ...consultationData })"
    style="cursor: pointer"
  >
    <!-- Ícono -->
    <v-avatar size="40" class="me-3" color="blue-darken-2" variant="tonal">
      <v-icon color="blue-darken-2">mdi-stethoscope</v-icon>
    </v-avatar>

    <!-- Contenido -->
    <div style="min-width: 0; flex: 1">
      <!-- Título -->
      <div class="text-body-2 font-weight-medium text-truncate">
        {{ $t("cardConsultaMedica") }}
      </div>

      <!-- Valor principal + profesional + motivo (dentro del tooltip) -->
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <div
            v-bind="props"
            class="text-caption text-grey-darken-1 text-truncate"
          >
            {{
              consultationData?.typeName
                ? `${consultationData.typeName}${consultationData.professional ? ' - ' + $t('consultations.fields.profesional') + ': ' + consultationData.professional : ''}`
                : $t("no_definido")
            }}
          </div>
        </template>
        <span>
          {{
            consultationData?.typeName
              ? `${consultationData.typeName}${consultationData.professional ? ' - ' + $t('consultations.fields.profesional') + ': ' + consultationData.professional : ''}`
              : $t("no_definido")
          }}
          <br v-if="consultationData?.reason" />
          <small class="text-grey-lighten-2">{{ $t('consultations.fields.reason') }}: {{ consultationData.reason }}</small>
        </span>
      </v-tooltip>

      <!-- Fecha -->
      <div class="text-caption text-grey-lighten-1 mt-1">
        {{
          formatoFecha(
            consultationData?.date || new Date().toISOString().split("T")[0]
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
            @update-complementary-data="initialize"
          />
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
import Weight from "./Weight.vue";
import Height from "./Height.vue";
import Vaccination from "./Vaccination.vue";
import Diagnosis from "./Diagnosis.vue";
import MedicalConsultation from "./MedicalConsultation.vue";

export default {
  components: {
    Height,
    Weight,
    Vaccination,
    Diagnosis,
    MedicalConsultation
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
    selectedView: 'height',
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
    heightData: {},
    bmiData: {},
    personalBackGroundData: [],
    diagnosisData: {},
    consultationData: {},
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
     firstVaccinationData() {
    if (!this.personalBackGroundData || !Array.isArray(this.personalBackGroundData) || this.personalBackGroundData.length === 0) {
      return null;
    }
    // Como viene ordenado DESC por startDate,
    // la vacunación más reciente está en la PRIMERA posición del array.
    return this.personalBackGroundData[0];
  },
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
    /*const primerSignoValido = this.signosVitalesTransformados.find(
    (s) => s.valor !== this.$t("no_definido")
  );/*/
  this.selectedView = "height";
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
    getImcColor(imc) {
      const value = parseFloat(imc);
      if (value < 18.5) return "blue"; // Bajo peso
      if (value >= 18.5 && value < 25) return "green"; // Normal
      if (value >= 25 && value < 30) return "orange"; // Sobrepeso
      return "red"; // Obesidad
    },
    abrirModal(item) {
      this.selectedView = item.type;
      console.log('this.selectedView');
      console.log(this.selectedView);
    },
    getComponentByType(type) {
      if (!type) return null;

      // Normalización: minúsculas + eliminar tildes
      const normalized = type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const map = {
        height: Height,
        weight: Weight,
        bmi: null, // Mejor null que '' para evitar confusión
        vacunacion: Vaccination,
        diagnosis: Diagnosis,
        consultation: MedicalConsultation
      };
      console.log('map[normalized]');
      console.log(map[normalized]);
      return map[normalized] || null;
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
      this.data.person_id = this.selectedPerson.id
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-profile-complementary",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.heightData = result.data?.height || {};
          this.bmiData = result.data?.bmi || {};
          this.personalBackGroundData = result.data?.backgroundPerson || [];
          this.diagnosisData = result.data?.diagnosis || {};
          this.weightData = result.data?.weight || [];
          this.consultationData = result.data.consultation || {};
        } else {
          // Si no hay datos, asignamos un array vacío
          this.heightData = {};
          this.bmiData = {};
          this.personalBackGroundData = [];
          this.diagnosisData = {};
          this.weightData = {};
          this.consultationData = {};
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
