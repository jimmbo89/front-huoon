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
  <v-card
    class="pa-0"
    elevation="1"
    rounded="lg"
    style="position: relative; overflow: visible; z-index: auto"
  >
    <!-- Encabezado con foto y datos -->
    <v-card-text>
      <v-card-actions class="bg-grey-lighten-5 tools-bar">
        <v-btn
          v-for="tool in tools"
          :key="tool.name"
          @click="tool.action()"
          size="small"
          color="primary"
          variant="text"
          prepend-icon="mdi-plus"
          class="text-capitalize"
        >
          {{ tool.name }}
        </v-btn>
      </v-card-actions>
      <v-card-title class="d-flex flex-wrap align-center pb-2">
        <!-- Título -->

        <!-- Spacer (solo visible en md+) -->
        <v-spacer class="d-none d-md-block"></v-spacer>
        <!-- Campo de búsqueda global -->
        <div class="flex-grow-1" style="max-width: 300px">
          <v-text-field
            v-model="search"
            density="compact"
            :label="$t('dataTable.search')"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            hide-details
            single-line
            flat
          ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="physicalExams"
        :search="search"
        :items-per-page-text="$t('dataTable.itemsPerPageText')"
        :no-data-text="$t('dataTable.noDataText')"
        :loading-text="$t('dataTable.loadingText')"
        :loading="loading"
        :hide-default-header="true"
        style="
          max-height: 68vh;
          overflow-y: auto;
          background: transparent;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 0;
        "
      >
        <template v-slot:top>
          <v-card
            :elevation="1"
            :hover="false"
            flat
            class="mb-2 mx-1 rounded-lg"
            style="
              border: 1px solid #eceff1;
              height: 40px;
              min-height: 40px;
              display: flex;
              align-items: center;
              transition: none !important;
            "
          >
            <v-card-text
              class="d-flex pa-2"
              style="
                width: 100%;
                min-width: 0;
                height: 100%;
                padding: 0 16px !important;
                display: flex;
                align-items: center;
              "
            >
              <!-- Fecha / Periodo (10%) -->
              <div style="width: 7%; min-width: 0" class="text-left">
                {{ $t("physicalExam.fields.exam_date") }}
              </div>

              <!-- Categoría / Descripción (40%)-->
              <div style="width: 83%; min-width: 0" class="text-left">
                {{ $t("physicalExam.fields.height") }}
              </div>
              <!-- Acciones (10%) -->
              <div style="width: 10%; min-width: 0" class="d-flex justify-end">
                {{ $t("settings.actions") }}
              </div>
            </v-card-text>
          </v-card>
        </template>
        <template v-slot:item="slotProps">
          <tr>
            <td colspan="100%" style="padding: 0; border: none">
              <v-card
                class="mb-2 mx-1 rounded-lg"
                elevation="1"
                density="comfortable"
                flat
              >
                <v-card-text
                  class="d-flex align-center pa-2"
                  style="width: 100%; min-width: 0"
                >
                  <div class="d-flex align-center" style="width: 7%; min-width: 0">
                    <v-avatar
                      class="mr-1 icono-concavo"
                      :class="`bg-${getTypeColor(slotProps.item.typeName)}`"
                      :style="{
                        'min-height': '48px',
                        'min-width': '48px',
                        'border-radius': '8px',
                        'font-size': '0.90em'
                      }"
                    >
                      <div class="font-weight-medium">
                        {{ formatIntuitiveDate(slotProps.item.exam_date) }}
                      </div>
                    </v-avatar>
                  </div>

                  <!-- Categoría + Descripción - 40% -->
                  <div style="width: 83%; min-width: 0" class="d-flex flex-column">
                    <div class="text-body-2 text-truncate">
                      {{ slotProps.item.height }}
                    </div>
                    <!--<div class="text-caption text-grey-darken-1 text-truncate">
                        {{ slotProps.item.typeName }}
                              </div>-->
                  </div>
                  <!-- Acciones - 10% -->
                  <div
                    class="d-flex gap-1"
                    style="width: 10%; justify-content: flex-end; flex-wrap: nowrap"
                  >
                    <v-btn
                      size="35"
                      icon
                      variant="text"
                      color="green-darken-2"
                      @click="editItem(slotProps.item)"
                      class="flex-shrink-0 mr-1"
                      title="Editar Presupuesto"
                    >
                      <v-icon size="20">mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn
                      size="35"
                      icon
                      variant="text"
                      color="red-darken-2"
                      @click="deleteItem(slotProps.item)"
                      class="flex-shrink-0"
                      title="Eliminar Presupuesto"
                    >
                      <v-icon size="20">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <v-dialog
  v-model="dialog"
  max-width="500px"
  persistent
  transition="dialog-bottom-transition"
