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
  <v-container class="pa-4">
    <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <!-- Encabezado -->
        <v-row justify="space-between" align="center" class="mb-6">
          <h2 class="text-body-2 font-weight-bold">{{ $t("medicalInformation") }}</h2>
        </v-row>
        <v-row dense>
          <!-- Card: Presión Altura -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'person' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'person', ...personData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="grey-darken-1 lighten-4" variant="tonal">
                <v-icon color="grey-darken-1">mdi-water</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("personManagement.fields.blood_type") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ personData?.blood_type || $t("no_definido") }}
                    </div>
                  </template>
                  <span>{{ personData?.blood_type || $t("no_definido") }}</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(personData?.date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Alergias -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'alergia' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'alergia', ...firstAlergiaData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="deep-orange lighten-4" variant="tonal">
                <v-icon color="deep-orange">mdi-alert-circle</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("cardAlergias") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ firstAlergiaData?.description || $t("no_definido") }}
                    </div>
                  </template>
                  <span>{{ firstAlergiaData?.description || $t("no_definido") }}</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(firstAlergiaData?.startDate || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Card: Frecuencia Respiratoria -->
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              :class="{ 'oscurecer-persistente': selectedView === 'backgroundPerson' }"
              elevation="1"
              rounded="lg"
              @click="abrirModal({ type: 'backgroundPerson', ...backgroundPersonData })"
              style="cursor: pointer"
            >
              <v-avatar size="40" class="me-3" color="deep-orange lighten-4" variant="tonal">
                <v-icon color="deep-orange">mdi-file-document-outline</v-icon>
              </v-avatar>

              <div style="min-width: 0; flex: 1">
                <div class="text-body-2 font-weight-medium text-truncate">
                  {{ $t("cardAntecedentesPersonales") }}
                </div>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                      {{ firstBackGroundPersonData?.description || $t("no_definido") }}
                    </div>
                  </template>
                  <span>{{ firstBackGroundPersonData?.description || $t("no_definido") }}</span>
                </v-tooltip>

                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(firstBackGroundPersonData?.startDate || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
            </v-card>
          </v-col>


          <!-- Card: Antecedentes Familiares -->
          <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-2 d-flex align-center signo-card"
            :class="{ 'oscurecer-persistente': selectedView === 'backgroundfamily' }"
            elevation="1"
            rounded="lg"
            @click="abrirModal({ type: 'backgroundfamily', ...allergyData })"
            style="cursor: pointer"
          >
            <v-avatar size="40" class="me-3" color="deep-orange lighten-4" variant="tonal">
              <v-icon color="deep-orange">mdi-family-tree</v-icon>
            </v-avatar>

            <div style="min-width: 0; flex: 1">
              <div class="text-body-2 font-weight-medium text-truncate">
                {{ $t("cardAntecedentesFamiliares") }}
              </div>

              <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="text-caption text-grey-darken-1 text-truncate"
                    >
                        {{
                              firstBackGroundFamilyData?.relationship && firstBackGroundFamilyData?.disease
                                ? `${firstBackGroundFamilyData.relationship} - ${firstBackGroundFamilyData.disease}`
                                : firstBackGroundFamilyData?.relationship
                                  ? firstBackGroundFamilyData.relationship
                                  : firstBackGroundFamilyData?.disease
                                    ? firstBackGroundFamilyData.disease
                                    : $t('no_definido')
                      }}
                    </div>
                  </template>
                  <span>
                    {{
                      firstBackGroundFamilyData?.relationship && firstBackGroundFamilyData?.disease
                      ? `${firstBackGroundFamilyData.relationship} - ${firstBackGroundFamilyData.disease}`
                      : firstBackGroundFamilyData?.relationship
                        ? firstBackGroundFamilyData.relationship
                        : firstBackGroundFamilyData?.disease
                          ? firstBackGroundFamilyData.disease
                          : $t('no_definido')
                    }}
                  </span>
                </v-tooltip>
                <div class="text-caption text-grey-lighten-1 mt-1">
                  {{ formatoFecha(firstBackGroundFamilyData?.date || new Date().toISOString().split("T")[0]) }}
                </div>
              </div>
          </v-card>
        </v-col>
        </v-row>
        <v-row dense class="mt-3">
        <v-col cols="12">
          <component
            :is="getComponentByType(selectedView)"
            v-if="selectedView"
            :key="selectedView"
            :selected-person="selectedPerson"
            @update-medical-information="initialize"
          />
        </v-col>
      </v-row>
      </v-card-text>
    </v-card>
  </v-container>
    <v-dialog
  v-model="dialogBlood"
  max-width="500px"
  persistent
  transition="dialog-bottom-transition"
>
  <v-form ref="form" v-model="valid" @submit.prevent="save">
    <v-card class="pa-6">
      <v-card-title class="text-h6 font-weight-bold">
        {{ $t('personManagement.fields.blood_type') }}
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <!-- Campo: Presión Arterial -->
          <v-col cols="12">
          <v-select
                    v-model="editedItemPerson.blood_type"
                    :items="bloodTypes"
                    :label="$t('personManagement.fields.blood_type')"
                    variant="underlined"
                  ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <v-btn
          variant="text"
          @click="close"
        >
          {{ $t("buttons.close") }}
        </v-btn>

        <v-btn
          color="primary"
          :disabled="!valid"
          @click="save"
        >
          {{ $t("buttons.saveAndClose") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</v-dialog>
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import { shallowRef } from "vue";
import Allergy from "./Allergy.vue";
import BackGroungPerson from "./BackGroungPerson.vue";
import BackGroundFamily from "./BackGroundFamily.vue";


export default {
  components: {
    Allergy,
    BackGroungPerson,
    BackGroundFamily
  },
  props: {
    selectedPerson: {
      type: Object,
      required: true
    },
  },
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    selectedView: 'alergia',
    time: null,
    modal2: false,
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
    personData: {},
    allergyData: [],
    backgroundFamilyData: {},
    backgroundPersonData: {},
    tittlePerson: -1,
    selectedItems: {}, // Almacena las selecciones por rol
    home_id: "",
    data: {},
    person_id: "",
    dialogBlood: false,
    bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    blood_type: '',
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    editedIndex: -1,
    search: "",
    title: "",
    description: "",
    date: "",
    module: "",
    editedItemPerson: {
      blood_type: null,
    },
    originalItemPerson: {
      blood_type: null,
    },
    defaultItemPerson: {
      blood_type: null,
    },
  }),
  computed: {
     firstAlergiaData() {
    if (!this.allergyData || !Array.isArray(this.allergyData) || this.allergyData.length === 0) {
      return null;
    }
    // Como viene ordenado DESC por startDate,
    // la vacunación más reciente está en la PRIMERA posición del array.
    return this.allergyData[0];
  },
  firstBackGroundPersonData() {
    if (!this.backgroundPersonData || !Array.isArray(this.backgroundPersonData) || this.backgroundPersonData.length === 0) {
      return null;
    }
    // Como viene ordenado DESC por startDate,
    // la vacunación más reciente está en la PRIMERA posición del array.
    return this.backgroundPersonData[0];
  },
  firstBackGroundFamilyData() {
    if (!this.backgroundFamilyData || !Array.isArray(this.backgroundFamilyData) || this.backgroundFamilyData.length === 0) {
      return null;
    }
    // Como viene ordenado DESC por startDate,
    // la vacunación más reciente está en la PRIMERA posición del array.
    return this.backgroundFamilyData[0];
  }
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
    /*const primerSignoValido = this.signosVitalesTransformados.find(
    (s) => s.valor !== this.$t("no_definido")
  );/*/
  this.selectedView = "alergia";
  },
  methods: {
    async save() {
      this.valid = false;
      const fieldsToUpdate = [
        "blood_type",
      ];

      let updatedFields = Object.keys(this.editedItemPerson)
        .filter(
          (key) =>
            fieldsToUpdate.includes(key) &&
            this.editedItemPerson[key] !== this.originalItemPerson[key]
        )
        .reduce((obj, key) => {
          obj[key] = this.editedItemPerson[key];
          return obj;
        }, {});

      if (Object.keys(updatedFields).length > 0) {
        updatedFields.id = this.selectedPerson.id;

        const formData = new FormData();

        // Manejo especial para la imagen
        if (this.imageFile) {
          formData.append("image", this.imageFile);
          delete updatedFields.image; // Eliminamos del objeto ya que lo manejamos por separado
        }

        for (let key in updatedFields) {
          formData.append(key, updatedFields[key]);
        }

        try {
          const result = await handleRequest({
            endpoint: "person-update",
            method: "POST",
            data: formData,
          });

          // Manejo de la respuesta
          if (result.success) {
            this.loading = false;
            this.showAlert("success", result.message, 3000);
            this.close();
            this.initialize();
          } else {
            this.loading = false;
            this.showAlert("warning", result.message, 3000);
          }
        } catch (error) {
          this.loading = false;
          this.showAlert(
            "error",
            "Ocurrió un error inesperado al procesar la solicitud.",
            3000
          );
        }
      } else {
        this.loading = false;
        this.showAlert("info", "No se realizaron cambios.", 3000);
        this.close();
      }
    },
    formatoFecha(fecha) {
      if (!fecha) return "";

      const d = new Date(fecha);
      const locale = this.$i18n.locale;
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Forzar UTC
      };

      return d.toLocaleDateString(locale, options);
    },
    abrirModal(item) {
      if(item.type === 'person'){
        this.dialogBlood = true;
      }else{
      this.selectedView = item.type;
      }
      console.log(this.selectedView);
    },
    getComponentByType(type) {
   if (!type || type === 'personal') return null;

  // Normalización: minúsculas + eliminar tildes
  const normalized = type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const map = {
    alergia: Allergy,
    backgroundperson: BackGroungPerson,
    backgroundfamily: BackGroundFamily,
  };

  return map[normalized] || null;
},
    getStatusById(statusId) {
      return this.status.find((status) => status.id === statusId);
    },
    close() {
      this.dialogBlood = false;
      this.$nextTick(() => {
        this.editedItemPerson = Object.assign({}, this.defaultItemPerson);
      });
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.data.person_id = this.selectedPerson.id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-profile-medical",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.personData = result.data?.person || {};
          this.allergyData = result.data?.allergy || [];
          this.backgroundFamilyData = result.data?.backgroundFamily || {};
          this.backgroundPersonData = result.data?.backgroundPerson || {};
        } else {
          // Si no hay datos, asignamos un array vacío
          this.personData = {};
          this.allergyData = [];
          this.backgroundFamilyData = {};
          this.backgroundPersonData = {};
          //this.showAlert('success', result.message || 'No hay tareas disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las tareas.",
          3000
        );
      } finally {
        this.loading = false;
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
  },
};
</script>
<style scoped>
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
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

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
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
