<!-- PetStatusDialog.vue -->
<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="!isFullscreen"
    :max-width="isMobile ? 'none' : '45%'"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card :class="isMobile ? 'pa-0' : 'pa-10'">
      <v-card-title class="text-body-2 font-weight-bold">
        {{ $t("pets.title") }}
      </v-card-title>

      <v-card-text>
        <v-card-title class="d-flex flex-wrap align-right pb-2">
          <v-spacer class="d-none d-md-block"></v-spacer>
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
            />
          </div>
        </v-card-title>

        <div
          class="ma-0 pa-0 responsive-data-table-wrapper"
          :class="isMobile ? 'mobile-scroll' : ''"
        >
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :items-per-page-text="$t('dataTable.itemsPerPageText')"
            :no-data-text="$t('dataTable.noDataText')"
            :loading-text="$t('dataTable.loadingText')"
            :loading="loading"
            :hide-default-header="true"
            class="transparent-table"
          >
            <!-- Encabezado personalizado -->
            <template #top>
              <v-card
                elevation="1"
                flat
                class="mb-2 mx-1 rounded-lg"
                style="
                  border: 1px solid #eceff1;
                  height: 40px;
                  min-height: 40px;
                  display: flex;
                  align-items: center;
                "
              >
                <v-card-text
                  class="d-flex pa-2 font-weight-bold"
                  style="
                    width: 100%;
                    padding: 0 16px !important;
                    display: flex;
                    align-items: center;
                  "
                >
                  <div style="width: 75%" class="text-left">
                    {{ $t("home.membersTable.name") }}
                  </div>
                  <div style="width: 20%" class="text-center">
                    {{ $t("taskForm.fields.status") }}
                  </div>
                  <div style="width: 5%"></div>
                </v-card-text>
              </v-card>
            </template>

            <!-- Fila de cada mascota -->
            <template #item="{ item }">
              <tr style="display: table; width: 100%">
                <td colspan="100%" style="padding: 0; border: none">
                  <v-card class="mb-2 mx-1 rounded-lg" elevation="1" flat>
                    <v-card-text class="d-flex align-center pa-2" style="width: 100%">
                      <!-- Avatar + nombre -->
                      <div style="width: 75%" class="d-flex align-center">
                        <v-avatar size="48" class="mr-1" color="grey-lighten-4">
                          <v-img :src="getImageUrl(item.image)" cover />
                        </v-avatar>
                        <div
                          class="d-flex flex-column justify-center"
                          style="min-width: 0"
                        >
                          <div class="text-body-2 text-truncate">
                            <span>{{ item.name }}</span>
                            <v-tooltip
                              activator="parent"
                              location="bottom"
                              max-width="350"
                            >
                              <span style="white-space: normal; word-break: break-word">
                                {{ item.name }}
                              </span>
                            </v-tooltip>
                          </div>
                          <div class="text-caption text--secondary">
                            {{ item[config.totalKey] }}
                            {{ config.totalLabel(item[config.totalKey]) }}
                          </div>
                        </div>
                      </div>

                      <!-- Estado (ícono) -->
                      <div style="width: 20%" class="d-flex justify-center align-center">
                        <v-icon
                          :color="!item[config.hasKey] ? 'success' : 'red'"
                          size="25"
                        >
                          {{
                            !item[config.hasKey]
                              ? "mdi-check-circle-outline"
                              : "mdi-alert-circle-outline"
                          }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom" max-width="350">
                          <span style="white-space: normal; word-break: break-word">
                            {{
                              !item[config.hasKey]
                                ? config.upToDateMessage
                                : config.pendingMessage
                            }}
                          </span>
                        </v-tooltip>
                      </div>

                      <!-- Botón de expansión -->
                      <div style="width: 5%" class="d-flex justify-center">
                        <v-btn
                          v-if="item[config.hasKey]"
                          icon
                          size="small"
                          variant="text"
                          @click.stop="toggleExpand(item.id)"
                          :class="{ 'rotate-180': isExpanded(item.id) }"
                        >
                          <v-icon size="small">mdi-chevron-down</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </td>
              </tr>

              <!-- Detalles expandidos -->
              <tr v-if="isExpanded(item.id) && item[config.hasKey]">
                <td colspan="100%" class="pa-0" style="background: #fafafa">
                  <div class="px-2 pb-4">
                    <v-card
                      v-for="record in item[config.itemsKey]"
                      :key="record.id"
                      class="mb-2 mx-1 rounded-lg"
                      elevation="1"
                      flat
                    >
                      <v-card-text
                        class="d-flex flex-wrap align-center pa-2"
                        style="width: 100%"
                      >
                        <div
                          class="ma-0 pa-0 responsive-data-table-wrapper d-flex align-center"
                          :class="isMobile ? 'mobile-scroll' : ''"
                        >
                          <!-- Fecha -->
                               <div style="width: 7%; min-width: 0" class="d-flex align-center">
                                <div
                                    class="icono-concavo d-flex flex-column justify-center justify-start mr-2"
                                    :class="`bg-${getTypeColor(record.typeName)}`"
                                    style="min-height: 48px; min-width: 48px; border-radius: 8px;"
                                >
                                    <div class="date-display text-center" style="font-size: 0.95em">
                                    {{ formatIntuitiveDate(record.next_date) }}
                                    </div>
                                </div>
                                </div>

                          <!-- Nombre / Razón -->
                          <div style="width: 30%" class="text-body-2 text-truncate ml-2">
                            {{ record[config.nameField] }}
                            <div
                              v-if="record.dosage"
                              class="text-caption text-grey-darken-1 text-truncate"
                            >
                              {{ record.dosage }} {{ record.unit }}
                            </div>
                          </div>

                          <!-- Notas / Clínica / Veterinario -->
                          <div style="width: 60%" class="text-body-2 text-truncate">
                            {{ record[config.detailField] }}
                            <v-tooltip
                              activator="parent"
                              location="bottom"
                              max-width="350"
                            >
                              <span style="white-space: normal; word-break: break-word">
                                {{ config.detailLabel }}: {{ record[config.detailField] }}
                              </span>
                            </v-tooltip>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="close"> {{ $t("buttons.close") }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PetStatusDialog",
  props: {
    modelValue: { type: Boolean, required: true },
    items: { type: Array, required: true, default: () => [] },
    type: {
      type: String,
      required: true,
      validator: (val) => ["visit", "control", "vaccination"].includes(val),
    },
  },
  emits: ["update:modelValue", "close"],
  data() {
    return {
      isFullscreen: false,
      search: "",
      expandedRows: [],
      headers: [], // no se usan realmente, pero evita warnings
    };
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    isMobile() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm;
    },
    isDesktop() {
      return !this.isMobile;
    },
    config() {
      const configs = {
        visit: {
          hasKey: "hasVetVisits",
          totalKey: "totalVetVisits",
          itemsKey: "vetVisits",
          nameField: "reason",
          detailField: "clinic",
          detailLabel: this.$t("vet_visits.fields.clinic"),
          upToDateMessage: "Tiene citas al día",
          pendingMessage: "Citas pendientes",
          totalLabel: (n) => `cita${n !== 1 ? "s" : ""}`,
        },
        control: {
          hasKey: "hasControls",
          totalKey: "totalControls",
          itemsKey: "controls",
          nameField: "name",
          detailField: "notes",
          detailLabel: this.$t("vaccinations.fields.notes"),
          upToDateMessage: "Tiene controles al día",
          pendingMessage: "Controles pendientes",
          totalLabel: (n) => `control${n !== 1 ? "s" : ""}`,
        },
        vaccination: {
          hasKey: "hasVaccinations",
          totalKey: "totalVaccinations",
          itemsKey: "vaccinations",
          nameField: "name",
          detailField: "notes",
          detailLabel: this.$t("vaccinations.fields.notes"),
          upToDateMessage: "Tiene vacunas al día",
          pendingMessage: "Vacunas vencidas o no registradas",
          totalLabel: (n) => `vacuna${n !== 1 ? "s" : ""}`,
        },
      };
      return configs[this.type] || configs.visit;
    },
    loading() {
      return false; // ajusta si usas loading real
    },
  },
  watch: {
    dialog(val) {
      if (val) this.updateFullscreenMode();
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
    close() {
      this.$emit("close");
      this.dialog = false;
    },
    toggleExpand(id) {
      const index = this.expandedRows.indexOf(id);
      if (index > -1) {
        this.expandedRows.splice(index, 1);
      } else {
        this.expandedRows.push(id);
      }
    },
    isExpanded(id) {
      return this.expandedRows.includes(id);
    },
    formatIntuitiveDate(dateString) {
      if (!dateString) return "Sin fecha";
      const [year, month, day] = dateString.split("-");
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate()) -
          Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
          (1000 * 60 * 60 * 24)
      );
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
              year: "numeric",
            })
            .replace(/\./g, "");
      }
    },
    getTypeColor(type) {
      const colorMap = { Tarea: "warning", Meta: "purple" };
      return colorMap[type] || "warning";
    },
    getImageUrl(imagePath) {
      return `${
        this.$axios.defaults.baseURL
      }images/${imagePath}?t=${this.getCacheTimestamp()}`;
    },
    getCacheTimestamp() {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.getTime();
    },
  },
});
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}

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
.responsive-data-table-wrapper {
  width: 100%;
}
.responsive-data-table-wrapper.mobile-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.responsive-data-table-wrapper.mobile-scroll :deep(.v-data-table) {
  min-width: 800px;
}
@media (min-width: 960px) {
  .responsive-data-table-wrapper :deep(.v-data-table) {
    min-width: auto;
    overflow-x: hidden;
  }
}
.transparent-table {
  max-height: 68vh;
  overflow-y: auto;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
</style>
