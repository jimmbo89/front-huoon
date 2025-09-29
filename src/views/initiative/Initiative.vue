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
  <v-container class="pa-4"> <v-card elevation="2" rounded="lg" flat>
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-col cols="12" sm="9" md="9" class="d-flex align-center">
          <v-avatar size="48" class="me-3" color="grey-lighten-4" variant="tonal">
            <v-icon color="warning">mdi-calendar-weekend-outline</v-icon>
          </v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold mb-1">
              Iniciativas de metas
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
    <!-- Título y búsqueda -->
    <v-card-title class="d-flex flex-wrap align-center gap-4 pb-0">
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
        >
        </v-text-field>
      </div>
    </v-card-title>

    <!-- Tabla de datos -->
    <v-data-table
      :headers="headers"
      :items="initiatives"
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
            <!-- Nombre y descripción (40%) -->
            <div style="width: 40%; min-width: 0" class="text-left">
              {{ $t("taskForm.fields.title") }} / {{ $t("taskForm.fields.description") }}
            </div>

            <!-- Tipo (10%) -->
            <div style="width: 15%; min-width: 0" class="text-center">
              {{ $t("taskForm.fields.recurrence") }}
            </div>

            <!-- Prioridad (10%) -->
            <div style="width: 15%; min-width: 0" class="text-center">
              {{ $t("taskForm.fields.priority") }}
            </div>

            <div style="width: 10%; min-width: 0" class="d-flex justify-center">
              {{ $t("taskForm.fields.status") }}
            </div>

            <div style="width: 13%; min-width: 0" class="d-flex justify-center">
              Tipo
            </div>

            <!-- Acciones (5%) -->
            <div style="width: 7%; min-width: 0" class="d-flex justify-center">
              {{ $t("settings.actions") }}
            </div>
          </v-card-text>
        </v-card>
      </template>

      <!-- Fila personalizada -->
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

                <!-- Nombre + Descripción - 40% -->
                <div style="width: 40%; min-width: 0" class="d-flex flex-column">
                  <div class="font-weight-bold text-body-2 text-truncate">
                    {{ slotProps.item.title }}
                  </div>
                  <div class="text-caption text-grey-darken-1 text-truncate">
                    {{ slotProps.item.description }}
                  </div>
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">
                      {{ slotProps.item.description }}
                    </span>
                  </v-tooltip>
                </div>

                <!-- Tipo - 10% -->
                <div style="width: 15%; min-width: 0; text-align: center">
                  <span class="text-body-2 text-truncate">
                    {{ slotProps.item.recurrence }}
                  </span>
                </div>

                <!-- Prioridad - 10% -->
                <div style="width: 15%; min-width: 0; text-align: center">
                  <span class="text-body-2 text-truncate">
                    {{ slotProps.item.namePriority }}
                  </span>
                </div>

                <div style="width: 10%; min-width: 0; text-align: center">
                <v-avatar size="24" :color="'#' + getTaskTypeColor(slotProps.item.status)" class="mr-1">
                    <v-icon size="16" color="white">
                      {{ getTaskTypeIcon(slotProps.item.status)  }}
                    </v-icon>
                  </v-avatar>
                  <span class="text-body-2">
                    {{ slotProps.item.status }}
                  </span>
                </div>

                <div style="width: 12%; min-width: 0; text-align: center">
                  <v-avatar size="24" :color="'#' + getTaskTypeColor(slotProps.item.task_type)" class="mr-1">
                    <v-icon size="16" color="white">
                      {{ getTaskTypeIcon(slotProps.item.task_type)  }}
                    </v-icon>
                  </v-avatar>
                  <span class="text-body-2">
                    {{ slotProps.item.task_type }}
                  </span>
              </div>

                <!-- Acciones - 5% -->
                <div
                  class="d-flex gap-1"
                  style="width: 7%; justify-content: flex-end; flex-wrap: nowrap"
                >
                  <v-btn
                    size="35"
                    icon
                    variant="text"
                    color="green-darken-2"
                    @click="editItem(slotProps.item)"
                    class="flex-shrink-0 mr-1"
                    :title="$t('buttons.edit')"
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
   </v-card-text>
  </v-card>
  </v-container>
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <!-- Pasos laterales -->

          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">{{ $t("formInstructions") }}</p>
          <v-row class="mt-12">
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
                      <strong>{{ s.title }}</strong>
                      <div class="text-caption text-grey">
                        {{ s.subtitle }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ steps[step].title }}
              </h3>

              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-text-field v-model="editedItem.title" :label="$t('taskForm.fields.title')" variant="underlined"
                    :rules="nameRules" />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select v-model="editedItem.priority_id" :items="priorities" item-title="namePriority"
                    item-value="id" :label="$t('taskForm.fields.priority')" variant="underlined" required>
                    <!-- Cómo se muestra en la lista desplegable -->
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :title="item.raw.namePriority"
                        :subtitle="item.raw.descriptionPriority">
                        <template v-slot:prepend>
                          <v-icon :color="'#' + item.raw.colorPriority">
                            mdi-priority-high
                          </v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItem.description" :label="$t('taskForm.fields.description')"
                    variant="underlined" rows="3"></v-textarea>
                </v-col>
              </v-row>
              <v-row dense v-if="step === 1">
                 <v-col cols="12" md="4">
                  <v-select v-model="editedItem.recurrence" :items="recurrences" item-title="name" item-value="id"
                    :label="$t('taskForm.fields.recurrence')" variant="underlined"
                    :rules="selectRules">
                  </v-select>
                </v-col>
                <v-col cols="12" sm="2" md="4">
                <v-select
                  v-model="editedItem.task_type"
                  :items="taskTypes"
                  item-title="name"
                  item-value="id"
                  label="Tipo"
                  variant="underlined"
                  :rules="selectRules"
                >
                  <template v-slot:selection="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar size="20" :color="'#' + item.raw.color" class="mr-2">
                        <v-icon size="small" color="white">{{ item.raw.icon }}</v-icon>
                      </v-avatar>
                      {{ item.raw.name }}
                    </div>
                  </template>

                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar size="20" :color="'#' + item.raw.color">
                          <v-icon size="small" color="white">{{ item.raw.icon }}</v-icon>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="editedItem.status"
                    :items="statusOptions"
                    item-title="nameStatus"
                    item-value="id"
                    label="Estado"
                    variant="underlined"
                    :rules="selectRules"
                  >
                    <!-- Selección actual -->
                    <template v-slot:selection="{ item }">
                      <div class="d-flex align-center">
                        <v-avatar size="20" :color="'#' + item.raw.colorStatus" class="mr-2">
                          <v-icon size="small" color="white">{{ item.raw.iconStatus }}</v-icon>
                        </v-avatar>
                        {{ item.raw.nameStatus }}
                      </div>
                    </template>

                    <!-- Opciones del dropdown -->
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="20" :color="'#' + item.raw.colorStatus">
                            <v-icon size="small" color="white">{{ item.raw.iconStatus }}</v-icon>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : this.close()">
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep" :disabled="!valid">
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
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.task`) }) }}</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
          }}</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">
          {{ $t("taskForm.buttons.confirmDelete") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import { shallowRef } from "vue";
import SuggestedTasksList from "@/components/suggested/SuggestedTasksList.vue";
import { defineAsyncComponent, markRaw } from "vue";
export default {
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    steps: [
      { title: "Información Básica", subtitle: "Ingresa el título y descripción" },
      { title: "Programación y Estados", subtitle: "Elige la frecuencia y el estado" },
    ],
    statusOptions: [
      {
        id: 'Activa',
        nameStatus: 'Activa',
        descriptionStatus: 'Tarea activa y en seguimiento',
        colorStatus: '4CAF50', // verde
        iconStatus: 'mdi-check-circle-outline'
      },
      {
        id: 'Inactiva',
        nameStatus: 'Inactiva',
        descriptionStatus: 'Tarea pausada o archivada',
        colorStatus: 'F44336', // rojo
        iconStatus: 'mdi-cancel'
      }
    ],
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
    initiatives: [],
    priorities: [],
    recurrences: [],
    typetasks: [],
    taskTypes: [],
    home_id: "",
    data: {},
    person_id: "",
   search: "",
       headers: [
        { title: "Título", key: "title", sortable: false },
        { title: "Descripción", key: "description", sortable: false },
        { title: "Tipo", key: "task_type", sortable: false },
        { title: "Recurrencia", key: "recurrence", sortable: false },
        { title: "Prioridad", key: "namePriority", sortable: false },
        { title: "Estado", key: "status", sortable: false },
        { title: "Acciones", key: "actions", sortable: false },
      ],
    editedItem: {
      id: "",
      title: "",
      description: "",
      module: "Meta",
      task_type: "Personal",
      type: "Meta",
      parent_id: "",
      priority_id: "",
      status: "Activa",
      person_id: null,
      recurrence: "",
    },
    defaultItem: {
      id: "",
      title: "",
      description: "",
      module: "Meta",
      task_type: "Personal",
      type: "Meta",
      parent_id: "",
      priority_id: "",
      status: "Activa",
      person_id: null,
      recurrence: "",
    },
    originalItem: {
      id: "",
      title: "",
      description: "",
      module: "",
      task_type: "",
      type: "",
      parent_id: "",
      priority_id: "",
      status: "",
      person_id: null,
      recurrence: "",
    },
    editedIndex: -1,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    sections: [
      { label: "General", value: "general", icon: "mdi-file-document-outline" },
      { label: "Personas", value: "personas", icon: "mdi-account-group-outline" },
      { label: "Módulo", value: "modulo", icon: "mdi-view-dashboard-outline" },
      { label: "Estado", value: "estado", icon: "mdi-progress-check" },
    ],
    title: "",
    description: "",
    date: "",
    module: "",
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Agregar nueva iniciativa"
        : "Editar iniciativa";
    },
    switchColor() {
      return this.editedItem.task_type === 'Personal' ? '#03626C' : '#FB8C00';
    },
    getCurrentName() {
      const type = this.taskTypes.find(t => t.id === this.editedItem.task_type);
      return type ? type.name : this.editedItem.task_type;
    },
  },
  created() {
    this.tools = [
      {
        name: 'Agregar iniciativa',
        action: () => this.showAdd(),
      },
    ];
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
  },
  methods: {
    async changeStatus(task, newStatus) {
      // Tu lógica para cambiar el estado
      //task.status_id = newStatusId;
      this.valid = false;
      this.data = {};
      this.data.id = task.id;
      this.data.status = newStatus;
      try {
        const result = await handleRequest({
          endpoint: "task-update",
          method: "POST",
          data: this.data,
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
      }
      task.statusDialog = false;
      // Aquí probablemente quieras hacer una llamada API para actualizar el estado en el backend
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
     getTaskTypeIcon(type) {
    const icons = {
      Personal: 'mdi-account-outline',
      Hogar: 'mdi-home-outline',
      Trabajo: 'mdi-briefcase-outline',
      Salud: 'mdi-heart-pulse',
      Otro: 'mdi-puzzle-outline',
      Inactiva: 'mdi-cancel',
      Activa: 'mdi-check-circle-outline'
    };
    return icons[type] || 'mdi-tag-outline';
  },
  getTaskTypeColor(type) {
    const colors = {
      Personal: '2196F3', // azul
      Hogar: 'FF9800',   // naranja
      Trabajo: '9C27B0', // morado
      Salud: '4CAF50',   // verde
      Otro: '9E9E9E',    // gris
      Inactiva: 'F44336',
      Activa: '4CAF50',
    };
    return colors[type] || '757575';
  },
    async showAdd() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.editedIndex = -1;
      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });
        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.priorities = result.data?.taskpriorities || [];
          const normalPriority = this.priorities.find(
            (priority) => priority.name === "Normal"
          );
          if (normalPriority) {
            this.editedItem.priority_id = normalPriority.id;
          }
          this.recurrences = result.data?.taskrecurrences || [];
          const diaryRecurrence = this.recurrences.find(
            (recurrence) => recurrence.recurrenceName === "Diaria"
          );
          if (diaryRecurrence) {
            this.editedItem.recurrence = diaryRecurrence.name;
          }
          this.typetasks = result.data?.tasktype || [];
          this.taskTypes = result.data?.tasktypetask.map(t => ({
            ...t,
            icon: this.getTaskTypeIcon(t.id),
            color: this.getTaskTypeColor(t.id)
          })) || [];
          console.log("typetasks:", this.typetasks);
          //
        } else {
          // Si no hay datos, asigna
          this.priorities = [];
          this.recurrences = [];
          this.typetasks = [];
          this.taskTypes = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
      }
    },
    close() {
      this.step = 0;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.file = null;
      this.imgMiniatura = "";
      this.editedIndex = -1;
    },
    async initialize() {
      //this.data.start_date = formattedDate;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "initiative",
          method: "GET",
        });
        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.initiatives = result.data?.initiatives;
        } else {
          // Si no hay datos, asignamos un array vacío
          this.initiatives = [];
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
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "title",
          "description",
          "parent_id",
          "status",
          "task_type",
          "recurrence",
          "priority_id",
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
        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.type = this.editedItem.type ? this.editedItem.type : "Meta";

          try {
            const result = await handleRequest({
              endpoint: "initiative",
              method: "POST",
              data: updatedFields,
            });
            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              if (result.data?.suggestedTasks?.length > 0) {
                this.suggestedTasks = result.data.suggestedTasks;
                this.dialogSuggested = true;
              }
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
          "title",
          "description",
          "parent_id",
          "status",
          "task_type",
          "recurrence",
          "priority_id",
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
          try {
            const result = await handleRequest({
              endpoint: "initiative-update",
              method: "POST",
              data: updatedFields,
            });
            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.editedIndex = -1;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.editedIndex = -1;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.editedIndex = -1;
          this.loading = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.originalItem = _.cloneDeep(item);
      this.editedItem = _.cloneDeep(item);

      this.data = {};
      this.data.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });
        if (result.success) {
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.typetasks = result.data?.tasktype || [];
          this.taskTypes = result.data?.tasktypetask.map(t => ({
            ...t,
            icon: this.getTaskTypeIcon(t.id),
            color: this.getTaskTypeColor(t.id)
          })) || [];
        } else {
          this.priorities = [];
          this.recurrences = [];
          this.typetasks = [];
          this.taskTypes = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
      }
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
        this.originalItem = Object.assign({}, this.defaultItem);
      });
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "initiative-destroy",
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
.date-display {
  font-size: 0.75rem; /* Equivale a text-caption */
  line-height: 1.1;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
/* Estilos para la hora */
.time-display {
  font-size: 0.625rem;
  line-height: 1;
  margin-top: 2px;
}
.fullscreen-dialog {
  height: 100vh !important;
  max-height: 100vh !important;
  min-width: 100vh;
  margin: 0 !important;
  padding: 0 !important;
}
.people-scroll-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 12px;
  /* Más espacio para el scroll */
  scrollbar-width: thin;
  /* Para navegadores modernos */
}
/* Estilo para la barra de scroll en WebKit */
.people-scroll-container::-webkit-scrollbar {
  height: 6px;
}
.people-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.people-scroll-wrapper {
  display: inline-flex;
  gap: 12px;
  /* Más espacio entre cards */
  padding: 4px 8px;
  /* Padding para que no peguen a los bordes */
}
.person-card {
  cursor: pointer;
  transition: all 0.3s ease;
  width: 220px;
  /* Ancho fijo */
  flex-shrink: 0;
  /* Evita que se reduzcan */
  border-radius: 8px !important;
  /* Bordes más redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
  /* Sombra sutil por defecto */
}
.person-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}
.selected-person {
  border: 2px solid #03626c;
  background-color: rgba(3, 98, 108, 0.08) !important;
  /* Color más suave */
}
.current-user {
  border-left: 3px solid #1976d2;
  /* Indicador lateral para el usuario actual */
}
.person-info {
  max-width: calc(220px - 60px);
  /* 220px (card) - 40px (avatar) - 20px (márgenes) */
  overflow: hidden;
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
.date-text {
  width: 100%;
  font-size: 0.75rem; /* Equivalente a text-caption */
  line-height: 1.2; /* Mejor interlineado */
  font-weight: 500; /* Medium weight */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>