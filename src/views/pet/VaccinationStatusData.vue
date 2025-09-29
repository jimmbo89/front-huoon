<!-- src/components/PetVaccinationStatusDialog.vue -->
<template>
  <v-dialog
    v-model="dialog"
    max-width="45%"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="pa-1">
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
            ></v-text-field>
          </div>
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="items"
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
                class="d-flex pa-2 font-weight-bold"
                style="
                  width: 100%;
                  min-width: 0;
                  height: 100%;
                  padding: 0 16px !important;
                  display: flex;
                  align-items: center;
                "
              >
                <div style="width: 75%; min-width: 0" class="text-left">
                  {{ $t("home.membersTable.name") }}
                </div>
                <div style="width: 20%; min-width: 0" class="text-center">
                  {{ $t("taskForm.fields.status") }}
                </div>
                <div style="width: 5%; min-width: 0" class="text-left"></div>
              </v-card-text>
            </v-card>
          </template>

          <template v-slot:item="{ item }">
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
                    <!-- Nombre + imagen -->
                    <div style="width: 75%; min-width: 0" class="d-flex align-center">
                      <v-avatar
                        size="48"
                        class="mr-1 icono-concavo"
                        color="grey-lighten-4"
                        style="flex-shrink: 0"
                      >
                        <v-img
                          :src="getImageUrl(item.image)"
                          cover
                          class="icono-concavo"
                        />
                      </v-avatar>

                      <div class="d-flex flex-column justify-center" style="min-width: 0">
                        <div class="text-body-2 text-truncate">
                          <span>{{ item.name }}</span>
                          <v-tooltip
                            activator="parent"
                            location="bottom"
                            max-width="350px"
                          >
                            <span style="white-space: normal; word-break: break-word">
                              {{ item.name }}
                            </span>
                          </v-tooltip>
                        </div>
                        <div class="text-caption text--secondary">
                          {{ item.totalVaccinations }} vacuna{{
                            item.totalVaccinations !== 1 ? "s" : ""
                          }}
                        </div>
                      </div>
                    </div>

                    <!-- Switch de estado -->
                    <div
                      style="
                        width: 20%;
                        min-width: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <v-icon
                        :color="!item.hasVaccinations ? 'success' : 'red'"
                        size="25"
                        class="mr-1"
                      >
                        {{
                          !item.hasVaccinations
                            ? "mdi-check-circle-outline"
                            : "mdi-alert-circle-outline"
                        }}
                      </v-icon>
                      <v-tooltip
                        activator="parent"
                        location="bottom"
                        max-width="350px"
                      >
                        <span style="white-space: normal; word-break: break-word">
                          {{
                            !item.hasVaccinations
                              ? "Tiene vacunas al día"
                              : "Vacunas vencidas o no registradas"
                          }}
                        </span>
                      </v-tooltip>
                    </div>

                    <!-- Ícono de expansión -->
                    <div
                      style="
                        width: 5%;
                        min-width: 0;
                        display: flex;
                        justify-content: center;
                      "
                    >
                      <v-btn
                        v-if="item.hasVaccinations"
                        icon
                        size="small"
                        variant="text"
                        @click.stop="toggleExpand(item.id)"
                        :class="{ 'rotate-180': isExpanded(item.id) }"
                        style="transition: transform 0.2s"
                      >
                        <v-icon size="small">mdi-chevron-down</v-icon>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </td>
            </tr>

            <!-- Fila expandida -->
            <tr v-if="isExpanded(item.id) && item.hasVaccinations">
              <td colspan="100%" class="pa-0" style="background: #fafafa">
                <div class="px-2 pb-4">
                  <v-card
                    v-for="vaccination in item.vaccinations"
                    :key="vaccination.id"
                    class="mb-2 mx-1 rounded-lg"
                    elevation="1"
                    density="comfortable"
                    flat
                  >
                    <v-card-text
                      class="d-flex flex-wrap align-center pa-2"
                      style="width: 100%"
                    >
                      <div style="width: 7%" class="text-body-2">
                        <v-avatar
                          class="mr-2 icono-concavo"
                          :class="`bg-${getTypeColor(vaccination.typeName)}`"
                          :style="{
                            'min-height': '48px',
                            'min-width': '48px',
                            'border-radius': '8px',
                            'font-size': '0.90em',
                          }"
                        >
                          <div class="text-body-3 font-weight-medium">
                            {{ formatIntuitiveDate(vaccination.next_date) }}
                          </div>
                        </v-avatar>
                        <v-tooltip
                          activator="parent"
                          location="bottom"
                          max-width="350px"
                        >
                          <span style="white-space: normal; word-break: break-word">
                            {{ $t("vaccinations.fields.next_date") }}:
                            {{ formatIntuitiveDate(vaccination.next_date) }}
                          </span>
                        </v-tooltip>
                      </div>
                      <div
                        style="width: 30%"
                        class="text-body-2 text-truncate ml-2"
                      >
                        {{ vaccination.name }}
                      </div>
                      <div
                        style="width: 60%"
                        class="text-body-2 text-truncate"
                      >
                        {{ vaccination.notes }}
                        <v-tooltip
                          activator="parent"
                          location="bottom"
                          max-width="350px"
                        >
                          <span style="white-space: normal; word-break: break-word">
                            {{ $t("vaccinations.fields.notes") }}:
                            {{ vaccination.notes }}
                          </span>
                        </v-tooltip>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="close">
          {{ $t("buttons.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PetVaccinationStatusDialog",
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "close"],
  data: () => ({
    search: "",
    expandedRows: [],
    dialog: true,
    headers: [
      { title: "Mascota", key: "name" },
      { title: "Estado", key: "hasVaccinations" },
      { title: "Cantidad", key: "totalVaccinations" },
    ],
  }),
  computed: {
  },
  methods: {
    close() {
      this.$emit("close");
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
      const inputUTC = Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      );
      const todayUTC = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const diffDays = Math.floor((inputUTC - todayUTC) / (1000 * 60 * 60 * 24));
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
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
      };
      return colorMap[type] || "warning";
    },
    getImageUrl(imagePath) {
      return `${this.$axios.defaults.baseURL}images/${imagePath}?t=${this.getCacheTimestamp()}`;
    },
    getCacheTimestamp() {
      // Usamos medianoche (00:00:00) del día actual
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.getTime(); // Ej: 1714003200000 (cambia una vez al día)
    },
  },
});
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>