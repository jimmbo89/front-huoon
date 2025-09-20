<template>
  <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
    :multi-line="true" vertical v-model="snackbar">
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
    <v-card elevation="2" rounded="lg" flat>
      <!-- Encabezado con foto y datos -->
      <v-card-text>

           <!-- Columna ícono + texto título: ocupando un ancho fijo o proporcional -->
          <v-col cols="12" sm="9" md="9" class="d-flex align-center">
            <v-avatar size="48" class="me-3" color="grey-lighten-4" variant="tonal">
              <v-icon color="green-darken-2">mdi-cash</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-bold mb-1">
                Presupuestos
              </div>
              <div class="text-body-2 text-grey-darken-1">
              Resumen de los presupuestos
              </div>
            </div>
          </v-col>


             <v-divider />
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
          :items="budgets" 
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
                <div style="width: 6%; min-width: 0" class="text-left">
                  {{ $t('budget.fields.period') }}
                </div>

                <!-- Categoría / Descripción (40%) -->
                <div style="width: 44%; min-width: 0" class="text-left">
                  {{ $t('budget.fields.category') }} / {{ $t('budget.fields.description') }}
                </div>

                <!-- Monto (10%) -->
                <div style="width: 10%; min-width: 0" class="text-left">
                  {{ $t('budget.fields.amount') }}
                </div>

                <!-- Usado (15%) -->
                <div style="width: 15%; min-width: 0" class="text-center">
                  {{ $t('budget.fields.used_amount') }}
                </div>

                <!-- Tipo (10%) -->
                <div style="width: 10%; min-width: 0" class="text-left">
                  {{ $t('budget.fields.budget_type') }}
                </div>

                <!-- Moneda (5%) -->
                <div style="width: 5%; min-width: 0" class="text-left">
                  {{ $t('budget.fields.currency') }}
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
                    <div class="d-flex align-center" style="width: 6%; min-width: 0">
                    <v-avatar class="mr-2 icono-concavo" :style="{
                            'background-color': getTypeColor(slotProps.item.budget_type),
                            'color': getContrastText(getTypeColor(slotProps.item.budget_type)),
                            'min-height': '48px',
                            'min-width': '48px',
                            'border-radius': '8px'
                          }">
                     <div class="text-body-2 font-weight-medium">
                          {{ getPeriodAbbreviation(slotProps.item.typeName) }}
                        </div>
                    </v-avatar>
                  </div>

                    <!-- Categoría + Descripción - 40% -->
                    <div style="width: 44%; min-width: 0" class="d-flex flex-column">
                      <div class="text-body-2 text-truncate">
                        {{ slotProps.item.description }}
                        </div>
                      <div class="text-caption text-grey-darken-1 text-truncate">
                        {{ slotProps.item.categoryName }}
                              </div>
                    </div>

                    <!-- Monto - 10% -->
                    <div style="width: 10%; min-width: 0" class="text-body-2 text-truncate">
                      {{ formatCurrency(slotProps.item.amount) }}
                    </div>

                    <!-- Usado - 15% -->
                    <div style="width: 15%; min-width: 0; text-align: center;" class="text-caption text-grey-darken-1 text-truncate">
                      {{ formatCurrency(slotProps.item.used_amount) }}
                    </div>

                    <!-- Tipo (con ícono) - 10% -->
                    <div style="width: 10%; min-width: 0" class="d-flex align-center">
                      <v-icon 
                        :color="getTypeColor(slotProps.item.budget_type)"
                        style="font-size: 10px; margin-right: 4px"
                        icon="mdi-circle"
                      ></v-icon>
                      <span class="text-grey-darken-1 text-body-2 text-truncate">
                        {{ slotProps.item.budget_type }}
                      </span>
                    </div>

                    <!-- Moneda (con ícono) - 5% -->
                    <div style="width: 5%; min-width: 0" class="d-flex align-center">
                      <v-icon 
                        style="font-size: 10px; margin-right: 4px"
                        icon="mdi-currency-sign"
                      ></v-icon>
                      <span class="text-grey-darken-1 text-body-2 text-truncate">
                        {{ getCurrencySymbol(slotProps.item.currency) }}
                      </span>
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
  </v-container>
  
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("budget.formInstructions") }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item v-for="(s, index) in steps" :key="index" :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  " :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  " size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`budget.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`budget.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`budget.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6">
          <v-autocomplete
            v-model="selectedParent"
            :items="categoryParents"
            :label="$t('budget.fields.category')"
            item-title="nameCategory"
            item-value="id"
            variant="underlined"
            :rules="selectRules"
            clearable
            :menu-props="{ contentClass: 'dropdown-limited' }"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" class="dropdown-item">
                <!-- Ícono -->
                <template v-slot:prepend>
                  <v-avatar size="24">
                    <img
                      v-if="isImage(item.raw.iconCategory)"
                      :src="`${$axios.defaults.baseURL}images/${item.raw.iconCategory}`"
                      alt="icon"
                      class="object-fit-cover"
                    />
                    <v-icon v-else size="small">{{ getIconName(item.raw.iconCategory) }}</v-icon>
                  </v-avatar>
                </template>

                <!-- Descripción truncada con tooltip -->
                <v-tooltip location="top" :text="`Descripción: ${item.raw.descriptionCategory}`">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <v-list-item-subtitle
                      v-bind="tooltipProps"
                      class="text-truncate"
                    >
                      Descripción: {{ item.raw.descriptionCategory }}
                    </v-list-item-subtitle>
                  </template>
                </v-tooltip>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

                <!-- === SUBCATEGORÍA === -->
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="editedItem.category_id"
                    :items="categoryChildren"
                    :label="$t('budget.fields.category')"
                    item-title="nameCategory"
                    item-value="id"
                    variant="underlined"
                    :rules="selectRules"
                    :disabled="!selectedParent"
                    clearable
                    :menu-props="{ contentClass: 'dropdown-limited' }"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" class="dropdown-item">
                        <!-- Ícono -->
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <img
                              v-if="isImage(item.raw.iconCategory)"
                              :src="`${$axios.defaults.baseURL}images/${item.raw.iconCategory}`"
                              alt="icon"
                              class="object-fit-cover"
                            />
                            <v-icon v-else size="small">{{ getIconName(item.raw.iconCategory) }}</v-icon>
                          </v-avatar>
                        </template>
                        <!-- Descripción con tooltip -->
                        <v-tooltip location="top" :text="`Descripción: ${item.raw.descriptionCategory}`">
                          <template v-slot:activator="{ props: tooltipProps }">
                            <v-list-item-subtitle
                              v-bind="tooltipProps"
                              class="text-truncate"
                            >
                              Descripción: {{ item.raw.descriptionCategory }}
                            </v-list-item-subtitle>
                          </template>
                        </v-tooltip>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete v-model="editedItem.budget_type" :items="types"
                    :label="$t('budget.fields.budget_type')" item-title="name" item-value="id" variant="underlined"
                    :rules="typeRules">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div class="truncate" v-bind="tooltipProps" style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                ">
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
                  <v-text-field v-model="editedItem.amount" :label="$t('budget.fields.amount')" variant="underlined" min="0" :rules="amountRules" />
                </v-col>

                <!--<v-col cols="12" sm="6">
                  <v-select v-model="editedItem.currency" :label="$t('budget.fields.currency')" :items="[
                      { title: $t('budget.currencies.CLP'), value: 'CLP' },
                      /*{ title: $t('budget.currencies.USD'), value: 'USD' },
                      { title: $t('budget.currencies.EUR'), value: 'EUR' },
                      { title: $t('budget.currencies.BRL'), value: 'BRL' },
                      { title: $t('budget.currencies.MXN'), value: 'MXN' },
                      { title: $t('budget.currencies.COP'), value: 'COP' },*/
                    ]" variant="underlined" :rules="currencyRules" />
                </v-col>-->
              </v-row>

              <!-- Step 2: Fechas y detalles -->
              <v-row dense v-if="step === 1">
                <v-autocomplete v-model="editedItem.type_id" :items="typesPeriodo" :label="$t('budget.fields.period')"
                  item-title="name" item-value="id" variant="underlined" :rules="selectRules">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <v-list-item-subtitle class="d-flex flex-column">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ props: tooltipProps }">
                            <div class="truncate" v-bind="tooltipProps"
                              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                              {{ item.raw.description }}
                            </div>
                          </template>
                          <span>{{ item.raw.description }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <v-col cols="12">
                  <v-textarea v-model="editedItem.description" :label="$t('budget.fields.description')"
                    variant="underlined" rows="3" auto-grow />
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : this.close()">
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep" :disabled="!valid">
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
    <v-card rounded-lg>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.budget`) }) }}</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
          }}</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">
          {{ $t("taskForm.buttons.confirmDelete") }}</v-btn>
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
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    time: null,
    modal2: false,
    timePickerDialog: false,
    steps: [
      {
        title: "basic",
        subtitle: "basic_information",
      },
      {
        title: "dates",
        subtitle: "dates_and_details",
      },
    ],
    headers: [
      { title: 'Periodo', key: 'period' },
      { title: 'Categoría / Descripción', key: 'category_description' },
      { title: 'Monto', key: 'amount' },
      { title: 'Usado', key: 'used_amount' },
      { title: 'Tipo', key: 'budget_type' },
      { title: 'Moneda', key: 'currency' },
      { title: 'Acciones', key: 'actions' },
    ],
    search: "",
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
    budgets: [],
    types: [],
    
    categoryChildren: [], // hijas de la categoría seleccionada
    selectedParent: null, // categoría padre seleccionada
    categories: [],
    typesPeriodo: [],
    //budgetTypes: ["Mensual", "Trimestral", "Semestral", "Anual", "Personalizado"],
    currencies: ["CLP", "USD", "EUR", "COP", "MXN", "Otro"],
    startDateMenu: false,
    endDateMenu: false,
    startDateInput: null,
    endDateInput: null,
    home_id: "",
    editedItem: {
      id: "",
      category_id: null,
      amount: null,
      used_amount: 0,
      start_date: null,
      end_date: null,
      budget_type: "Personal",
      status: "",
      description: "",
      currency: "CLP",
      type_id: null,
    },
    messages:[],
    /*tools:[
      {
        name: "Crear Presupuestos",
        action: () => this.showAdd()
      }],*/
      
    defaultItem: {
      id: "",
      category_id: null,
      amount: null,
      used_amount: 0,
      start_date: null,
      end_date: null,
      budget_type: "Personal",
      status: "",
      description: "",
      currency: "CLP",
      type_id: null,
    },
    originalItem: {
      id: "",
      category_id: null,
      amount: null,
      used_amount: 0,
      start_date: null,
      end_date: null,
      budget_type: "",
      status: "",
      description: "",
      currency: "",
      type_id: null,
    },
    editedIndex: -1,
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    amountRules: [
      (v) => !!v || "El monto es requerido",
      (v) => (v && v > 0) || "El monto debe ser positivo",
    ],
  currencyRules: [
  v => !!v || 'La moneda es requerida',
],
    usedAmountRules: [(v) => !v || v >= 0 || "El monto utilizado no puede ser negativo"],
    descriptionRules: [
      (v) =>
        !v ||
        v.length <= 200 ||
        this.$t("budget.validationMessages.description.maxLength"),
    ],
  }),
  computed: {
    categoryParents() {
    return this.categories.filter(cat => cat.parent_id === null);
  },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("budget.titles.new")
        : this.$t("budget.titles.edit");
    },
    startDateFormatted() {
      const date = this.startDateInput ? new Date(this.startDateInput) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    endDateFormatted() {
      if (!this.endDateInput) return "";
      const date = new Date(this.endDateInput);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    paginatedBudgets() {
      if (!Array.isArray(this.budgets)) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.budgets.slice(start, end);
    },
    pageCount() {
      return this.budgets?.length
        ? Math.ceil(this.budgets.length / this.itemsPerPage)
        : 0;
    },
    typeRules() {
      return [
        (v) => !!v || this.$t("budget.validationMessages.category.required"), // Validación de requerido
        /*(v) =>
          !v || v.length <= 50 || this.$t("budget.validationMessages.type.maxLength"), // Validación de longitud máxima*/
      ];
    },
  },
  watch: {
  selectedParent(newParentId) {
    if (newParentId) {
      // Filtrar subcategorías cuyo parent_id === newParentId
      this.categoryChildren = this.categories.filter(cat => cat.parent_id === newParentId);
      // Si no hay selección, limpiar subcategoría
      if (!this.editedItem.category_id || !this.categoryChildren.some(c => c.id === this.editedItem.category_id)) {
        this.editedItem.category_id = null;
      }
    } else {
      this.categoryChildren = [];
      this.editedItem.category_id = null;
    }
  },

  // Cuando editedItem.category_id cambia (por carga en edición)
  'editedItem.category_id'(newChildId) {
    if (newChildId) {
      const child = this.categories.find(c => c.id === newChildId);
      if (child && child.parent_id) {
        // Sincronizar el padre
        this.selectedParent = child.parent_id;
      }
    }
  }
},
   created() {
    this.tools = [
      {
        name: this.$t("budget.titles.new"),
        action: () => this.showAdd()
      }
    ]
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    getCurrencyColor(currency) {
    const colorMap = {
      'CLP': 'blue-darken-2',  // Chile
      'USD': 'green-darken-1', // USA
      'EUR': 'indigo-darken-1',// Europa
      'BRL': 'amber-darken-3', // Brasil
      'MXN': 'green-darken-3', // México
      'COP': 'yellow-darken-2' // Colombia
    };
    return colorMap[currency] || 'grey-lighten-1';
  },
  
  getCurrencySymbol(currency) {
    const symbols = {
      'CLP': 'CLP',  // O 'CLP$' si prefieres
      'USD': 'USD',
      'EUR': 'EUR',
      'BRL': 'BRL',
      'MXN': 'MXN',
      'COP': 'COP'
    };
    return symbols[currency] || currency || '?';
  },
  
  getCurrencyName(currency) {
    return this.$t(`budget.currencies.${currency}`) || this.$t('general.not_specified');
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
      return colorMap[type] || "#607D8B"; // Color por defecto
    },
   getPeriodColor(periodName) {
      const colorMap = {
        'Mensual': '#4CAF50',  // Verde
        'Diario': '#2196F3',    // Azul
        'Anual': '#FF9800',     // Naranja
        'Semanal': '#9C27B0',   // Morado
        // Default
        'default': '#607D8B'    // Gris
      };
      return colorMap[periodName] || colorMap['default'];
    },
    getContrastText(bgColor) {
      // Convierte color HEX a RGB y calcula brillo
      const r = parseInt(bgColor.substr(1, 2), 16);
      const g = parseInt(bgColor.substr(3, 2), 16);
      const b = parseInt(bgColor.substr(5, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#000000' : '#FFFFFF';
    },
    getPeriodAbbreviation(periodName) {
      const abbreviations = {
        'Mensual': 'MES',
        'Diario': 'DIA',
        'Anual': 'AÑO',
        'Semanal': 'SEM',
        // Default
        'default': periodName?.charAt(0)?.toUpperCase() || ''
      };
      return abbreviations[periodName] || abbreviations['default'];
    },
    isImage(icon) {
      // Validar si el valor es una URL válida (puedes personalizar esta lógica)
      return (
        typeof icon === "string" &&
        (icon.startsWith("http") || /\.(png|jpe?g|gif|svg|webp)$/i.test(icon))
      );
    },
    getIconName(icon) {
      if (!icon) return "mdi-help-circle"; // Ícono por defecto si no hay valor
      // Si el ícono tiene el prefijo "MdiIcons.", extraer solo el nombre
      if (icon.startsWith("MdiIcons.")) {
        return `mdi-${icon.split(".")[1].toLowerCase()}`;
      }
      // Si el ícono ya está en formato "mdi-*", devolverlo tal cual
      if (icon.startsWith("mdi-")) {
        return icon;
      }
      // En otros casos, devolver un ícono por defecto
      return "mdi-help-circle";
    },
    formatDate(dateString) {
      if (!dateString) return "N/R";
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
    formatCurrency(value) {
  // Convertir a número si es string
      if (typeof value === 'string') {
        // Eliminar cualquier caracter no numérico excepto punto y signo menos
        value = value.trim().replace(/[^\d.-]/g, '');
        value = parseFloat(value);
      }

      // Validar si es numérico válido
      if (value === null || value === undefined || isNaN(value)) {
        return '0.00';
      }

      // Redondear a 2 decimales con protección contra errores de punto flotante
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Formatear con 2 decimales siempre, usando formato en-US
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    updateStartDate(val) {
      this.startDateInput = val;
      this.editedItem.start_date = this.startDateFormatted;
      this.startDateMenu = false;
    },
    updateEndDate(val) {
      this.endDateInput = val;
      this.editedItem.end_date = this.endDateFormatted;
      this.endDateMenu = false;
    },
    async showAdd() {
      this.editedIndex = -1;
      try {
        const result = await handleRequest({
          endpoint: "category-budgets",
          method: "POST",
        });
        if (result.success) {
          this.categories = result.data.categories || [];
          this.types = result.data.types || [];
          this.typesPeriodo = result.data.typesPeriodo || [];
        } else {
          this.categories = [];
          this.types = [];
          this.typesPeriodo = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las categorías.",
          3000
        );
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
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-budget-person",
          method: "POST",
          data: this.data
        });
        if (result.success) {
          this.budgets = result.data.budgets || [];
        } else {
          this.budgets = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los presupuestos.",
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
        // Crear nuevo presupuesto
        const fieldsToUpdate = [
          "category_id",
          "amount",
          "used_amount",
          "start_date",
          "end_date",
          "budget_type",
          "status",
          "description",
          "currency",
          "type_id"
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
        updatedFields.home_id = this.home_id;
        if (Object.keys(updatedFields).length > 0) {
          try {
            const result = await handleRequest({
              endpoint: "budget",
              method: "POST",
              data: updatedFields,
            });
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.showAlert("error", "Ocurrió un error al guardar el presupuesto", 3000);
          }
        }
      } else {
        // Actualizar presupuesto existente
        const fieldsToUpdate = [
          "category_id",
          "amount",
          "used_amount",
          "start_date",
          "end_date",
          "budget_type",
          "status",
          "description",
          "currency",
          "type_id"
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
              endpoint: "budget-update",
              method: "POST",
              data: updatedFields,
            });
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.showAlert(
              "error",
              "Ocurrió un error al actualizar el presupuesto",
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
      this.editedItem = Object.assign({}, this.originalItem);
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.startDateInput = item.start_date;
      this.endDateInput = item.end_date;
      try {
        const result = await handleRequest({
          endpoint: "category-budgets",
          method: "POST",
        });
        if (result.success) {
          this.categories = result.data.categories || [];
          this.types = result.data.types || [];
          this.typesPeriodo = result.data.typesPeriodo || [];
        } else {
          this.categories = [];
          this.types = [];
          this.typesPeriodo= [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las categorías.",
          3000
        );
      } finally {
        const child = this.categories.find(c => c.id === this.editedItem.category_id);
        if (child && child.parent_id) {
          this.selectedParent = child.parent_id;
          // categoryChildren se llenará por el watcher de selectedParent
        }
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
          endpoint: "budget-destroy",
          method: "POST",
          data: request,
        });
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
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
    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
  },
};
</script>
<style>
/* Limita el ancho del menú desplegable */
.dropdown-limited {
  max-width: 100% !important;
  width: auto !important;
  min-width: 0 !important;
  overflow-x: hidden;
}

/* Items del dropdown: no crecer innecesariamente */
.dropdown-item {
  min-width: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

/* Asegura que el tooltip no interfiera con el layout */
.v-tooltip__activator {
  width: 100%;
  display: block;
}
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
/* Estilos para los chips */
.v-chip {
  margin-right: 4px;
  margin-bottom: 4px;
}
/* Estilos para la línea de tiempo */
.v-timeline-item {
  padding-bottom: 16px;
}
/* Estilos para los campos del formulario */
.v-text-field,
.v-select,
.v-textarea {
  margin-bottom: 12px;
}
/* Estilos para los botones de acción */
.v-btn--icon {
  transition:  none !important;
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