<!-- src/components/MealRecipesSection.vue -->
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

      <v-data-table
        :headers="headers"
        :items="modelValue"
        :search="search"
        :items-per-page-text="$t('dataTable.itemsPerPageText')"
        :no-data-text="$t('meal_recipe.listing.noData')"
        :loading-text="$t('dataTable.loadingText')"
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
                {{ $t("recipe.fields.name") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("meal_recipe.fields.servings") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("recipe.fields.calories") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("recipe.fields.protein") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("recipe.fields.carbs") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-left">
                {{ $t("settings.actions") }}
              </div>
            </v-card-text>
          </v-card>
        </template>

        <!-- Fila personalizada -->
        <template v-slot:item="{ item }">
          <v-card class="mb-2 mx-1 rounded-lg" elevation="1" flat>
            <v-card-text class="d-flex align-center pa-2" style="width: 100%">
              <!-- Nombre + imagen -->
              <div style="width: 25%" class="d-flex align-center">
                <v-avatar size="36" class="mr-2" color="grey-lighten-4">
                  <v-img :src="getImageUrl(item.image)" cover />
                </v-avatar>
                <span class="text-body-2">{{ item.name }}</span>
              </div>

              <!-- Raciones -->
              <div style="width: 15%" class="text-body-2">
                {{ item.servings }} {{ $t("meal_recipe.fields.servings_unit") }}
                <v-tooltip activator="parent" location="bottom">
                  {{ $t('meal_recipe.fields.servings') }}: {{ item.servings }}
                </v-tooltip>
              </div>

              <!-- Calorías -->
              <div style="width: 15%" class="text-body-2">
                {{ item.calories ? item.calories + ' kcal' : '—' }}
              </div>

              <!-- Proteína -->
              <div style="width: 15%" class="text-body-2">
                {{ item.protein ? item.protein + 'g' : '—' }}
              </div>

              <!-- Carbohidratos -->
              <div style="width: 15%" class="text-body-2">
                {{ item.carbs ? item.carbs + 'g' : '—' }}
              </div>

              <!-- Acciones -->
              <div style="width: 15%" class="d-flex justify-end gap-1">
                <v-btn
                  size="35"
                  icon
                  variant="text"
                  color="blue"
                  @click="editRecipe(item)"
                  :title="$t('buttons.edit')"
                >
                  <v-icon size="20">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  size="35"
                  icon
                  variant="text"
                  color="red"
                  @click="deleteRecipe(item)"
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

    <!-- Diálogo con pasos -->
    <v-dialog
      v-model="dialog"
      style="width: 1000px;"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-form ref="form" v-model="valid" class="h-100">
        <v-card class="pa-10">
          <v-card-text class="pt-12">
            <h5 class="text-grey-darken-2 font-weight-medium">
              {{ $t(`meal_recipe.formTitle.${editIndex === -1 ? 'create' : 'edit'}`) }}
            </h5>
            <p class="text-grey-lighten-1">{{ $t("meal_recipe.formInstructions") }}</p>

            <v-row class="mt-12">
              <!-- Pasos laterales -->
              <v-col cols="4">
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
                        <strong>{{ $t(`meal_recipe.steps.${step.key}.title`) }}</strong>
                        <div class="text-caption text-grey">
                          {{ $t(`meal_recipe.steps.${step.key}.subtitle`) }}
                        </div>
                      </div>
                    </template>
                  </v-timeline-item>
                </v-timeline>
              </v-col>

              <!-- Contenido dinámico -->
              <v-col cols="8">
                <h3 class="text-deep-purple-accent-3 mb-8">
                  {{ $t(`meal_recipe.steps.${steps[currentStep].key}.title`) }}
                </h3>

                <!-- Paso 1: Selección de receta -->
                <v-row dense v-if="currentStep === 0">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="selectedRecipe"
                      :items="recipes"
                      :label="$t('meal_recipe.fields.recipe_id')"
                      item-title="name"
                      item-value="id"
                      variant="underlined"
                      :rules="selectRules"
                      prepend-inner-icon="mdi-food"
                      return-object
                      no-filter
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
                      v-model.number="servings"
                      :label="$t('meal_recipe.fields.servings')"
                      type="number"
                      step="1"
                      min="1"
                      variant="underlined"
                      :rules="servingsRules"
                    ></v-text-field>
                  </v-col>
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

export default defineComponent({
  name: "MealRecipesSection",
  props: {
    modelValue: { type: Array, required: true, default: () => [] },
    recipes: { type: Array, required: true, default: () => [] }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      search: "",
      dialog: false,
      valid: false,
      currentStep: 0,
      steps: [
        { key: "basic", title: "Receta y raciones", subtitle: "Elija una receta y la cantidad consumida" }
      ],
      editIndex: -1,
      selectedRecipe: null,
      servings: 1.0,
      headers: [
        { title: this.$t("recipe.fields.name"), key: "name" },
        { title: this.$t("meal_recipe.fields.servings"), key: "servings" },
        { title: this.$t("recipe.fields.calories"), key: "calories" },
        { title: this.$t("recipe.fields.protein"), key: "protein" },
        { title: this.$t("recipe.fields.carbs"), key: "carbs" },
        { title: this.$t("settings.actions"), key: "actions" }
      ],
      tools: [
        {
          name: this.$t("meal_recipe.listing.addButton"),
          action: () => this.openRecipeDialog(),
          disabled: false
        }
      ],
      selectRules: [
        (v) => !!v || this.$t("meal_recipe.validation.required", { field: this.$t("meal_recipe.fields.recipe_id") })
      ],
      servingsRules: [
        (v) => (v != null && v > 0) || this.$t("meal_recipe.validation.invalid_servings")
      ]
    };
  },
  computed: {
    isStepValid() {
      return this.currentStep === 0 ? !!this.selectedRecipe && this.servings > 0 : true;
    }
  },
  methods: {
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
        this.saveRecipe();
      }
    },
    openRecipeDialog(item = null) {
      this.currentStep = 0;
      this.editIndex = -1;
      this.selectedRecipe = null;
      this.servings = 1.0;

      if (item) {
        this.editIndex = this.modelValue.findIndex(r => r.recipe_id === item.recipe_id);
        // Buscamos la receta completa en el array de recetas disponibles
        this.selectedRecipe = this.recipes.find(r => r.id === item.recipe_id) || null;
        this.servings = item.servings || 1.0;
      }

      this.dialog = true;
    },
    saveRecipe() {
      if (!this.selectedRecipe) return;

      const newEntry = {
        ...(this.editIndex !== -1 && { recipe_id: this.modelValue[this.editIndex].recipe_id }),
        recipe_id: this.selectedRecipe.id,
        servings: this.servings,
        // ✅ Guardamos todos los datos necesarios para mostrar en la tabla
        name: this.selectedRecipe.name,
        image: this.selectedRecipe.image,
        calories: this.selectedRecipe.calories,
        protein: this.selectedRecipe.protein,
      };

      const updated = [...this.modelValue];
      if (this.editIndex === -1) {
        updated.push(newEntry);
      } else {
        updated.splice(this.editIndex, 1, newEntry);
      }

      this.$emit("update:modelValue", updated);
      this.dialog = false;
    },
    editRecipe(item) {
      this.openRecipeDialog(item);
    },
    deleteRecipe(item) {
      const index = this.modelValue.findIndex(r => r.recipe_id === item.recipe_id);
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