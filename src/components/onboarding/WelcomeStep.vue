<template>
  <div class="ww-100 rounded-lg onboarding-card">
     <h3 class="text-body-2 mb-2">👋 ¡Hola! Bienvenido(a) a Huoon, tu asistente inteligente para la organización del hogar.</h3>
    <p class="mb-4 text-body-2">
      Vamos a dar los primeros pasos para personalizar tu experiencia.
    </p>
    <v-btn 
      color="cyan-darken-3" class="text-white text-subtitle-1 mr-1" variant="flat" style="text-transform: none;"
      @click="handleNextStep"
    >
      Comenzar ahora
    </v-btn>
    <v-btn 
      color="cyan-darken-3" class="text-white text-subtitle-1" variant="flat" style="text-transform: none;"
      @click="nextLater"
    >
      Más tarde
    </v-btn>
  </div>
</template>

<script>
export default {
  emits: ['start-flow', 'next-later'], // Declara explícitamente el evento
  methods: {
    handleNextStep() {
      this.$emit('start-flow'); // Emite el evento claramente
    },
    nextLater(){
      this.$emit('next-later');
    }
  }
};
</script>

<style scoped>
.onboarding-card {
  width: 100%;
  max-width: 100%;
}
</style>