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
                                        :src="`${this.$axios.defaults.baseURL}images/${selectedPet.image}?t=${getCacheTimestamp()}`"
                                        alt="Foto de la mascota" />
                                </v-avatar>
                                <!-- Botón de edición superpuesto -->
                                <v-btn v-if="selectedPet !== null"
                                    icon 
                                    variant="text" 
                                    size="small" 
                                    color="blue-grey" 
                                    @click.stop="editItem(selectedPet)" 
                                    style="position: absolute; bottom: 0; right: 12px;"
                                >
                                    <v-icon color="primary" size="20">mdi-pencil</v-icon>
                                </v-btn>
                            </div>

                            <!-- Datos del paciente -->
                            <div>
                                <div class="text-body-2 font-weight-bold mb-1">
                                    {{ selectedPet.name }}
                                </div>
                                <div class="text-body-2 text-grey-darken-1">
                                    {{ selectedPet.breed ? $t("petDetails.breed.withValue", { breed: selectedPet.breed
                                    }) : "" }}
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
                    <v-col v-for="(tool, index) in petTools" :key="index" cols="12" sm="6" md="6" lg="3" class="px-1">
                        <v-card class="d-flex align-center pa-2" elevation="2" rounded="lg" density="comfortable"  :class="{ 'oscurecer-persistente': selectedView === tool.type }"
                           @click="abrirModal(tool)" style="cursor: pointer; height: 70px; width: 100%">
                            <v-avatar size="40" class="me-3" :color="colors[index] + ' lighten-4'" variant="tonal">
                                <v-icon :color="colors[index]">{{ tool.icon }}</v-icon>
                            </v-avatar>

                            <div style="min-width: 0; flex: 1">
                                <div class="text-body-2 font-weight-medium text-truncate">
                                    {{ tool.name }}
                                </div>

                                <template v-if="tool.count > 0">
                                    <!-- Caso 1: Solo 1 registro -->
                                    <template v-if="tool.count === 1">
                                        <v-tooltip location="bottom" v-if="tool.lastItemName">
                                            <template v-slot:activator="{ props }">
                                                <div v-bind="props"
                                                    class="text-caption text-grey-darken-1 text-truncate">
                                                    {{ tool.lastItemName }}
                                                </div>
                                            </template>
                                            <span>{{ tool.lastItemName }}</span>
                                        </v-tooltip>
                                        <div v-else class="text-caption text-grey-darken-1">
                                            {{ $t("common.no_name") }}
                                        </div>

                                        <div class="text-caption text-grey-lighten-1 mt-1">
                                            {{ formatIntuitiveDate(tool.lastDate) }}
                                        </div>
                                    </template>

                                    <!-- Caso 2: Más de 1 registro -->
                                    <template v-else>
                                        <div class="text-caption text-grey-lighten-1">
                                            <div class="font-weight-medium">
                                                {{ tool.count }} {{ $t("common.items") }}
                                            </div>
                                            <div class="mt-1">
                                                {{ formatIntuitiveDate(tool.lastDate) }}
                                            </div>
                                        </div>
                                    </template>
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
                    :selected-pet="selectedPet"
                  />
                </v-col>
      </v-row>
            </v-card-text>
        </v-card>
    </v-container>

    <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
        content-class="fullscreen-dialog">
        <v-form ref="form" v-model="valid" class="h-100">
            <v-card class="pa-10">
                <v-card-text class="pt-12">
                    <h5 class="text-grey-darken-2 font-weight-medium">
                        {{ editedIndex === -1 ? $t("pets.actions.create") : $t("pets.actions.edit") }}
                    </h5>
                    <p class="text-grey-lighten-1">
                        {{ $t("pets.instructions") }}
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
                                            <strong>{{ $t(`pets.steps.${s.title}.title`) }}</strong>
                                            <div class="text-caption text-grey">
                                                {{ $t(`pets.steps.${s.title}.subtitle`) }}
                                            </div>
                                        </div>
                                    </template>
                                </v-timeline-item>
                            </v-timeline>
                        </v-col>

                        <!-- Contenido dinámico según paso -->
                        <v-col cols="9">
                            <h3 class="text-deep-purple-accent-3 mb-8">
                                {{ $t(`pets.steps.${steps[step].title}.title`) }}
                            </h3>

                            <!-- Paso 1: Información básica -->
                            <v-row dense v-if="step === 0">
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="editedItem.name" :label="$t('pets.fields.name')"
                                        variant="underlined" :rules="nameRules" />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-autocomplete v-model="editedItem.category_id" :items="categories"
                                        :label="$t('pets.fields.category')" item-title="nameCategory" item-value="id"
                                        variant="underlined" :rules="selectRules">
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item v-bind="props">
                                                <template v-slot:prepend>
                                                    <v-avatar size="24">
                                                        <!-- Verifica si es URL o ícono -->
                                                        <template v-if="isImage(item.raw.iconCategory)">
                                                            <img :src="`${this.$axios.defaults.baseURL}images/${item.raw.iconCategory}`"
                                                                alt="icon" />
                                                        </template>
                                                        <template v-else>
                                                            <v-icon>{{ getIconName(item.raw.iconCategory) }}</v-icon>
                                                        </template>
                                                    </v-avatar>
                                                </template>
                                                <v-list-item-subtitle class="d-flex flex-column">
                                                    <div>Descripción: {{ item.raw.descriptionCategory }}</div>
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                        </template>
                                    </v-autocomplete>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="editedItem.breed" :label="$t('pets.fields.breed')"
                                        variant="underlined" />
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-select v-model="editedItem.sex" :label="$t('pets.fields.sex')" :items="[
                      { title: $t('pets.gender.male'), value: 'Male' },
                      { title: $t('pets.gender.female'), value: 'Female' },
                      { title: $t('pets.gender.other'), value: 'Other' },
                    ]" variant="underlined" :rules="selectRules" />
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="editedItem.age" :label="$t('pets.fields.age')"
                                        variant="underlined" type="number" min="0" />
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-locale-provider>
                                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="290px">
                                            <template v-slot:activator="{ props }">
                                                <v-text-field v-bind="props" :modelValue="this.editedItem.date_birth"
                                                    variant="underlined"
                                                    :label="$t('pets.fields.date_birth')"></v-text-field>
                                            </template>
                                            <v-date-picker color="#03626C"
                                                :modelValue="parseDateString(this.editedItem.date_birth)"
                                                @update:model-value="updateDate" format="yyyy-MM-dd"></v-date-picker>
                                        </v-menu>
                                    </v-locale-provider>
                                </v-col>
                            </v-row>

                            <!-- Paso 2: Características físicas -->
                            <v-row dense v-if="step === 1">
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="editedItem.color" :label="$t('pets.fields.color')"
                                        variant="underlined" />
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="editedItem.microchip" :label="$t('pets.fields.microchip')"
                                        variant="underlined" />
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea v-model="editedItem.signs" :label="$t('pets.fields.signs')"
                                        variant="underlined" rows="2" auto-grow />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-file-input v-model="file" ref="fileInput" :label="$t('pets.fields.image')"
                                        variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                                        @change="onFileSelected" prepend-icon=""></v-file-input>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                                        <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210" />
                                    </v-card>
                                </v-col>
                            </v-row>

                            <!-- Paso 3: Información de salud -->
                            <v-row dense v-if="step === 2"> </v-row>

                            <!-- Navegación -->
                            <div class="d-flex justify-space-between mt-8">
                                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : close()">
                                    {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                                </v-btn>

                                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep"
                                    :disabled="!valid">
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
    <v-dialog v-model="dialogMedication" fullscreen transition="dialog-bottom-transition">
        <v-card>
            <v-card-text>
                <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                <CurrentMedication :pet="selectedPet" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialogMedication">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDiet" fullscreen transition="dialog-bottom-transition">
        <v-card>
            <v-card-text>
                <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                <PetDiet :pet="selectedPet" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialogDiet">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";

import Vaccination from "./Vaccination.vue";
import Deworming from "./Deworming.vue";
import VetVisit from "./VetVisit.vue";
import CurrentMedication from "./CurrentMedication.vue";
import PetDiet from "./PetDiet.vue";
export default {
  components: {
    Vaccination,
    Deworming,
    VetVisit,
    CurrentMedication,
    PetDiet,
  },
   props: {
    selectedPet: {
      type: Object,
      required: true
    },
  },
  data: () => ({
    selectedView: "vaccination",
    currentView: null,
    dialogMedication: false,
    dialogDiet: false,
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

    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    tools() {
      return [
        // 1. Vacunación
        {
          name: this.$t("petTitles.vaccines"),
          action: () => this.showVaccines(),
          icon: "mdi-needle",
        },
        // 2. Desparasitación
        {
          name: this.$t("petTitles.deworming"),
          action: () => this.showDeworming(),
          icon: "mdi-bug",
        },
        // 3. Visitas veterinarias
        {
          name: this.$t("petTitles.vetVisits"),
          action: () => this.showVetVisits(),
          icon: "mdi-medical-bag",
        },
        // 4. Medicamentos actuales
        {
          name: this.$t("petTitles.currentMedications"),
          action: () => this.showMedications(),
          icon: "mdi-pill",
        },
        // 5. Alimentación
        {
          name: this.$t("petTitles.diet"),
          action: () => this.showDiet(),
          icon: "mdi-food",
        },
      ];
    },
    imgedit() {
      return this.imgMiniatura;
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
        vaccination: Vaccination,
        deworming: Deworming,
        vetvisits: VetVisit,
        currentmedications: CurrentMedication,
        petdiet: PetDiet
      };

      return map[normalized] || null;
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
      return this.selectedPet.id === pet.id;
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
      /*switch (item.type) {
        case "physicalExam":
          this.showAddPhysicalExam();
          break;
        case "treatment":
          this.showAddTreatment();
          break;
        case "backgroundPerson":
          this.showAddPerson();
          break;
        case "backgroundFamily":
          this.showAddFamily();
          break;
        case "medicalExam":
          this.showAddExam();
          break;
        case "diagnosis":
          this.showAddDiagnosis();
          break;
        case "consultation":
          this.showAddConsultations();
          break;
        default:
          break;
      }*/
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
    /*async showAdd() {
      this.step = 0;
      (this.file = null), (this.editedIndex = -1);
      (this.imgMiniatura = ""), (this.data = {});
      try {
        const result = await handleRequest({
          endpoint: "category-pets",
          method: "POST",
        });

        if (result.success) {
          this.categories = result.data.categories || [];
          this.types = result.data.types || [];
        } else {
          this.categories = [];
          this.types = [];
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
    },*/
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
      this.data.pet_id = this.selectedPet.id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-pet",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursale
          this.pets = result.data?.pet || [];
          console.log("this.selectedPet");
          console.log(this.selectedPet);
          
          this.updatePetTools();
        } else {
          // Si no hay datos, asignamos un array vací
          this.pets = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
      } finally {
        this.loading = false;
      }
    },
    updatePetTools() {
      this.petTools = [
        {
          name: this.$t("petTitles.vaccines"),
          action: () => this.showVaccines(),
          icon: "mdi-needle",
          color: "green",
          type: "vaccination",
          count: this.pets?.vaccinations.count,
          lastDate: this.pets?.vaccinations.date,
          lastItemName: this.pets?.vaccinations.name || this.$t("common.no_name"),
        },
        {
          name: this.$t("petTitles.deworming"),
          action: () => this.showDeworming(),
          icon: "mdi-bug",
          color: "orange",
          type: "deworming",
          count: this.pets?.dewormings.count,
          lastDate: this.pets?.dewormings.date,
          lastItemName: this.pets?.dewormings.name || this.$t("common.no_name"),
        },
        {
          name: this.$t("petTitles.vetVisits"),
          action: () => this.showVetVisits(),
          icon: "mdi-medical-bag",
          color: "blue",
          type: "vetvisits",
          count: this.pets?.vetvisits.count,
          lastDate: this.pets?.vetvisits.date,
          lastItemName: this.pets?.vetvisits.name || this.$t("common.no_name"),
        },
        {
          name: this.$t("petTitles.currentMedications"),
          action: () => this.showMedications(),
          icon: "mdi-pill",
          color: "red",
          type: "currentmedications",
          count: this.pets?.medications.count,
          lastDate: this.pets?.medications.date,
          lastItemName: this.pets?.medications.name || this.$t("common.no_name"),
        },
        {
          name: this.$t("petTitles.diet"),
          action: () => this.showDiet(),
          icon: "mdi-food",
          color: "purple",
          type: "petdiet",
          count: this.pets?.diets.count,
          lastDate: this.pets?.diets.date,
          lastItemName: this.pets?.diets.name || this.$t("common.no_name"),
        },
      ];
    },
    async save() {
      this.data = {};
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "name",
          "category_id",
          "type",
          "breed",
          "sex",
          "age",
          "date_birth",
          "color",
          "microchip",
          "signs",
          "image",
          "home_id",
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

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.home_id = this.home_id;
          updatedFields.type = this.editedItem.type ? this.editedItem.type : "Hogar";

          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }

          // Crear el objeto FormData
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "pet",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
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
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos de la tarea.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "name",
          "category_id",
          "type",
          "breed",
          "sex",
          "age",
          "date_birth",
          "color",
          "microchip",
          "signs",
          "image",
          "home_id",
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

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }

          // Crear el objeto FormData
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "pet-update",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
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
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos de la tarea.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.step = 0;
      this.originalItem = _.cloneDeep(item);
      this.editedItem = _.cloneDeep(item);
      this.input = item.date_birth;
      this.file = null;
      // Crear la imagen y configurar el src
      const img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${item.image}`; // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.image}`;
        } catch (error) {
          this.showAlert("error", "Error al cargar la imagen.", 3000);
        }
      };
      try {
        const result = await handleRequest({
          endpoint: "category-pets",
          method: "POST",
        });

        if (result.success) {
          this.categories = result.data.categories || [];
          this.types = result.data.types || [];
        } else {
          this.categories = [];
          this.types = [];
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
