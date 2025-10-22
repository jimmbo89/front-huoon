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

  <v-container>
    <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-row dense>
          <!-- Foto del usuario -->
          <v-col cols="auto">
            <!-- Avatar -->
            <v-avatar size="80" class="me-4">
              <v-img :src="getImageUrl(imageUrl)" alt="Foto del paciente" />
            </v-avatar>
          </v-col>

          <!-- Datos del paciente (contenedor principal clickeable) -->
          <v-col>
            <v-menu
              v-model="menuPerson"
              :close-on-content-click="false"
              location="bottom start"
              offset-y
              :min-width="null"
              :max-width="null"
              class="rounded-lg"
            >
              <!-- 🔥 ACTIVADOR: Todo el contenedor de datos + avatar + ícono -->
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="cursor-pointer d-flex align-center"
                  style="max-width: fit-content; gap: 12px"
                >
                  <!-- Datos del paciente (apilados verticalmente) -->
                  <div class="flex-grow-1">
                    <!-- Nombre -->
                    <div class="text-body-2 font-weight-bold mb-1">
                      {{ selectedPerson.name }}
                    </div>

                    <!-- Edad -->
                    <div class="d-flex align-center justify-space-between mb-1">
                      <div class="text-body-2 text-grey-darken-1">
                        {{
                          selectedPerson.age !== null
                            ? $t("personDetails.age.withValue", {
                                age: selectedPerson.age,
                              })
                            : $t("personDetails.age.withoutValue")
                        }}
                      </div>
                    </div>

                    <!-- Tipo de documento -->
                    <div class="d-flex align-center justify-space-between mb-1">
                      <div class="text-body-2 text-grey-darken-1"></div>
                    </div>

                    <!-- Número de documento (ÚLTIMA LÍNEA) -->
                    <div class="d-flex align-center justify-space-between">
                      <div class="text-body-2 text-grey-darken-1"></div>
                    </div>
                  </div>

                  <!-- ✅ ÍCONO DE DESPLIEGUE: A LA DERECHA, CENTRADO VERTICALMENTE CON TODO EL CONTENIDO -->
                  <v-icon
                    :class="{ rotate: menuPerson }"
                    class="transition-fast-in-fast-out ms-2"
                    size="20"
                    color="grey"
                    style="vertical-align: middle; flex-shrink: 0"
                    v-if="this.type === 'Hogar'"
                  >
                    mdi-menu-down
                  </v-icon>
                </div>
              </template>

              <!-- MENÚ DESPLEGABLE -->
              <v-card
                max-width="900px"
                class="mx-auto rounded-lg"
                v-if="this.type === 'Hogar'"
              >
                <v-card-text>
                  <v-container fluid>
                    <v-row justify="center">
                      <!-- TARJETAS UNIFORMES -->
                      <v-col
                        v-for="person in homePerson"
                        :key="person.id"
                        cols="auto"
                        min-width="200px"
                        class="pa-2"
                      >
                        <v-card
                          class="text-center store-card"
                          elevation="3"
                          rounded="lg"
                          width="200px"
                          height="auto"
                          @click="selectPerson(person)"
                          :class="{
                            'bg-blue-lighten-5': selectedPerson?.id === person.id,
                          }"
                        >
                          <!-- Imagen ajustada dentro de contenedor fijo -->
                          <div class="icon-wrapper rounded-lg mb-3">
                            <v-img
                              :src="`${$axios.defaults.baseURL}images/${
                                person.image
                              }?t=${getCacheTimestamp()}`"
                              alt="Foto de la persona"
                              width="100%"
                              height="130"
                              cover
                              class="rounded-lg"
                            />
                          </div>

                          <!-- Texto centrado y con espacio fijo -->
                          <div
                            class="store-name"
                            style="
                              font-size: 0.875rem;
                              font-weight: 500;
                              margin-top: 8px;
                              height: 1.2em;
                              line-height: 1.2em;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            "
                          >
                            {{ person.name }}
                          </div>

                          <div
                            class="store-products"
                            style="
                              font-size: 0.75rem;
                              color: #757575;
                              margin-top: 4px;
                              height: 1.2em;
                              line-height: 1.2em;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            "
                          >
                            {{
                              person.age !== null
                                ? $t("personDetails.age.withValue", { age: person.age })
                                : $t("personDetails.age.withoutValue")
                            }}
                          </div>

                          <!-- Check de selección -->
                          <v-icon
                            v-if="selectedPerson?.id === person.id"
                            color="primary"
                            size="18"
                            class="position-absolute"
                            style="top: 8px; right: 8px"
                          >
                            mdi-check-circle
                          </v-icon>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <div class="d-flex align-right justify-end pa-2">
              <v-switch
                v-model="type"
                true-value="Personal"
                false-value="Hogar"
                :base-color="switchColor"
                :color="switchColor"
                hide-details
                inset
                class="mb-4 font-weight-bold"
              >
                <template v-slot:label>
                  <span class="text-body-1" :style="{ color: switchColor }">
                    {{ getCurrentName }}
                  </span>
                </template>
              </v-switch>
            </div>
          </v-col>
        </v-row>
        <!-- Fila completa para herramientas -->
        <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
          <v-btn
            v-for="tool in tools"
            :key="tool.name"
            @click="tool.action"
            size="small"
            color="primary"
            variant="text"
            :disabled="tool.disabled"
            prepend-icon="mdi-plus"
            class="text-capitalize"
          >
            {{ tool.name }}
          </v-btn>
        </v-card-actions>
        <v-divider />

        <v-row dense class="mt-4">
          <v-col cols="12" sm="12" md="12">
            <v-card class="mx-auto" elevation="1" rounded="lg" border flat>
              <v-list-item height="60">
                <template v-slot:prepend>
                  <v-avatar size="40" color="deep-orange">
                    <v-icon icon="mdi-nutrition"></v-icon>
                  </v-avatar>
                </template>

                <template v-slot:title> Panel de Nutrición</template>
                <template v-slot:subtitle>
                  {{ new Date().toLocaleDateString() }}
                </template>
                <template v-slot:append>
                  <v-chip :color="nutritionStatusColor" label rounded="lg">
                    <v-icon :icon="nutritionStatusIcon" start></v-icon>
                    {{ nutritionStatus.level }}
                  </v-chip>
                  <v-tooltip activator="parent" location="bottom">
                    <span>{{ nutritionStatus.message }}</span>
                  </v-tooltip>
                </template>
              </v-list-item>

              <v-divider></v-divider>

              <v-card-text class="pa-4">
                <!-- Alertas específicas (fibra, agua, etc.) -->
                <v-alert
                  v-if="nutritionAlerts.length > 0"
                  color="warning"
                  variant="outlined"
                  rounded="lg"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-icon icon="mdi-bell-alert" size="small"></v-icon>
                  </template>
                  <div v-for="(alert, i) in nutritionAlerts" :key="i" class="mb-1">
                    • {{ alert }}
                  </div>
                </v-alert>

                <!-- Fila Estado General + KPI Circulares -->
                <v-row dense>
                  <v-col cols="12" sm="12">
                    <v-row dense justify="space-between">
                      <!-- Calorías -->
                      <v-col cols="6" sm="6" md="4">
                        <v-tooltip top>
                          <template v-slot:activator="{ props }">
                            <v-card
                              class="pa-4 text-center"
                              rounded="lg"
                              outlined
                              v-bind="props"
                              @click="openModal('calories')"
                              style="cursor: pointer"
                            >
                              <v-progress-circular
                                :model-value="caloriesProgress"
                                size="80"
                                width="8"
                                :color="caloriesColor"
                              >
                                <strong>{{ caloriesDisplay }}</strong>
                              </v-progress-circular>
                              <div class="mt-2 font-weight-medium">Calorías</div>
                            </v-card>
                          </template>
                          <span>{{ caloriesTooltip }}</span>
                        </v-tooltip>
                      </v-col>

                      <!-- Agua -->
                      <v-col cols="6" sm="6" md="4">
                        <v-tooltip top>
                          <template v-slot:activator="{ props }">
                            <v-card
                              class="pa-4 text-center"
                              rounded="lg"
                              outlined
                              v-bind="props"
                              @click="openModal('water')"
                              style="cursor: pointer"
                            >
                              <v-progress-circular
                                :model-value="waterProgress"
                                size="80"
                                width="8"
                                :color="waterColor"
                              >
                                <strong>{{ waterDisplay }}</strong>
                              </v-progress-circular>
                              <div class="mt-2 font-weight-medium">Agua</div>
                            </v-card>
                          </template>
                          <span>{{ waterTooltip }}</span>
                        </v-tooltip>
                      </v-col>

                      <!-- Proteínas -->
                      <v-col cols="6" sm="6" md="4">
                        <v-tooltip top>
                          <template v-slot:activator="{ props }">
                            <v-card
                              class="pa-4 text-center"
                              rounded="lg"
                              outlined
                              v-bind="props"
                              @click="openModal('protein')"
                              style="cursor: pointer"
                            >
                              <v-progress-circular
                                :model-value="proteinProgress"
                                size="80"
                                width="8"
                                :color="proteinColor"
                              >
                                <strong>{{ proteinDisplay }}</strong>
                              </v-progress-circular>
                              <div class="mt-2 font-weight-medium">Proteínas</div>
                            </v-card>
                          </template>
                          <span>{{ proteinTooltip }}</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!--<SuggestionsList
          :items="suggestions"
          :title="$t('finances.sections.suggestions')"
          icon="mdi-finance"
          v-if="this.type === 'Hogar'"
        >
          <template #detail="{ taskData, onClose }">
            <ChatTaskSalud :taskData="taskData" @close-dialog="onClose" />
          </template>
        </SuggestionsList>-->
      </v-card-text>
    </v-card>
  </v-container>
  <v-dialog v-model="dialogPerson">
    <v-card max-width="900px" class="mx-auto">
      <v-card-title class="text-body-2"> Seleccionar Miembro </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row justify="center">
            <v-col
              v-for="person in homePerson"
              :key="person.id"
              cols="auto"
              min-width="200px"
            >
              <v-card
                class="text-center store-card"
                elevation="3"
                rounded="lg"
                @click="selectPerson(person)"
              >
                <div class="icon-wrapper mb-3">
                  <v-img
                    :src="`${$axios.defaults.baseURL}images/${
                      person.image
                    }?t=${getCacheTimestamp()}`"
                    alt="Foto de Mascota"
                    width="100%"
                    height="150"
                    contain
                  />
                </div>
                <div class="store-name">{{ person.name }}</div>
                <div class="store-products">{{ person.breed }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogNutritionData"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-text class="bg-grey-lighten-4">
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <NutritionData :selectedPerson="selectedPerson" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialogNutritionData">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="showShoppingListDialog"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-text class="bg-grey-lighten-4">
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <SuggestedShoppingList :selectedPerson="selectedPerson" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeShoppingList">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <NutritionStatusDialog
    v-if="nutritionModalType"
    v-model="dialogNutrition"
    :items="nutritionData?.membersData || []"
    :type="nutritionModalType"
    @close="closeModal"
  />
  <DailyLogCreateDialog
    v-if="selectedPerson.id"
    v-model="showCreateDialog"
    :item="selectedDailyLog"
    :selected-person="selectedPerson"
    @saved="onDailyLogSaved"
    @close="onCreateDialogClose"
  />
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
import _ from "lodash";
import NutritionData from "./NutritionData.vue";
import NutritionStatusDialog from "./NutritionStatusDialog.vue";
import DailyLogCreateDialog from "./DailyLogCreateDialog.vue";
import RecipeFormDialog from "./RecipeFormDialog.vue";
import SuggestedShoppingList from "./SuggestedShoppingList.vue";

export default {
  components: {
    NutritionData,
    NutritionStatusDialog,
    DailyLogCreateDialog,
    RecipeFormDialog,
    SuggestedShoppingList
  },
  data: () => ({
    dialogPerson: false,
    dialogChatTask: false,
    showCreateDialog: false,
    showRecipeDialog: false,
    showShoppingListDialog: false,
    selectedRecipe: null, // o un objeto si editas
    selectedDailyLog: null, // o un objeto si editas
    currentTask: null,
    selectedView: "",
    dialog: false,
    nuevoValor: "",
    type: "Hogar",
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
    person: {},
    homePerson: [],
    suggestions: [],
    statusuggestions: [],
    types: [],
    menuPerson: false,
    selectedPerson: {},
    data: {},
    headers: [
      { title: "Antecedentes Familiares", value: "familyBackground" },
      { title: "Antecedentes Personales", value: "personalBackground" },
      { title: "Grupo Sanguíneo", value: "bloodType" },
      { title: "Vacunaciones", value: "vaccines" },
      { title: "Medicamentos Actuales", value: "currentMedications" },
      { title: "Acciones", value: "actions", sortable: false, width: "10%" },
    ],
    editedItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    defaultItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    originalItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    editedIndex: -1,
    search: "",
    menu: false,
    input: null,
    imageUrl: "",
    name: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 2) || "El campo debe tener al menos de 2 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
     nutritionData: {},
     hasDailyLogToday: false,
    dialogNutritionData: false,
    dialogNutrition: false,
    nutritionModalType: null, // 'calories', 'water', 'protein'
  }),
  computed: {
    currentMember() {
      if (this.type !== "Personal") return null;
      return (
        this.nutritionData?.membersData?.find((m) => m.id === this.selectedPerson.id) ||
        null
      );
    },
    // --- Calorías ---
    caloriesColor() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member || !member.hasData) return "red";
        const consumed = parseFloat(member.summary.caloriesConsumed) || 0;
        const goal = parseFloat(member.summary.caloriesGoal) || 2000;
        const pct = (consumed / goal) * 100;
        return pct >= 80 ? "green" : pct >= 60 ? "amber" : "red";
      } else {
        // Modo Hogar: usar el estado global
        return this.nutritionData?.status?.color || "red";
      }
    },
    caloriesTooltip() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member) return "Sin datos";
        const { caloriesConsumed, caloriesGoal } = member.summary;
        return `Calorías: ${parseFloat(caloriesConsumed) || 0} / ${
          parseFloat(caloriesGoal) || 2000
        } kcal`;
      } else {
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        return `Miembros con datos: ${membersWithNutritionData || 0} de ${
          totalMembers || 0
        }`;
      }
    },
    caloriesDisplay() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member) return "0 / 2000";
        const { caloriesConsumed, caloriesGoal } = member.summary;
        return `${parseFloat(caloriesConsumed) || 0} / ${
          parseFloat(caloriesGoal) || 2000
        }`;
      } else {
        // Modo Hogar: mostrar conteo de miembros con datos
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        return `${membersWithNutritionData || 0} / ${totalMembers || 0}`;
      }
    },
    caloriesProgress() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member || !member.hasData) return 0;
        const { caloriesConsumed, caloriesGoal } = member.summary;
        const consumed = parseFloat(caloriesConsumed) || 0;
        const goal = parseFloat(caloriesGoal) || 2000;
        return Math.min(100, Math.round((consumed / goal) * 100));
      } else {
        // Modo Hogar: porcentaje de miembros con datos
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        const pct =
          totalMembers > 0 ? (membersWithNutritionData / totalMembers) * 100 : 0;
        return Math.min(100, Math.round(pct));
      }
    },

    // --- Agua ---
    waterColor() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member || !member.hasData) return "red";
        const consumed = parseFloat(member.summary.waterConsumed) || 0;
        const goal = parseFloat(member.summary.waterGoal) || 2.0;
        const pct = (consumed / goal) * 100;
        return pct >= 80 ? "green" : pct >= 60 ? "amber" : "red";
      } else {
        return this.nutritionData?.status?.color || "red";
      }
    },
    waterTooltip() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member) return "Sin datos";
        const { waterConsumed, waterGoal } = member.summary;
        return `Agua: ${parseFloat(waterConsumed) || 0}L / ${
          parseFloat(waterGoal) || 2.0
        }L`;
      } else {
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        return `Miembros con datos: ${membersWithNutritionData || 0} de ${
          totalMembers || 0
        }`;
      }
    },
    waterDisplay() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member) return "0L / 2.0L";
        const { waterConsumed, waterGoal } = member.summary;
        return `${parseFloat(waterConsumed) || 0}L / ${parseFloat(waterGoal) || 2.0}L`;
      } else {
        // Modo Hogar: mostrar conteo de miembros con datos
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        return `${membersWithNutritionData || 0} / ${totalMembers || 0}`;
      }
    },
    waterProgress() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member || !member.hasData) return 0;
        const { waterConsumed, waterGoal } = member.summary;
        const consumed = parseFloat(waterConsumed) || 0;
        const goal = parseFloat(waterGoal) || 2.0;
        return Math.min(100, Math.round((consumed / goal) * 100));
      } else {
        // Modo Hogar: porcentaje de miembros con datos
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        const pct =
          totalMembers > 0 ? (membersWithNutritionData / totalMembers) * 100 : 0;
        return Math.min(100, Math.round(pct));
      }
    },

    // --- Proteínas ---
    proteinColor() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member || !member.hasData) return "red";
        const consumed = parseFloat(member.summary.proteinConsumed) || 0;
        const goal = parseFloat(member.summary.proteinGoal) || 80;
        const pct = (consumed / goal) * 100;
        return pct >= 80 ? "green" : pct >= 60 ? "amber" : "red";
      } else {
        return this.nutritionData?.status?.color || "red";
      }
    },
    proteinTooltip() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member) return "Sin datos";
        const { protein, proteinGoal } = member.summary;
        return `Proteínas: ${parseFloat(protein) || 0}g / ${
          parseFloat(proteinGoal) || 80
        }g`;
      } else {
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        return `Miembros con datos: ${membersWithNutritionData || 0} de ${
          totalMembers || 0
        }`;
      }
    },
    proteinDisplay() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member) return "0g / 80g";
        const { protein, proteinGoal } = member.summary;
        return `${parseFloat(protein) || 0}g / ${parseFloat(proteinGoal) || 80}g`;
      } else {
        // Modo Hogar: mostrar conteo de miembros con datos
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        return `${membersWithNutritionData || 0} / ${totalMembers || 0}`;
      }
    },
    proteinProgress() {
      if (this.type === "Personal") {
        const member = this.currentMember;
        if (!member || !member.hasData) return 0;
        const { protein, proteinGoal } = member.summary;
        const consumed = parseFloat(protein) || 0;
        const goal = parseFloat(proteinGoal) || 80;
        return Math.min(100, Math.round((consumed / goal) * 100));
      } else {
        // Modo Hogar: porcentaje de miembros con datos
        const { membersWithNutritionData, totalMembers } = this.nutritionData || {};
        const pct =
          totalMembers > 0 ? (membersWithNutritionData / totalMembers) * 100 : 0;
        return Math.min(100, Math.round(pct));
      }
    },
    tools() {
      return [
        {
          //name: this.$t("vitalSigns"), // Asegúrate de añadir la traducción
          name: "Agregar Registro", // Asegúrate de añadir la traducción
          action: () => this.showDailyLog(),
          disabled: this.hasDailyLogToday,
        },
        {
          name: "Planificador Semanal", // Asegúrate de añadir la traducción
          action: () => this.showNutritionData(),
          disabled: false,
        },
        {
          name: "Crear Receta", // Asegúrate de añadir la traducción
          action: () => this.showRecipe(),
          disabled: false,
        },
        {
          name: "Lista de Compras", // Asegúrate de añadir la traducción
          action: () => this.showShoppingList(),
          disabled: false,
        },
      ];
    },
    switchColor() {
      return this.type === "Personal" ? "#03626C" : "#FB8C00";
    },
    getCurrentName() {
      const type = this.types.find((t) => t.id === this.type);
      return type ? type.name : this.type;
    },
    nutritionStatus() {
      return (
        this.nutritionData?.status || {
          level: "Crítico",
          message: "Sin datos de nutrición",
          icon: "mdi-alert-circle",
          color: "grey",
        }
      );
    },
    nutritionStatusIcon() {
      return this.nutritionStatus.icon || "mdi-alert-circle";
    },
    nutritionStatusColor() {
      return this.nutritionStatus.color || "grey";
    },
    // Alertas específicas (solo modo Personal)
    nutritionAlerts() {
      return this.nutritionData?.alerts || [];
    },
    mealsOfTheDay() {
      return this.type === "Personal" ? this.nutritionData?.mealsOfTheDay || [] : [];
    },
  },
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  watch: {
    type(newVal) {
      // Actualiza budget_type según el valor del switch
      //this.budget_type = newVal === 'Hogar' ? 'Hogar' : 'Personal';

      // Llama al método de inicialización
      this.initialize();
    },
  },
  methods: {
    showRecipe() {
      this.showRecipeDialog = false;
      this.showRecipeDialog = true;
    },
    onRecipeSaved(data) {
      console.log("Receta guardada:", data);
      this.initialize();
    },
    onRecipeDialogClose() {
      console.log("Diálogo cerrado");
    },
    showDailyLog() {
      this.showCreateDialog = false;
      this.showCreateDialog = true;
    },
    onDailyLogSaved(data) {
      console.log("Nuevo registro:", data);
      this.initialize();
      // Aquí puedes recargar la tabla, emitir evento, etc.
    },
    onCreateDialogClose() {
      console.log("Diálogo de creación cerrado");
    },
    showNutritionData() {
      if (!this.selectedPerson.id) {
        this.showAlert("warning", "Primero selecciona una persona.", 3000);
        return;
      }
      this.dialogNutritionData = true;
    },
    closeDialogNutritionData() {
      this.dialogNutritionData = false; // Cerramos el diálogo
      this.initialize();
    },
    showShoppingList(){
      if (!this.selectedPerson.id) {
        this.showAlert("warning", "Primero selecciona una persona.", 3000);
        return;
      }
      this.showShoppingListDialog = true;
    },
    closeShoppingList() {
      this.showShoppingListDialog = false; // Cerramos el diálogo
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
    openModal(type) {
      if (["calories", "water", "protein"].includes(type)) {
        if (this.nutritionData?.membersData) {
          this.nutritionModalType = type;
          this.dialogNutrition = true;
        }
        return;
      }
    },
    closeModal() {
      this.dialogNutrition = false; // 👈 nuevo
      this.nutritionModalType = null; // 👈 reset
    },
    toggleExpand(id) {
      const index = this.expandedConsultationRows.indexOf(id);
      if (index > -1) {
        this.expandedConsultationRows.splice(index, 1);
      } else {
        this.expandedConsultationRows.push(id);
      }
    },

    isExpanded(id) {
      return this.expandedConsultationRows.includes(id);
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
            .replace(/\./g, "");
      }
    },
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "warning"; // Color por defecto
    },
    isSelected(person) {
      return this.selectedPerson.id === person.id;
    },
    selectPerson(person) {
      // Si necesitas el objeto completo también:
      this.selectedPerson = person;
      this.menuPerson = false;
      this.dialogPerson = false;
      this.imageUrl = this.selectedPerson.image;
      this.initialize();
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.currentTask = null; // Limpia la tarea actual
      this.initialize();
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
      this.data.type = this.type;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-person-profile-nutrition",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.person = result.data?.person || {};
          this.homePerson = result.data?.homeperson || [];
          this.suggestions = result.data?.suggestions || [];
          this.statusuggestions = result.data?.statusuggestions || [];
          this.selectedPerson = this.person;
          this.nutritionData = result.data?.nutritionData || {};
          this.hasDailyLogToday = result.data?.hasDailyLogToday || false;
          this.types = result.data?.types || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.person = {};
          this.homePerson = [];
          this.suggestions = [];
          this.statusuggestions = [];
          this.types = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
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
.icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
