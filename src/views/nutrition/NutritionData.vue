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

    <v-container>
        <v-card class="pa-4" elevation="4" rounded="lg">
            <!-- Encabezado con foto y datos -->
            <v-card-text>
                <v-row dense>
                    <!-- Foto del usuario -->
                    <!-- Foto y datos de la mascota (clickeable para cambiar) -->
                    <v-col cols="12" md="6">
                        <!-- Selector de mascota (activador del menú) -->
                        <div class="d-flex align-center cursor-pointer pet-selector"
                            style="padding: 8px; border-radius: 12px; transition: background-color 0.2s">
                            <!-- Foto del paciente -->
                            <div style="position: relative; display: inline-block;">
                                <v-avatar size="60" class="me-4">
                                    <v-img
                                        :src="this.getImageUrl(selectedPerson.image)"
                                        alt="Foto de la persona" />
                                </v-avatar>
                            </div>

                            <!-- Datos del paciente -->
                            <div>
                                <div class="text-body-2 font-weight-bold mb-1">
                                    {{ selectedPerson.name }}
                                </div>
                                
                            </div>
                        </div>
                    </v-col>

                    <!-- Espaciado para centrar visualmente -->
                    <v-col cols="12" md="3"></v-col>

                    <v-col cols="12" sm="6" md="3">
                    </v-col>
                </v-row>
                <!-- Fila completa para herramientas 
                <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
                            <v-btn v-for="tool in tools" :key="tool.name" @click="tool.action" size="small"
                                color="primary" variant="text" prepend-icon="mdi-plus" class="text-capitalize">
                                {{ tool.name }}
                            </v-btn>
                </v-card-actions>
                <v-divider />-->
                <v-row dense class="mt-4">
                  <v-col 
                    v-for="(tool, index) in nutritionTools" 
                    :key="index" 
                    cols="12" sm="6" md="6" lg="3" 
                    class="px-1"
                  >
                    <v-card 
                      class="d-flex align-center pa-2" 
                      elevation="2" 
                      rounded="lg" 
                      density="comfortable"
                      @click="abrirModal(tool)"
                      style="cursor: pointer; height: 85px; width: 100%; min-height: 85px;"
                      :class="{ 'oscurecer-persistente': selectedView === tool.type }"
                    >
                      <v-avatar size="40" class="me-3" :color="tool.color + ' lighten-4'" variant="tonal">
                        <v-icon :color="tool.color">{{ tool.icon }}</v-icon>
                      </v-avatar>

                      <div style="min-width: 0; flex: 1">
                        <div class="text-body-2 font-weight-medium text-truncate">
                          {{ tool.name }}
                        </div>

                        <template v-if="tool.count > 0">
                          <v-tooltip v-if="tool.lastItemName" location="bottom">
                            <template v-slot:activator="{ props }">
                              <div v-bind="props" class="text-caption text-grey-darken-1 text-truncate">
                                {{ tool.lastItemName }}
                              </div>
                            </template>
                            <span>{{ tool.lastItemName }}</span>
                          </v-tooltip>
                          
                          <div v-else class="text-caption text-grey-darken-1">
                            {{ $t("common.no_name") }}
                          </div>
                        </template>
                        <template v-else>
                          <div class="text-caption text-grey-darken-1">
                            {{ $t("common.no_records") }}
                          </div>
                        </template>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row dense class="mt-4">
                <v-col cols="12">
                  <component
                    :is="getComponentByType(selectedView)"
                    v-if="selectedView"
                    :key="selectedView"
                    :selected-person="selectedPerson"
                    @update-nutrition-data="initialize"
                  />
                </v-col>
      </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";

