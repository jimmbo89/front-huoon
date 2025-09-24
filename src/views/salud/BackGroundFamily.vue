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
        :headers="familyHeaders"
        :items="backgroundFamilies"
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
        <!-- Encabezado fijo -->
        <template v-slot:top>
          <v-card
            :elevation="1"
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
              <!-- Fecha / Periodo (7%) -->
              <div style="width: 7%; min-width: 0" class="text-left">
                {{ $t("familyBackground.fields.date") }}
              </div>

              <!-- Tipo + Descripción (33%) -->
              <div style="width: 54%; min-width: 0" class="text-left">
                {{ $t("familyBackground.fields.disease") }}
              </div>

              <!-- Detalles (30%) -->
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("familyBackground.fields.relationship") }}
              </div>

              <!-- Severidad (10%) -->
              <div style="width: 13%; min-width: 0" class="text-left">
                {{ $t("familyBackground.fields.diagnosis_age") }}
              </div>

              <!-- Acciones (10%) -->
              <div style="width: 7%; min-width: 0" class="d-flex justify-end">
                {{ $t("settings.actions") }}
              </div>
            </v-card-text>
          </v-card>
        </template>

        <!-- Item (fila) -->
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
                  <!-- Fecha / Periodo (7%) -->
                  <div class="d-flex align-center" style="width: 7%; min-width: 0">
                    <v-avatar
                      class="mr-1 icono-concavo"
                      :class="`bg-${getTypeColor(slotProps.item.typeName)}`"
                      :style="{
                        'min-height': '48px',
                        'min-width': '48px',
                        'border-radius': '8px',
                        'font-size': '0.90em',
                      }"
                    >
                      <div class="text-body-3 font-weight-medium">
                        {{ formatIntuitiveDate(slotProps.item.date) }}
                      </div>
                    </v-avatar>
                  </div>

                  <!-- Tipo + Descripción (33%) -->
                  <div style="width: 54%; min-width: 0" class="d-flex flex-column">
                    <div class="text-body-2 text-truncate">
                      {{ slotProps.item.disease || "" }}
                    </div>
                    <div class="text-caption text-grey-darken-1 text-truncate mt-1">
                      {{ slotProps.item.details || "" }}
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("familyBackground.fields.details") }}:
                          {{ slotProps.item.details || "-" }}
                        </span>
                      </v-tooltip>
                    </div>
                  </div>

                  <!-- Detalles (30%) → Mapeado a relationship -->
                  <div style="width: 15%; min-width: 0" class="text-body-2 text-truncate">
                    <span>{{ slotProps.item.relationship || "" }}</span>
                  </div>

                  <div
                    style="width: 13%; min-width: 0; text-align: cecnter"
                    class="text-body-2 text-truncate"
                  >
                    <span>{{ slotProps.item.diagnosis_age || "" }}</span>
                  </div>
                  <!-- Acciones (10%) -->
                  <div
                    class="d-flex gap-1"
                    style="width: 7%; justify-content: flex-end; flex-wrap: nowrap"
                  >
                    <v-btn
                      size="35"
                      icon
                      variant="text"
                      color="green-darken-2"
                      @click="editItem(slotProps.item)"
                      class="flex-shrink-0"
                      title="Editar Antecedente Familiar"
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
                      title="Eliminar Antecedente Familiar"
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
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("familyBackground.formInstructions") }}
          </p>

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
                      <strong>{{ $t(`familyBackground.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`familyBackground.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`familyBackground.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles -->
              <v-row dense v-if="step === 0">
                <!--<v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.type_id"
                    :items="backgroundTypes"
                    :label="$t('familyBackground.fields.type')"
                    item-title="nameTranslated"
                    item-value="id"
                    variant="underlined"
                    :rules="typeRules"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div
                                class="truncate"
                                v-bind="tooltipProps"
                                style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
                              >
                                {{ item.raw.descriptionTranslated }}
                              </div>
                            </template>
                            <span>{{ item.raw.descriptionTranslated }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>-->

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItem.relationship"
                    :items="relationships"
                    item-title="name"
                    item-value="id"
                    :label="$t('familyBackground.fields.relationship')"
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
                                style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
                              >
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.disease"
                    :label="$t('familyBackground.fields.disease')"
                    variant="underlined"
                    :rules="diseaseRules"
                  />
                </v-col>
              </v-row>

              <!-- Step 2: Información adicional -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.details"
                    :label="$t('familyBackground.fields.details')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.diagnosis_age"
                    :label="$t('familyBackground.fields.diagnosis_age')"
                    variant="underlined"
                    type="number"
                    min="0"
                    max="120"
                    :rules="diagnosisAgeRules"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="dateInput"
                        variant="underlined"
                        :label="$t('familyBackground.fields.date')"
                        :rules="dateRules"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="dateInput"
                        @update:model-value="updateDate"
                        format="yyyy-MM-dd"
                        :max="new Date().toISOString().split('T')[0]"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Step 3: Fechas -->
              <v-row dense v-if="step === 2">
                <v-col cols="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="dateFormatted"
                        variant="underlined"
                        :label="$t('familyBackground.fields.date')"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="dateInput"
                        @update:model-value="updateDate"
                        format="yyyy-MM-dd"
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
          {{
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.familyBackground`) })
          }}</span
        >
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">{{
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
import { handleRequest } from "@/utils/api";
import _ from "lodash";
import { shallowRef } from "vue";

