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

  <v-card class="pa-0" elevation="1" rounded="lg" style="
    position: relative;
    overflow: visible;
    z-index: auto;
  ">
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
                    <v-text-field v-model="search" density="compact" :label="$t('dataTable.search')"
                        prepend-inner-icon="mdi-magnify" variant="solo-filled" hide-details single-line
                        flat></v-text-field>
                </div>
            </v-card-title>
          <v-data-table 
          :headers="headers" 
          :items="treatments" 
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
              style="border: 1px solid #ECEFF1; height: 40px; min-height: 40px; display: flex; align-items: center; transition: none !important"
            >
              <v-card-text
                class="d-flex pa-2"
                style="width: 100%; min-width: 0; height: 100%; padding: 0 16px !important; display: flex; align-items: center"
              >
                <!-- Fecha / Periodo (10%) -->
                <div style="width: 7%; min-width: 0" class="text-left">
                  {{ $t('treatment.fields.startDate') }}
                </div>

                <!-- Categoría / Descripción (40%) -->
                <div style="width: 20%; min-width: 0" class="text-left">
                  {{ $t('treatment.fields.medication') }}
                </div>

                <!-- Monto (10%) -->
                <div style="width: 24%; min-width: 0" class="text-left">
                  {{ $t('treatment.fields.purpose') }}
                </div>

                <!-- Usado (15%) -->
                <div style="width: 24%; min-width: 0" class="text-center">
                  {{ $t('treatment.fields.instructions') }}
                </div>

                <!-- Tipo (10%) -->
                <div style="width: 10%; min-width: 0" class="text-left">
                  {{ $t('treatment.fields.duration') }}
                </div>

                <!-- Moneda (5%) -->
                <div style="width: 5%; min-width: 0" class="text-left">
                  {{ $t('treatment.fields.dosage') }}
                </div>

                <!-- Acciones (10%) -->
                <div style="width: 10%; min-width: 0" class="d-flex justify-end">
                  {{ $t('settings.actions') }}
                </div>
              </v-card-text>
            </v-card>
          </template>
          <template v-slot:item="slotProps">
            <tr>
              <td colspan="100%" style="padding: 0; border: none">
                <v-card class="mb-2 mx-1 rounded-lg" elevation="1" density="comfortable" flat>
                  <v-card-text class="d-flex align-center pa-2" style="width: 100%; min-width: 0">
                    <div class="d-flex align-center" style="width: 7%; min-width: 0">
                    <v-avatar class="mr-1 icono-concavo" :class="`bg-${getTypeColor(slotProps.item.typeName)}`" :style="{
                            'min-height': '48px',
                            'min-width': '48px',
                            'border-radius': '8px',
                            'font-size': '0.90em'
                          }">
                     <div class="text-body-3 font-weight-medium">
                          {{ formatIntuitiveDate(slotProps.item.startDate) }}
                        </div>
                    </v-avatar>
                  </div>

                    <!-- Categoría + Descripción - 40% -->
                    <div style="width: 20%; min-width: 0" class="d-flex flex-column">
                      <div class="text-body-2 text-truncate">
                        {{ slotProps.item.medication }}
                        </div>
                      <div class="text-caption text-grey-darken-1 text-truncate">
                        {{ slotProps.item.typeName }}
                              </div>
                    </div>

                    <!-- Monto - 10% -->
                    <div style="width: 24%; min-width: 0" class="text-body-2 text-truncate">
                      <span>{{ slotProps.item.purpose }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word"> {{ slotProps.item.purpose }}</span>
                    </v-tooltip>
                    </div>

                    <!-- Usado - 15% -->
                    <div style="width: 24%; min-width: 0; text-align: center;" class="text-body-2 text-truncate">
                      <span>{{ slotProps.item.instructions }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word"> {{ slotProps.item.instructions }}</span>
                    </v-tooltip>
                    </div>

                    <!-- Moneda (con ícono) - 5% -->
                    <div style="width: 10%; min-width: 0" class="text-body-2 text-truncate">
                    <span> {{ slotProps.item.duration }} </span>
                     <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word"> {{ slotProps.item.duration }}</span>
                    </v-tooltip>
                    </div>

                    <div style="width: 5%; min-width: 0" class="text-body-2 text-truncate">
                    <span>{{ slotProps.item.dosage }}</span>
                     <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word"> {{ slotProps.item.dosage }}</span>
                    </v-tooltip>
                    </div>

                    <!-- Acciones - 10% -->
                    <div class="d-flex gap-1" style="width: 10%; justify-content: flex-end; flex-wrap: nowrap">
                      <v-btn 
                        size="35" 
                        icon 
                        variant="text" 
                        color="green-darken-2" 
                        @click="editItem(slotProps.item)"
                        class="flex-shrink-0 mr-1" 
                        title="Editar Presupuesto">
                        <v-icon size="20">mdi-pencil</v-icon>
                      </v-btn>

                      <v-btn 
                        size="35" 
                        icon 
                        variant="text" 
                        color="red-darken-2" 
                        @click="deleteItem(slotProps.item)"
                        class="flex-shrink-0" 
                        title="Eliminar Presupuesto">
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
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">{{ $t("treatment.formInstructions") }}</p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item
                  v-for="(s, index) in steps"
                  :key="index"
                  :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  "
                  :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  "
                  size="large"
                >
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`treatment.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`treatment.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`treatment.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Medicación -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.medication"
                    :label="$t('treatment.fields.medication')"
                    variant="underlined"
                    :rules="medicationRules"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.dosage"
                    :label="$t('treatment.fields.dosage')"
                    variant="underlined"
                    :rules="dosageRules"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete 
                    v-model="editedItem.type_id"
                    :items="treatmentTypes" 
                    :label="$t('treatment.fields.frequency')" 
                    item-title="name"
                    item-value="id" 
                    variant="underlined" 
                    :rules="selectRules"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div 
                                class="truncate" 
                                v-bind="tooltipProps"
                                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                              >
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                     <v-text-field
                        v-model="editedItem.duration"
                        :label="$t('treatment.fields.duration')"
                        variant="underlined"
                        :rules="durationRules"
                        hint="Ej: 5 días, 2 semanas, 1 mes"
                        persistent-hint
                      />
                </v-col>
              </v-row>

              <!-- Step 2: Detalles -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.instructions"
                    :label="$t('treatment.fields.instructions')"
                    variant="underlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.purpose"
                    :label="$t('treatment.fields.purpose')"
                    variant="underlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>
              </v-row>

              <!-- Step 3: Fechas -->
              <v-row dense v-if="step === 2">
                <v-col cols="12" md="6">
                  <v-menu
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="startDateInput"
                        variant="underlined"
                        :label="$t('treatment.fields.startDate')"
                        :rules="dateRules"
                        readonly
                        clearable
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :model-value="startDateInput"
                        @update:model-value="updateStartDate"
                        format="yyyy-MM-dd"
                        :max="editedItem.endDate ? new Date(editedItem.endDate) : null"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="6">
                  <v-menu
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="endDateInput"
                        variant="underlined"
                        :label="$t('treatment.fields.endDate')"
                        :rules="dateRules"
                        readonly
                        clearable
                        @click:clear="editedItem.endDate = ''"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :model-value="endDateInput"
                        @update:model-value="updateEndDate"
                        format="yyyy-MM-dd"
                        :min="editedItem.startDate ? new Date(editedItem.startDate) : null"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn
                  variant="text"
                  class="text-grey-darken-1"
                  @click="step > 0 ? step-- : this.close()"
                >
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn
                  variant="text"
                  class="text-deep-purple-accent-3"
                  @click="nextStep"
                  :disabled="!valid"
                >
                  {{
                    step === steps.length - 1
                      ? $t("buttons.saveAndClose")
                      : $t("buttons.next")
                  }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.treatment`) }) }}</span
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
import { ref } from 'vue';
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import { shallowRef } from 'vue';


