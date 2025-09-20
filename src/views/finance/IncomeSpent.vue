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
    <v-card elevation="2" rounded="lg" flat>
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-col cols="12" sm="9" md="9" class="d-flex align-center">
          <v-avatar size="48" class="me-3" color="grey-lighten-4" variant="tonal">
            <v-icon color="green-darken-2">mdi-cash-multiple</v-icon>
          </v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold mb-1">
              {{ $t("finances.sections.movements") }}
            </div>
            <div class="text-body-2 text-grey-darken-1"></div>
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
        <v-data-table
          :headers="headers"
          :items="financialRecords"
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
                <!-- Fecha / Periodo (10%) -->
                <div style="width: 6%; min-width: 0" class="text-left">
                  {{ $t("finances.fields.date") }}
                </div>

                <!-- Categoría / Descripción (40%) -->
                <div style="width: 35%; min-width: 0" class="text-left">
                  {{ $t("finances.fields.budget") }} /
                  {{ $t("finances.fields.description") }}
                </div>

                <!-- Monto (10%) -->
                <div
                  style="width: 10%; min-width: 0"
                  class="text-center text-green-darken-1"
                >
                  {{ $t("finances.fields.income") }}
                </div>

                <!-- Usado (15%) -->
                <div
                  style="width: 10%; min-width: 0"
                  class="text-center text-red-darken-1"
                >
                  {{ $t("finances.fields.spent") }}
                </div>

                <!-- Usado (15%) -->
                <div style="width: 10%; min-width: 0" class="text-center">
                  {{ $t("finances.fields.saldo") }}
                </div>

                <!-- Tipo (10%) -->
                <div style="width: 10%; min-width: 0" class="text-center">
                  {{ $t("finances.fields.type") }}
                </div>

                <div style="width: 10%; min-width: 0" class="text-left">
                  {{ $t("finances.fields.file") }}
                </div>

                <!-- Acciones (10%) -->
                <div style="width: 10%; min-width: 0" class="d-flex justify-end">
                  {{ $t("settings.actions") }}
                </div>
              </v-card-text>
            </v-card>
          </template>
          <template v-slot:item="slotProps">
            <tr>
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
                    <div class="d-flex align-center" style="width: 6%; min-width: 0">
                      <v-avatar
                        class="mr-2 icono-concavo"
                        :style="{
                          'background-color': getTypeColor(slotProps.item.type),
                          color: getTypeColor(slotProps.item.type),
                          'min-height': '48px',
                          'min-width': '48px',
                          'border-radius': '8px',
                          'font-size': '0.90em'
                        }"
                      >
                        <div
                          class="icono-concavo"
                          :class="`bg-${getTypeColor(slotProps.item.type)}`"
                        >
                          <div class="date-text">
                            {{ formatIntuitiveDate(slotProps.item.date) }}
                          </div>
                        </div>
                      </v-avatar>
                    </div>

                    <!-- Categoría + Descripción - 40% -->
                    <div style="width: 35%; min-width: 0" class="d-flex flex-column">
                      <div v-if="slotProps.item.income">
                        <div class="text-body-2 text-truncate">
                          {{ slotProps.item.description }}
                        </div>
                        <div class="text-caption text-grey-darken-1 text-truncate"></div>
                      </div>
                      <div else>
                        <div class="text-body-2 text-truncate">
                          {{ slotProps.item.categoryName }}
                        </div>
                        <div
                          class="text-caption text-grey-darken-1 text-truncate"
                          v-if="slotProps.item.spent"
                        >
                          {{ slotProps.item.description }}
                        </div>
                      </div>
                    </div>

                    <!-- Monto - 10% -->
                    <div
                      style="width: 10%; min-width: 0; text-align: center"
                      class="text-body-2 text-green-darken-1 text-truncate"
                    >
                      {{ formatCurrency(slotProps.item.income) }}
                    </div>

                    <!-- Usado - 15% -->
                    <div
                      style="width: 10%; min-width: 0; text-align: center"
                      class="text-body-2 text-red-darken-1 text-truncate"
                    >
                      {{ formatCurrency(slotProps.item.spent) }}
                    </div>

                    <div
                      style="width: 10%; min-width: 0; text-align: center"
                      class="text-body-2 text-truncate"
                      :class="{
                        'text-green-darken-1': parseFloat(slotProps.item.available) > 0,
                        'text-red-darken-1': parseFloat(slotProps.item.available) < 0,
                        'text-grey': parseFloat(slotProps.item.available) === 0,
                      }"
                    >
                      {{ formatCurrency(slotProps.item.available) }}
                    </div>

                    <!-- Tipo (con ícono) - 10% -->
                    <div style="width: 10%; min-width: 0; text-align: center">
                      <v-icon
                        :color="getTypeColor(slotProps.item.type)"
                        style="font-size: 10px; margin-right: 4px"
                        icon="mdi-circle"
                      ></v-icon>
                      <span class="text-grey-darken-1 text-body-2 text-truncate">
                        {{ slotProps.item.type }}
                      </span>
                    </div>

                    <!-- Moneda (con ícono) - 5% -->
                    <div style="width: 10%; min-width: 0; text-align: center">
                      <div
                        v-if="
                          slotProps.item.image &&
                          slotProps.item.image !== 'finances/default.jpg'
                        "
                        class="mr-2"
                      >
                        <v-btn
                          density="comfortable"
                          icon="mdi-eye"
                          color="green"
                          @click="openModal(slotProps.item.image)"
                          variant="tonal"
                          size="small"
                          title="Ver archivo adjunto"
                        ></v-btn>
                      </div>
                    </div>

                    <!-- Acciones - 10% -->
                    <div
                      class="d-flex gap-1"
                      style="width: 10%; justify-content: flex-end; flex-wrap: nowrap"
                    >
                      <v-btn
                        size="35"
                        icon
                        variant="text"
                        color="green-darken-2"
                        @click="editItem(slotProps.item)"
                        class="flex-shrink-0 mr-1"
                        title="Editar Presupuesto"
                      >
                        <v-icon size="20">mdi-pencil</v-icon>
                      </v-btn>

                      <v-btn
                        size="35"
                        icon
                        variant="text"
                        color="red-darken-2"
                        @click="deleteItem(slotProps.item)"
                        class="flex-shrink-0"
                        title="Eliminar Presupuesto"
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
      </v-card-text>
    </v-card>
  </v-container>

  <!-- Diálogo para agregar/editar ingresos -->
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p :class="[isIncome ? 'text-green' : 'text-red', 'text-grey-lighten-1']">
            {{
              isIncome
                ? $t("finances.formInstructions.income")
                : $t("finances.formInstructions.expense")
            }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
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
                      <strong>{{ $t(`finances.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`finances.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`finances.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles del ingreso -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="12">
                  <v-switch
                    v-model="isIncome"
                    inset
                    hide-details
                    :label="''"
                    :base-color="isIncome ? 'green' : 'red'"
                    :color="isIncome ? 'green' : 'red'"
                    class="mb-4 font-weight-bold"
                  >
                    <template #label>
                      <span :class="isIncome ? 'text-green' : 'text-red'">
                        {{
                          isIncome
                            ? $t("finances.fields.income")
                            : $t("finances.fields.spent")
                        }}
                      </span>
                    </template>
                  </v-switch>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.type"
                    :items="types"
                    :label="$t('finances.fields.type')"
                    item-title="name"
                    item-value="id"
                    variant="underlined"
                    :rules="typeRules"
                    :disabled="editedIndex !== -1"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div
                                class="truncate"
                                v-bind="tooltipProps"
                                style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
                              >
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
                  <v-text-field
                    v-if="isIncome"
                    v-model="editedItem.income"
                    :label="$t('finances.fields.income')"
                    variant="underlined"
                    :rules="incomeRules"
                    required
                    :color="'green'"
                  />
                  <v-text-field
                    v-else
                    v-model="editedItem.spent"
                    :label="$t('finances.fields.spent')"
                    variant="underlined"
                    required
                    :rules="[validateSpent]"
                    :hint="spentHint"
                    persistent-hint
                    :class="{
                      'has-negative-hint': availableAmount < 0,
                      'has-positive-hint': availableAmount > 0,
                      'has-neutral-hint': availableAmount === 0,
                    }"
                  />
                </v-col>

                <v-col cols="12" sm="12" v-if="!isIncome">
                  <v-autocomplete
                    v-model="editedItem.budget_id"
                    :items="filteredBudgets"
                    :label="$t('budget.fields.category')"
                    item-title="categoryName"
                    item-value="id"
                    variant="underlined"
                    :rules="selectRules"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <template v-if="isImage(item.raw.icon)">
                              <img
                                :src="`${this.$axios.defaults.baseURL}images/${item.raw.icon}`"
                                alt="icon"
                              />
                            </template>
                            <template v-else>
                              <v-icon>{{ getIconName(item.raw.icon) }}</v-icon>
                            </template>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="d-flex flex-column">
                          <div>
                            {{ $t("finances.fields.total") }}:
                            {{ formatCurrency(item.raw.amount) }}
                          </div>
                          <div>
                            {{ $t("budget.fields.used_amount") }}:
                            {{ formatCurrency(item.raw.used_amount) }}
                          </div>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('finances.fields.attach_file')"
                    variant="underlined"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"
                    :prepend-icon="null"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible() && this.showImage"
                      :src="imgedit"
                      height="120"
                      :label="$t('finances.fields.file')"
                      width="210"
                    />
                    <v-icon
                      v-else
                      class="d-flex align-center justify-center"
                      style="height: 120px; width: 210px; font-size: 120px"
                      >{{ this.icono }}</v-icon
                    >
                  </v-card>
                </v-col>
              </v-row>

              <!-- Step 2: Descripción y fecha -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('finances.fields.description')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                    :rules="descriptionRules"
                  />
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="dateInput"
                        :label="$t('finances.fields.date')"
                        variant="underlined"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#03626C"
                      :model-value="dateInput"
                      @update:model-value="updateDate"
                      :max="maxDate"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn
                  variant="text"
                  class="text-grey-darken-1"
                  @click="step > 0 ? step-- : this.close()"
                >
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn
                  variant="text"
                  class="text-deep-purple-accent-3"
                  @click="nextStep"
                  :disabled="!valid"
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
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- Diálogo de confirmación para eliminar -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card rounded-lg>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.income`) }) }}</span
        >
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
        }}</v-btn>
        <v-btn
          color="#03626C"
          variant="flat"
          :loading="loading"
          @click="deleteItemConfirm"
        >
          {{ $t("taskForm.buttons.confirmDelete") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo para ver imagen -->
  <v-dialog v-model="dialogPhoto" persistent max-width="600px">
    <v-card rounded-lg>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">Detalle</span> <v-spacer></v-spacer>
        <v-btn @click="dialogPhoto = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <template v-if="loadingImage">
          <div class="d-flex justify-center align-center" style="min-height: 200px">
            <v-progress-circular
              indeterminate
              color="#03626C"
              style="width: 100px; height: 100px"
            ></v-progress-circular>
          </div>
        </template>
        <template v-else>
          <v-img :src="selectedImageUrl" aspect-ratio="1.5" contain fill-height></v-img>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import _ from "lodash";
import { shallowRef } from "vue";
import { ThemeSymbol } from "vuetify/lib/composables/theme";

export default {
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    time: null,
    isIncome: true,
    modal2: false,
    timePickerDialog: false,
    steps: [
      {
        title: "financialDetails",
        subtitle: "basic_information",
      },
      {
        title: "description",
        subtitle: "additional_details",
      },
    ],
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
    file: null,
    showImage: false,
    icono: "mdi-file",
    imgMiniatura: "",
    dialog: false,
    dialogDelete: false,
    financialRecords: [],
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: "",
    dateMenu: false,
    dateInput: null,
    home_id: "",
    person_id: "",
    headers: [
      { title: "fecha", key: "date" },
      { title: "Categoría", key: "categoryName" },
      { title: "Ingreso", key: "income" },
      { title: "Gasto", key: "spent" },
      { title: "Tipo", key: "type" },
      { title: "Description", key: "description" },
      { title: "Balance", key: "available" },
      { title: "Método", key: "metodh" },
      { title: "Acciones", key: "actions" },
    ],
    editedItem: {
      id: "",
      type: "",
      method: "",
      income: null,
      available: null,
      spent: null,
      description: "",
      date: null,
      image: null,
      budget_id: "",
    },
    defaultItem: {
      id: "",
      type: "",
      method: "",
      income: null,
      available: null,
      spent: null,
      description: "",
      date: null,
      image: null,
      budget_id: "",
    },
    originalItem: {
      id: "",
      type: "",
      method: "",
      income: null,
      available: null,
      spent: null,
      description: "",
      date: null,
      image: null,
      budget_id: "",
    },
    editedIndex: -1,
    search: "",
    types: [],
    budgets: [],
    blance: {},
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),

  computed: {
    maxDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
      // Esto asegura que sea el inicio del día (evita problemas de hora/minuto)
    },
    filteredIncomes() {
      return this.financialRecords.filter((record) => record.income && record.income > 0);
    },

    filteredFinances() {
      if (!this.editedItem.type) return this.financialRecords; // Si no hay tipo seleccionado, mostrar todos

      // Suponiendo que "types" tiene objetos con { id, name }, y editedItem.type es el ID
      // Necesitamos obtener el "name" del tipo seleccionado para compararlo con budget_type
      /*const selectedType = this.types.find(t => t.id === this.editedItem.type);
    const typeName = selectedType ? selectedType.name : null;

    if (!typeName) return [];*/

      // Filtrar budgets cuyo budget_type coincida con el nombre del tipo seleccionado
      return this.financialRecords.filter(
        (finance) => finance.type === this.editedItem.type
      );
    },
    typeRules() {
      return [
        (v) => !!v || this.$t("finances.validationMessages.type.required"), // Validación de requerido
        (v) =>
          !v || v.length <= 50 || this.$t("finances.validationMessages.type.maxLength"), // Validación de longitud máxima
      ];
    },
    methodRules() {
      return [
        (v) =>
          !v || v.length <= 50 || this.$t("finances.validationMessages.method.maxLength"),
      ];
    },
    incomeRules() {
      return [
        (v) =>
          v === null ||
          v === "" ||
          !isNaN(v) ||
          this.$t("finances.validationMessages.income.number"),
        (v) =>
          v === null ||
          v === "" ||
          /^-?\d+(\.\d{1,2})?$/.test(v) ||
          this.$t("finances.validationMessages.income.precision"),
      ];
    },
    spentRules() {
      return [
        (v) =>
          v === null ||
          v === "" ||
          !isNaN(v) ||
          this.$t("finances.validationMessages.spent.number"),
        (v) =>
          v === null ||
          v === "" ||
          /^-?\d+(\.\d{1,2})?$/.test(v) ||
          this.$t("finances.validationMessages.spent.precision"),
      ];
    },
    descriptionRules() {
      return [
        (v) =>
          !v ||
          v.length <= 255 ||
          this.$t("finances.validationMessages.description.maxLength"),
      ];
    },
    dateRules() {
      return [(v) => !!v || this.$t("finances.validationMessages.date.required")];
    },
    formTitle() {
      const action = this.editedIndex === -1 ? "new" : "edit";
      const type = this.isIncome ? "income" : "expense";

      return this.$t(`finances.titles.${action}.${type}`);
    },
    dateFormatted() {
      const date = this.dateInput ? new Date(this.dateInput) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.dateInput ? new Date(this.dateInput) : new Date();
    },
    imgedit() {
      return this.imgMiniatura;
    },
    filteredBudgets() {
      if (!this.editedItem.type) return this.budgets; // Si no hay tipo seleccionado, mostrar todos

      // Suponiendo que "types" tiene objetos con { id, name }, y editedItem.type es el ID
      // Necesitamos obtener el "name" del tipo seleccionado para compararlo con budget_type
      /*const selectedType = this.types.find(t => t.id === this.editedItem.type);
    const typeName = selectedType ? selectedType.name : null;

    if (!typeName) return [];*/

      // Filtrar budgets cuyo budget_type coincida con el nombre del tipo seleccionado
      return this.budgets.filter((budget) => budget.budget_type === this.editedItem.type);
    },
    availableAmount() {
      if (!this.editedItem.type || !this.balance) return 0;
      return this.editedItem.type === "Personal"
        ? this.balance.personal.available
        : this.balance.home?.available || 0;
    },
    spentHint() {
      const amount = this.availableAmount;
      const formatted = this.formatCurrency(amount);
      return `Disponible: ${formatted}`;
    },
  },

  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
  },
  created() {
    this.tools = [
      {
        name: this.$t("finances.titles.new.finance"),
        action: () => this.showAdd(),
      },
    ];
  },
  methods: {
    obtenerFechaLocal() {
      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = String(hoy.getMonth() + 1).padStart(2, "0");
      const day = String(hoy.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    validateSpent(value) {
      if (value === null || value === undefined || value === "") {
        return "Este campo es requerido.";
      }

      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return "Debe ser un número válido.";
      }

      if (numValue < 0) {
        return "El gasto no puede ser negativo.";
      }

      // Validar contra el disponible según el tipo
      if (!this.editedItem.type) {
        return "Selecciona un tipo primero.";
      }

      if (!this.balance) {
        return "Cargando balance...";
      }

      const available =
        this.editedItem.type === "Personal"
          ? this.balance.personal.available
          : this.balance.home?.available || 0;

      if (numValue > available) {
        return `No puedes gastar más de lo disponible (${this.formatCurrency(
          available
        )}).`;
      }

      return true; // ✅ válido
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
              year: "numeric"
            })
            .replace(/\./g, "");
      }
    },

    getTypeColor(type) {
      console.log("type");
      console.log(type);
      if (!type) return "#607D8B";
      const colorMap = {
        Personal: "#4CAF50", // Azul intenso claro
        Hogar: "#FB8C00", // Naranja intenso
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "#607D8B"; // Color por defecto
    },
    updateDate(value) {
      // value viene como objeto Date desde el date-picker
      // Convertimos a formato YYYY-MM-DD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItem.date = this.dateInput;
      this.dateMenu = false;
    },

    // Método para convertir string a Date (solo cuando sea necesario)
    parseDateString(dateString) {
      if (!dateString) {
        const today = new Date();
        // Aseguramos que sea el inicio del día (evita problemas de zona horaria)
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
      }
      const [year, month, day] = dateString.split("-");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    },
    formatCurrency(value) {
      if (value === null || value === undefined || value === "") return "";

      const number = parseFloat(value);
      if (isNaN(number)) return "";

      return (
        "$" +
        number.toLocaleString("es-CL", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      );
    },
    openModal(imageUrl) {
      this.dialogPhoto = true;
      this.loadingImage = true;
      var img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${imageUrl}`;

      img.onload = () => {
        this.selectedImageUrl = `${this.$axios.defaults.baseURL}images/${imageUrl}`;
        this.loadingImage = false;
      };

      img.onerror = () => {
        this.selectedImageUrl = "";
        this.dialogPhoto = false;
        this.loadingImage = false;
      };
    },
    formatDate(dateString) {
      if (!dateString) return "N/R";
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
    shouldShowTooltip(text) {
      return text && text.length > 120;
    },
    /*updateDate(val) {
      this.dateInput = val;
      this.editedItem.date = this.dateFormatted;
      this.dateMenu = false;
    },*/

    async showAdd() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      this.dateInput = this.obtenerFechaLocal();
      this.editedItem.date = this.dateInput;
      this.file = null;
      this.data = {};
      this.data.home_id = this.home_id;
      this.imgMiniatura = "";
      try {
        const result = await handleRequest({
          endpoint: "get-finances-data",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.budgets = result.data?.budgets || [];
          this.balance = result.data?.balance || {};

          if (!this.editedItem.type && this.types.length > 0) {
            this.editedItem.type = this.types[0].id;
          }
        } else {
          this.types = [];
          this.budgets = [];
          this.balance = {};
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los tipos de consulta.",
          3000
        );
      } finally {
        this.dialog = true;
      }
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
    },

    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.data.type = "Todas";
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-type-finance-range",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          this.financialRecords = result.data?.finances || [];
        } else {
          this.financialRecords = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert(
          "error",
          "Ocurrió un error al cargar los registros financieros.",
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
        this.valid = false;
        const fieldsToUpdate = [
          "home_id",
          "spent",
          "income",
          "image",
          "date",
          "description",
          "image",
          "type",
          "method",
          "budget_id",
          "available",
        ];
        const updatedBalance = this.calculateNewAvailable(
          this.balance,
          this.editedItem,
          "create"
        );

        this.editedItem.available = updatedBalance;
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
          updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
          updatedFields.home_id = Number(this.home_id);
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "finance",
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
          this.showAlert("success", "Debe completar los datos de producto.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "home_id",
          "spent",
          "income",
          "image",
          "date",
          "description",
          "image",
          "type",
          "method",
          "budget_id",
          "available",
        ];
        const newAvailable = this.calculateNewAvailable(
          this.balance,
          this.editedItem,
          "update",
          this.originalItem
        );
        this.editedItem.available = newAvailable;
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
              endpoint: "finance-update",
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
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },

    calculateNewAvailable(currentBalance, editedItem, mode, originalItem = {}) {
      // Determinar la clave según el texto del type
      const typeKey = editedItem.type === "Hogar" ? "home" : "personal";

      // Obtener la categoría actual
      const category = currentBalance[typeKey];
      if (!category) return 0;

      // Clonamos los valores actuales para trabajar con ellos
      let { income, spent, available } = { ...category };

      // Si es edición, revertimos el efecto del registro original
      if (mode === "update") {
        const origIncome = parseFloat(originalItem.income) || 0;
        const origSpent = parseFloat(originalItem.spent) || 0;

        income -= origIncome;
        spent -= origSpent;
        available = income - spent; // Recalculamos para evitar errores de redondeo
      }

      // Aplicamos los nuevos valores
      const newIncome = parseFloat(editedItem.income) || 0;
      const newSpent = parseFloat(editedItem.spent) || 0;

      income += newIncome;
      spent += newSpent;
      available = income - spent;

      return available; // 👈 Solo devolvemos el número, ej: 287000
    },

    async editItem(item) {
      this.showImage = false;
      this.icono = "mdi-file";
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dateInput = item.date || null;
      console.log("this.dateInput");
      console.log(this.dateInput);
      this.file = null;
      item.income > 0 ? (this.isIncome = true) : (this.isIncome = false);
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const extension = item.image?.split(".").pop().toLowerCase();

      if (imageExtensions.includes(extension) || item.image?.startsWith("image/")) {
        this.showImage = true;
        const img = new Image();
        img.src = `${this.$axios.defaults.baseURL}images/${item.image}`;
        img.onload = () => {
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.image}`;
        };
      } else {
        this.icono = "mdi-file";
      }
      try {
        const result = await handleRequest({
          endpoint: "get-finances-data",
          method: "POST",
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.budgets = result.data?.budgets || [];
          this.balance = result.data?.balance || {};
        } else {
          this.types = [];
          this.budgets = [];
          this.balance = {};
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los tipos de consulta.",
          3000
        );
      } finally {
        this.dialog = true;
      }
      this.dialog = true;
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
      });
    },

    async deleteItemConfirm() {
      this.loading = true;
      try {
        const result = await handleRequest({
          endpoint: "delete-financial-record",
          method: "POST",
          data: { id: this.editedItem.id },
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
          "Ocurrió un error al eliminar el registro financiero.",
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
        this.sb_icon = "mdi-alert-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },

    compactRecordData(record) {
      return [
        {
          label: this.$t("finances.fields.type"),
          value: record.type || "N/R",
          fullLabel: this.$t("finances.fields.type"),
          fullValue: record.type || this.$t("finances.notRecorded"),
          icon: "mdi-cash",
          color: "indigo-darken-2",
        },
        {
          label: this.$t("finances.fields.method"),
          value: this.truncateText(record.method) || "N/R",
          fullLabel: this.$t("finances.fields.method"),
          fullValue: record.method || this.$t("finances.notRecorded"),
          icon: "mdi-credit-card",
          color: "green-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },

    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
    },

    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        let img = new Image();
        img.src = this.imgedit;
        return true;
      }
      return false;
    },

    onFileSelected(event) {
      this.imgMiniatura = "";
      let file = event.target.files[0];
      const maxSize = 500 * 1024; // 500 KB en bytes

      if (file && file.size > maxSize) {
        this.valid = false;
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return;
      }

      const mimeType = file.type;
      const extension = file.name.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];

      if (
        (mimeType.startsWith("image/") || imageExtensions.includes(extension)) &&
        imageExtensions.includes(extension)
      ) {
        this.cargarImage(file);
        this.showImage = true;
      } else {
        this.showImage = false;
        this.icono = "mdi-file";
      }

      this.valid = true;
      this.editedItem.image = file;
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

<style>
.has-negative-hint .v-field__hint {
  color: #f44336 !important;
}

.has-positive-hint .v-field__hint {
  color: #4caf50 !important;
}

.has-neutral-hint .v-field__hint {
  color: #9e9e9e !important;
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
}

.date-text {
  font-size: 0.75rem; /* Equivale a text-caption */
  line-height: 1.1;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.text-truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 4.2em;
}

.v-tooltip__content {
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 12px;
  background-color: rgba(97, 97, 97, 0.9);
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

.v-chip {
  margin-right: 4px;
  margin-bottom: 4px;
}

.v-timeline-item {
  padding-bottom: 16px;
}

.v-text-field,
.v-select,
.v-textarea {
  margin-bottom: 12px;
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
