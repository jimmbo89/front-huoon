<!-- src/components/NutritionStatusDialog.vue -->
<template>
  <v-dialog
    v-model="dialog"
    max-width="45%"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="pa-1">
      <v-card-title class="text-body-2 font-weight-bold">
        {{ getTitleByType }}
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
                <div style="width: 25%; min-width: 0" class="text-center">
                  {{ getHeaderLabel }}
                </div>
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
                          {{ item.summary.caloriesConsumed }} kcal ·
                          {{ item.summary.waterConsumed }} L ·
                          {{ item.summary.protein }} g
                        </div>
                      </div>
                    </div>

                    <!-- Valor nutricional dinámico -->
                    <div
                      style="
                        width: 25%;
                        min-width: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <v-tooltip
                        location="bottom"
                        max-width="350px"
                        :text="getTooltipMessage(item)"
                      >
                        <template v-slot:activator="{ props }">
                          <div
                            v-bind="props"
                            class="text-body-2 font-weight-medium text-truncate"
                            :class="`text-${getProgressColor(item)}`"
                            style="min-width: 0"
                          >
                            {{ getDisplayValue(item) }}
                          </div>
                        </template>
                      </v-tooltip>
                    </div>
                  </v-card-text>
                </v-card>
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
  name: "NutritionStatusDialog",
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['calories', 'water', 'protein'].includes(value),
    },
  },
  emits: ["close"],
  data: () => ({
    search: "",
    dialog: true,
    loading: false, // puedes activarlo si haces llamadas asíncronas
    headers: [
      { title: "Miembro", key: "name" },
      { title: "Progreso", key: "caloriesConsumed" },
      { title: "Progreso", key: "waterConsumed" },
      { title: "Progreso", key: "protein" },
    ],
  }),
  computed: {
    getHeaderLabel() {
    const fieldMap = {
      calories: 'calories',
      water: 'water',
      protein: 'protein',
    };

    const fieldKey = fieldMap[this.type];
    if (!fieldKey) return this.$t("nutrition.progress");

    // Usa la ruta exacta de tu i18n
    return this.$t(`nutrition_profile.fields.${fieldKey}`);
  },
    getTitleByType() {
      const map = {
        calories: "Calorías",
        water: "Agua",
        protein: "Proteínas",
      };
      // Si usas i18n, reemplaza por:
      // return this.$t(`nutrition.${this.type}`);
      return map[this.type] || "Nutrición";
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getDisplayValue(member) {
      const s = member.summary;
      switch (this.type) {
        case "calories":
          return `${s.caloriesConsumed} / ${s.caloriesGoal} kcal`;
        case "water":
          return `${s.waterConsumed} / ${s.waterGoal} L`;
        case "protein":
          return `${s.protein} / ${s.proteinGoal} g`;
        default:
          return "--";
      }
    },
    getProgressColor(member) {
      const s = member.summary;
      let ratio = 0;
      switch (this.type) {
        case "calories":
          ratio = s.caloriesGoal > 0 ? s.caloriesConsumed / s.caloriesGoal : 0;
          break;
        case "water":
          ratio = s.waterGoal > 0 ? s.waterConsumed / s.waterGoal : 0;
          break;
        case "protein":
          // Meta estimada de proteína (puedes ajustar o recibir del backend)
          const proteinGoal = 50;
          ratio = proteinGoal > 0 ? s.protein / proteinGoal : 0;
          break;
        default:
          return "grey";
      }

      if (ratio >= 1) return "success";
      if (ratio >= 0.7) return "warning";
      return "error";
    },
    getTooltipMessage(member) {
      const s = member.summary;
      switch (this.type) {
        case "calories":
          return `Consumidas: ${s.caloriesConsumed} kcal\nMeta: ${s.caloriesGoal} kcal`;
        case "water":
          return `Consumida: ${s.waterConsumed} L\nMeta: ${s.waterGoal} L`;
        case "protein":
          return `Proteínas: ${s.protein} g\n(Meta estimada: ~50g)`;
        default:
          return "";
      }
    },
    getImageUrl(imagePath) {
      // Asegúrate de que `this.$axios` esté disponible (plugin global o inyectado)
      const baseUrl = this.$axios?.defaults?.baseURL || "";
      return `${baseUrl}images/${imagePath}?t=${this.getCacheTimestamp()}`;
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
/* Si necesitas mantener el estilo de expansión en el futuro */
</style>