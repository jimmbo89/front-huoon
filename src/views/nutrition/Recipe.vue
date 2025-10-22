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
        :items="recipes"
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
              <div style="width: 48%; min-width: 0" class="text-left">
                {{ $t("recipe.fields.name") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-left">
              {{ $t("recipe.fields.preparation_time") }}
              </div>
              <div style="width: 10%; min-width: 0" class="text-left">
              {{ $t("recipe.fields.servings") }}
              </div>
               <div style="width: 10%; min-width: 0" class="text-left">
              {{ $t("recipe.fields.calories") }}(kcal)
              </div>
               <div style="width: 10%; min-width: 0" class="text-left">
              {{ $t("recipe.fields.is_favorite") }}
              </div>
              <div style="width: 7%; min-width: 0" class="d-flex justify-center">
                {{ $t("settings.actions") }}
              </div>
            </v-card-text>
          </v-card>
        </template>

        <!-- Fila personalizada -->
         <template v-slot:item="{ item }">
          <!-- Fila principal de la receta -->
          <tr>
            <td colspan="100%" style="padding: 0; border: none">
              <v-card
                class="mb-2 mx-1 rounded-lg"
                elevation="1"
                flat
              >
                <v-card-text class="d-flex align-center pa-2" style="width: 100%">
                  <div style="width: 48%" class="d-flex align-center">
                    <v-avatar size="48" class="mr-3 icono-concavo" color="grey-lighten-4" style="flex-shrink: 0">
                      <v-img :src="getImageUrl(item.image)" cover class="icono-concavo" />
                    </v-avatar>
                    <div class="d-flex flex-column" style="min-width: 0">
                      <div class="font-weight-bold text-body-2 text-truncate">
                        {{ item.name }}
                      </div>
                      <div class="text-caption text-grey-darken-1 text-truncate">
                        {{ item.description }}
                      </div>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ item.description }}
                        </span>
                      </v-tooltip>
                    </div>
                  </div>
                  <div style="width: 15%; text-align: left" class="text-body-2 text-truncate">
                    {{ item.preparation_time }}
                  </div>
                  <div style="width: 10%; text-align: left" class="text-body-2 text-truncate">
                    {{ item.servings }}
                  </div>
                  <div style="width: 10%; text-align: left" class="text-body-2 text-truncate">
                    {{ item.calories }}
                  </div>
                  <div style="width: 10%; text-align: left" class="text-body-2 text-truncate">
                    <v-icon :color="item.is_favorite ? 'amber' : 'grey'" size="small">
                      {{ item.is_favorite ? 'mdi-star' : 'mdi-star-outline' }}
                    </v-icon>
                  </div>
                  <div class="d-flex gap-1" style="width: 7%; justify-content: flex-end">
                    <v-btn
                      v-if="item.products && item.products.length > 0"
                      size="35"
                      icon
                      variant="text"
                      color="blue-darken-1"
                      @click.stop="toggleExpand(item.id)"
                      :class="{ 'rotate-180': isExpanded(item.id) }"
                      style="transition: transform 0.2s"
                      :title="$t('recipe.expand_ingredients')"
                    >
                      <v-icon size="20">mdi-chevron-down</v-icon>
                    </v-btn>
                    <v-btn size="35" icon variant="text" color="green-darken-2" @click="editItem(item)" :title="$t('buttons.edit')">
                      <v-icon size="20">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn size="35" icon variant="text" color="red-darken-2" @click="deleteItem(item)" :title="$t('buttons.delete')">
                      <v-icon size="20">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </td>
          </tr>

          <!-- Fila expandida: productos (solo si tiene y está expandida) -->
          <tr v-if="isExpanded(item.id) && item.products && item.products.length > 0">
            <td colspan="100%" class="pa-0" style="background: #fafafa">
              <div class="px-2 pb-1">
                <v-card
                  v-for="product in item.products"
                  :key="product.recipe_product_id"
                  class="mb-2 rounded-lg"
                  elevation="1"
                  flat
                >
                  <v-card-text class="d-flex align-center pa-2">
                    <v-avatar size="36" class="mr-3" color="grey-lighten-4">
                    <v-img :src="getImageUrl(product.image)" cover />
                  </v-avatar>

                  <!-- Nombre del producto -->
                  <div style="width: 30%" class="text-body-2 text-truncate">
                    {{ product.name }}
                  </div>

                <div style="width: 20%" class="text-body-2 text-truncate">
                    {{ product.quantity }} {{ product.unit }}
                    <v-tooltip activator="parent" location="bottom" max-width="250px">
                      <span>{{ $t("recipe_product.fields.quantity_in_recipe") }}: {{ product.quantity }} {{ product.unit }}</span>
                    </v-tooltip>
                  </div>

                  <!-- Proteínas por unidad -->
                    <div style="width: 15%" class="text-body-2 text-truncate">
                      <span v-if="product.protein_per_unit !== null">
                        {{ product.protein_per_unit }}g
                      </span>
                      <span v-else>—</span>
                      <v-tooltip activator="parent" location="bottom" max-width="250px">
                        <span>{{ $t("recipe_product.fields.protein_per_unit") }}: {{ product.protein_per_unit ? product.protein_per_unit + 'g' : '—' }}</span>
                      </v-tooltip>
                    </div>

                    <!-- Carbohidratos por unidad -->
                    <div style="width: 15%" class="text-body-2 text-truncate">
                      <span v-if="product.carbs_per_unit !== null">
                        {{ product.carbs_per_unit }}g
                      </span>
                      <span v-else>—</span>
                      <v-tooltip activator="parent" location="bottom" max-width="250px">
                        <span>{{ $t("recipe_product.fields.carbs_per_unit") }}: {{ product.carbs_per_unit ? product.carbs_per_unit + 'g' : '—' }}</span>
                      </v-tooltip>
                    </div>

                    <!-- Grasas por unidad -->
                    <div style="width: 15%" class="text-body-2 text-truncate">
                      <span v-if="product.fats_per_unit !== null">
                        {{ product.fats_per_unit }}g
                      </span>
                      <span v-else>—</span>
                      <v-tooltip activator="parent" location="bottom" max-width="250px">
                        <span>{{ $t("recipe_product.fields.fats_per_unit") }}: {{ product.fats_per_unit ? product.fats_per_unit + 'g' : '—' }}</span>
                      </v-tooltip>
                    </div>

                    <!-- Calorías por unidad -->
                    <div style="width: 15%" class="text-body-2 text-truncate">
                      <span v-if="product.calories_per_unit !== null">
                        {{ product.calories_per_unit }} kcal
                      </span>
                      <span v-else>—</span>
                      <v-tooltip activator="parent" location="bottom" max-width="250px">
                        <span>{{ $t("recipe_product.fields.calories_per_unit") }}: {{ product.calories_per_unit ? product.calories_per_unit + ' kcal' : '—' }}</span>
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
            {{ $t(`recipe.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("recipe.formInstructions") }}</p>

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
                      <strong>{{ $t(`recipe.steps.${s.key}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`recipe.steps.${s.key}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`recipe.steps.${steps[step].key}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('recipe.fields.name')"
                    variant="underlined"
                    :rules="[v => !!v || $t('recipe.validation.required', { field: $t('recipe.fields.name') })]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.preparation_time"
                    :label="$t('recipe.fields.preparation_time')"
                    type="number"
                    variant="underlined"
                    :rules="[v => v > 0 || $t('recipe.validation.min_preparation_time')]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.servings"
                    :label="$t('recipe.fields.servings')"
                    type="number"
                    variant="underlined"
                    :rules="[v => v >= 1 || $t('recipe.validation.min_servings')]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center flex-wrap gap-6" style="max-width: 100%">
                    <!-- Switch: Favorita -->
                    <v-switch
                      v-model="editedItem.is_favorite"
                      :label="$t('recipe.fields.is_favorite')"
                      color="amber"
                      hide-details
                      inset
                      class="mb-0 mr-15 ml-15"
                    >
                      <template v-slot:label>
                        <span class="text-body-2 font-weight-medium" :style="{ color: 'rgba(255, 179, 0, 1)' }">
                          {{ $t('recipe.fields.is_favorite') }}
                        </span>
                      </template>
                    </v-switch>

                    <!-- Switch: Privada -->
                    <v-switch
                      v-model="editedItem.is_private"
                      :label="$t('recipe.fields.is_private')"
                      color="blue-grey"
                      hide-details
                      inset
                      class="mb-0"
                    >
                      <template v-slot:label>
                        <span class="text-body-2 font-weight-medium" :style="{ color: 'rgba(84, 110, 122, 1)' }">
                          {{ $t('recipe.fields.is_private') }}
                        </span>
                      </template>
                    </v-switch>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('recipe.fields.description')"
                    variant="underlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
                 <v-col cols="12" md="6">
                  <v-file-input clearable v-model="file" ref="fileInput" :label="$t('recipe.fields.image')"
                    variant="underlined" :prepend-icon="null" density="compact" name="file" accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210" />
                  </v-card>
                </v-col>
              </v-row>

              <!-- Paso 2: Ingredientes -->
              <v-row dense v-if="step === 1">
                  <v-col cols="12">
                  <RecipeProductsSection
                    v-model="editedItem.products"
                    :selected-person="selectedPerson"
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
  
   <RecipeFormDialog
   v-if="selectedPerson.id"
    v-model="showRecipeDialog"
    :item="selectedRecipe" 
    :selected-person="selectedPerson"
    @saved="onRecipeSaved"
    @close="onRecipeDialogClose"
  />
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import { format } from "date-fns";
import RecipeProductsSection from "./RecipeProductsSection.vue";
import RecipeFormDialog from "./RecipeFormDialog.vue";
export default {
  components: {
    RecipeProductsSection,
    RecipeFormDialog
  },
  props: {
    selectedPerson: {
      type: Object,
      required: true
    }
  },
  emits: ['update-nutrition-data'],
  data: () => ({
    steps: [
      { key: 'basic_info', title: 'Información básica', subtitle: 'Nombre, descripción, tiempo...' },
      //{ key: 'nutrition', title: 'Nutrición', subtitle: 'Valores nutricionales totales' },
      { key: 'ingredients', title: 'Ingredientes', subtitle: 'Lista de productos' }
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
    recipes: [],
    data: {},
    file: null,
    imgMiniatura: "",
   editedItem: {
      id: null,
      person_id: null,
      home_id: null,
      name: "",
      description: "",
      image: "",
      preparation_time: 0,
      servings: 1,
      is_private: false,
      is_favorite: false,
      // Nutrición total (calculada o editable)
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      saturated_fats: 0,
      // Ingredientes
      products: [] // ← array de ingredientes
    },
    originalItem: {
      id: null,
      person_id: null,
      home_id: null,
      name: "",
      description: "",
      image: "",
      preparation_time: 0,
      servings: 1,
      is_private: false,
      is_favorite: false,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      saturated_fats: 0,
      products: []
    },
    defaultItem: {
      id: null,
      person_id: null,
      home_id: null,
      name: "",
      description: "",
      image: "",
      preparation_time: 0,
      servings: 1,
      is_private: false,
      is_favorite: false,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      saturated_fats: 0,
      products: []
    },
    editedIndex: -1,
     headers: [
      { title: 'Nombre', value: 'name', sortable: false },
      { title: 'Descripción', value: 'description', sortable: false },
      { title: 'Tiempo', value: 'preparation_time', sortable: false },
      { title: 'servings', value: 'servings', sortable: false },
      { title: 'calories', value: 'calories', sortable: false },
      { title: 'is_favorite', value: 'is_favorite', sortable: false },
      { title: 'Acciones', value: 'actions', sortable: false, width: '20%' },
    ],
    expandedRows: [],
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
    showRecipeDialog: false,
    selectedRecipe: null, // o un objeto si editas
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
    imgedit() {
      return this.imgMiniatura;
    },
  },
  created() {
    this.tools = [
      {
          name: this.$t("recipe.listing.addButton"),
          action: () => this.showRecipe()
      }
    ];
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    showRecipe(){
      this.showRecipeDialog = true;
    },
    onRecipeSaved(data) {
      console.log("Receta guardada:", data);
      this.initialize();
      this.$emit('update-nutrition-data');
    },
    onRecipeDialogClose() {
      console.log("Diálogo cerrado");
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
      return `${this.$axios.defaults.baseURL}images/${imagePath}?t=${this.getCacheTimestamp()}`;
    },
    getCacheTimestamp() {
      // Usamos medianoche (00:00:00) del día actual
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.getTime(); // Ej: 1714003200000 (cambia una vez al día)
    },
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
          endpoint: "recipes-person",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.recipes = result.data?.recipes || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
        } else {
          // Si no hay datos, asignamos un array vacío
          this.recipes = {};
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

      // Definir los campos que se pueden actualizar
      const fieldsToUpdate = [
        "name",
        "description",
        "image",
        "preparation_time",
        "servings",
        "is_private",
        "is_favorite",
        "calories",
        "protein",
        "carbs",
        "fats",
        "fiber",
        "sugar",
        "saturated_fats",
        "products", // ← campo complejo (array)
      ];

      if (this.editedIndex === -1) {
        // ✅ Crear nueva receta
        this.valid = false;

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) =>
            fieldsToUpdate.includes(key) &&
            (key !== "products"
              ? this.editedItem[key] !== this.originalItem[key]
              : this.areProductsDifferent(this.originalItem[key], this.editedItem[key]))
          )
          .reduce((obj, key) => {
            if (key === "products") {
              // Serializar productos tal como están (sin forzar tipos)
              obj[key] = this.editedItem.products.map((product) => ({
                product_id: product.product_id,
                person_id: product.person_id,
                //name: product.name,
                //image: product.image,
                quantity: product.quantity,
                unit: product.unit,
                calories_per_unit: product.calories_per_unit,
                protein_per_unit: product.protein_per_unit,
                carbs_per_unit: product.carbs_per_unit,
                fats_per_unit: product.fats_per_unit,
                fiber_per_unit: product.fiber_per_unit,
                sugar_per_unit: product.sugar_per_unit,
                saturated_fats_per_unit: product.saturated_fats_per_unit,
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});

        if (Object.keys(updatedFields).length > 0) {
          if (this.file) {
            updatedFields.image = this.file; // ← importante: usar el File, no la URL
          }

          const formData = new FormData();
          for (const [key, value] of Object.entries(updatedFields)) {
            if (key === "products") {
              value.forEach((product, index) => {
                for (const [prop, propValue] of Object.entries(product)) {
                  // Solo enviar si no es undefined; null se puede enviar como string vacío o null
                  if (propValue !== undefined) {
                    formData.append(`products[${index}][${prop}]`, propValue ?? "");
                  }
                }
              });
            } else {
              formData.append(key, value);
            }
          }

          try {
            const result = await handleRequest({
              endpoint: "recipe", // ajusta según tu API
              method: "POST",
              data: formData,
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
              "Ocurrió un error inesperado al crear la receta.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.showAlert("warning", "Debe completar los datos de la receta.", 3000);
        }
      } else {
        // ✏️ Editar receta existente
        this.valid = false;

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) =>
            fieldsToUpdate.includes(key) &&
            (key !== "products"
              ? this.editedItem[key] !== this.originalItem[key]
              : this.areProductsDifferent(this.originalItem[key], this.editedItem[key]))
          )
          .reduce((obj, key) => {
            if (key === "products") {
              obj[key] = this.editedItem.products.map((product) => ({
                product_id: product.product_id,
                person_id: product.person_id,
                //name: product.name,
                //image: product.image,
                quantity: product.quantity,
                unit: product.unit,
                calories_per_unit: product.calories_per_unit,
                protein_per_unit: product.protein_per_unit,
                carbs_per_unit: product.carbs_per_unit,
                fats_per_unit: product.fats_per_unit,
                fiber_per_unit: product.fiber_per_unit,
                sugar_per_unit: product.sugar_per_unit,
                saturated_fats_per_unit: product.saturated_fats_per_unit,
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});

        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id; // necesario para la actualización

          if (this.file) {
            updatedFields.image = this.file;
          }

          const formData = new FormData();
          for (const [key, value] of Object.entries(updatedFields)) {
            if (key === "products") {
              value.forEach((product, index) => {
                for (const [prop, propValue] of Object.entries(product)) {
                  if (propValue !== undefined) {
                    formData.append(`products[${index}][${prop}]`, propValue ?? "");
                  }
                }
              });
            } else {
              formData.append(key, value);
            }
          }

          try {
            const result = await handleRequest({
              endpoint: "recipe-update", // ajusta según tu API
              method: "POST",
              data: formData,
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
              "Ocurrió un error inesperado al actualizar la receta.",
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
    areProductsDifferent(originalProducts, editedProducts) {
      // Ordenar por product_id para comparación consistente (opcional, pero recomendado)
      const sortById = (arr) =>
        [...arr].sort((a, b) => (a.product_id || 0) - (b.product_id || 0));

      const sortedOriginal = sortById(originalProducts || []);
      const sortedEdited = sortById(editedProducts || []);

      return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.step = 0;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.selectedRecipe = Object.assign({}, item);
        this.input = item.date;
      this.input2 = item.next_date;
      this.file = null;
      // Crear la imagen y configurar el src
      const img = new Image();
      img.src = this.getImageUrl(item.image); // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = this.getImageUrl(item.image);;
        } catch (error) {
          this.showAlert("error", "Error al cargar la imagen.", 3000);
        }
      };
      this.showRecipeDialog = true;
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
          endpoint: "recipe-delete",
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