>
  <v-form ref="form" v-model="valid" @submit.prevent="save">
    <v-card class="pa-6">
      <v-card-title class="text-h6 font-weight-bold">
        {{ formTitle }}
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <!-- Campo: Presión Arterial -->
          <v-col cols="12">
           <v-text-field
            v-model="editedItem.height"
            :label="$t('physicalExam.fields.height')"
            variant="underlined"
            type="number"
            :rules="heightRules"
            hint="Ej: 1.50"
            persistent-hint
            min="0.30"
            max="3.00"
          ></v-text-field>
          </v-col>
          <!-- Campo: Fecha -->
          <v-col cols="12">
             <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="dateInput"
                        :label="$t('physicalExam.fields.exam_date')"
                        variant="underlined"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                    <v-date-picker
                      color="#03626C"
                      :model-value="dateInput"
                      @update:model-value="updateDate"
                      :max="new Date().toISOString().split('T')[0]"
                    ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <v-btn
          variant="text"
          @click="close"
        >
          {{ $t("buttons.close") }}
        </v-btn>

        <v-btn
          color="primary"
          :disabled="!valid"
          @click="save"
        >
          {{ $t("buttons.saveAndClose") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          {{
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.weight`) })
          }}</span
        >
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
        }}</v-btn>
        <v-btn
          color="#03626C"
          variant="flat"
          :loading="loading"
          @click="deleteItemConfirm"
        >
          {{ $t("taskForm.buttons.confirmDelete") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import { shallowRef } from "vue";

export default {
  props: {
    selectedPerson: {
      type: Object,
      required: true
    },
  },
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    time: null,
    modal2: false,
    timePickerDialog: false,
    steps: [
      {
        title: "vital_signs",
        subtitle: "basic_patient_data",
      },
      {
        title: "body_measurements",
        subtitle: "weight_height_bmi",
      },
      {
        title: "observations",
        subtitle: "system_examination",
      },
    ],
    itemsPerPage: 6,
    currentPage: 1,
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
    physicalExams: [],
    tittlePerson: -1,
    selectedItems: {}, // Almacena las selecciones por rol
    typetasks: [],
    home_id: "",
    data: {},
    dialogAddPeople: false,
    person_id: "",
    role_id: "",
    task_id: "",
    editedItem: {
      id: "",
      medical_consultation_id: null,
      blood_pressure: "",
      pulse: "",
      exam_date: null, // Fecha actual por defecto
      respiratory_rate: "",
      temperature: "",
      weight: "",
      height: "",
      bmi: "",
      neurological_observations: "",
      cardiovascular_observations: "",
      respiratory_observations: "",
      digestive_observations: "",
      urinary_observations: "",
      other_findings: "",
    },

    defaultItem: {
      id: "",
      medical_consultation_id: null,
      blood_pressure: "",
      pulse: "",
      exam_date: null, // Fecha actual por defecto
      respiratory_rate: "",
      temperature: "",
      weight: "",
      height: "",
      bmi: "",
      neurological_observations: "",
      cardiovascular_observations: "",
      respiratory_observations: "",
      digestive_observations: "",
      urinary_observations: "",
      other_findings: "",
    },

    originalItem: {
      id: "",
      medical_consultation_id: null,
      blood_pressure: "",
      pulse: "",
      exam_date: null, // Fecha actual por defecto
      respiratory_rate: "",
      temperature: "",
      weight: "",
      height: "",
      bmi: "",
      neurological_observations: "",
      cardiovascular_observations: "",
      respiratory_observations: "",
      digestive_observations: "",
      urinary_observations: "",
      other_findings: "",
    },

    menu: false,
    menu2: false,
    input: null,
    input2: null,
    editedIndex: -1,
    headers: [
      { title: "Altura", key: "height" },
      { title: "Acciones", key: "actions" },
    ],
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    dateRules: [(v) => !v || !isNaN(Date.parse(v)) || "Fecha inválida"],
   heightRules: [
  v => !!v || this.$t('physicalExam.rules.required'),
  v => (v >= 0.3 && v <= 3.0) || this.$t('physicalExam.rules.heightRange'),
  v => /^\d\.\d{1,2}$/.test(v) || this.$t('physicalExam.rules.validFormat')
],
    bmiRules: [(v) => !v || (v > 10 && v < 60) || "IMC debe ser entre 10-60"],

    title: "",
    description: "",
    date: "",
    module: "",
    dateMenu: false,
    dateInput: null,
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("physicalExam.forms.height.title.add")
        : this.$t("physicalExam.forms.height.title.edit");
    },
  },
  created() {
    this.tools = [
      {
        name: this.$t("physicalExam.forms.height.title.add"),
        action: () => this.showAdd(),
      },
    ];
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
  },
  methods: {
      obtenerFechaLocal() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
    formatIntuitiveDate(dateString) {
      if (!dateString) return "Sin fecha";
      // 1. Parsear la fecha de entrada (formato YYYY-MM-DD)
      const [year, month, day] = dateString.split("-");
      const inputDate = new Date(year, month - 1, day); // Mes es 0-based
      // 2. Obtener fecha actual (sin horas/minutos/segundos)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // 3. Normalizar ambas fechas a UTC para evitar problemas de zona horaria
      const inputUTC = Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      );
      const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      // 4. Calcular diferencia en días
      const diffDays = Math.floor((inputUTC - todayUTC) / (1000 * 60 * 60 * 24));
      // 5. Determinar el texto a mostrar
      switch (diffDays) {
        case 0:
          return "Hoy";
        case 1:
          return "Mañana";
        case -1:
          return "Ayer";
        default:
          return inputDate
            .toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric", // <-- Añadido: muestra el año
            })
            .replace(/\./g, "");
      }
    },
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "grey-darken-1"; // Color por defecto
    },
    formatDate(dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
    updateDate(value) {
    // value viene como objeto Date desde el date-picker
    // Convertimos a formato YYYY-MM-DD
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    this.dateInput = `${year}-${month}-${day}`;
    this.editedItem.exam_date = this.dateInput;
    this.dateMenu = false;
  },
  
  // Método para convertir string a Date (solo cuando sea necesario)
    parseDateString(dateString) {
      if (!dateString) {
        const today = new Date();
        // Aseguramos que sea el inicio del día (evita problemas de zona horaria)
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
      }
      const [year, month, day] = dateString.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    },
    async showAdd() {
      this.editedIndex = -1;
      this.dateInput = this.obtenerFechaLocal();
      this.editedItem.exam_date = this.dateInput;
      this.dialog = true;
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
      this.data.query = "height";
      this.data.person_id = this.selectedPerson.id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "physical-exams-person",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.physicalExams = result.data?.physicalExams || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.physicalExams = [];
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
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "medical_consultation_id",

          // Signos vitales
          "blood_pressure",
          "pulse",
          "respiratory_rate",
          "temperature",

          // Fecha del examen
          "exam_date",

          // Medidas corporales
          "weight",
          "height",
          "bmi",

          // Observaciones por sistemas
          "neurological_observations",
          "cardiovascular_observations",
          "respiratory_observations",
          "digestive_observations",
          "urinary_observations",

          // Otros hallazgos
          "other_findings",
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.person_id = this.selectedPerson.id;
          try {
            const result = await handleRequest({
              endpoint: "physical-exams",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos de la tarea.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "medical_consultation_id",

          // Signos vitales
          "blood_pressure",
          "pulse",
          "respiratory_rate",
          "temperature",

          // Fecha del examen
          "exam_date",

          // Medidas corporales
          "weight",
          "height",
          "bmi",

          // Observaciones por sistemas
          "neurological_observations",
          "cardiovascular_observations",
          "respiratory_observations",
          "digestive_observations",
          "urinary_observations",

          // Otros hallazgos
          "other_findings",
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          try {
            const result = await handleRequest({
              endpoint: "physical-exams-update",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.editedIndex = -1;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.editedIndex = -1;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.editedIndex = -1;
          this.loading = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      // Filtrar las personas que tengan 'select' igual a 1
      //const selectedPeople = item.people.filter(person => person.select === 1);

      // Asignar a originalItem y editedItem solo las personas seleccionadas
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dateInput = item.exam_date || null;
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "physical-exams-delete",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
      } finally {
        this.loading = false;
        this.closeDelete();
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
</style>
