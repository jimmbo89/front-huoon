
<template>
  <!-- Snackbar -->
  <v-snackbar
    class="mt-12"
    location="right top"
    :timeout="sb_timeout"
    :color="sb_type"
    elevation="24"
    multi-line
    vertical
    v-model="snackbar"
  >
    <v-row>
      <v-col cols="2" class="d-flex justify-center align-center">
        <v-avatar :icon="sb_icon" :color="sb_type" size="40"></v-avatar>
      </v-col>
      <v-col cols="10">
        <h4>{{ sb_title }}</h4>
        {{ sb_message }}
      </v-col>
    </v-row>
  </v-snackbar>

  <!-- Diálogo principal -->
  <v-dialog
    v-model="dialog"
    :fullscreen="isFullscreen"
    :max-width="isMobile ? 'none' : '100%'"
    persistent
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card :class="isMobile ? 'pa-0' : 'pa-10'">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`recipe.formTitle.${isEditing ? "edit" : "create"}`) }}
          </h5>
          <p class="text-grey-lighten-1">
            {{ $t("recipe.formInstructions") }}
          </p>

          <v-container fluid class="pa-0 mt-6">
            <v-row>
              <!-- Timeline (solo escritorio) -->
              <v-col
                v-if="isDesktop"
                cols="12"
                md="3"
                class="pr-md-6"
              >
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

              <!-- Contenido del formulario -->
              <v-col
                :cols="12"
                :md="isMobile ? 12 : 9"
                :class="{ 'mt-6': isMobile }"
              >
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
                    {{ $t(`recipe.steps.${steps[step].key}.title`) }}
                  </v-chip>
                </div>

                <!-- En escritorio: título del paso -->
                <h3 v-else class="text-deep-purple-accent-3 mb-6">
                  {{ $t(`recipe.steps.${steps[step].key}.title`) }}
                </h3>

                <v-row dense>
                  <!-- Paso 0: información básica -->
                  <template v-if="step === 0">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.name"
                        :label="$t('recipe.fields.name')"
                        variant="underlined"
                        :rules="[
                          (v) =>
                            !!v ||
                            $t('recipe.validation.required', {
                              field: $t('recipe.fields.name'),
                            }),
                        ]"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="editedItem.preparation_time"
                        :label="$t('recipe.fields.preparation_time')"
                        type="number"
                        variant="underlined"
                        :rules="[(v) => v > 0 || 'Debe ser un valor mayor a 0']"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="editedItem.servings"
                        :label="$t('recipe.fields.servings')"
                        type="number"
                        variant="underlined"
                        :rules="[(v) => v >= 1 || $t('recipe.validation.min_servings')]"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <div
                        class="d-flex align-center gap-6"
                        style="flex-wrap: nowrap;"
                      >
                        <v-switch
                          v-model="editedItem.is_favorite"
                          :base-color="favoriteSwitchColor"
                          :color="favoriteSwitchColor"
                          hide-details
                          inset
                          class="mb-0"
                        >
                          <template #label>
                            <span
                              class="text-body-2 font-weight-medium"
                              :style="{ color: favoriteSwitchColor }"
                            >
                              {{ $t("recipe.fields.is_favorite") }}
                            </span>
                          </template>
                        </v-switch>

                        <v-switch
                          v-model="editedItem.is_private"
                          :base-color="privateSwitchColor"
                          :color="privateSwitchColor"
                          hide-details
                          inset
                          class="mb-0 ml-2"
                        >
                          <template #label>
                            <span
                              class="text-body-2 font-weight-medium"
                              :style="{ color: privateSwitchColor }"
                            >
                              {{ $t("recipe.fields.is_private") }}
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
                      />
                    </v-col>

                    <!-- Imagen -->
                    <v-col cols="12" md="6">
                      <v-file-input
                        clearable
                        v-model="file"
                        ref="fileInput"
                        :label="$t('recipe.fields.image')"
                        variant="underlined"
                        :prepend-icon="null"
                        density="compact"
                        name="file"
                        accept=".png, .jpg, .jpeg"
                        @change="onFileSelected"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card
                        elevation="6"
                        class="mx-auto"
                        max-width="210"
                        max-height="120"
                      >
                        <img
                          v-if="imagenDisponible()"
                          :src="imgedit"
                          height="120"
                          width="210"
                          style="object-fit: cover"
                        />
                      </v-card>
                    </v-col>
                  </template>

                  <!-- Paso 1: ingredientes -->
                  <template v-if="step === 1">
                    <v-col cols="12">
                      <RecipeProductsSection
                        v-model="editedItem.products"
                        :selected-person="selectedPerson"
                      />
                    </v-col>
                  </template>
                </v-row>

                <!-- Botones de navegación -->
                <div class="d-flex justify-space-between mt-8">
                  <v-btn
                    variant="text"
                    class="text-grey-darken-1"
                    @click="step > 0 ? step-- : close()"
                  >
                    {{
                      step === 0 ? $t("buttons.close") : $t("buttons.previous")
                    }}
                  </v-btn>

                  <v-btn
                    variant="text"
                    class="text-deep-purple-accent-3"
                    @click="nextStep"
                    :disabled="!valid"
                    :loading="loading && step === steps.length - 1"
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
          </v-container>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>


