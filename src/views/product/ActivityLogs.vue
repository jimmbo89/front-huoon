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
      <v-card class="pa-0" elevation="1" rounded="lg" style="
    position: relative;
    overflow: visible;
    z-index: auto;
  ">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
          <v-card-title class="d-flex flex-wrap align-center pb-2">
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
  :items="activities"
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
  <!-- Encabezado fijo -->
  <template v-slot:top>
    <v-card
      :elevation="1"
      flat
      class="mb-2 mx-1 rounded-lg"
      style="border: 1px solid #ECEFF1; height: 40px; min-height: 40px; display: flex; align-items: center; transition: none !important"
    >
      <v-card-text
        class="d-flex pa-2"
        style="width: 100%; min-width: 0; height: 100%; padding: 0 16px !important; display: flex; align-items: center"
      >
        <!-- Fecha / Periodo (7%) -->
        <div style="width: 7%; min-width: 0" class="text-left">
          {{ $t('activity.date') }}
        </div>

        <!-- Descripción + Severidad (34%) -->
        <div style="width: 20%; min-width: 0" class="text-left">
          {{ $t('activity.product') }}
        </div>

        <!-- Estado (15%) -->
        <div style="width: 20%; min-width: 0" class="text-left">
          {{ $t('activity.origin_warehouse') }}
        </div>

        <div style="width: 20%; min-width: 0" class="text-left">
          {{ $t('activity.destination_warehouse') }}
        </div>

        <!-- Detalles (34%) -->
        <div style="width: 7%; min-width: 0" class="text-left">
          {{ $t('activity.quantity') }}
        </div>

        <div style="width: 26%; min-width: 0" class="text-left">
          {{ $t('activity.performed_by') }}
        </div>
      </v-card-text>
    </v-card>
  </template>

  <!-- Item (fila) -->
  <template v-slot:item="slotProps">
    <tr>
      <td colspan="100%" style="padding: 0; border: none">
        <v-card
          class="mb-2 mx-1 rounded-lg"
          elevation="1"
          density="comfortable"
          flat
        >
          <v-card-text class="d-flex align-center pa-2" style="width: 100%; min-width: 0">
            <!-- Fecha / Periodo (7%) -->
            <div class="d-flex align-center" style="width: 7%; min-width: 0">
              <v-avatar
                class="mr-1 icono-concavo"
                :class="`bg-${getTypeColor(slotProps.item.newData.date)}`"
                :style="{
                  'min-height': '48px',
                  'min-width': '48px',
                  'border-radius': '8px',
                  'font-size': '0.90em'
                }"
              >
                <div class="text-body-3 font-weight-medium">
                  {{ formatIntuitiveDate(slotProps.item.newData.date) }}
                </div>
              </v-avatar>
            </div>

            <!-- Descripción + Severidad (34%) -->
            <div style="width: 20%; min-width: 0" class="d-flex align-left">
               <v-avatar
                    size="48"
                    class="mr-1 icono-concavo"
                    color="grey-lighten-4"
                    style="flex-shrink: 0"
                  >
                    <v-img
                      :src="getImageUrl(slotProps.item.newData.productImage)"
                      cover
                      class="icono-concavo"
                    />
                  </v-avatar>

                  <!-- Contenedor de texto -->
                  <div class="d-flex flex-column justify-center" style="min-width: 0">
                    <div class="font-weight-bold text-body-2 text-truncate">
                      {{ slotProps.item.newData.productName }}
                    </div>
                  </div>
            </div>

            <!-- Estado (15%) -->
            <div style="width: 20%; min-width: 0" class="text-body-2 text-truncate">
              <span>{{ slotProps.item.newData.originalWarehouse || '' }}</span>
            </div>

            <div style="width: 20%; min-width: 0" class="text-body-2 text-truncate">
              <span>{{ slotProps.item.newData.destinationWarehouse || '' }}</span>
            </div>
            <!-- Detalles (34%) -->
            <div style="width: 7%; min-width: 0" class="text-body-2 text-truncate">
              <span>{{ slotProps.item.newData.quantity_moved || '' }}</span>

            </div>
            <div style="width: 26%; min-width: 0" class="d-flex align-left">
               <v-avatar
                    size="48"
                    class="mr-1 icono-concavo"
                    color="grey-lighten-4"
                    style="flex-shrink: 0"
                  >
                    <v-img
                      :src="getImageUrl(slotProps.item.newData.personImage)"
                      cover
                      class="icono-concavo"
                    />
                  </v-avatar>

                  <!-- Contenedor de texto -->
                  <div class="d-flex flex-column justify-center" style="min-width: 0">
                    <div class="font-weight-bold text-body-2 text-truncate">
                      <span>{{ slotProps.item.newData.personName }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                      <span style="white-space: normal; word-break: break-word">
                              {{ slotProps.item.newData.personName }}
                            </span>
                          </v-tooltip>
                    </div>
                  </div>
            </div>

          </v-card-text>
        </v-card>
      </td>
    </tr>
  </template>
</v-data-table>
    </v-card-text>
    </v-card>
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import { shallowRef } from "vue";

export default {
  props: {
    type: {
      type: String,
      required: true
    },
  },
  data: () => ({
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
    activities: [],
    home_id: "",
    data: {},
    person_id: "",
    headers: [
      { title: 'Fecha', key: 'newData.date' },
      { title: 'Producto', key: 'newData.productName' },
      { title: 'Almacén saliente', key: 'newData.originalWarehouse' },
      { title: 'Almacén entrante', key: 'newData.destinationWarehouse' },
      { title: 'Cantidad', key: 'newData.quantity_moved' },
      { title: 'Realisado', key: 'newData.personName' },
    ],
    search: "",
    dateMenu: false,
    dateInput: null,
  }),
  computed: {
    
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
     getImageUrl(imagePath) {
      return `${this.$axios.defaults.baseURL}images/${imagePath}`;
    },
    obtenerFechaLocal() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "deep-orange"; // Color por defecto
    },
    // Filtra las personas para mostrar en cada card según el rol
    
    async initialize() {
      this.activities = [];
      this.data = {};
      this.data.home_id = this.home_id;
      this.data.type = this.type;
      this.data.model = "PersonHomeWarehouseProduct"
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "activity-log-model",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.activities = result.data?.activities || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.activities = [];
          //this.showAlert('success', 'No hay productos disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
      } finally {
        this.updateWarehouseTools();
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
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.date-time-display .date {
  font-size: 0.9rem;
  font-weight: 500; /* medium */
  color: inherit; /* usa el color por defecto del tema */
}

.date-time-display .time {
  font-size: 0.9rem;
  font-weight: 400; /* regular */
  color: rgba(0, 0, 0, 0.6); /* gris medio */
  margin-top: 8px;
}
.fullscreen-dialog {
  height: 100vh !important;
  max-height: 100vh !important;
  min-width: 100vh;
  margin: 0 !important;
  padding: 0 !important;
}
.text-secondary {
  color: #6c757d;
  /* Color gris claro */
  font-size: 0.85rem;
  /* Tamaño de texto más pequeño */
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
</style>
