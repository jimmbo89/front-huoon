<!-- src/components/DailyLogCreateDialog.vue -->
<template>
  <!-- Snackbar interno -->
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
        <v-avatar :icon="sb_icon" :color="sb_type" size="40"></v-avatar>
      </v-col>
      <v-col md="10">
        <h4>{{ sb_title }}</h4>
        {{ sb_message }}
      </v-col>
    </v-row>
  </v-snackbar>

  <!-- Diálogo -->
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    transition="dialog-bottom-transient"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`daily_log.formTitle.${isEditing ? 'edit' : 'create'}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("daily_log.formInstructions") }}</p>

          <v-row class="mt-12">
            <!-- Timeline lateral -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item dot-color="deep-purple" icon="mdi-numeric-1" size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t("daily_log.steps.info.title") }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t("daily_log.steps.info.subtitle") }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Formulario -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t("daily_log.steps.info.title") }}
              </h3>

              <v-row dense>
                <!-- Fecha -->
                <v-col cols="12" md="6">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="true"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="localItem.date"
                        :label="$t('physicalExam.fields.exam_date')"
                        variant="underlined"
                        readonly
                      />
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :model-value="parseDate(localItem.date)"
                        @update:model-value="updateDate"
                        :max="new Date().toISOString().split('T')[0]"
                      />
                    </v-locale-provider>
                  </v-menu>
                </v-col>
              </v-row>

              <v-row dense>
                <!-- Agua -->
                <v-col cols="12" md="6">
                  <div class="d-flex align-center">
                    <div style="width: 40%; flex-shrink: 0" class="d-flex align-center">
                      <v-checkbox
                        v-model="waterEnabled"
                        :label="$t('daily_log.fields.water_intake')"
                        color="deep-purple"
                        hide-details
                        class="me-2"
                        @update:model-value="toggleField('water')"
                      />
                    </div>
                    <v-text-field
                      v-show="waterEnabled"
                      v-model.number="localItem.water_intake"
                      variant="underlined"
                      type="number"
                      step="0.1"
                      min="0"
                      style="width: 60%"
                      density="compact"
                      hide-details
                      :rules="positiveRules($t('daily_log.fields.water_intake'))"
                    />
                  </div>
                </v-col>
              </v-row>

              <v-row dense>
                <!-- Sueño -->
                <v-col cols="12" md="6">
                  <div class="d-flex align-center">
                    <div style="width: 40%; flex-shrink: 0" class="d-flex align-center">
                      <v-checkbox
                        v-model="sleepEnabled"
                        :label="$t('daily_log.fields.sleep_hours')"
                        color="deep-purple"
                        hide-details
                        class="me-2"
                        @update:model-value="toggleField('sleep')"
                      />
                    </div>
                    <v-text-field
                      v-show="sleepEnabled"
                      v-model.number="localItem.sleep_hours"
                      variant="underlined"
                      type="number"
                      step="0.5"
                      min="0"
                      style="width: 60%"
                      density="compact"
                      hide-details
                      :rules="positiveRules($t('daily_log.fields.sleep_hours'))"
                    />
                  </div>
                </v-col>
              </v-row>

              <v-row dense>
                <!-- Pasos -->
                <v-col cols="12" md="6">
                  <div class="d-flex align-center">
                    <div style="width: 40%; flex-shrink: 0" class="d-flex align-center">
                      <v-checkbox
                        v-model="stepsEnabled"
                        :label="$t('daily_log.fields.steps')"
                        color="deep-purple"
                        hide-details
                        class="me-2"
                        @update:model-value="toggleField('steps')"
                      />
                    </div>
                    <v-text-field
                      v-show="stepsEnabled"
                      v-model.number="localItem.steps"
                      variant="underlined"
                      type="number"
                      min="0"
                      style="width: 60%"
                      density="compact"
                      hide-details
                      :rules="positiveRules($t('daily_log.fields.steps'))"
                    />
                  </div>
                </v-col>

                <!-- Notas -->
                <v-col cols="12">
                  <v-textarea
                    v-model="localItem.notes"
                    :label="$t('daily_log.fields.notes')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                  />
                </v-col>
              </v-row>

              <!-- Botones -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="close">
                  {{ $t("buttons.close") }}
                </v-btn>
                <v-btn
                  variant="text"
                  class="text-deep-purple-accent-3"
                  @click="submit"
                  :disabled="!valid"
                  :loading="loading"
                >
                  {{ $t("buttons.saveAndClose") }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { handleRequest } from "@/utils/api";

export default {
  name: "DailyLogCreateDialog",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    selectedPerson: { type: Object, required: true },
    item: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["update:modelValue", "close", "saved"],
  data() {
    return {
      dialog: false,
      valid: true,
      loading: false,
      dateMenu: false,
      snackbar: false,
      sb_type: "",
      sb_message: "",
      sb_timeout: 2000,
      sb_title: "",
      sb_icon: "",
      localItem: {
        id: null,
      person_id: null,
      date: "",
      water_intake: null,
      sleep_hours: null,
      steps: null,
      notes: "",
    },
    originalItem: {
      id: null,
      person_id: null,
      date: "",
      water_intake: null,
      sleep_hours: null,
      steps: null,
      notes: "",
    },
      waterEnabled: false,
      sleepEnabled: false,
      stepsEnabled: false,
      // Backups para restaurar valores
      waterBackup: null,
      sleepBackup: null,
      stepsBackup: null,
    };
  },
  computed: {
    isEditing() {
      return this.item && this.item.id != null;
    },
  },
  watch: {
    modelValue(val) {
      this.dialog = val;
      if (val) {
        this.resetForm();
      }
    },
    dialog(val) {
      this.$emit("update:modelValue", val);
      if (!val) {
        this.$emit("close");
      }
    },
  },
  methods: {
    resetForm() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      if (this.isEditing) {
        this.localItem = {
          id: this.item.id,
          person_id: this.item.person_id,
          date: this.item.date,
          water_intake: this.item.water_intake ?? null,
          sleep_hours: this.item.sleep_hours ?? null,
          steps: this.item.steps ?? null,
          notes: this.item.notes ?? "",
        };

        // Guardar copia original para comparar cambios
        this.originalItem = { ...this.localItem };

        this.waterBackup = this.item.water_intake ?? null;
        this.sleepBackup = this.item.sleep_hours ?? null;
        this.stepsBackup = this.item.steps ?? null;

        this.waterEnabled = this.item.water_intake != null;
        this.sleepEnabled = this.item.sleep_hours != null;
        this.stepsEnabled = this.item.steps != null;
      } else {
        this.originalItem = { ...this.localItem }; // copia inicial
        this.localItem = {
          person_id: this.selectedPerson.id,
          date: `${year}-${month}-${day}`,
          water_intake: null,
          sleep_hours: null,
          steps: null,
          notes: "",
        };

        this.waterBackup = null;
        this.sleepBackup = null;
        this.stepsBackup = null;
        this.waterEnabled = false;
        this.sleepEnabled = false;
        this.stepsEnabled = false;
      }
    },

    parseDate(dateStr) {
      if (!dateStr) return null;
      const [y, m, d] = dateStr.split("-");
      return new Date(y, m - 1, d);
    },

    updateDate(dateObj) {
      if (dateObj) {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");
        this.localItem.date = `${y}-${m}-${d}`;
      }
      this.dateMenu = false;
    },

    toggleField(field) {
      const enabled = this[`${field}Enabled`];
      if (enabled) {
        // Restaurar desde backup
        if (field === 'water') this.localItem.water_intake = this.waterBackup;
        if (field === 'sleep') this.localItem.sleep_hours = this.sleepBackup;
        if (field === 'steps') this.localItem.steps = this.stepsBackup;
      } else {
        // Guardar en backup y limpiar
        if (field === 'water') {
          this.waterBackup = this.localItem.water_intake;
          this.localItem.water_intake = null;
        }
        if (field === 'sleep') {
          this.sleepBackup = this.localItem.sleep_hours;
          this.localItem.sleep_hours = null;
        }
        if (field === 'steps') {
          this.stepsBackup = this.localItem.steps;
          this.localItem.steps = null;
        }
      }
    },

    positiveRules(fieldName) {
      return [
        (v) => v === null || v === "" || v >= 0 ||
          this.$t("daily_log.validation.positive_number", { field: fieldName }),
      ];
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

    async submit() {
      this.loading = true;

      // Campos que queremos considerar para actualización
      const fieldsToUpdate = [
        "date",
        "water_intake",
        "sleep_hours",
        "steps",
        "notes",
        "person_id"
      ];

      // Comparar contra originalItem para detectar cambios reales
      let updatedFields = Object.keys(this.localItem)
        .filter(key =>
          fieldsToUpdate.includes(key) &&
          this.localItem[key] !== this.originalItem[key]
        )
        .reduce((obj, key) => {
          obj[key] = this.localItem[key];
          return obj;
        }, {});

      // Si no hay cambios, salir
      if (Object.keys(updatedFields).length === 0) {
        this.loading = false;
        this.showAlert("success", "No se realizaron cambios.", 3000);
        this.close();
        return;
      }

      // Añadir ID si es edición
      if (this.isEditing) {
        updatedFields.id = this.localItem.id;
      }


      try {
        const endpoint = this.isEditing ? "daily-log-update" : "daily-log";
        const result = await handleRequest({
          endpoint,
          method: "POST",
          data: updatedFields,
        });

        if (result.success) {
          this.showAlert(
            "success",
            result.message || (this.isEditing ? "Registro actualizado correctamente" : "Registro creado correctamente"),
            3000
          );
          this.$emit("saved", result.data || updatedFields);
          this.close();
        } else {
          this.showAlert("warning", result.message || "No se pudo guardar el registro", 3000);
        }
      } catch (error) {
        console.error("Error al guardar daily log:", error);
        this.showAlert("error", "Ocurrió un error inesperado.", 3000);
      } finally {
        this.loading = false;
      }
    },

    close() {
      this.dialog = false;
    },
  },
};
</script>