<!-- src/components/onboarding/BirthdateStep.vue -->
<template>
  <div class="onboarding-card rounded-lg pa-4" :class="isMobile ? 'pa-2' : 'pa-4'">
    <h3 class="text-body-2 mb-4 text-center">
      ¡Perfecto! Para adaptar tu experiencia, ¿cuál es tu fecha de nacimiento?
    </h3>
    <v-card :class="isMobile ? 'pa-1 w-100' : 'pa-2'" elevation="1" :style="{ maxWidth: isMobile ? '100%' : '345px' }" density="compact">
      <v-locale-provider :locale="locale">
       <div
          v-if="isMobile"
          class="date-picker-scroll-wrapper"
        >
        <v-date-picker 
        density="compact"
        header="Calendario"       
        title="Seleccione la fecha"
          v-model="selectedDate"
          color="#03626C"
          class="pa-0"
          :width="isMobile ? '100%' : undefined"
        />
        </div>
      </v-locale-provider>
      <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        variant="tonal"
        class="text-grey-darken-1"
        @click="handleCancel"
      >
        Cancelar
      </v-btn>
      <v-btn
      variant="flat"
        color="cyan-darken-3"
        class="text-white"
        :disabled="!selectedDate"
        @click="handleAccept"
      >
        Aceptar
      </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
export default {
  name: "BirthdateStep",
  emits: ["birthdate-submitted", "go-back"],
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  data() {
    return {
      selectedDate: new Date().toISOString().split("T")[0],
      isFullscreen: false,
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split("T")[0];
    },
    minBirthDate() {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 120);
      return d.toISOString().split("T")[0];
    },
       isMobile() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm;
    },
    isDesktop() {
      return !this.isMobile;
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
    handleAccept() {
      if (this.selectedDate) {
        const formatted = new Date(this.selectedDate).toISOString().split("T")[0];
        this.$emit("birthdate-submitted", formatted);
      }
    },
    handleCancel() {
      this.$emit("go-back");
    }
  }
};
</script>

<style scoped>
.onboarding-card {
  width: 100%;
  max-width: 100%;
}
/* ✅ Scroll horizontal SOLO para el calendario en móvil */
.date-picker-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 2px 4px 2px;
}

.date-picker-scroll-wrapper :deep(.v-date-picker) {
  min-width: 300px; /* Asegura que los 7 días quepan */
  width: auto !important;
}
</style>