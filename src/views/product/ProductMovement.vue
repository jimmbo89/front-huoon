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
    <v-card elevation="2" rounded="lg" flat>
      <v-card-text>
        <v-card-title class="d-flex flex-wrap align-center gap-4 pb-0">
      <v-spacer class="d-none d-md-block"></v-spacer>
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

    <!-- Tabla de datos -->
    <div
        class="ma-0 pa-0 responsive-data-table-wrapper"
        :class="isMobile ? 'mobile-scroll' : ''"
      >
    <v-data-table
      :headers="headers"
      :items="this.products"
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
            overflow-x: hidden;
            background: transparent;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
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
            <div style="width: 6%; min-width: 0" class="text-left">
              {{ $t("product.fields.purchase_date") }}
            </div>
            <div style="width: 30%; min-width: 0" class="text-left">
              {{ $t("product.fields.name") }}
            </div>
            <div style="width: 10%; min-width: 0" class="text-left">
              {{ $t("product.fields.category") }}
            </div>
            <div style="width: 10%; min-width: 0" class="text-left">
              {{ $t("product.fields.brand") }}
            </div>
            <div style="width: 20%; min-width: 0" class="text-left">
              {{ $t("product.fields.additional_notes") }}
            </div>
            <div style="width: 17%; min-width: 0" class="text-left">
              {{ $t("product.fields.purchase_place") }}
            </div>
            <div style="width: 7%; min-width: 0" class="d-flex justify-end">
              {{ $t("settings.actions") }}
            </div>
          </v-card-text>
        </v-card>
      </template>

      <!-- Fila personalizada -->
      <template v-slot:item="slotProps">
         <tr
          style="display: table; width: 100%;"
          :class="isMobile ? 'mobile-table' : 'desktop-table'"
        >
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
                <!-- Fecha con barra lateral de color - 7% -->
                <div style="width: 6%; min-width: 0" class="d-flex align-left justify-left">
                  <div
                    class="icono-concavo d-flex flex-column justify-center align-center rounded-lg"
                    :class="`bg-${getTypeColor(slotProps.item.nameStatus)}`"
                    style="min-height: 48px; min-width: 48px; padding: 4px; border-radius: 8px;"
                  >
                    <div class="date-display text-center" style="font-size: 0.90em; color: white; font-weight: bold">
                      {{ formatIntuitiveDate(slotProps.item.purchase_date) }}
                    </div>
                  </div>
                </div>

                <!-- Nombre + Cantidad + Precio - 30% -->
                <div style="width: 30%; min-width: 0" class="d-flex align-left">
                <!-- Avatar de la vivienda -->
                  <v-avatar
                    size="48"
                    class="mr-3 icono-concavo"
                    color="grey-lighten-4"
                    style="flex-shrink: 0"
                  >
                    <v-img
                      :src="getImageUrl(slotProps.item.image)"
                      cover
                      class="icono-concavo"
                    />
                  </v-avatar>

                  <!-- Contenedor de texto -->
                  <div class="d-flex flex-column" style="min-width: 0">
                    <div class="font-weight-bold text-body-2 text-truncate">
                      {{ slotProps.item.productName }}
                    </div>
                     <div class="text-body-2 d-flex align-center text-grey-darken-1">
                          {{ slotProps.item.quantity }}
                          <v-tooltip activator="parent" location="bottom" max-width="350px">
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("product.fields.quantity") }}: {{ slotProps.item.quantity }}
                            </span>
                          </v-tooltip>
                        </div>
                  </div>
                </div>

                <!-- Categoría - 10% -->
                <div style="width: 10%; min-width: 0; text-align: left" class="text-body-2 text-truncate">
                  {{ slotProps.item.nameCategory }}
                </div>

                <!-- Marca - 10% -->
                <div style="width: 10%; min-width: 0; text-align: left" class="text-body-2 text-truncate">
                  {{ slotProps.item.brand }}
                </div>

                <!-- Notas adicionales - 15% -->
                <div style="width: 20%; min-width: 0; text-align: left" class="text-body-2 text-truncate">
                  {{ slotProps.item.additional_notes }}
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">
                      {{ slotProps.item.additional_notes }}
                    </span>
                  </v-tooltip>
                </div>

                <!-- Lugar de compra - 13% -->
                <div style="width: 17%; min-width: 0; text-align: left" class="text-body-2 text-truncate">
                  {{ slotProps.item.purchase_place }}
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">
                      {{ slotProps.item.purchase_place }}
                    </span>
                  </v-tooltip>
                </div>

                <!-- Acciones - 7% -->
                <div
                  class="d-flex gap-1"
                  style="width: 7%; justify-content: flex-end; flex-wrap: nowrap"
                >
                   <v-btn
                    size="35"
                    icon
                    variant="text"
                    color="blue-darken-2"
                    @click="moveItem(slotProps.item)"
                    class="flex-shrink-0 mr-1"
                    :title="$t('buttons.moveProduct')"
                  >
                    <v-icon size="20">mdi-arrow-split-horizontal</v-icon>
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </td>
        </tr>
      </template>
    </v-data-table>
    </div>
         </v-card-text>
    </v-card>

  <!-- Crear/Editar Producto -->
 <v-dialog v-model="dialog" max-width="600px">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-3">
      <v-toolbar color="white">
          <span class="text-subtitle-2 ml-4">{{ $t("buttons.moveProduct") }}</span>
        </v-toolbar>
          <!--<h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t("buttons.moveProduct") }}
          </h5>-->
        <v-card-text class="pt-3">
          <!-- Pasos laterales -->
          <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('product.fields.name')"
                    variant="underlined"
                    :rules="validationRules.name"
                    :disabled="true"
                    prepend-inner-icon="">
                    <template v-slot:prepend-inner>
                      <v-avatar
                        size="30"
                        class="mr-2"
                        color="grey-lighten-4"
                      >
                        <v-img
                          :src="getImageUrl(editedItem.image)"
                          cover
                        />
                      </v-avatar>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItem.quantity" :label="$t('product.fields.quantity')"
                    variant="underlined" type="number" :rules="validationRules.quantity" :disabled="true"></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-autocomplete v-model="editedItem.warehouse_id" :items="stores"
                    :label="$t('warehouse.fields.warehouse')" item-title="title" item-value="warehouse_id" variant="underlined" :rules="selectRules">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div class="description-text" v-bind="props" :title="item.raw.description">
                                {{ $t("warehouse.fields.description") }}:
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div class="description-text" v-bind="props" :title="item.raw.location">
                                {{ $t("warehouse.fields.home_location") }}:
                                {{ item.raw.location }}
                              </div>
                            </template>
                            <span>{{ item.raw.location }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.quantity_mov" :label="$t('product.fields.quantity')"
                    variant="underlined" type="number" :rules="quantity_mov"></v-text-field>
                </v-col>
                </v-row>
              </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-grey-darken-1" @click="close()">
                  {{ $t("buttons.close") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="save()" :disabled="!valid">
                  {{
                 $t("buttons.move")
                  }}
                </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!--Almacén-->
  <v-dialog v-model="dialogWarehouse" persistent transition="dialog-bottom-transition"
     :fullscreen="isFullscreen"
    :max-width="isMobile ? '100%' : 'none'">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card :class="isMobile ? 'pa-0' : 'pa-10'">	
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitleWarehouse }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("warehouse.formInstructions") }}
          </p>

          <v-container fluid class="pa-0 mt-6">
            <v-row>
              <!-- Timeline (solo escritorio) -->
              <v-col v-if="isDesktop" cols="12" md="3" class="pr-md-6">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item v-for="(s, index) in stepsW" :key="index" :dot-color="
                    stepW > index
                      ? 'green'
                      : stepW === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  " :icon="
                    stepW >= index
                      ? stepW === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  " size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`warehouse.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`warehouse.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col :cols="12" :md="isMobile ? 12 : 9" :class="{ 'mt-6': isMobile }">
                <!-- En móvil: indicador del paso -->
                <div
                  v-if="isMobile"
                  class="d-flex justify-space-between align-center mb-4"
                >
                  <v-chip
                    label
                    size="small"
                    color="deep-purple-lighten-4"
                    class="text-deep-purple"
                  >
                    {{ $t(`warehouse.steps.${stepsW[stepW].title}.title`) }}
                  </v-chip>
                </div>

                <!-- En escritorio: título del paso -->
                <h3 v-else class="text-deep-purple-accent-3 mb-6">
                  {{ $t(`warehouse.steps.${stepsW[stepW].title}.title`) }}
                </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense>
              <template v-if="stepW === 0">

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItemWarehouse.title"  :label="$t('warehouse.fields.name')"
                    variant="underlined" :rules="nameRules"></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItemWarehouse.location" 
                    :label="$t('warehouse.fields.home_location')" variant="underlined"
                    :rules="locationRules"></v-text-field>
                </v-col>
              </template>
              <!-- Paso 2: Configuración adicional -->
              <template v-if="stepW === 1">
                <v-col cols="12" md="6">
                  <v-select v-model="editedItemWarehouse.status" :items="[
                      { id: 0, label: $t('warehouse.status.public') },
                      { id: 1, label: $t('warehouse.status.private') },
                    ]" item-title="label" item-value="id" :label="$t('warehouse.fields.status')" variant="underlined"
                    :rules="statusRules"></v-select>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItemWarehouse.description" 
                    :label="$t('warehouse.fields.description')" variant="underlined"
                    :rules="descriptionRules"></v-textarea>
                </v-col>
              </template>
              </v-row>

              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="stepW > 0 ? stepW-- : this.closeWarehouse()">
                  {{ stepW === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStepW" :disabled="!valid">
                  {{
                  stepW === stepsW.length - 1
                  ? $t("buttons.saveAndClose")
                  : $t("buttons.next")
                  }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
  <!--</v-container>-->
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
export default {
  props: {
      warehouseData: {
      type: Object,
      default: null,
    },
  },
  emits: ['warehouse-updated'],
  data: () => ({
    selectedTool: 'products',
     isFullscreen: false,
    steps: [
      { title: "basic", subtitle: "basic_information" },
      { title: "purchase", subtitle: "purchase_details" },
      { title: "additional", subtitle: "additional_configuration" },
    ],
    dialogWarehouse: false,
    step: 0,
    stepsW: [
      {
        title: "basic",
        subtitle: "basic_information",
      },
      {
        title: "configuration",
        subtitle: "additional_configuration",
      },
    ],
    stepW: 0,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    loadingProduct: false,
    loadingProductEdit: false,
    dialogImg: false,
    currentImage: '',
    file: null,
    imgMiniatura: "",
    // Datos de prueba: almacenes y productos
    stores: [],
    products: [],
    categories: [],
    status: [],
    home_id: "",
    // Paginación
    currentPage: 1,
    itemsPerPage: 10,
    dialog: false,
    dialogDelete: false,
    isEditing: false,
    editedIndex: -1,
    editedItem: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      quantity_mov: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null, // Imagen
      product_id: null,
    },

    defaultItem: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      quantity_mov: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null, // Imagen
      product_id: null,
    },

    originalItem: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      quantity_mov: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null,
      product_id: null, // Imagen
    },

    editedItemWarehouse: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
    },
    defaultItemWarehouse: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      warehouse_id: "",
      home_id: "",
    },
    originalItemWarehouse: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
    },
    warehouse: [],
    tab: null,
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    dateInput: null,
    dateInput1: null,
     search: "",
      headers: [
        { title: "Fecha", key: "purchase_date" },
        { title: "Imagen", key: "image" },
        { title: "Nombre", key: "productName" },
        { title: "Cantidad", key: "quantity" },
        { title: "Categoría", key: "nameCategory" },
        { title: "Marca", key: "brand" },
        { title: "Notas", key: "additional_notes" },
        { title: "Lugar compra", key: "purchase_place" },
        { title: "Acciones", key: "actions" },
      ],
      warehouseTools: [],
    /*nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    price: [
      (value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],*/
  }),
  computed: {
    isMobile() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm;
    },
    isDesktop() {
      return !this.isMobile;
    },
    quantity_mov() {
    return [
      v => !!v || 'La cantidad es requerida',
      v => (v && v > 0) || 'La cantidad debe ser mayor que 0',
      v => {
        if (!this.editedItem || !this.editedItem.quantity) return true;
        return (v && v <= this.editedItem.quantity) || `La cantidad debe ser menor o igual a ${this.editedItem.quantity}`;
      }
    ];
  },
    validationRules() {
      return {
        name: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.name"),
            }),
          (v) =>
            (v && v.length >= 3) ||
            this.$t("product.validation.min_length", {
              field: this.$t("product.fields.name"),
              length: 3,
            }),
        ],
        unit_price: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.unit_price"),
            }),
          (v) =>
            !isNaN(v) ||
            this.$t("product.validation.invalid_number", {
              field: this.$t("product.fields.unit_price"),
            }),
          (v) =>
            v >= 0 ||
            this.$t("product.validation.min_value", {
              field: this.$t("product.fields.unit_price"),
              value: 0,
            }),
        ],
        quantity: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.quantity"),
            }),
          (v) =>
            !isNaN(v) ||
            this.$t("product.validation.invalid_number", {
              field: this.$t("product.fields.quantity"),
            }),
          (v) =>
            v >= 0 ||
            this.$t("product.validation.min_value", {
              field: this.$t("product.fields.quantity"),
              value: 0,
            }),
        ],
        status_id: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.status"),
            }),
        ],
        category_id: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.category"),
            }),
        ],
        purchase_date: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.purchase_date"),
            }),
        ],
        expiration_date: [
          (v) =>
            !v ||
            v >= this.editedItem.purchase_date ||
            this.$t("product.validation.invalid_date"),
        ],
      };
    },
    priceRules() {
      return this.validationRules.unit_price;
    },
    quantityRules() {
      return this.validationRules.quantity;
    },
    selectRules() {
      return [(v) => !!v || this.$t("product.validation.required")];
    },
     nameRules() {
      return [
        (v) =>
          (v && v.length >= 3) ||
          this.$t("warehouse.validation.min_length", {
            field: this.$t("warehouse.fields.name"),
            length: 3,
          }),
        (v) =>
          (v && v.length <= 50) ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.name"),
            length: 50,
          }),
      ];
    },
    locationRules() {
      return [
        (v) =>
          (v && v.length <= 100) ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.home_location"),
            length: 100,
          }),
      ];
    },
    statusRules() {
      return [
        (v) =>
          (v !== null && v !== undefined) ||
          this.$t("warehouse.validation.required", {
            field: this.$t("warehouse.fields.status"),
          }),
        (v) =>
          [0, 1].includes(v) ||
          this.$t("warehouse.validation.invalid_selection", {
            field: this.$t("warehouse.fields.status"),
          }),
      ];
    },
    descriptionRules() {
      return [
        (v) =>
          !v ||
          v.length <= 255 ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.description"),
            length: 255,
          }),
      ];
    },
    // Obtener el almacén seleccionado
    /*selectedStore() {
      const store = this.warehouseData.find(
        (store) => store.warehouse_id === this.editedItem.warehouse_id
      );
      if (store) {
        this.selectStore(store.warehouse_id);
      }
      return store;
    },*/
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Nuevo Producto" : "Editar Producto";
    },
    formTitleWarehouse() {
      return "Editar Almacén";
    },

    imgedit() {
      return this.imgMiniatura;
    },
    // Calcula automáticamente el precio total
    formattedTotalPrice() {
      return this.editedItem.total_price
        ? parseFloat(this.editedItem.total_price).toFixed(2)
        : "0.00";
    },
  },
  watch: {
    "editedItem.unit_price": {
      handler: "calculateTotalPrice",
      immediate: true,
    },
    "editedItem.quantity_mov": {
      handler: "calculateTotalPrice",
      immediate: true,
    },
    "editedItemWarehouse.warehouse_id"(newVal) {
      if (!this.isEditing) {
        // Si está en modo edición, no ejecutar la lógica del watch
        return;
      }
      const selectedWarehouse = this.warehouses.find((w) => w.id === newVal);
      if (selectedWarehouse) {
        this.editedItemWarehouse.title = selectedWarehouse.title;
        this.editedItemWarehouse.description = selectedWarehouse.description;
        this.editedItemWarehouse.location = selectedWarehouse.location;
      } else {
        this.editedItemWarehouse.title = "";
        this.editedItemWarehouse.description = "";
        this.editedItemWarehouse.location = "";
      }
    },
    dialog(val) {
      if (val) this.updateFullscreenMode();
    },
    isDesktop() {
      this.updateFullscreenMode();
    },
  },
  created() {
    this.tools = [
      {
        name: this.$t("product.listing.addButton"),
        action: () => this.showAddProduct(),
      },
    ];
  },
  mounted() {
    this.home_id = LocalStorageService.getItem("home_id");
    this.showPersonProducts();
    this.selectedTool = "products";
  },
  methods: {    
     updateFullscreenMode() {
      this.$nextTick(() => {
        this.isFullscreen = this.isDesktop;
      });
    },
    async moveItem(item) {
      //this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.warehouse_id = null;
      try {
        const result = await handleRequest({
          endpoint: "productcategory-productstatus-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
           this.stores = (result.data?.productwarehouses || []).filter(
        store => store.id !== this.warehouseData.id
      );
          this.categories = result.data?.productcategories || [];
          this.status = result.data?.productstatus || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.stores = [];
          this.status = [];
          this.showAlert(
            "info",
            result.message || "No hay alamacenes disponibles.",
            3000
          );
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
        this.loadingProduct = false;
      } finally {
        this.dialog = true;
        this.loadingProduct = false;
      }
    },
    getImageUrl(imagePath) {
      return `${this.$axios.defaults.baseURL}images/${imagePath}`;
    },
     openModal() {
      this.dialogImg = true;
      console.log("Diálogo abierto:", this.dialogImg); // Debug
    },
    closeModal() {
      // Pequeño delay para evitar que se cierre al mover el mouse hacia el modal
      setTimeout(() => {
        this.dialogImg = false
      }, 100)
    },
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "error"; // Color por defecto
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
    nextStepW() {
      if (this.stepW < this.stepsW.length - 1) {
        this.stepW++;
      } else {
        this.dialogWarehouse = false;
        this.step = 0;
        this.editDataWarehouse();
      }
    },
    closeWarehouse() {
      this.dialogWarehouse = false;
      this.loading = false;
      this.$nextTick(() => {
        this.editedItemWarehouse = Object.assign({}, this.defaultItemWarehouse);
        this.originalItemWarehouse = Object.assign({}, this.defaultItemWarehouse);
      });
    },
    async editDataWarehouse(){
      const fieldsToUpdate = ["id", "title", "location", "description", "status"];
        let updatedFields = Object.keys(this.editedItemWarehouse)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItemWarehouse[key] !== this.originalItemWarehouse[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItemWarehouse[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItemWarehouse.id;
          this.loading = true;
          try {
            const result = await handleRequest({
              endpoint: "person-warehouse",
              method: "PUT",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              //this.initialize();
             this.$emit('warehouse-updated', result.data.personWarehouse);
 
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
        }
    },
    async editWarehouse() {
      console.log("editWarehouse", this.warehouseData);
      this.stepW = 0;
      // Asigna los datos del almacén al objeto de edición
      this.editedItemWarehouse = {
        ...this.warehouseData
      };
    
      this.originalItemWarehouse = { ...this.warehouseData };
      this.data = {};
      this.data.home_id = this.home_id;
      this.editedItemWarehouse.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "person-warehouse-home-select",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          //this.warehouses = result.data?.warehouses || [];
          this.warehouses =
            result.data?.warehouses || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.warehouses = [];
          this.showAlert(
            "info",
            result.message || "No hay alamacenes disponibles.",
            3000
          );
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
      } finally {
        this.dialogWarehouse = true;
      }
      this.isEditing = false;
    },
    calculateTotalPrice() {
      this.editedItem.total_price = (
        this.editedItem.unit_price * this.editedItem.quantity_mov
      ).toFixed(2);
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
    updateDate(value) {
      // value viene como objeto Date desde el date-picker
      // Convertimos a formato YYYY-MM-DD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItem.purchase_date = this.dateInput;
      this.menu = false;
    },
    updateDate1(value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.dateInput1 = `${year}-${month}-${day}`;
      this.editedItem.expiration_date = this.dateInput1;
      this.menu2 = false;
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
    async showPersonProducts() {
      this.products = [];
      this.data = {};
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.home_id;
      this.data.warehouse_id = this.warehouseData.warehouse_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-home-warehouse-products",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.products = result.data?.products || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.products = [];
          //this.showAlert('success', 'No hay productos disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
      } finally {
        this.loading = false;
      }
    },
    obtenerFechaLocal() {
      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = String(hoy.getMonth() + 1).padStart(2, "0");
      const day = String(hoy.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    async showAddProduct() {
      this.loadingProduct = true;
      this.data = {};
      this.editedIndex = -1;
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.editedItem.home_id;
      this.dateInput = this.obtenerFechaLocal();
      this.dateInput1 = null;
      this.editedItem.purchase_date = this.dateInput;
      try {
        const result = await handleRequest({
          endpoint: "productcategory-productstatus-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.productcategories || [];
          this.status = result.data?.productstatus || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.showAlert(
            "info",
            result.message || "No hay alamacenes disponibles.",
            3000
          );
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
        this.loadingProduct = false;
      } finally {
        this.dialog = true;
        this.loadingProduct = false;
      }
    },
    close() {
      this.dialog = false;
      this.loading = false;
      this.loadingProduct = false;
      this.loadingProductEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
    },

    async save() {
      this.valid = false;
        const fieldsToUpdate = [
          "id",
          "warehouse_id",
          "product_id",
          "unit_price",
          "quantity",
          "quantity_mov",
          "total_price",
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
              endpoint: "warehouse-product-move",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.showPersonProducts();
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
            this.loadingProduct = false;
            this.editedIndex = -1;
          }
        } 
        else {
          this.loadingProductEdit = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      /*if (this.editedIndex === -1) {
        this.loadingProduct = true;
        this.valid = false;
        const fieldsToUpdate = [
          "id",
          "home_id",
          "warehouse_id",
          "product_id",
          "status_id",
          "category_id",
          "name",
          "unit_price",
          "quantity",
          "total_price",
          "purchase_date",
          "purchase_place",
          "expiration_date",
          "brand",
          "additional_notes",
          "maintenance_date",
          "due_date",
          "frequency",
          "type",
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
          updatedFields.home_id = this.editedItem.home_id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "person-home-warehouse-product",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.showPersonProducts();
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
            this.loadingProduct = false;
            this.editedIndex = -1;
          }
        } else {
          this.loadingProduct = false;
          this.showAlert("success", "Debe completar los datos de producto.", 3000);
        }
      } else {
        this.loadingProductEdit = true;
        this.valid = false;
        const fieldsToUpdate = [
          "id",
          "home_id",
          "warehouse_id",
          "product_id",
          "status_id",
          "category_id",
          "name",
          "unit_price",
          "quantity",
          "total_price",
          "purchase_date",
          "purchase_place",
          "expiration_date",
          "brand",
          "additional_notes",
          "maintenance_date",
          "due_date",
          "frequency",
          "type",
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
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }
          try {
            const result = await handleRequest({
              endpoint: "person-home-warehouse-product-update",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.showPersonProducts();
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loadingProductEdit = false;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loadingProductEdit = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }*/
      this.close();
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
.fullscreen-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}
.desktop-table {
  table-layout: fixed;
}

.mobile-table {
  table-layout: auto;
}
.responsive-data-table-wrapper {
  width: 100%;
}

/* Solo en móvil: activar scroll horizontal */
.responsive-data-table-wrapper.mobile-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* En móvil: forzar ancho mínimo para que haya algo que scrollear */
.responsive-data-table-wrapper.mobile-scroll :deep(.v-data-table) {
  min-width: 800px;
}

/* En desktop: asegurar que no haya scroll innecesario */
@media (min-width: 960px) {
  .responsive-data-table-wrapper :deep(.v-data-table) {
    min-width: auto;
    overflow-x: hidden;
  }
}

.tools-bar {
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}
.date-display {
  font-size: 0.85rem; /* Equivale a text-caption */
  line-height: 1.1;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
   margin: 0;
  padding: 0;
}
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
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
.img-concava {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra el espacio */
  border-radius: 8px; /* Para que coincida con el contenedor */
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