<script>
import { handleRequest } from "@/utils/api";
import RecipeProductsSection from "./RecipeProductsSection.vue";

export default {
  name: "RecipeFormDialog",
  components: { RecipeProductsSection },
  props: {
    modelValue: { type: Boolean, required: true },
    item: { type: Object, default: () => null },
    selectedPerson: { type: Object, required: true },
  },
  emits: ["update:modelValue", "close", "saved"],
  data() {
    return {
      dialog: false,
      isFullscreen: false,
      valid: true,
      loading: false,
      step: 0,
      file: null,
      imgMiniatura: "",
      snackbar: false,
      sb_type: "",
      sb_message: "",
      sb_timeout: 2000,
      sb_title: "",
      sb_icon: "",
      steps: [
        {
          key: "basic_info",
          title: "Información básica",
          subtitle: "Nombre, descripción, tiempo...",
        },
        { key: "ingredients", title: "Ingredientes", subtitle: "Lista de productos" },
      ],
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
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        sugar: 0,
        saturated_fats: 0,
        products: [],
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
        products: [],
      },
    };
  },
  computed: {
    isMobile() {
    return this.$vuetify.display.xs || this.$vuetify.display.sm;
  },
  isDesktop() {
    return !this.isMobile;
  },
    isEditing() {
      return this.item && this.item.id != null;
    },
    imgedit() {
      return this.imgMiniatura;
    },
   favoriteSwitchColor() {
      return this.editedItem.is_favorite ? "#FFB300" : "#9E9E9E";
    },
    privateSwitchColor() {
      return this.editedItem.is_private ? "#546E7A" : "#9E9E9E";
    }
  },
  watch: {
    modelValue(val) {
      this.dialog = val;
      if (val) this.resetForm();
    },
    dialog(val) {
      if (val) this.updateFullscreenMode();
      this.$emit("update:modelValue", val);
      if (!val) this.$emit("close");
    },
    isDesktop() {
      this.updateFullscreenMode();
    },
  },
  methods: {
    updateFullscreenMode() {
      this.$nextTick(() => {
        this.isFullscreen = this.isDesktop;
      });
    },
    resetForm() {
      this.step = 0;
      this.file = null;
      if (this.isEditing) {
        this.originalItem = Object.assign({}, this.item);
        this.editedItem = Object.assign({}, this.item);
        // Previsualizar imagen existente
        //this.imgMiniatura = this.getImageUrl(this.item.image);
        this.file = null;
        // Crear la imagen y configurar el src
        const img = new Image();
        img.src = `${this.$axios.defaults.baseURL}images/${this.item.image}`; // Se asume que item.image_url es la URL de la imagen

        // Usar una función asíncrona para manejar la carga de la imagen
        img.onload = async () => {
          try {
            // Asignar la imagen cargada a imgMiniatura
            this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${this.item.image}`;
          } catch (error) {
            this.showAlert("error", "Error al cargar la imagen.", 3000);
          }
        };
      } else {
        this.editedItem = {
          id: null,
          person_id: this.selectedPerson.id,
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
          products: [],
        };
        this.originalItem = Object.assign({}, this.item);
        this.imgMiniatura = "";
      }
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

    areProductsDifferent(originalProducts, editedProducts) {
      const sortById = (arr) =>
        [...arr].sort((a, b) => (a.product_id || 0) - (b.product_id || 0));
      const sortedOriginal = sortById(originalProducts || []);
      const sortedEdited = sortById(editedProducts || []);
      return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
    },

    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.save();
      }
    },

    async save() {
      this.loading = true;
      const fieldsToUpdate = [
        "name",
        "description",
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
        "products",
        "person_id",
      ];

      let updatedFields = Object.keys(this.editedItem)
        .filter(
          (key) =>
            fieldsToUpdate.includes(key) &&
            (key !== "products"
              ? this.editedItem[key] !== this.originalItem[key]
              : this.areProductsDifferent(this.originalItem[key], this.editedItem[key]))
        )
        .reduce((obj, key) => {
          if (key === "products") {
            obj[key] = this.editedItem.products.map((p) => ({
              product_id: p.product_id,
              person_id: p.person_id,
              quantity: p.quantity,
              unit: p.unit,
              calories_per_unit: p.calories_per_unit,
              protein_per_unit: p.protein_per_unit,
              carbs_per_unit: p.carbs_per_unit,
              fats_per_unit: p.fats_per_unit,
              fiber_per_unit: p.fiber_per_unit,
              sugar_per_unit: p.sugar_per_unit,
              saturated_fats_per_unit: p.saturated_fats_per_unit,
            }));
          } else {
            obj[key] = this.editedItem[key];
          }
          return obj;
        }, {});

      if (Object.keys(updatedFields).length === 0) {
        this.loading = false;
        this.showAlert("success", "No se realizaron cambios.", 3000);
        this.close();
        return;
      }

      if (this.isEditing) updatedFields.id = this.editedItem.id;
      if (this.file) updatedFields.image = this.file;

      const formData = new FormData();
      for (const [key, value] of Object.entries(updatedFields)) {
        if (key === "products") {
          value.forEach((product, i) => {
            for (const [prop, propVal] of Object.entries(product)) {
              if (propVal !== undefined) {
                formData.append(`products[${i}][${prop}]`, propVal ?? "");
              }
            }
          });
        } else {
          formData.append(key, value);
        }
      }

      try {
        const endpoint = this.isEditing ? "recipe-update" : "recipe";
        const result = await handleRequest({ endpoint, method: "POST", data: formData });
        if (result.success) {
          this.showAlert(
            "success",
            result.message || "Receta guardada correctamente",
            3000
          );
          this.$emit("saved", result.data || updatedFields);
          this.close();
        } else {
          this.showAlert(
            "warning",
            result.message || "No se pudo guardar la receta",
            3000
          );
        }
      } catch (error) {
        console.error("Error:", error);
        this.showAlert("error", "Ocurrió un error inesperado.", 3000);
      } finally {
        this.loading = false;
      }
    },

    close() {
      this.dialog = false;
    },

    showAlert(type, message, timeout = 2000) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      if (type === "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      } else if (type === "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      } else if (type === "error") {
        this.sb_title = "Error";
        this.sb_icon = "mdi-alert-octagon";
      } else {
        this.sb_title = "Información";
        this.sb_icon = "mdi-information";
      }
      this.snackbar = true;
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
</style>
