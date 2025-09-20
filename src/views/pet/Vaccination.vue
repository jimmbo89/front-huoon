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
    class="pa-0 mt-2"
    elevation="1"
    rounded="lg"
    style="position: relative; overflow: visible; z-index: auto"
  >
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
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
        <v-card-title class="d-flex flex-wrap align-center gap-4 pb-0">
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
          clearable
        ></v-text-field>
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
    class="mt-1"
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
    <!-- Header personalizado (simulado) -->
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
          <div style="width: 7%; min-width: 0" class="text-left">
            {{ $t("vaccinations.fields.date") }}
          </div>
          <div style="width: 20%; min-width: 0" class="text-left">
            {{ $t("vaccinations.fields.name") }}
          </div>
          <div style="width: 43%; min-width: 0" class="text-left">
            {{ $t("vaccinations.fields.notes") }}
          </div>
          <div style="width: 23%; min-width: 0" class="text-left">
            {{ $t("vaccinations.fields.next_date") }}
          </div>
          <div style="width: 7%; min-width: 0" class="d-flex justify-end">
            {{ $t("settings.actions") }}
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Fila personalizada -->
    <template v-slot:item="{ item }">
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
          <!-- Columna 1: Fecha con ícono cóncavo (5%) -->
          <div style="width: 7%; min-width: 0" class="d-flex align-center justify-left">
            <div
              class="icono-concavo d-flex flex-column justify-center align-left"
              :class="`bg-${getTypeColor(item.type)}`"
             style="min-height: 48px; min-width: 48px; border-radius: 8px;">
              <div class="date-display text-center" style="font-size: 0.9rem; line-height: 1.2;">
                {{ formatIntuitiveDate(item.date) }}
              </div>
            </div>
          </div>

          <!-- Columna 2: Nombre del tratamiento (20%) -->
          <div style="width: 20%; min-width: 0" class="d-flex flex-column">
            <div class="font-weight-bold text-body-2 text-truncate">
              {{ item.name }}
            </div>
          </div>

          <!-- Columna 3: Notas (45%) -->
          <div style="width: 43%; min-width: 0" class="d-flex flex-column">
            <div
              class="text-body-2 text-grey-darken-1 text-truncate"
              style="max-width: 100%;"
            >
              {{ item.notes }}
              <v-tooltip
                activator="parent"
                location="bottom"
                max-width="350px"
              >
                <span style="white-space: normal; word-break: break-word">
                  {{ item.notes }}
                </span>
              </v-tooltip>
            </div>
          </div>

          <!-- Columna 4: Próxima fecha (23%) -->
          <div style="width: 23%; min-width: 0" class="d-flex flex-column">
            <div class="text-body-2 text-truncate">
              {{ formatIntuitiveDate(item.next_date) }}
            </div>
          </div>

          <!-- Columna 5: Acciones (Editar + Eliminar) (7%) -->
          <div
            class="d-flex gap-1"
            style="width: 7%; justify-content: flex-end; flex-wrap: nowrap"
          >
            <v-btn
              size="35"
              icon
              variant="text"
              color="green-darken-2"
              @click="editItem(item)"
              class="flex-shrink-0 mr-1"
              :title="$t('buttons.edit')"
            >
              <v-icon size="20">mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              size="35"
              icon
              variant="text"
              color="red-darken-2"
              @click="deleteItem(item)"
              class="flex-shrink-0"
              :title="$t('buttons.delete')"
            >
              <v-icon size="20">mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
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
        <!-- Encabezado -->
        <h5 class="text-grey-darken-2 font-weight-medium">
          {{ $t(`vaccinations.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
        </h5>
        <p class="text-grey-lighten-1">{{ $t("vaccinations.formInstructions") }}</p>

        <v-row class="mt-12">
          <!-- Pasos laterales -->
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
                    <strong>{{ $t(`vaccinations.steps.${s.key}.title`) }}</strong>
                    <div class="text-caption text-grey">
                      {{ $t(`vaccinations.steps.${s.key}.subtitle`) }}
                    </div>
                  </div>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-col>

          <!-- Contenido dinámico según paso -->
          <v-col cols="9">
            <h3 class="text-deep-purple-accent-3 mb-8">
              {{ $t(`vaccinations.steps.${steps[step].key}.title`) }}
            </h3>

            <!-- Paso 1: Información básica -->
            <v-row dense v-if="step === 0">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="editedItem.name"
                  :label="$t('vaccinations.fields.name')"
                  variant="underlined"
                  :rules="[
                    (v) =>
                      !!v ||
                      $t('vaccinations.vaccinations.validation.required', {
                        field: $t('vaccinations.fields.name'),
                      }),
                  ]"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.notes"
                  :label="$t('vaccinations.fields.notes')"
                  variant="underlined"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- Paso 2: Detalles adicionales -->
            <v-row dense v-if="step === 1">
            <v-col cols="12" md="6">
                <v-locale-provider>
                  <v-menu v-model="menu" :close-on-content-click="false" offset-y min-width="auto" transition="scale-transition" location="end">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="this.editedItem.date" variant="underlined" :rules="[
                            v => !!v || $t('vaccinations.validation.required', { field: $t('vaccinations.fields.date') })
                        ]"
                        :label="$t('vaccinations.fields.date')" readonly></v-text-field>
                    </template>
                      <v-date-picker color="#03626C" :modelValue="parseDateString(this.editedItem.date)" @update:model-value="updateDate"
                        format="yyyy-MM-dd"></v-date-picker>
                  </v-menu>
                    </v-locale-provider>
              </v-col>
              <v-col cols="12" md="6">
                <v-locale-provider>
                    <v-menu v-model="menu2" :close-on-content-click="false" offset-y min-width="auto" transition="scale-transition" location="end">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :model-value="this.editedItem.next_date" 
                          :label="$t('vaccinations.fields.next_date')" variant="underlined" readonly></v-text-field>
                      </template>
                      <v-date-picker :modelValue="parseDateString(this.editedItem.next_date)" @update:model-value="updateDate1"
                        format="yyyy-MM-dd" color="#03626C"
                        :min="editedItem.date"></v-date-picker>
                    </v-menu>
                    </v-locale-provider>
              </v-col>
            </v-row>

            <!-- Navegación -->
            <div class="d-flex justify-space-between mt-8">
              <v-btn
                variant="text"
                class="text-grey-darken-1"
                @click="step > 0 ? step-- : close()"
              >
                {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
              </v-btn>

              <v-btn
                variant="text"
                class="text-deep-purple-accent-3"
                @click="nextStep"
                :disabled="!validStep"
              >
                {{
                  step === steps.length - 1 ? $t("buttons.saveAndClose") : $t("buttons.next")
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
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.wish`) }) }}</span
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
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import { format } from "date-fns";
export default {
    props: {
    selectedPet: {
      type: Object,
      required: true
    },
  },
  data: () => ({
     steps: [
      { key: "basic", title: "Información básica", subtitle: "Datos principales de la vacuna" },
      { key: "schedule", title: "Información adicional", subtitle: "Lote y observaciones" }
    ],
    step: 0,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    person_id: "",
    loading: false,
    mostrar: false,
    home_id:"",
    dialog: false,
    dialogDelete: false,
    treatments: [],
    data: {},

    editedItem: {
      id: "",
        type: "vaccination",
        name: "",
        date: null,
        next_date: null,
        notes: "",
        pet_id: "",
        home_id: ""
    },
    originalItem: {
      id: "",
        type: "",
        name: "",
        date: null,
        next_date: null,
        notes: "",
        pet_id: "",
        home_id: ""
    },
    defaultItem: {
      id: "",
        type: "vaccination",
        name: "",
        date: null,
        next_date: null,
        notes: "",
        pet_id: "",
        home_id: ""
    },
    editedIndex: -1,
     headers: [
      //{ title: 'Sucursal', value: 'branchName', width: '20%' },
      { title: "Fecha", value: "date", width: "20%" },
      { title: "Nombre", value: "name", width: "10%" },
      { title: "Notas", value: "notes", width: "10%" },
      { title: "Siguiente vacuna", value: "next_date", width: "10%" },
      { title: "files.fields.actions", value: "actions", sortable: false, width: "15%" },
    ],
    search: "",
    menu: false,
    input: null,
    menu2: false,
    input2: null,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    priceRules: [
      (v) => !!v || "El precio es obligatorio", // El campo es obligatorio
      (v) =>
        /^[0-9]+(\.[0-9]{1,2})?$/.test(v) ||
        "El precio debe ser un número válido con hasta 2 decimales", // Valida el formato del precio
      (v) => v > 0 || "El precio debe ser un número positivo", // El precio debe ser positivo
    ],
  }),
  computed: {
     validStep() {
    switch (this.step) {
      case 0:
        return !!this.editedItem.name;
      case 1:
        return !!this.editedItem.date; // Todos los campos son opcionales en el segundo paso
      default:
        return false;
    }
  },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Deseo" : "Editar Deseo";
    },
    imgedit() {
      return this.imgMiniatura;
    },
    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    dateFormatted1() {
      const date = this.input1 ? new Date(this.input1) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate1() {
      return this.input1 ? new Date(this.input1) : new Date();
    },
  },
  created() {
    this.tools = [
      {
        name: this.$t("vaccinations.listing.addButton"),
        action: () => this.showAdd(),
      },
    ];
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    parseDateString(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  },
    getTypeColor(type) {
      const colorMap = {
        Personal: "deep-purple",      // Color morado para asuntos personales
        Profesional: "indigo",       // Color índigo para temas profesionales
        Hogar: "teal",               // Color verde azulado para el hogar
        // Puedes agregar más tipos si es necesario
        Regalo: "pink",              // Ejemplo adicional
        Otro: "blue-grey"            // Color neutral para otros tipos
      };
      
      // Retorna el color correspondiente o un color por defecto (primary)
      return colorMap[type] || "green";
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
        .replace(/\./g, ""); // Elimina los puntos de abreviaturas (ej: "mar." → "mar")
  }
},
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.save();
      }
    },
   formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formattedValue;
    },
    updateDate(value) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    this.input = `${year}-${month}-${day}`;

      this.editedItem.date = this.input;
      this.menu = false;
    },
    updateDate1(value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      this.input2 = `${year}-${month}-${day}`;

      this.editedItem.next_date = this.input2;
      this.menu2 = false;
    },
    async showAdd() {
      this.editedIndex = -1;
      this.step = 0;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.showStatus = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
    },
    async initialize() {
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        this.data.pet_id = this.selectedPet.id;
        this.data.type = "vaccination";
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-pet-treatments",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.treatments = result.data?.treatments || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
        } else {
          // Si no hay datos, asignamos un array vacío
          this.treatments = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los deseos.",
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
        "type",
        "name",
        "date",
        "next_date",
        "notes",
        "pet_id",
        "home_id"
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
          updatedFields.home_id = this.home_id;
          updatedFields.pet_id = this.selectedPet.id;

          try {
            const result = await handleRequest({
              endpoint: "pet-treatment",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.close();
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.close();
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.close();
          this.showAlert("success", "Debe completar los datos de la vacuna.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "type",
        "name",
        "date",
        "next_date",
        "notes",
        "pet_id",
        "home_id"
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
              endpoint: "pet-treatment-update",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.close();
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.close();
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.close();
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.step = 0;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
        this.input = item.date;
      this.input2 = item.next_date;
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
      });
    },
    async deleteItemConfirm() {
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "pet-treatment-destroy",
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
        this.closeDelete();
      }
    },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "info") {
        this.sb_title = "Información";
        this.sb_icon = "mdi-alert-circle";
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
.date-display {
  font-size: 0.85rem; /* Equivale a text-caption */
  line-height: 1.1;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 2px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
   z-index: 1;
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
.icono-concavo:hover .img-concava {
  filter: brightness(1.1);
}

.modal-imagen {
  background: transparent !important;
  box-shadow: none !important;
}
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* OCULTAR HEADER DE v-data-table - Vuetify 3.4.7 */
/* Máxima especificidad para ocultar el thead */
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
