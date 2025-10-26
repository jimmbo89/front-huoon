<!-- src/components/RecipeProductsSection.vue -->
<template>
  <v-card elevation="3" class="mx-2">
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
            clearable
          ></v-text-field>
        </div>
      </v-card-title>
      <div
      class="ma-0 pa-0 responsive-data-table-wrapper"
      :class="{ 'mobile-scroll': $vuetify.display.xs || $vuetify.display.sm }"
    >
      <v-data-table
        :headers="headers"
        :items="modelValue"
        :search="search"
        :items-per-page-text="$t('dataTable.itemsPerPageText')"
        :no-data-text="$t('recipe_product.listing.noData')"
        :loading-text="$t('dataTable.loadingText')"
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
        <!-- Encabezado personalizado -->
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
              <div style="width: 25%; min-width: 0" class="text-left">
                {{ $t("product.fields.name") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("recipe_product.fields.quantity_in_recipe") }}
              </div>
              <div style="width: 12%; min-width: 0" class="text-left">
                {{ $t("recipe_product.fields.calories_per_unit") }}
              </div>
              <div style="width: 12%; min-width: 0" class="text-left">
                {{ $t("recipe_product.fields.protein_per_unit") }}
              </div>
              <div style="width: 12%; min-width: 0" class="text-left">
                {{ $t("recipe_product.fields.carbs_per_unit") }}
              </div>
              <div style="width: 12%; min-width: 0" class="text-left">
                {{ $t("recipe_product.fields.fats_per_unit") }}
              </div>
              <div style="width: 12%; min-width: 0" class="text-left">
                {{ $t("settings.actions") }}
              </div>
            </v-card-text>
          </v-card>
        </template>

        <!-- Fila personalizada -->
        <template v-slot:item="{ item }">
        <tr
          style="display: table; width: 100%;"
          :class="$vuetify.display.xs || $vuetify.display.sm ? 'mobile-table' : 'desktop-table'"
        >
          <td colspan="100%" style="padding: 0; border: none">
          <v-card class="mb-2 mx-1 rounded-lg" elevation="1" flat>
            <v-card-text class="d-flex align-center pa-2" style="width: 100%">
              <!-- Nombre + imagen -->
              <div style="width: 25%" class="d-flex align-center">
                <v-avatar size="36" class="mr-2" color="grey-lighten-4">
                  <v-img :src="getImageUrl(item.image)" cover />
                </v-avatar>
                <span class="text-body-2">{{ item.name }}</span>
              </div>

              <!-- Cantidad en receta -->
              <div style="width: 15%" class="text-body-2">
                {{ item.quantity }} {{ item.unit }}
                <v-tooltip activator="parent" location="bottom">
                  {{ $t('recipe_product.fields.quantity_in_recipe') }}: {{ item.quantity }} {{ item.unit }}
                </v-tooltip>
              </div>

              <!-- Calorías por unidad -->
              <div style="width: 12%" class="text-body-2">
                {{ item.calories_per_unit ? item.calories_per_unit + ' kcal' : '—' }}
              </div>

              <!-- Proteína por unidad -->
              <div style="width: 12%" class="text-body-2">
                {{ item.protein_per_unit ? item.protein_per_unit + 'g' : '—' }}
              </div>

              <!-- Carbohidratos por unidad -->
              <div style="width: 12%" class="text-body-2">
                {{ item.carbs_per_unit ? item.carbs_per_unit + 'g' : '—' }}
              </div>

              <!-- Grasas por unidad -->
              <div style="width: 12%" class="text-body-2">
                {{ item.fats_per_unit ? item.fats_per_unit + 'g' : '—' }}
              </div>

              <!-- Acciones -->
              <div style="width: 12%" class="d-flex justify-end gap-1">
                <v-btn
                  size="35"
                  icon
                  variant="text"
                  color="blue"
                  @click="editProduct(item)"
                  :title="$t('buttons.edit')"
                >
                  <v-icon size="20">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  size="35"
                  icon
                  variant="text"
                  color="red"
                  @click="deleteProduct(item)"
                  :title="$t('buttons.delete')"
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
      </div>
    </v-card-text>

    <!-- ✅ Diálogo NUEVO: fullscreen con pasos -->
    <v-dialog
      v-model="dialog"
      :width="$vuetify.display.xs ? '100%' : '50%'"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-form ref="form" v-model="valid" class="h-100">
        <v-card :class="$vuetify.display.xs ? 'pa-4' : 'pa-10'">
          <v-card-text class="pt-12">
            <h5 class="text-grey-darken-2 font-weight-medium">
              {{ $t(`recipe_product.formTitle.${editIndex === -1 ? 'create' : 'edit'}`) }}
            </h5>
            <p class="text-grey-lighten-1">{{ $t("recipe_product.formInstructions") }}</p>

            <v-row class="mt-6">
            <!-- Timeline: solo visible en md+ -->
            <v-col cols="12" md="4" class="d-none d-md-block">
                <v-timeline align="start" side="end" dense>
                  <v-timeline-item
                    v-for="(step, index) in steps"
                    :key="index"
                    :dot-color="getStepColor(index)"
                    :icon="getStepIcon(index)"
                    size="large"
                  >
                    <template #opposite>
                      <div class="text-end">
                        <strong>{{ $t(`recipe_product.steps.${step.key}.title`) }}</strong>
                        <div class="text-caption text-grey">
                          {{ $t(`recipe_product.steps.${step.key}.subtitle`) }}
                        </div>
                      </div>
                    </template>
                  </v-timeline-item>
                </v-timeline>
              </v-col>

              <!-- Contenido dinámico -->
             <v-col :cols="12" :md="8" :class="{ 'mt-6': $vuetify.display.xs || $vuetify.display.sm }" >
              <!-- En móvil: mostrar indicador de paso -->
              <div
                v-if="$vuetify.display.xs || $vuetify.display.sm"
                class="d-flex justify-space-between align-center mb-4"
              >
                <v-chip
                  label
                  size="small"
                  color="deep-purple-lighten-4"
                  class="text-deep-purple"
                >
                  {{ $t(`recipe_product.steps.${steps[currentStep].key}.title`) }}
                </v-chip>
              </div>

              <!-- Título del paso (solo en desktop) -->
              <h3 v-else class="text-deep-purple-accent-3 mb-6">
                {{ $t(`recipe_product.steps.${steps[currentStep].key}.title`) }}
              </h3>
              <v-row dense>

                <!-- Paso 1: Selección de producto -->
                <template v-if="currentStep === 0">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="selectedProduct"
                      :items="products"
                      :label="$t('recipe_product.fields.product_id')"
                      item-title="name"
                      item-value="id"
                      variant="underlined"
                      :rules="selectRules"
                      prepend-inner-icon="mdi-food"
                      return-object
                      no-filter
                      clearable
                    >
                      <template #item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :prepend-avatar="getImageUrl(item.raw.image)"
                          :title="item.raw.name"
                        />
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="quantity"
                      :label="$t('recipe_product.fields.quantity_in_recipe')"
                      type="number"
                      step="0.001"
                      variant="underlined"
                      :rules="numberRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="unit"
                      :label="$t('recipe_product.fields.unit')"
                      variant="underlined"
                      :rules="textRules"
                    ></v-text-field>
                  </v-col>
                </template>

                <!-- Paso 3: Nutrición por unidad -->
                <template v-if="currentStep === 1 && selectedProduct">
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="calories_per_unit"
                      :label="$t('recipe_product.fields.calories_per_unit') + ' (kcal)'"
                      type="number"
                      step="0.01"
                      variant="underlined"
                      :rules="nutrientRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="protein_per_unit"
                      :label="$t('recipe_product.fields.protein_per_unit') + ' (g)'"
                      type="number"
                      step="0.01"
                      variant="underlined"
                      :rules="nutrientRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="carbs_per_unit"
                      :label="$t('recipe_product.fields.carbs_per_unit') + ' (g)'"
                      type="number"
                      step="0.01"
                      variant="underlined"
                      :rules="nutrientRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="fats_per_unit"
                      :label="$t('recipe_product.fields.fats_per_unit') + ' (g)'"
                      type="number"
                      step="0.01"
                      variant="underlined"
                      :rules="nutrientRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="fiber_per_unit"
                      :label="$t('recipe_product.fields.fiber_per_unit') + ' (g)'"
                      type="number"
                      step="0.01"
                      variant="underlined"
                      :rules="nutrientRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="sugar_per_unit"
                      :label="$t('recipe_product.fields.sugar_per_unit') + ' (g)'"
                      type="number"
                      step="0.01"
                      variant="underlined"
                      :rules="nutrientRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="saturated_fats_per_unit"
                      :label="$t('recipe_product.fields.saturated_fats_per_unit') + ' (g)'"
                      type="number"
                      step="0.01"
                      variant="underlined"
                      :rules="nutrientRules"
                    ></v-text-field>
                  </v-col>
                </template>

                </v-row>

                <!-- Navegación -->
                <div class="d-flex justify-space-between mt-8">
                  <v-btn
                    variant="text"
                    class="text-grey-darken-1"
                    @click="goBack"
                  >
                    {{ currentStep === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                  </v-btn>
                  <v-btn
                    variant="text"
                    class="text-deep-purple-accent-3"
                    @click="goNext"
                    :disabled="!isStepValid"
                  >
                    {{
                      currentStep === steps.length - 1
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
  </v-card>
</template>

<script>
import { defineComponent } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";

export default defineComponent({
  name: "RecipeProductsSection",
  props: {
    modelValue: { type: Array, required: true, default: () => [] },
    selectedPerson: { type: Object, required: true }
  },
  created() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.tools = [
      {
        name: this.$t("recipe_product.listing.addButton"),
        action: () => this.openProductDialog()
      }
    ];
  },
  emits: ["update:modelValue"],
  data() {
    return {
      search: "",
      home_id: "",
      dialog: false,
      valid: false,
      // ✅ Nuevos datos para pasos
      currentStep: 0,
      steps: [
        { key: "basic", title: "Producto y cantidad", subtitle: "Seleccione un producto..." },
        { key: "nutrition", title: "Nutrición", subtitle: "Valores nutricionales por unidad" }
      ],
      // ... resto de datos existentes (selectedProduct, quantity, etc.)
      editIndex: -1,
      selectedProduct: null,
      quantity: 0,
      unit: "g",
      calories_per_unit: null,
      protein_per_unit: null,
      carbs_per_unit: null,
      fats_per_unit: null,
      fiber_per_unit: null,
      sugar_per_unit: null,
      saturated_fats_per_unit: null,
      products: [],
      headers: [
        { title: this.$t("product.fields.name"), key: "name" },
        { title: this.$t("recipe_product.fields.quantity_in_recipe"), key: "quantity" },
        { title: this.$t("recipe_product.fields.calories_per_unit"), key: "calories" },
        { title: this.$t("recipe_product.fields.protein_per_unit"), key: "protein" },
        { title: this.$t("recipe_product.fields.carbs_per_unit"), key: "carbs" },
        { title: this.$t("recipe_product.fields.fats_per_unit"), key: "fats" },
        { title: this.$t("settings.actions"), key: "actions" }
      ],
      selectRules: [(v) => !!v || this.$t("validation.required", { field: this.$t("recipe_product.fields.product_id") })],
      numberRules: [(v) => v > 0 || this.$t("recipe_product.validation.invalid_quantity")],
      textRules: [(v) => !!v || this.$t("validation.required", { field: this.$t("recipe_product.fields.unit") })],
      nutrientRules: [(v) => v === null || v === '' || v >= 0 || this.$t("recipe_product.validation.invalid_nutrient")]
    };
  },
  computed: {
    isStepValid() {
      if (this.currentStep === 0) return !!this.selectedProduct;
      if (this.currentStep === 1) return this.quantity > 0 && this.unit;
      return true; // Paso 2: nutrientes son opcionales
    }
  },
  methods: {
    // ✅ Nuevos métodos de navegación
    getStepColor(index) {
      if (this.currentStep > index) return "green";
      if (this.currentStep === index) return "deep-purple";
      return "grey-lighten-1";
    },
    getStepIcon(index) {
      if (this.currentStep > index) return "mdi-check";
      if (this.currentStep === index) return `mdi-numeric-${index + 1}`;
      return null;
    },
    goBack() {
      if (this.currentStep === 0) {
        this.dialog = false;
      } else {
        this.currentStep--;
      }
    },
    goNext() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      } else {
        this.saveProduct();
      }
    },

    // ✅ Métodos existentes (ajustados)
    async openProductDialog(item = null) {
      // Reiniciar estado
      this.currentStep = 0;
      this.editIndex = -1;
      this.selectedProduct = null;
      this.quantity = 0;
      this.unit = "g";
      this.calories_per_unit = null;
      this.protein_per_unit = null;
      this.carbs_per_unit = null;
      this.fats_per_unit = null;
      this.fiber_per_unit = null;
      this.sugar_per_unit = null;
      this.saturated_fats_per_unit = null;

      // Cargar datos si es edición
      if (item) {
        this.editIndex = this.modelValue.findIndex(p => p.recipe_product_id === item.recipe_product_id);
        this.selectedProduct = { id: item.product_id, name: item.name, image: item.image };
        this.quantity = parseFloat(item.quantity) || 0;
        this.unit = item.unit || 'g';

        // Nutrientes: asegúrate de parsear o dejar null si no existen
        this.calories_per_unit = item.calories_per_unit != null ? parseFloat(item.calories_per_unit) : null;
        this.protein_per_unit = item.protein_per_unit != null ? parseFloat(item.protein_per_unit) : null;
        this.carbs_per_unit = item.carbs_per_unit != null ? parseFloat(item.carbs_per_unit) : null;
        this.fats_per_unit = item.fats_per_unit != null ? parseFloat(item.fats_per_unit) : null;
        this.fiber_per_unit = item.fiber_per_unit != null ? parseFloat(item.fiber_per_unit) : null;
        this.sugar_per_unit = item.sugar_per_unit != null ? parseFloat(item.sugar_per_unit) : null;
        this.saturated_fats_per_unit = item.saturated_fats_per_unit != null ? parseFloat(item.saturated_fats_per_unit) : null;
      }

      // Cargar productos disponibles
      this.data = { home_id: this.home_id, person_id: this.selectedPerson.id };
      try {
        const result = await handleRequest({ endpoint: "available-products", method: "POST", data: this.data });
        this.products = result.success ? result.data?.products || [] : [];
      } catch (error) {
        this.products = [];
      } finally {
        this.dialog = true;
      }
    },
    closeDialog() {
      this.dialog = false;
    },
    saveProduct() {
      if (!this.selectedProduct) return;

      const newProduct = {
        ...(this.editIndex !== -1 && { recipe_product_id: this.modelValue[this.editIndex].recipe_product_id }),
        product_id: this.selectedProduct.id,
        person_id: this.selectedPerson.id,
        name: this.selectedProduct.name,
        image: this.selectedProduct.image,
        quantity: this.quantity,
        unit: this.unit,
        calories_per_unit : this.calories_per_unit,
        protein_per_unit: this.protein_per_unit,
        carbs_per_unit: this.carbs_per_unit,
        fats_per_unit: this.fats_per_unit,
        fiber_per_unit: this.fiber_per_unit,
        sugar_per_unit: this.sugar_per_unit,
        saturated_fats_per_unit: this.saturated_fats_per_unit
      };

      const updatedProducts = [...this.modelValue];
      if (this.editIndex === -1) {
        updatedProducts.push(newProduct);
      } else {
        updatedProducts.splice(this.editIndex, 1, newProduct);
      }

      this.$emit("update:modelValue", updatedProducts);
      this.dialog = false;
    },
    editProduct(item) {
      this.openProductDialog(item);
    },
    deleteProduct(item) {
      const index = this.modelValue.findIndex(p => p.recipe_product_id === item.recipe_product_id);
      if (index !== -1) {
        const updated = [...this.modelValue];
        updated.splice(index, 1);
        this.$emit("update:modelValue", updated);
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) return "/images/default.jpg";
      return `${this.$axios.defaults.baseURL}images/${imagePath}?t=${Date.now()}`;
    }
  }
});
</script>
<style scoped>
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

</style>