export default {
  props: {
    selectedPerson: {
      type: Object,
      required: true
    },
  },
  emits: ['update-medical-information'],
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    time: null,
    modal2: false,
    timePickerDialog: false,
    steps: [
      {
        title: "details",
        subtitle: "family_information",
      },
      {
        title: "additional",
        subtitle: "medical_details",
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
    backgroundFamilies: [],
    tittlePerson: -1,
    selectedItems: {},
    relationships: [],
    dateMenu: false,
    dateInput: null,
    home_id: "",
    data: {},
    dialogAddPeople: false,
    person_id: "",
    editedItem: {
      id: "",
      type_id: null,
      relationship: null,
      disease: "",
      details: "",
      date: null,
      diagnosis_age: null,
    },

    defaultItem: {
      id: "",
      type_id: null,
      relationship: null,
      disease: "",
      details: "",
      date: null,
      diagnosis_age: null,
    },

    optionalItem: {
      id: "",
      type_id: null,
      relationship: null,
      disease: "",
      details: "",
      date: null,
      diagnosis_age: null,
    },

    editedIndex: -1,
    headers: [
      { title: "", key: "date", width: "7%" },
      { title: "", key: "typeName", width: "33%" },
      { title: "", key: "status", width: "10%" },
      { title: "", key: "disease", width: "10%" },
      { title: "", key: "relationship", width: "30%" },
      { title: "", key: "actions", width: "10%" },
    ],
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    descriptionRules: [
      (v) =>
        !v ||
        v.length <= 200 ||
        this.$t("familyBackground.validationMessages.description.maxLength"),
    ],
    ageRules: [
      (v) => !v || (v >= 0 && v <= 120) || "La edad debe estar entre 0 y 120 años",
    ],
    title: "",
    description: "",
    date: "",
    module: "",
  }),

  computed: {
    typeRules() {
      return [(v) => !!v || this.$t("familyBackground.validationMessages.type.required")];
    },
    relationshipRules() {
      return [
        (v) =>
          !!v || this.$t("familyBackground.validationMessages.relationship.required"),
      ];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("familyBackground.titles.new")
        : this.$t("familyBackground.titles.edit");
    },
    dateFormatted() {
      const date = this.dateInput ? new Date(this.dateInput) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.dateInput ? new Date(this.dateInput) : new Date();
    },
    paginatedTasks() {
      if (!Array.isArray(this.tasks)) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tasks.slice(start, end);
    },
    pageCount() {
      return this.tasks?.length ? Math.ceil(this.tasks.length / this.itemsPerPage) : 0;
    },
    translatedSteps() {
      const defaultSteps = [
        { title: "Información Familiar", subtitle: "Detalles del familiar" },
        { title: "Detalles Médicos", subtitle: "Información médica" },
      ];
      return this.$t("steps") || defaultSteps;
    },
  },

  created() {
    this.tools = [
      {
        name: this.$t("familyBackground.titles.new"),
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
      const month = String(hoy.getMonth() + 1).padStart(2, "0");
      const day = String(hoy.getDate()).padStart(2, "0");
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
              year: "numeric",
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
      return colorMap[type] || "deep-orange"; // Color por defecto
    },

    updateDate(value) {
      // value viene como objeto Date desde el date-picker
      // Convertimos a formato YYYY-MM-DD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItem.date = this.dateInput;
      this.dateMenu = false;
    },

    async showAdd() {
      this.editedIndex = -1;
      this.dateInput = this.obtenerFechaLocal();
      this.editedItem.date = this.dateInput;
      this.data = {};
      this.data.type = "Salud";
      try {
        const result = await handleRequest({
          endpoint: "get-type-relationship",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          //this.backgroundTypes = result.data?.types || [];
          this.relationships = result.data?.relationships || [];
        } else {
          //this.backgroundTypes = [];
          this.relationships = [];
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
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
      this.editedIndex = -1;
    },

    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.data.person_id = this.selectedPerson.id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-family-background-person",
          method: "POST",
          data: this.data
        });

        if (result.success) {
          this.backgroundFamilies = result.data?.backgrounds || [];
        } else {
          this.backgroundFamilies = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los antecedentes familiares.",
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
        // Crear nuevo antecedente familiar
        const fieldsToUpdate = [
          "type_id",
          "relationship",
          "disease",
          "details",
          "date",
          "diagnosis_age",
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.defaultItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        if (Object.keys(updatedFields).length > 0) {
          updatedFields.person_id = this.selectedPerson.id;
          try {
            const result = await handleRequest({
              endpoint: "family-background",
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
              this.$emit('update-medical-information');
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.showAlert(
              "error",
              "Ocurrió un error al guardar el antecedente familiar",
              3000
            );
          }
        }
      } else {
        // Actualizar antecedente familiar existente
        const fieldsToUpdate = [
          "type_id",
          "relationship",
          "disease",
          "details",
          "date",
          "diagnosis_age",
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
              endpoint: "family-background-update",
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
              this.$emit('update-medical-information');
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.showAlert(
              "error",
              "Ocurrió un error al actualizar el antecedente familiar",
              3000
            );
          }
        }
      }
      this.loading = false;
      this.close();
    },

    async editItem(item) {
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dateInput = item.date || null;
      this.editedItem.date = item.date || null;
      this.data = {};
      this.data.type = "Salud";
      try {
        const result = await handleRequest({
          endpoint: "get-type-relationship",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          //this.backgroundTypes = result.data?.types || [];
          this.relationships = result.data?.relationships || [];
        } else {
          //this.backgroundTypes = [];
          this.relationships = [];
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
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
          endpoint: "family-background-delete",
          method: "POST",
          data: request,
        });

        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
          this.$emit('update-medical-information');
        } else {
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
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

.date-display {
  font-size: 0.75rem; /* Equivale a text-caption */
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.date {
  padding: 4px 8px;
  border-radius: 4px;
}

.fullscreen-dialog {
  height: 100vh !important;
  max-height: 100vh !important;
  min-width: 100vh;
  margin: 0 !important;
  padding: 0 !important;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-secondary {
  color: #6c757d;
  /* Color gris claro */
  font-size: 0.85rem;
  /* Tamaño de texto más pequeño */
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
