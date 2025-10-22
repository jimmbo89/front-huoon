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
            :disabled="tool.disabled"
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
        :items="Object.keys(profile).length > 0 ? [profile] : []"
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
        <!-- Header personalizado -->
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
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("nutrition_profile.fields.calories") }} (kcal)
              </div>
              <div style="width: 7%; min-width: 0" class="text-left">
                {{ $t("nutrition_profile.fields.protein") }}
              </div>
              <div style="width: 10%; min-width: 0" class="text-left">
                {{ $t("nutrition_profile.fields.carbs") }}
              </div>
              <div style="width: 10%; min-width: 0" class="text-left">
                {{ $t("nutrition_profile.fields.fats") }}
              </div>
              <div style="width: 7%; min-width: 0" class="text-left">
                {{ $t("nutrition_profile.fields.fiber") }}
              </div>
              <div style="width: 10%; min-width: 0" class="text-left">
                {{ $t("nutrition_profile.fields.water") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("nutrition_profile.fields.sugar_limit") }}
              </div>
              <div style="width: 18%; min-width: 0" class="text-left">
                {{ $t("nutrition_profile.fields.sat_fats_limit") }}
              </div>
              <div style="width: 7%; min-width: 0" class="d-flex justify-center">
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
              <!-- Calorías -->
              <div style="width: 15%; min-width: 0" class="d-flex flex-column">
                <div class=" text-body-2">
                  {{ item.calories}}
                </div>
              </div>

              <!-- Proteínas -->
              <div style="width: 7%; min-width: 0" class="d-flex flex-column">
                <div class="text-body-2">
                  {{ item.protein}}
                </div>
              </div>

              <!-- Carbohidratos -->
              <div style="width: 10%; min-width: 0" class="d-flex flex-column">
                <div class="text-body-2">
                  {{ item.carbs}}
                </div>
              </div>

              <!-- Grasas -->
              <div style="width: 10%; min-width: 0" class="d-flex flex-column">
                <div class="text-body-2">
                  {{ item.fats }}
                </div>
              </div>

              <!-- Fibra -->
              <div style="width: 7%; min-width: 0" class="d-flex flex-column">
                <div class="text-body-2">
                  {{ item.fiber}}
                </div>
              </div>

              <!-- Agua -->
              <div style="width: 10%; min-width: 0" class="d-flex flex-column">
                <div class="text-body-2">
                  {{ item.water }}
                </div>
              </div>

              <div style="width: 15%; min-width: 0" class="d-flex flex-column">
                <div class="text-body-2">
                  {{ item.sugar_limit }}
                </div>
              </div>

               <div style="width: 18%; min-width: 0" class="d-flex flex-column">
                <div class="text-body-2">
                  {{ item.sat_fats_limit }}
                </div>
              </div>

              <!-- Acciones -->
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
            {{ $t(`nutrition_profile.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("nutrition_profile.formInstructions") }}</p>

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
                      <strong>{{ $t(`nutrition_profile.steps.${s.key}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`nutrition_profile.steps.${s.key}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`nutrition_profile.steps.${steps[step].key}.title`) }}
              </h3>

              <!-- Paso 1: Metas básicas -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.calories"
                    :label="$t('nutrition_profile.fields.calories')"
                    type="number"
                    variant="underlined"
                    :rules="numberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.protein"
                    :label="$t('nutrition_profile.fields.protein')"
                    type="number"
                    variant="underlined"
                    :rules="numberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.carbs"
                    :label="$t('nutrition_profile.fields.carbs')"
                    type="number"
                    variant="underlined"
                    :rules="numberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.fats"
                    :label="$t('nutrition_profile.fields.fats')"
                    type="number"
                    variant="underlined"
                    :rules="numberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.water"
                    :label="$t('nutrition_profile.fields.water')"
                    type="number"
                    step="0.1"
                    variant="underlined"
                    :rules="waterRules"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Paso 2: Límites adicionales -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.fiber"
                    :label="$t('nutrition_profile.fields.fiber')"
                    type="number"
                    variant="underlined"
                    :rules="numberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.sugar_limit"
                    :label="$t('nutrition_profile.fields.sugar_limit')"
                    type="number"
                    variant="underlined"
                    :rules="numberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.sat_fats_limit"
                    :label="$t('nutrition_profile.fields.sat_fats_limit')"
                    type="number"
                    variant="underlined"
                    :rules="numberRules"
                  ></v-text-field>
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
    selectedPerson: {
      type: Object,
      required: true
    }
  },

  emits: ['update-nutrition-data'],
  data: () => ({
     steps: [
      { key: "basic", title: "Metas básicas", subtitle: "Calorías, proteínas, carbohidratos y grasas" },
      { key: "limits", title: "Límites adicionales", subtitle: "Fibra, azúcar y grasas saturadas" }
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
    profile: {},
    data: {},

    editedItem: {
      id: null,
      person_id: "",
      calories: null,
      protein: null,
      carbs: null,
      fats: null,
      fiber: null,
      sugar_limit: null,
      sat_fats_limit: null,
      water: null
    },
    originalItem: {
      id: null,
      person_id: "",
      calories: null,
      protein: null,
      carbs: null,
      fats: null,
      fiber: null,
      sugar_limit: null,
      sat_fats_limit: null,
      water: null
    },
    defaultItem: {
      id: null,
      person_id: "",
      calories: null,
      protein: null,
      carbs: null,
      fats: null,
      fiber: null,
      sugar_limit: null,
      sat_fats_limit: null,
      water: null
    },
    editedIndex: -1,
     headers: [
      { title: 'Calorías (kcal)', value: 'calories', sortable: false },
      { title: 'Proteínas (g)', value: 'protein', sortable: false },
      { title: 'Carbohidratos (g)', value: 'carbs', sortable: false },
      { title: 'Grasas (g)', value: 'fats', sortable: false },
      { title: 'Fibra (g)', value: 'fiber', sortable: false },
      { title: 'Agua (L)', value: 'water', sortable: false },
      { title: 'Lìmites de azucar', value: 'sugar_limit', sortable: false },
      { title: 'Lìmites de grasa', value: 'sat_fats_limit', sortable: false }
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
    numberRules: [
      v => !v || v >= 0 || this.$t('nutrition_profile.validation.min_value', { min: 0 })
    ],
    waterRules: [
      v => !v || (v >= 0 && v <= 10) || this.$t('nutrition_profile.validation.max_value', { max: 10 })
    ],
  }),
  computed: {
validStep() {
  if (this.step === 0) {
    return this.editedItem.calories != null && this.editedItem.protein != null;
  }
  return true; // Paso 2 es opcional
},
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Deseo" : "Editar Deseo";
    },
  },
  created() {
    const hasProfile = this.nutritionData?.profile?.id != null;
    this.tools = [
      {
          name: this.$t("nutrition_profile.formTitle.create"),
          action: () => {
            if (!hasProfile) {
              this.showAdd();
            }
          },
          disabled: hasProfile
        }
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
        //this.data.home_id = this.home_id;
        this.data.person_id = this.selectedPerson.id;
        this.loading = true;
        const result = await handleRequest({
          endpoint: "nutrition-profile-by-person",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.profile = result.data?.profile || {};
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
        } else {
          // Si no hay datos, asignamos un array vacío
          this.profile = {};
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
        "calories",
        "protein",
        "carbs",
        "fats",
        "fiber",
        "water",
        "sat_fats_limit",
        "sugar_limit",
        "person_id"
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
          //updatedFields.home_id = this.home_id;
          updatedFields.person_id = this.selectedPerson.id;

          try {
            const result = await handleRequest({
              endpoint: "nutrition-profile",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
              this.$emit('update-nutrition-data');
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
        "calories",
        "protein",
        "carbs",
        "fats",
        "fiber",
        "water",
        "sat_fats_limit",
        "sugar_limit",
        "person_id"
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
              endpoint: "nutrition-profile-update",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
              this.$emit('update-nutrition-data');
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
          endpoint: "nutrition-profile-delete",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
          this.$emit('update-nutrition-data');
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
