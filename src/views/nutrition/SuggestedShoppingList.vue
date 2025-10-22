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
        <v-avatar :icon="sb_icon" :color="sb_type" size="40"></v-avatar>
      </v-col>
      <v-col md="10">
        <h4>{{ sb_title }}</h4>
        {{ sb_message }}
      </v-col>
    </v-row>
  </v-snackbar>

  <v-container>
    <v-card class="pa-4" elevation="4" rounded="lg">
    <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
          <v-btn
            v-for="tool in tools"
            :key="tool.name"
            @click="tool.action()"
            :disabled="tool.disabled"
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
            clearable
          ></v-text-field>
        </div>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="products"
        :search="search"
        :items-per-page-text="$t('dataTable.itemsPerPageText')"
        :no-data-text="$t('dataTable.noDataText')"
        :loading-text="$t('dataTable.loadingText')"
        :loading="loading"
        :hide-default-header="true"
        return-object
        show-select
        class="mt-1"
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
        <!-- Header personalizado -->
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
              <div style="width: 50%; min-width: 0" class="text-left">
                {{ $t("product.fields.name") }}
              </div>
              <div style="width: 15%; min-width: 0" class="text-center">
                {{ $t("product.fields.quantity") }}
              </div>
              <div style="width: 35%; min-width: 0" class="text-left">
                {{ $t("shoppingList.reason") }}
              </div>
            </v-card-text>
          </v-card>
        </template>

        <!-- Fila personalizada 
        <template v-slot:item="{ item }">
          <tr style="display: table; width: 100%; table-layout: fixed;">
            <td colspan="100%" style="padding: 0; border: none">
              <v-card class="mb-2 mx-1 rounded-lg" elevation="1" flat>
                <v-card-text class="d-flex align-center pa-2" style="width: 100%">
                  <div style="width: 50%" class="d-flex align-center">
                    <v-avatar size="48" class="mr-3 icono-concavo" color="grey-lighten-4" style="flex-shrink: 0">
                      <v-img :src="getImageUrl(item.image)" cover class="icono-concavo" />
                    </v-avatar>
                    <div class="d-flex flex-column" style="min-width: 0">
                      <div class="font-weight-bold text-body-2 text-truncate">
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                  <div style="width: 15%; text-align: center" class="text-body-2">
                    {{ item.quantity }}
                  </div>
                  <div style="width: 35%; text-align: left" class="text-body-2 text-truncate">
                    {{ $t(`shoppingList.reasons.${item.reason}`) }}
                  </div>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>-->
        <template v-slot:item="{ item }">
          <tr style="display: table; width: 100%; table-layout: fixed;">
            <td colspan="100%" style="padding: 0; border: none">
              <v-card class="mb-2 mx-1 rounded-lg" elevation="1" flat :class="{ 'oscurecer-persistente': isSelected(item) }">
                <v-card-text class="d-flex align-center pa-2" style="width: 100%">
                  <!-- Checkbox de selección -->
                  <v-checkbox-btn
                    :model-value="isSelected(item)"
                    @update:model-value="() => toggleSelection(item)"
                    class="mr-3 flex-shrink-0"
                    style="width: 24px; height: 24px"
                    density="compact"
                    color="primary"
                    hide-details
                  ></v-checkbox-btn>

                  <!-- Nombre e imagen -->
                  <div style="width: calc(50% - 32px)" class="d-flex align-center">
                    <v-avatar size="48" class="mr-3 icono-concavo" color="grey-lighten-4" style="flex-shrink: 0">
                      <v-img :src="getImageUrl(item.image)" cover class="icono-concavo" />
                    </v-avatar>
                    <div class="d-flex flex-column" style="min-width: 0">
                      <div class="font-weight-bold text-body-2 text-truncate">
                        {{ item.name }}
                      </div>
                    </div>
                  </div>

                  <!-- Cantidad -->
                  <div style="width: 15%; text-align: center" class="text-body-2">
                    {{ item.quantity }}
                  </div>

                  <!-- Motivo -->
                  <div style="width: 35%; text-align: left" class="text-body-2 text-truncate">
                    {{ $t(`shoppingList.reasons.${item.reason}`) }}
                  </div>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";

export default {
  props: {
    selectedPerson: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    selected: [],
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    loading: false,
    products: [],
    home_id: null,
    search: "",
    headers: [
      { title: 'Nombre', value: 'name', sortable: false },
      { title: 'Cantidad', value: 'quantity', sortable: false },
      { title: 'Motivo', value: 'reason', sortable: false }
    ]
  }),
  computed: {
    tools() {
      return [
        {
          name: this.$t('shoppingList.createShoppingTask'),
          action: () => this.createShoppingTask(), // ← cambia a createShoppingTask
          disabled: this.selected.length === 0 // ✅ reactivo y correcto
        }
      ];
    }
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.loadSuggestedShoppingList();
  },
  methods: {
    isSelected(item) {
      // Compara por ID para evitar problemas de referencia
      return this.selected.some(selectedItem => selectedItem.id === item.id);
    },
    toggleSelection(item) {
      const exists = this.selected.some(selectedItem => selectedItem.id === item.id);
      if (exists) {
        // Eliminar por ID
        this.selected = this.selected.filter(selectedItem => selectedItem.id !== item.id);
      } else {
        // Añadir el objeto completo
        this.selected.push(item);
      }
    },
    createShoppingTask() {
      if (this.selected.length === 0) return;
      
      // Aquí procesas los productos seleccionados
      console.log('Crear tarea con:', this.selected);
      
      // Ejemplo: abrir diálogo, llamar API, etc.
      // this.$router.push(...) o this.showTaskForm()
    },
    getImageUrl(imagePath) {
      const baseUrl = this.$axios?.defaults?.baseURL || '';
      return `${baseUrl}images/${imagePath || 'products/default.jpg'}?t=${this.getCacheTimestamp()}`;
    },
    getCacheTimestamp() {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.getTime();
    },
    async loadSuggestedShoppingList() {
      this.loading = true;
      try {
        const data = {
          home_id: this.home_id,
          person_id: this.selectedPerson.id
        };

        const result = await handleRequest({
          endpoint: "get-shopping-list", // ← ajusta al endpoint real
          method: "POST",
          data
        });

        if (result.success) {
          this.products = result.data?.products || [];
        } else {
          this.products = [];
          this.showAlert("info", this.$t("shoppingList.noSuggestions"), 3000);
        }
      } catch (error) {
        this.showAlert("error", this.$t("shoppingList.loadError"), 5000);
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;
      this.sb_title = this.$t(`snackbar.${sb_type}.title`);
      this.sb_icon = sb_type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    }
  }
};
</script>

<style scoped>
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
/* Mantén tus estilos existentes */
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 2px;
  color: white;
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
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Ocultar header por defecto */
.v-data-table > .v-data-table__wrapper > table > thead {
  display: none !important;
}
</style>