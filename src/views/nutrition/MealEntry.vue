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
        :items="meals"
        :search="search"
        :items-per-page-text="$t('dataTable.itemsPerPageText')"
        :no-data-text="$t('dataTable.noDataText')"
        :loading-text="$t('dataTable.loadingText')"
        :loading="loading"
        :hide-default-header="true"
        hide-default-footer
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
              <div style="width: 7%" class="text-left">
                {{ $t("daily_log.fields.date") }}
              </div>
              <div style="width: 15%; text-align: left">
                {{ $t("meal_entry.fields.type_id") }}
              </div>
              <div style="width: 71%" class="text-left">
                {{ $t("meal_entry.fields.notes") }}
              </div>
              <div style="width: 7%" class="d-flex justify-center">
                {{ $t("settings.actions") }}
              </div>
            </v-card-text>
          </v-card>
        </template>

        <!-- Fila personalizada -->
        <template v-slot:item="{ item }">
          <!-- Fila principal: DailyLog -->
          <tr>
            <td :colspan="6" style="padding: 0; border: none">
              <v-card class="mb-2 mx-1 rounded-lg" elevation="1" flat>
                <v-card-text class="d-flex align-center pa-2" style="width: 100%">
                  <div style="width: 7%" class="d-flex align-center">
                    <div
                      class="icono-concavo d-flex flex-column justify-center justify-start mr-2"
                      :class="`bg-${getTypeColor(item.type)}`"
                      style="min-height: 48px; min-width: 48px; border-radius: 8px"
                    >
                      <div class="date-display text-center" style="font-size: 0.95em">
                        {{ formatIntuitiveDate(item.date) }}
                      </div>
                    </div>
                  </div>
                  <div
                    style="width: 15%; text-align: left"
                    class="text-body-2 text-truncate"
                  >
                    {{ item.typeName }}
                  </div>
                  <div
                    style="width: 71%; text-align: left"
                    class="text-body-2 text-truncate"
                  >
                    <span>{{ item.notes }}</span>
                  </div>
                  <div class="d-flex gap-1" style="width: 7%; justify-content: flex-end">
                    <v-btn
                      v-if="item.meal_recipes?.length > 0"
                      size="35"
                      icon
                      variant="text"
                      color="blue-darken-1"
                      @click.stop="toggleDailyLog(item.id)"
                      :class="{ 'rotate-180': isDailyLogExpanded(item.id) }"
                      style="transition: transform 0.2s"
                      :title="$t('recipe.steps.ingredients.title')"
                    >
                      <v-icon size="20">mdi-chevron-down</v-icon>
                    </v-btn>
                    <v-btn
                      size="35"
                      icon
                      variant="text"
                      color="green-darken-2"
                      @click="editItem(item)"
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
                      :title="$t('buttons.delete')"
                    >
                      <v-icon size="20">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </td>
          </tr>

          <!-- Fila expandida: MealEntries -->
          <tr v-if="isDailyLogExpanded(item.id) && item.meal_recipes?.length > 0">
            <td :colspan="6" class="pa-0" style="background: #fafafa">
              <div class="px-2 pb-1">
                <v-card
                  v-for="recipe in item.meal_recipes"
                  :key="recipe.recipe_id"
                  class="mb-2 rounded-lg"
                  elevation="1"
                  flat
                >
                  <v-card-text class="d-flex align-center pa-2" style="min-height: 60px">
                    <div style="width: 60%; min-width: 0" class="d-flex align-left">
                      <!-- Avatar de la vivienda -->
                      <v-avatar
                        size="48"
                        class="mr-3 icono-concavo"
                        color="grey-lighten-4"
                        style="flex-shrink: 0"
                      >
                        <v-img
                          :src="getImageUrl(recipe.image)"
                          cover
                          class="icono-concavo"
                        />
                      </v-avatar>

                      <!-- Contenedor de texto -->
                      <div class="d-flex flex-column" style="min-width: 0">
                        <div class="font-weight-bold text-body-2 text-truncate">
                          {{ recipe.name }}
                        </div>
                        <div
                          class="text-body-2 d-flex align-center text-grey-darken-1 text-truncate"
                        >
                          {{ recipe.name }}
                          <v-tooltip
                            activator="parent"
                            location="bottom"
                            max-width="350px"
                          >
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("recipe.fields.description") }}:
                              {{ recipe.name }}
                            </span>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                    <div
                      style="width: 10%; min-width: 0; text-align: left"
                      class="text-body-2 mt-3 text-truncate"
                    >
                      <span>{{ recipe.calories }} kcal</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("recipe.fields.calories") }}: {{ recipe.calories }} kcal
                        </span>
                      </v-tooltip>
                    </div>
                    <div
                      style="width: 10%; min-width: 0; text-align: left"
                      class="text-body-2 mt-3 text-truncate"
                    >
                      <span>{{ recipe.servings }} </span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("recipe.fields.servings") }}: {{ recipe.servings }}
                        </span>
                      </v-tooltip>
                    </div>
                    <div
                      style="width: 10%; min-width: 0; text-align: left"
                      class="text-body-2 mt-3 text-truncate"
                    >
                      <span>{{ recipe.protein }} </span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("recipe.fields.protein") }}: {{ recipe.protein }}
                        </span>
                      </v-tooltip>
                    </div>
                    <div
                      style="width: 10%; min-width: 0; text-align: left"
                      class="text-body-2 mt-3 text-truncate"
                    >
                      <span>{{ recipe.preparation_time }} min</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("recipe.fields.preparation_time") }}:
                          {{ recipe.preparation_time }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
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
    transition="dialog-bottom-transient"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <!-- Encabezado -->
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`meal_entry.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("meal_entry.formInstructions") }}</p>

          <v-row class="mt-12">
            <!-- Timeline lateral -->
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
                      <strong>{{ $t(`meal_entry.steps.${s.key}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`meal_entry.steps.${s.key}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`meal_entry.steps.${steps[step].key}.title`) }}
              </h3>

              <!-- Paso 1: Tipo de comida y notas -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="editedItem.type_id"
                    :items="types"
                    :label="$t('meal_entry.fields.type_id')"
                    item-title="nameTranslated"
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
                </v-col>
                <v-col cols="12" md="6">
                    <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="true"
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
                    ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                  </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.notes"
                    :label="$t('meal_entry.fields.notes')"
                    variant="underlined"
                    rows="2"
                    counter="255"
                    maxlength="255"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- Paso 2: Recetas -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <MealRecipesSection
                    v-model="editedItem.meal_recipes"
                    :recipes="recipes"
                  />
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
import MealRecipesSection from "./MealRecipesSection.vue";
export default {
  components: {
    MealRecipesSection,
  },
  props: {
    selectedPerson: {
      type: Object,
      required: true,
    },
  },
  emits: ['update-nutrition-data'],
  data: () => ({
    steps: [
      { key: "basic", title: "Datos de la comida", subtitle: "Fecha, tipo y notas" },
      { key: "recipes", title: "Recetas", subtitle: "Selecciona recetas y porciones" },
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
    home_id: "",
    dialog: false,
    dialogDelete: false,
    profile: {},
    meals: [],
    data: {},
    file: null,
    imgMiniatura: "",
    editedItem: {
      id: null,
      daily_log_id: null,
      date: null, // YYYY-MM-DD
      type_id: null,
      notes: "",
      meal_recipes: [], // ← { recipe_id, servings }
    },
    defaultItem: {
      id: null,
      daily_log_id: null,
      date: null,
      type_id: null,
      notes: "",
      meal_recipes: [],
    },
    originalItem: {
      id: null,
      daily_log_id: null,
      date: null,
      type_id: null,
      notes: "",
      meal_recipes: [],
    },
    editedIndex: -1,
    headers: [
      { title: "Fecha", value: "date", sortable: false },
      { title: "Tipo", value: "typeName", sortable: false },
      { title: "Notas", value: "notes", sortable: false },
      { title: "Acciones", value: "actions", sortable: false, width: "20%" },
    ],
    expandedRows: [],
    expandedDailyLogs: [],
    expandedMealEntries: [],
    search: "",
    dateMenu: false,
    dateInput: null,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    numberRules: [
      (v) =>
        !v || v >= 0 || this.$t("nutrition_profile.validation.min_value", { min: 0 }),
    ],
    waterRules: [
      (v) =>
        !v ||
        (v >= 0 && v <= 10) ||
        this.$t("nutrition_profile.validation.max_value", { max: 10 }),
    ],
    types: [],
    recipes: [],
  }),
  computed: {
    validStep() {
      if (this.step === 0) {
        return this.editedItem.date && this.editedItem.type_id !== null;
      }
      if (this.step === 1) {
        return true; // permitir guardar sin recetas (comida sin receta)
      }
      return true;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Deseo" : "Editar Deseo";
    },
    imgedit() {
      return this.imgMiniatura;
    },
    tools() {
      return [
        {
          name: this.$t("meal_entry.formTitle.create"),
          action: () => this.showAdd(),
          disabled: false, // ✅ ahora es reactivo
        },
        // ... otros botones si los tienes
      ];
    },
  },
  created() {},
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
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
    toggleDailyLog(id) {
      const index = this.expandedDailyLogs.indexOf(id);
      if (index > -1) {
        this.expandedDailyLogs.splice(index, 1);
      } else {
        this.expandedDailyLogs.push(id);
      }
    },
    isDailyLogExpanded(id) {
      return this.expandedDailyLogs.includes(id);
    },

    // ✅ Nuevos métodos para el segundo nivel
    toggleMealEntry(mealEntryId) {
      const index = this.expandedMealEntries.indexOf(mealEntryId);
      if (index > -1) {
        this.expandedMealEntries.splice(index, 1);
      } else {
        this.expandedMealEntries.push(mealEntryId);
      }
    },
    isMealEntryExpanded(mealEntryId) {
      return this.expandedMealEntries.includes(mealEntryId);
    },
    toggleExpand(id) {
      const index = this.expandedRows.indexOf(id);
      if (index > -1) {
        this.expandedRows.splice(index, 1);
      } else {
        this.expandedRows.push(id);
      }
    },
    isExpanded(id) {
      return this.expandedRows.includes(id);
    },
    getImageUrl(imagePath) {
      return `${
        this.$axios.defaults.baseURL
      }images/${imagePath}?t=${this.getCacheTimestamp()}`;
    },
    getCacheTimestamp() {
      // Usamos medianoche (00:00:00) del día actual
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.getTime(); // Ej: 1714003200000 (cambia una vez al día)
    },
    parseDateString(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return new Date(year, month - 1, day);
    },
    getTypeColor(type) {
      const colorMap = {
        Personal: "deep-purple", // Color morado para asuntos personales
        Profesional: "indigo", // Color índigo para temas profesionales
        Hogar: "teal", // Color verde azulado para el hogar
        // Puedes agregar más tipos si es necesario
        Regalo: "pink", // Ejemplo adicional
        Otro: "blue-grey", // Color neutral para otros tipos
      };

      // Retorna el color correspondiente o un color por defecto (primary)
      return colorMap[type] || "orange";
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
      this.dateInput = this.obtenerFechaLocal();
      this.editedItem.date = this.dateInput;
      this.editedIndex = -1;
      this.step = 0;
      this.data = {};
      this.data.type = "Nutricion";
      this.data.person_id = this.selectedPerson.id;
      try {
        const result = await handleRequest({
          endpoint: "get-type-recipes",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.recipes = result.data?.recipes || [];
        } else {
          this.types = [];
          this.recipes = [];
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
      }
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
          endpoint: "meal-entries-by-person",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.meals = result.data?.meals || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
        } else {
          // Si no hay datos, asignamos un array vacío
          this.meals = [];
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

      // ✅ Campos que se pueden actualizar en MealEntry
      const fieldsToUpdate = [
        "daily_log_id",
        "date",
        "type_id",
        "notes",
        "meal_recipes", // ← campo complejo (array)
      ];

      if (this.editedIndex === -1) {
        // ✅ Crear nuevo MealEntry
        this.valid = false;

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              (key !== "meal_recipes"
                ? this.editedItem[key] !== this.originalItem[key]
                : this.areMealRecipesDifferent(
                    this.originalItem[key],
                    this.editedItem[key]
                  ))
          )
          .reduce((obj, key) => {
            if (key === "meal_recipes") {
              // ✅ Serializar solo los campos necesarios para el backend
              obj[key] = this.editedItem.meal_recipes.map((entry) => ({
                recipe_id: entry.recipe_id,
                servings: entry.servings,
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});

        // ✅ Añadir person_id y date (asumimos que están en editedItem)
        updatedFields.person_id = this.selectedPerson.id;
        updatedFields.date = this.editedItem.date; // debe estar definido

        if (Object.keys(updatedFields).length > 0) {
          /*const formData = new FormData();
          for (const [key, value] of Object.entries(updatedFields)) {
            if (key === "meal_recipes") {
              value.forEach((recipe, index) => {
                for (const [prop, propValue] of Object.entries(recipe)) {
                  if (propValue !== undefined) {
                    formData.append(`meal_recipes[${index}][${prop}]`, propValue ?? "");
                  }
                }
              });
            } else {
              formData.append(key, value);
            }
          }*/

          try {
            const result = await handleRequest({
              endpoint: "meal-entry", // ← ajusta según tu API
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
              this.$emit('update-nutrition-data');
            } else {
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al crear la comida.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.showAlert("warning", "Debe completar los datos de la comida.", 3000);
        }
      } else {
        // ✏️ Editar MealEntry existente
        this.valid = false;

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              (key !== "meal_recipes"
                ? this.editedItem[key] !== this.originalItem[key]
                : this.areMealRecipesDifferent(
                    this.originalItem[key],
                    this.editedItem[key]
                  ))
          )
          .reduce((obj, key) => {
            if (key === "meal_recipes") {
              obj[key] = this.editedItem.meal_recipes.map((entry) => ({
                recipe_id: entry.recipe_id,
                servings: entry.servings,
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});

        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id; // ← ID del MealEntry existente

          /*const formData = new FormData();
          for (const [key, value] of Object.entries(updatedFields)) {
            if (key === "meal_recipes") {
              value.forEach((recipe, index) => {
                for (const [prop, propValue] of Object.entries(recipe)) {
                  if (propValue !== undefined) {
                    formData.append(`meal_recipes[${index}][${prop}]`, propValue ?? "");
                  }
                }
              });
            } else {
              formData.append(key, value);
            }
          }*/

          try {
            const result = await handleRequest({
              endpoint: "meal-entry-update", // ← ajusta según tu API
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
              this.$emit('update-nutrition-data');
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
              "Ocurrió un error inesperado al actualizar la comida.",
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

    // ✅ Método de comparación para mealRecipes
    areMealRecipesDifferent(originalRecipes, editedRecipes) {
      // Ordenar por recipe_id para comparación consistente
      const sortById = (arr) =>
        [...(arr || [])].sort((a, b) => (a.recipe_id || 0) - (b.recipe_id || 0));

      const sortedOriginal = sortById(originalRecipes);
      const sortedEdited = sortById(editedRecipes);

      return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.step = 0;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dateInput = item.date || null;
      this.data = {};
      this.data.type = "Nutricion";
      this.data.person_id = this.selectedPerson.id;
      try {
        const result = await handleRequest({
          endpoint: "get-type-recipes",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.recipes = result.data?.recipes || [];
        } else {
          this.types = [];
          this.recipes = [];
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
      });
    },
    async deleteItemConfirm() {
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "daily-log-delete",
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
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;
        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      // Validar el tamaño del archivo (500 KB máximo)
      const maxSize = 500 * 1024; // 500 KB en bytes
      if (file && file.size > maxSize) {
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return; // Detener el proceso si el archivo es demasiado grande
      }
      this.editedItem.image = file;
      //console.log(this.editedItem.image_cardgift);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
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
