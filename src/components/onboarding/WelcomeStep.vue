<template>
  <div class="w-100 rounded-lg onboarding-card">
    <h3
      class="text-body-2 mb-2"
      :class="isMobile ? 'text-body-3' : 'text-body-2'"
    >
      👋 ¡Hola! Bienvenido(a) a Huoon, tu asistente inteligente para la organización del hogar.
    </h3>
    <p
      class="mb-4"
      :class="isMobile ? 'text-body-3' : 'text-body-2'"
    >
      Vamos a dar los primeros pasos para personalizar tu experiencia.
    </p>

    <!-- Botones: apilados en móvil, alineados en desktop -->
    <div
      :class="isMobile ? 'd-flex flex-column gap-2' : 'de-flex flex-row gap-2'"
    >
      <v-btn
        color="cyan-darken-3"
        class="text-white"
        :class="isMobile ? '' : 'mr-1'"
        variant="flat"
        style="text-transform: none;"
        @click="handleNextStep"
      >
        Comenzar ahora
      </v-btn>
      <v-btn
        color="cyan-darken-3"
        class="text-white"
        :class="isMobile ? 'mt-1' : ''"
        variant="flat"
        style="text-transform: none;"
        @click="nextLater"
      >
        Más tarde
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['start-flow', 'next-later'],
  data() {
    return {
      isFullscreen: false,
    };
  },
  computed: {
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
    handleNextStep() {
      this.$emit('start-flow');
    },
    nextLater() {
      this.$emit('next-later');
    }
  }
};
</script>

<style scoped>
.onboarding-card {
  width: 100%;
  max-width: 100%;
  /* Padding por defecto (desktop) */
  padding: 24px;
}

/* En móvil: reducir padding horizontal para aprovechar más espacio */
@media (max-width: 600px) {
  .onboarding-card {
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 16px;
    padding-bottom: 16px;
  }


  p {
    font-size: 0.875rem !important; /* ~text-caption */
    line-height: 1.4 !important;
  }
  .desktop-table {
  table-layout: fixed;
}

.mobile-table {
  table-layout: auto;
}
.responsive-data-table-wrapper {
  width: 100%;
}
}
</style>