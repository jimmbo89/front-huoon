<!-- src/components/DailyLogCreateDialog.vue -->
<template>
  <!-- Snackbar interno (igual que en tu vista) -->
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

  <!-- Diálogo de creación -->
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
            {{ $t("daily_log.formTitle.create") }}
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
      step="1"
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
      step="1"
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
    personId: {
      type: [String, Number],
      required: true,
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
        person_id: null,
        date: "",
        water_intake: 0,
        sleep_hours: 0,
        steps: 0,
        notes: "",
      },
      waterEnabled: false,
      sleepEnabled: false,
      stepsEnabled: false
    };
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
  created() {
    this.localItem.person_id = this.personId;
  },
  methods: {
    resetForm() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      this.localItem = {
        person_id: this.personId,
        date: `${year}-${month}-${day}`,
        water_intake: 0,
        sleep_hours: 0,
        steps: 0,
        notes: "",
      };
      this.waterEnabled = false;
      this.sleepEnabled = false;
      this.stepsEnabled = false;
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
      if (!this[`${field}Enabled`]) {
        // Si se desmarca, limpiar el valor
        if (field === 'water') this.localItem.water_intake = null;
        if (field === 'sleep') this.localItem.sleep_hours = null;
        if (field === 'steps') this.localItem.steps = null;
      }
    },

    positiveRules(fieldName) {
      return [
        (v) =>
          (v !== "" && v >= 0) ||
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
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;
      try {
        const payload = { ...this.localItem };
        const result = await handleRequest({
          endpoint: "daily-log",
          method: "POST",
          data: payload,
        });

        if (result.success) {
          this.showAlert("success", result.message || "Registro creado correctamente");
          this.$emit("saved", result.data || payload);
          this.close();
        } else {
          this.showAlert("warning", result.message || "No se pudo crear el registro");
        }
      } catch (error) {
        console.error("Error al crear daily log:", error);
        this.showAlert("error", "Ocurrió un error inesperado al crear el registro.");
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