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
  <v-container class="pa-4" >
    <v-card elevation="2" rounded="lg" flat>
      <v-card-text>
      <v-row>
      <v-col cols="12" sm="10" md="10" class="d-flex align-center">
          <v-avatar size="48" class="me-3" color="grey-lighten-4" variant="tonal">
              <v-icon size="35" color="error">mdi-store-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-bold mb-1">
                {{ $t("warehouse.list.title") }}
              </div>
            </div>
           </v-col>
          <v-col cols="12" sm="2" md="2">
            <div class="d-flex align-right justify-end pa-2">
              <v-switch v-model="localType" true-value="Personal" false-value="Hogar" :base-color="switchColor"
                :color="switchColor" hide-details inset class="mb-4 font-weight-bold">
                <template v-slot:label>
                  <span class="text-body-1" :style="{ color: switchColor }">
                    {{ getCurrentName }}
                  </span>
                </template>
              </v-switch>
            </div>
          </v-col>
          </v-row>       
        <v-row class="pa-0 ma-0 mt-1">
  <v-col
    v-for="warehouse in warehouses"
    :key="warehouse.id"
    cols="12"
    sm="6"
    md="6"
    lg="3"
    class="px-1"
  >
    <v-card
      class="d-flex align-center pa-2"
      :class="{ 'oscurecer-persistente': warehouse.id === warehouseData?.id }"
      elevation="2"
      rounded="lg"
      density="comfortable"
      @click="selectWarehouse(warehouse)"
      style="cursor: pointer; height: 70px; width: 100%; position: relative"
    >
      <v-avatar
        size="40"
        class="me-3"
        color="indigo lighten-4"
        variant="tonal"
      >
        <v-icon color="indigo">mdi-warehouse</v-icon>
      </v-avatar>

      <div style="min-width: 0; flex: 1">
        <div class="text-body-2 font-weight-medium text-truncate">
          <span>{{ warehouse.title }}</span>
          <v-tooltip activator="parent" location="bottom" max-width="350px">
            <span style="white-space: normal; word-break: break-word">
              {{ $t("warehouse.fields.name") }}: {{ warehouse.title }}
            </span>
          </v-tooltip>
        </div>

          <div class="text-caption text-grey-darken-1 text-truncate">
            <span>{{ warehouse.description || $t("common.no_description") }}</span>
            <v-tooltip activator="parent" location="bottom" max-width="350px">
              <span style="white-space: normal; word-break: break-word">
                {{ $t("warehouse.fields.description") }}: {{ warehouse.description }}
              </span>
            </v-tooltip>
          </div>
          <div class="text-caption text-grey-lighten-1 mt-1">
            {{ warehouse.productCount }} {{ $t("common.product") }}
          </div>
      </div>

      <!-- ✅ Botón de edición -->
      <v-btn
        icon
        size="x-small"
        variant="text"
        color="blue-grey"
        @click.stop="editWarehouse(warehouse)" 
        class="position-absolute"
        style="right: 2px; top: 2px"
      >
        <v-tooltip activator="parent" location="bottom">
          {{ $t("buttons.edit") }}
        </v-tooltip>
        <v-icon color="primary" size="20">mdi-pencil</v-icon>
      </v-btn>
    </v-card>
  </v-col>
</v-row>
        <v-row dense class="mt-3">
        <v-col cols="12">
          <Product
            v-if="warehouseData"
            :key="warehouseData.id"
            :warehouseData="warehouseData"
          />
        </v-col>
      </v-row>
         </v-card-text>
    </v-card>
  </v-container>
  <!--Almacén-->
  <v-dialog v-model="dialogWarehouse" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitleWarehouse }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("warehouse.formInstructions") }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
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
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`warehouse.steps.${stepsW[stepW].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="stepW === 0">
                <!--<v-col cols="12" md="12" v-show="editedIndex === -1">
                  <v-autocomplete v-model="editedItemWarehouse.warehouse_id" :items="warehouses"
                    :label="$t('warehouse.fields.warehouse')" item-title="title" item-value="id" variant="underlined">
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
                </v-col>-->

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItemWarehouse.title" clearable :label="$t('warehouse.fields.name')"
                    variant="underlined" :rules="nameRules"></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItemWarehouse.location" clearable
                    :label="$t('warehouse.fields.home_location')" variant="underlined"
                    :rules="locationRules"></v-text-field>
                </v-col>
              </v-row>

              <!-- Paso 2: Configuración adicional -->
              <v-row dense v-if="stepW === 1">
                <v-col cols="12" md="6">
                  <v-select v-model="editedItemWarehouse.status" :items="[
                      { id: 0, label: $t('warehouse.status.public') },
                      { id: 1, label: $t('warehouse.status.private') },
                    ]" item-title="label" item-value="id" :label="$t('warehouse.fields.status')" variant="underlined"
                    :rules="statusRules"></v-select>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItemWarehouse.description" clearable
                    :label="$t('warehouse.fields.description')" variant="underlined"
                    :rules="descriptionRules"></v-textarea>
                </v-col>
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
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
  <!--</v-container>-->
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import Product from "../product/Product";
export default {
  props: {
      warehouses: {
      type: Array,
      default: () => [],
    },
     types: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "",
    },
  },
  emits: ['warehouse-updated', 'update:type'],
  components: {
    Product
  },
  data: () => ({
    warehouseData: null,
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
    products: [],
    status: [],
    home_id: "",
    dialog: false,
    isEditing: false,
    editedIndex: -1,

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
  }),
  watch: {
     warehouses: {
      immediate: true, // Se ejecuta al montar el componente
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.warehouseData = newVal[0]; // Asigna el primero por defecto
        } else {
          this.warehouseData = null;
        }
      },
    },
  },
  computed: {
     localType: {
    get() {
      return this.type; // ← lee el prop "type"
    },
    set(newValue) {
      this.$emit('update:type', newValue); // ← emite para actualizar el padre
    }
  },
    formTitleWarehouse() {
      return "Editar Almacén";
    },
  switchColor() {
      return this.type === 'Personal' ? '#03626C' : '#FB8C00';
    },
    getCurrentName() {
      const type = this.types.find(t => t.id === this.type);
      return type ? type.name : this.type;
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
  },
  mounted() {
    this.home_id = LocalStorageService.getItem("home_id");
  },
  methods: {
    selectWarehouse(warehouse) {
    this.warehouseData = warehouse;
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
    async editWarehouse(warehouse) {
      console.log("editWarehouse", warehouse);
      this.stepW = 0;
      // Asigna los datos del almacén al objeto de edición
      this.editedItemWarehouse = {
        ...warehouse
      };
    
      this.originalItemWarehouse = { ...warehouse };
        this.dialogWarehouse = true;
      this.isEditing = false;
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
