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
                {{ $t("physicalExam.fields.weight") }}
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
                      <div class="text-body-3 font-weight-medium">
                        {{ formatIntuitiveDate(slotProps.item.exam_date) }}
                      </div>
                    </v-avatar>
                  </div>

                  <!-- Categoría + Descripción - 40% -->
                  <div style="width: 83%; min-width: 0" class="d-flex flex-column">
                    <div class="text-body-2 text-truncate">
                      {{ slotProps.item.weight }}
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
              v-model="editedItem.weight"
              :label="$t('physicalExam.fields.weight')"
              variant="underlined"
              type="number"
              :rules="weightRules"
              hint="Ej: 70.5"
              persistent-hint
              min="2.5"
              max="300"
            >
            </v-text-field>
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
  emits: ['update-complementary-data'],
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
      { title: "Peso", key: "weight" },
      { title: "Acciones", key: "actions" },
    ],
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    bloodPressureRules: [
      (v) => !v || /^\d{2,3}\/\d{2,3}$/.test(v) || "Formato debe ser XXX/XX (ej. 120/80)",
    ],
    pulseRules: [
      (v) => !v || (v >= 30 && v <= 250) || "Frecuencia debe estar entre 30-250 lpm",
    ],
    temperatureRules: [
    v => !!v || "La temperatura es obligatoria",
    v => !isNaN(parseFloat(v)) || "Debe ser un número válido",
    v => (v >= 30 && v <= 45) || "Temperatura debe estar entre 30°C y 45°C"
  ],
    respiratoryRateRules: [
  v => !!v || "La frecuencia respiratoria es obligatoria",
  v => Number.isInteger(Number(v)) || "Debe ser un número entero",
  v => (v >= 10 && v <= 60) || "Frecuencia debe estar entre 10 y 60 rpm"
],
    dateRules: [(v) => !v || !isNaN(Date.parse(v)) || "Fecha inválida"],
      weightRules: [
      v => !!v || "El peso es obligatorio",
      v => !isNaN(parseFloat(v)) || "Debe ser un número válido",
      v => (v > 0 && v < 300) || "Peso debe estar entre 0 y 300 kg"
    ],
    heightRules: [(v) => !v || (v > 0 && v < 3) || "Altura debe ser entre 0-3 m"],
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
        ? this.$t("physicalExam.forms.weight.title.add")
        : this.$t("physicalExam.forms.weight.title.edit");
    },
    paginatedTasks() {
      if (!Array.isArray(this.tasks)) return []; // Verifica que tasks sea un array
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tasks.slice(start, end);
    },
    pageCount() {
      return this.tasks?.length ? Math.ceil(this.tasks.length / this.itemsPerPage) : 0;
    },
    translatedSteps() {
      // Fallback en caso de que la traducción no esté disponible
      const defaultSteps = [
        { title: "Información Básica", subtitle: "Ingresa el título y descripción" },
        { title: "Asignación", subtitle: "Selecciona responsables y participantes" },
        { title: "Programación", subtitle: "Elige fecha y hora de la tarea" },
      ];

      return this.$t("steps") || defaultSteps;
    },
  },
  created() {
    this.tools = [
      {
        name: this.$t("physicalExam.forms.weight.title.add"),
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
      return colorMap[type] || "indigo-darken-2"; // Color por defecto
    },
    formatDate(dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
    getStatusById(statusId) {
      return this.status.find((status) => status.id === statusId);
    },
    // Filtra las personas para mostrar en cada card según el rol
    /*updateDate(val) {
      this.input = val;
      this.editedItem.exam_date = this.dateFormatted;
      this.menu = false;
    },*/
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
      this.data.query = "weight";
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
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.dialog = false;
        this.step = 0;
        this.save();
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
              this.$emit('update-complementary-data');
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
              this.$emit('update-complementary-data');
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
      /*this.data = {};
      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
      }*/
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
          this.$emit('update-complementary-data');
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
    compactExamData(exam) {
      return [
        {
          label: "P.A.",
          value: exam.blood_pressure || "N/R",
          fullLabel: "Presión Arterial",
          fullValue: exam.blood_pressure
            ? `${exam.blood_pressure} mmHg`
            : "No registrada",
          icon: "mdi-heart-pulse",
          color: "blue-darken-2",
        },
        {
          label: "Pulso",
          value: exam.pulse || "N/R",
          fullLabel: "Frecuencia Cardíaca",
          fullValue: exam.pulse ? `${exam.pulse} ppm` : "No registrado",
          icon: "mdi-heart",
          color: "red-darken-2",
        },
        {
          label: "Temp",
          value: exam.temperature ? `${exam.temperature}°C` : "N/R",
          fullLabel: "Temperatura",
          fullValue: exam.temperature ? `${exam.temperature} °C` : "No registrada",
          icon: "mdi-thermometer",
          color: "orange-darken-2",
        },
        {
          label: "Peso",
          value: exam.weight ? `${exam.weight} kg` : "N/R",
          fullLabel: "Peso",
          fullValue: exam.weight ? `${exam.weight} kilogramos` : "No registrado",
          icon: "mdi-scale",
          color: "green-darken-2",
        },
        {
          label: "Altura",
          value: exam.height ? `${exam.height} m` : "N/R",
          fullLabel: "Altura",
          fullValue: exam.height ? `${exam.height} metros` : "No registrada",
          icon: "mdi-human-male-height",
          color: "purple-darken-2",
        },
        {
          label: "IMC",
          value: exam.bmi || "N/R",
          fullLabel: "Índice de Masa Corporal",
          fullValue: exam.bmi ? `${exam.bmi}` : "No registado",
          icon: "mdi-human",
          color: "cyan-darken-2",
        },
        {
          label: "Resp",
          value: exam.respiratory_rate || "N/R",
          fullLabel: "Frecuencia Respiratoria",
          fullValue: exam.respiratory_rate
            ? `${exam.respiratory_rate} rpm`
            : "No registrada",
          icon: "mdi-lungs",
          color: "teal-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },
    compactObservations(exam) {
      return [
        {
          label: "Neuro",
          text: this.truncateText(exam.neurological_observations) || "-",
          fullLabel: "Neurológicas",
          icon: "mdi-brain",
          color: "blue",
          fullText: exam.neurological_observations || "No registrado",
        },
        {
          label: "Cardio",
          text: this.truncateText(exam.cardiovascular_observations) || "-",
          fullLabel: "Cardiovasculares",
          icon: "mdi-heart",
          color: "red",
          fullText: exam.cardiovascular_observations || "No registrado",
        },
        {
          label: "Resp",
          text: this.truncateText(exam.respiratory_observations) || "-",
          fullLabel: "Respiratorias",
          icon: "mdi-lungs",
          color: "green",
          fullText: exam.respiratory_observations || "No registrado",
        },
        {
          label: "Dig",
          text: this.truncateText(exam.digestive_observations) || "-",
          fullLabel: "Digestivas",
          icon: "mdi-stomach",
          color: "orange",
          fullText: exam.digestive_observations || "No registrado",
        },
        {
          label: "Urin",
          text: this.truncateText(exam.urinary_observations) || "-",
          fullLabel: "Urinarias",
          icon: "mdi-kidney",
          color: "purple",
          fullText: exam.urinary_observations || "No registrado",
        },
        {
          label: "Hallazgos",
          text: this.truncateText(exam.other_findings) || "-",
          fullLabel: "Otros Hallazgos",
          icon: "mdi-clipboard-text",
          color: "cyan",
          fullText: exam.other_findings || "No registrado",
        },
        {
          label: "P.A.",
          text: exam.blood_pressure || "-",
          fullLabel: "Presión Arterial",
          icon: "mdi-heart-pulse",
          color: "blue-darken-2",
          fullText: `Presión arterial: ${exam.blood_pressure || "No registrada"}`,
        },
        {
          label: "Temp",
          text: exam.temperature ? `${exam.temperature}°C` : "-",
          fullLabel: "Temperatura",
          icon: "mdi-thermometer",
          color: "red-darken-2",
          fullText: `Temperatura: ${exam.temperature || "No registrada"}°C`,
        },
        {
          label: "Pulso",
          text: exam.pulse || "-",
          fullLabel: "Frecuencia Cardíaca",
          icon: "mdi-heart-flash",
          color: "pink-darken-1",
          fullText: `Frecuencia cardíaca: ${exam.pulse || "No registrada"} ppm`,
        },
        {
          label: "Resp",
          text: exam.respiratory_rate || "-",
          fullLabel: "Frecuencia Respiratoria",
          icon: "mdi-lungs",
          color: "teal-darken-1",
          fullText: `Frecuencia respiratoria: ${
            exam.respiratory_rate || "No registrada"
          } rpm`,
        },
      ].filter((obs) => obs.text !== "-");
    },
    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
    calculateBMI() {
      if (this.editedItem.weight && this.editedItem.height) {
        const weight = parseFloat(this.editedItem.weight);
        const height = parseFloat(this.editedItem.height);
        this.editedItem.bmi = (weight / (height * height)).toFixed(2);
      } else {
        this.editedItem.bmi = "";
      }
    },

    getBMICategory(bmi) {
      if (!bmi) return "";
      const num = parseFloat(bmi);
      if (num < 18.5) return "Bajo peso";
      if (num < 25) return "Normal";
      if (num < 30) return "Sobrepeso";
      return "Obesidad";
    },

    getBMIColor(bmi) {
      if (!bmi) return "grey";
      const num = parseFloat(bmi);
      if (num < 18.5) return "blue";
      if (num < 25) return "green";
      if (num < 30) return "orange";
      return "red";
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

.date-display {
  font-size: 0.75rem; /* Equivale a text-caption */
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.date-time-display .date {
  font-size: 0.9rem;
  font-weight: 500; /* medium */
  color: inherit; /* usa el color por defecto del tema */
}

.date-time-display .time {
  font-size: 0.9rem;
  font-weight: 400; /* regular */
  color: rgba(0, 0, 0, 0.6); /* gris medio */
  margin-top: 8px;
}
.smooth-hover {
  transition: all 0.5s ease;
}

.smooth-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12) !important;
}
.fullscreen-dialog {
  height: 100vh !important;
  max-height: 100vh !important;
  min-width: 100vh;
  margin: 0 !important;
  padding: 0 !important;
}
.avatar-border {
  border: 2px solid #000;
  /* Aquí se define el borde */
}

.avatar-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
}

.avatar-col {
  margin-right: -10px;
  /* Reduce the space between avatars */
}

.avatar-item {
  margin-right: -5px;
  /* Cambia el color del borde según desees */
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* Para que siga siendo redondo */
  box-sizing: border-box;
  /* Asegura que el borde no afecte el tamaño del avatar */
  /* Optional: reduce the space even further between avatars */
  /* Optional: reduce the space even further between avatars */
}

.text-secondary {
  color: #6c757d;
  /* Color gris claro */
  font-size: 0.85rem;
  /* Tamaño de texto más pequeño */
}

.custom-tooltip {
  background-color: #f5f5f5 !important;
  /* Fondo claro */
  color: #e5e5e5 !important;
  /* Texto oscuro */
  border-radius: 8px;
  /* Bordes redondeados */
  padding: 8px;
  /* Espaciado interno */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombra suave */
}

.avatar-item.hover-expand:hover {
  transform: scale(1.5);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