export default {
  props: {
    selectedPerson: {
      type: Object,
      required: true
    },
  },
  emits: ['update-vital-signs'],
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    time: null,
      modal2: false,
      timePickerDialog: false,
      steps: [
      {
        title: 'medication',
        subtitle: 'medication_details'
      },
      {
        title: 'details',
        subtitle: 'instructions_purpose'
      },
      {
        title: 'dates',
        subtitle: 'treatment_period'
      }
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
    treatments: [],
    tittlePerson: -1,
    selectedItems: {}, // Almacena las selecciones por rol
    typetasks: [],
    treatmentTypes: [],
    home_id: "",
    data: {},
    dialogAddPeople: false,
    person_id: "",
     editedItem: {
      id: "",
      medical_consultation_id: null,
      type_id: null,
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      purpose: "",
      startDate: null,
      endDate: null
    },

    defaultItem: {
      id: "",
      medical_consultation_id: null,
      type_id: null,
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      purpose: "",
      startDate: null,
      endDate: null
    },

    originalItem: {
      id: "",
      medical_consultation_id: null,
      type_id: null,
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      purpose: "",
      startDate: null,
      endDate: null
    },

    startDateMenu: false,
    endDateMenu: false,
    startDateInput: null,
    endDateInput: null,
    editedIndex: -1,
    
    headers: [
      { title: 'Medicación', key: 'medication' },
      { title: 'Dosis', key: 'dosage' },
      { title: 'Frecuencia', key: 'frquency' },
      { title: 'Duración', key: 'duration' },
      { title: 'Instrucciones', key: 'instructions' },
      { title: 'Propósito', key: 'purpose' },
      { title: 'Fecha de Inicio', key: 'startDate' },
      { title: 'Fecha de Finalización', key: 'endDate' },
      { title: 'Tipo', key: 'typeName' },
      { title: 'Acciones', key: 'actions' },
    ],
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    durationRules: [
      v => !!v || 'La duración es requerida',
      v => /^\d+\s*(días?|semanas?|mes(es)?)?$/i.test(v) || 'Formato inválido (ej: 5 días, 2 semanas, 1 mes)'
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    medicationRules: [
      v => !v || v.length <= 100 || 'El medicamento no debe exceder los 100 caracteres'
    ],
    dosageRules: [
      v => !v || v.length <= 50 || 'La dosis no debe exceder los 50 caracteres'
    ],
    frequencyRules: [
      v => !v || v.length <= 50 || 'La frecuencia no debe exceder los 50 caracteres'
    ],
    dateRules: [
      v => !v || !isNaN(Date.parse(v)) || 'Fecha inválida'
    ],

    title: '',
    description: '',
    date: '',
    module: '',
  }),
  computed: {
   formTitle() {
  return this.editedIndex === -1 
    ? this.$t('treatment.titles.new') 
    : this.$t('treatment.titles.edit');
},
    startDateFormatted() {
    if (!this.editedItem.startDate) return '';
    const date = this.parseDateWithoutTimezone(this.editedItem.startDate);
    if (isNaN(date.getTime())) return this.editedItem.startDate;
    
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  },
  endDateFormatted() {
    if (!this.editedItem.endDate) return '';
    const date = this.parseDateWithoutTimezone(this.editedItem.endDate);
    if (isNaN(date.getTime())) return this.editedItem.endDate;
    
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  },
    getStartDate() {
      return this.startDateInput ? new Date(this.startDateInput) : new Date();
    },
    getEndDate() {
      return this.endDateInput ? new Date(this.endDateInput) : new Date();
    },
    paginatedTasks() {
    if (!Array.isArray(this.tasks)) return []; // Verifica que tasks sea un array
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.tasks.slice(start, end);
  },
  pageCount() {
    return this.tasks?.length
      ? Math.ceil(this.tasks.length / this.itemsPerPage)
      : 0;
  },
  translatedSteps() {
      // Fallback en caso de que la traducción no esté disponible
      const defaultSteps = [
        { title: 'Medicación', subtitle: 'Detalles de la medicación' },
        { title: 'Detalles', subtitle: 'Instrucciones y propósito' },
        { title: 'Fechas', subtitle: 'Período del tratamiento' }
      ]

      return this.$t('steps') || defaultSteps
    }
  },
  watch: {
   'editedItem.startDate': {
    handler(newVal) {
      if (newVal) {
        this.calculateEndDate();
      }
    },
    immediate: true
  },
  'editedItem.duration': {
    handler(newVal) {
      if (newVal && this.editedItem.startDate) {
        this.calculateEndDate();
      }
    },
    immediate: true
  },
  'editedItem.type_id': {
    handler(newVal) {
      if (newVal && this.editedItem.startDate && this.editedItem.duration) {
        this.calculateEndDate();
      }
    },
    immediate: true
  }
},
created() {
    this.tools = [
      {
        name: this.$t("treatment.titles.new"),
        action: () => this.showAdd()
      }
    ]
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
      console.log('type');
      console.log(type);
       if (!type) return "#607D8B";
      const colorMap = {
        Personal: "#4CAF50",  // Azul intenso claro
        Hogar: "#FB8C00",  // Naranja intenso
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "purple"; // Color por defecto
    },
    parseDateWithoutTimezone(dateString) {
    if (!dateString) return null;
    
    // Para fechas en formato YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    
    // Para otros formatos o strings ISO
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  },
    calculateEndDate() {
  // Validaciones básicas
  if (!this.editedItem.startDate || !this.editedItem.duration) {
    this.editedItem.endDate = '';
    return;
  }

  try {
    const durationText = this.editedItem.duration.toLowerCase().trim();
    const match = durationText.match(/^(\d+)\s*(d[ií]as?|semanas?|mes(es)?)?$/i);
    
    if (!match) {
      this.editedItem.endDate = '';
      return;
    }

    const durationValue = parseInt(match[1]);
    let durationUnit = match[2] ? match[2].toLowerCase() : 'días';
    
    // Normalizar unidades
    if (durationUnit.includes('dia') || durationUnit.includes('día')) durationUnit = 'days';
    else if (durationUnit.includes('semana')) durationUnit = 'weeks';
    else if (durationUnit.includes('mes')) durationUnit = 'months';

    const startDate = new Date(this.editedItem.startDate);
    if (isNaN(startDate.getTime())) {
      this.editedItem.endDate = '';
      return;
    }

    const endDate = new Date(startDate);
    
    switch(durationUnit) {
      case 'days':
        endDate.setDate(startDate.getDate() + durationValue);
        break;
      case 'weeks':
        endDate.setDate(startDate.getDate() + (durationValue * 7));
        break;
      case 'months':
        endDate.setMonth(startDate.getMonth() + durationValue);
        break;
    }

    // Formatear a YYYY-MM-DD
    this.editedItem.endDate = endDate.toISOString().split('T')[0];
    this.endDateInput = endDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error calculando fecha final:', error);
    this.editedItem.endDate = '';
  }
},
    formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  },
    // Filtra las personas para mostrar en cada card según el rol
   /*updateStartDate(val) {
      this.startDateInput = val;
      this.editedItem.startDate = this.startDateFormatted;
      this.startDateMenu = false;
    },*/
    updateStartDate(value) {
    // value viene como objeto Date desde el date-picker
    // Convertimos a formato YYYY-MM-DD
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    this.startDateInput = `${year}-${month}-${day}`;
    this.editedItem.startDate = this.startDateInput;
    this.startDateMenu = false;
  },
    updateEndDate(value) {
      const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    this.startDateInput = `${year}-${month}-${day}`;
      this.editedItem.endDate = this.startDateInput;
      this.endDateMenu = false;
    },
    async showAdd() {
      this.editedIndex = -1;
      this.startDateInput = this.obtenerFechaLocal();
      this.editedItem.startDate = this.startDateInput;
     this.data = {};
      this.data.type = 'Tratamiento';
      try {
        const result = await handleRequest({
          endpoint: 'get-type-treatment',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          this.treatmentTypes = result.data?.types || [];
        } else {
          this.treatmentTypes = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de diagnóstico.', 3000);
      } finally {
        this.dialog = true;
      }
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
          endpoint: "treatments-person",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.treatments = result.data?.treatments || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.treatments = [];
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
        this.step++
      } else {
        this.dialog = false
        this.step = 0
        this.save();
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "medical_consultation_id",
          "type_id",
          "medication",
          "dosage",
          "frequency",
          "duration",
          "instructions",
          "purpose",
          "startDate",
          "endDate"
        ];
        
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        if (Object.keys(updatedFields).length > 0) {
          updatedFields.person_id = this.selectedPerson.id;            
           try {
            const result = await handleRequest({
              endpoint: "treatment",
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
              this.$emit('update-vital-signs');
            } else {
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos del tratamiento.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "medical_consultation_id",
          "type_id",
          "medication",
          "dosage",
          "frequency",
          "duration",
          "instructions",
          "purpose",
          "startDate",
          "endDate"
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});
          
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          try {
            const result = await handleRequest({
              endpoint: "treatment-update",
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
              this.$emit('update-vital-signs');
            } else {
              this.loading = false;
              this.editedIndex = -1;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.editedIndex = -1;
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
      this.startDateInput = item.startDate;
      this.endDateInput = item.endDate;
      this.data = {};
      this.data.type = 'Tratamiento';
      try {
        const result = await handleRequest({
          endpoint: 'get-type-treatment',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          this.treatmentTypes = result.data?.types || [];
        } else {
          this.treatmentTypes = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de diagnóstico.', 3000);
      } finally {
        this.dialog = true;
      }
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
          endpoint: "treatment-delete",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
          this.$emit('update-vital-signs');
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
    compactTreatmentData(treatment) {
        return [
          {
            label: this.$t('treatment.fields.medication'),
            value: treatment.medication || 'N/R',
            fullLabel: this.$t('treatment.fields.medication'),
            fullValue: treatment.medication || this.$t('treatment.notRecorded'),
            icon: 'mdi-pill',
            color: 'blue-darken-2'
          },
          {
            label: this.$t('treatment.fields.dosage'),
            value: treatment.dosage || 'N/R',
            fullLabel: this.$t('treatment.fields.dosage'),
            fullValue: treatment.dosage || this.$t('treatment.notRecorded'),
            icon: 'mdi-numeric',
            color: 'red-darken-2'
          },
          {
            label: this.$t('treatment.fields.frequency'),
            value: treatment.typeName || 'N/R',
            fullLabel: this.$t('treatment.fields.frequency'),
            fullValue: treatment.typeName || this.$t('treatment.notRecorded'),
            icon: 'mdi-clock-outline',
            color: 'orange-darken-2'
          },
          {
            label: this.$t('treatment.fields.duration'),
            value: treatment.duration || 'N/R',
            fullLabel: this.$t('treatment.fields.duration'),
            fullValue: treatment.duration || this.$t('treatment.notRecorded'),
            icon: 'mdi-calendar-clock',
            color: 'green-darken-2'
          },
          {
            label: this.$t('treatment.fields.startDate'),
            value: treatment.startDate ? this.formatDate(treatment.startDate) : 'N/R',
            fullLabel: this.$t('treatment.fields.startDate'),
            fullValue: treatment.startDate ? this.formatDate(treatment.startDate) : this.$t('treatment.notRecorded'),
            icon: 'mdi-calendar-start',
            color: 'purple-darken-2'
          },
          {
            label: this.$t('treatment.fields.endDate'),
            value: treatment.endDate ? this.formatDate(treatment.endDate) : 'N/R',
            fullLabel: this.$t('treatment.fields.endDate'),
            fullValue: treatment.endDate ? this.formatDate(treatment.endDate) : this.$t('treatment.notRecorded'),
            icon: 'mdi-calendar-end',
            color: 'cyan-darken-2'
          }
        ].filter(item => item.value !== 'N/R');
      },
      compactInstructions(treatment) {
        return [
          {
            label: this.$t('treatment.fields.instructions'),
            text: this.truncateText(treatment.instructions) || '-',
            fullLabel: this.$t('treatment.fields.instructions'),
            icon: 'mdi-text-box-outline',
            color: 'blue',
            fullText: treatment.instructions || this.$t('treatment.notRecorded')
          },
          {
            label: this.$t('treatment.fields.purpose'),
            text: this.truncateText(treatment.purpose) || '-',
            fullLabel: this.$t('treatment.fields.purpose'),
            icon: 'mdi-target',
            color: 'red',
            fullText: treatment.purpose || this.$t('treatment.notRecorded')
          }
        ].filter(obs => obs.text !== '-');
      },
      truncateText(text, length = 15) {
        if (!text) return null;
        return text.length > length ? text.substring(0, length) + '...' : text;
      },
   calculateBMI() {
    if (this.editedItem.weight && this.editedItem.height) {
      const weight = parseFloat(this.editedItem.weight);
      const height = parseFloat(this.editedItem.height);
      this.editedItem.bmi = (weight / (height * height)).toFixed(2);
    } else {
      this.editedItem.bmi = '';
    }
  },

  getBMICategory(bmi) {
    if (!bmi) return '';
    const num = parseFloat(bmi);
    if (num < 18.5) return 'Bajo peso';
    if (num < 25) return 'Normal';
    if (num < 30) return 'Sobrepeso';
    return 'Obesidad';
  },

  getBMIColor(bmi) {
    if (!bmi) return 'grey';
    const num = parseFloat(bmi);
    if (num < 18.5) return 'blue';
    if (num < 25) return 'green';
    if (num < 30) return 'orange';
    return 'red';
  },
  },
};
</script>
<style>
.icono-concavo {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.v-data-table > .v-data-table__wrapper > table > thead,
.v-data-table > .v-data-table__wrapper > .v-table > table > thead,
.v-data-table__content > table > thead,
.v-data-table__content > thead,
table.v-table > thead,
.v-table > .v-table__wrapper > table > thead {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-spacing: 0 !important;
  border-collapse: collapse !important;
}
.hidden-header .v-data-table__content > table > thead {
  display: none !important;
}


</style>