import NutritionProfile from "./NutritionProfile.vue";
import Recipe from "./Recipe.vue";
import DailyLog from "./DailyLog.vue";
import MealEntry from "./MealEntry.vue";
export default {
  components: {
    NutritionProfile,
    Recipe,
    DailyLog,
  },
   props: {
    selectedPerson: {
      type: Object,
      required: true
    },
  },
  data: () => ({
    selectedView: "profile",
    currentView: null,
    petTools: [],
    dialog: false,
    nuevoValor: "",
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    home_id: "",
    tab: null,
    loading: false,
    dialogDelete: false,
    pets: [],
    categories: [],
    types: [],
    data: {},

    steps: [
      { title: "basic", icon: "mdi-information" },
      { title: "details", icon: "mdi-dog" },
    ],
    page: 1, // Página actual
    itemsPerPage: 5, // Elementos por página
    totalItems: 0, // Total de elementos disponibles
    editedItem: {
      id: "",
      name: "",
      category_id: null,
      type: "Hogar",
      breed: "",
      sex: null,
      age: null,
      date_birth: null,
      color: "",
      microchip: "",
      signs: "",
      image: null,
      home_id: null,
    },
    defaultItem: {
      id: "",
      name: "",
      category_id: null,
      type: "Hogar",
      breed: "",
      sex: null,
      age: null,
      date_birth: null,
      color: "",
      microchip: "",
      signs: "",
      image: null,
      home_id: null,
      person_id: null,
    },
    originalItem: {
      id: "",
      name: "",
      category_id: null,
      breed: "",
      sex: null,
      age: null,
      date_birth: null,
      color: "",
      microchip: "",
      signs: "",
      image: null,
      home_id: null,
      person_id: null,
      type: "",
    },
    search: "",
    menu: false,
    menuPet: false,
    input: null,
    imageUrl: "",
    name: "",
    file: null,
    imgMiniatura: "",
    step: 0,
    colors: ["green", "orange", "blue", "red", "purple"],
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 2) || "El campo debe tener al menos de 2 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
     nutritionProfile: null,
    nutritionTools: []
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Agregar Historia Clínica"
        : "Editar Historia Clínica";
    },
    alertasHoy() {
      return this.listaAlertas.length;
    },
  },
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    getComponentByType(type) {
      if (!type) return null;

      // Normalización: minúsculas + eliminar tildes
      const normalized = type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const map = {
        profile: NutritionProfile,
        recipes: Recipe,
        dailylog: DailyLog,
        mealentry: MealEntry
      };

      return map[normalized] || null;
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
    isSelected(pet) {
      return this.selectedPerson.id === pet.id;
    },
    parseDateString(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return new Date(year, month - 1, day);
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
    nextStep() {
      if (this.step < this.steps.length - 1) {
        // 0=basic, 1=details, 2=members
        this.step++;
      } else {
        this.save();
      }
    },
    handleCloseDialog() {
      // Lógica adicional al cerrar el diálogo si es necesaria
      console.log("Diálogo cerrado");
      this.closeDialgChat();
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.currentTask = null; // Limpia la tarea actual
      this.initialize();
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
      this.selectedView = item.type;
    },
    // Método para manejar la paginación
    updatePage(page) {
      this.page = page;
      this.initialize(); // Recarga los almacenes con la nueva página
    },

    updateDate(value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.input = `${year}-${month}-${day}`;

      this.editedItem.date_birth = this.input;
      this.menu = false;
    },
   close() {
      this.dialog = false;
      this.loading = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.data.person_id = this.selectedPerson.id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "nutrition-by-person",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursale
          this.nutritionProfile = result.data?? [];
          console.log("this.selectedPerson");
          console.log(this.selectedPerson);
          
          this.updateNutritionTools();
        } else {
          // Si no hay datos, asignamos un array vací
          this.nutritionProfile = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
      } finally {
        this.loading = false;
      }
    },
    updateNutritionTools() {
      this.nutritionTools = [
        {
          name: this.$t("nutrition.profile"),
          action: () => this.showNutritionProfile(),
          icon: "mdi-account-details",
          color: "blue",
          type: "profile",
          count: this.nutritionProfile?.profile ? 1 : 0,
          lastItemName: this.nutritionProfile?.profile ? "Metas nutricionales" : null
        },
        {
          name: this.$t("nutrition.recipes"),
          action: () => this.showRecipes(),
          icon: "mdi-book-open-variant",
          color: "green",
          type: "recipes",
          count: this.nutritionProfile?.recipes.count || 0,
          lastItemName: this.nutritionProfile?.recipes.lastRecipe || this.$t("common.no_name")
        },
        {
          name: this.$t("nutrition.dailyLog"),
          action: () => this.showDailyLog(),
          icon: "mdi-water",
          color: "cyan",
          type: "dailylog",
          count: this.nutritionProfile?.dailyLog.hasData ? 1 : 0,
          lastItemName: this.nutritionProfile?.dailyLog.hasData 
            ? `${this.nutritionProfile.dailyLog.waterIntake}L agua, ${this.nutritionProfile.dailyLog.steps} pasos`
            : null
        },
        {
          name: this.$t("nutrition.meals"),
          action: () => this.showMeals(),
          icon: "mdi-food",
          color: "orange",
          type: "mealentry",
          count: this.nutritionProfile?.meals.count || 0,
          lastItemName: this.nutritionProfile?.meals.items[0]?.recipes || this.$t("common.no_name")
        }
      ];
    },
    // Función para comparar arrays de objetos
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
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "pet-destroy",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
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
  },
};
</script>
<style scoped>
.store-card {
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 120px;
  min-width: 120px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 5px;
}
.store-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
}
.icon-wrapper {
  width: 55px;
  height: 55px;
  margin: 0 auto;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.store-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.store-products {
  font-size: 13px;
  color: #777;
}
.selected-pet-card {
  background-color: rgba(76, 175, 80, 0.05); /* Fondo muy suave */
  transition: all 0.3s ease;
}
.v-btn {
  flex-shrink: 0;
}

/* Espaciado entre elementos */
.gap-1 {
  gap: 4px;
}
.tools-bar {
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}
/* Estilos para personalizar el scroll */
.v-list {
  scrollbar-width: thin;
  /* Para navegadores que soportan scrollbar-width */
  scrollbar-color: #888 #f1f1f1;
  /* Color del scroll */
}

.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}

.v-list::-webkit-scrollbar {
  width: 6px;
  /* Ancho del scroll */
}

.v-list::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Color del thumb */
  border-radius: 3px;
  /* Bordes redondeados */
}

.v-list::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  /* Color del track */
}

.text-h6 {
  font-size: 1.2rem;
}

.signo-card {
  transition: 0.2s ease-in-out;
}

.signo-card .text-truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.signo-card:hover {
  transform: scale(1.01);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
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
.img-concava {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra el espacio */
  border-radius: 8px; /* Para que coincida con el contenedor */
}
.modal-imagen {
  background: transparent !important;
  box-shadow: none !important;
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
