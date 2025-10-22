<!-- src/components/InviteAdultForm.vue -->
<template>
  <div class="onboarding-card rounded-lg pa-4">
    <h3 class="text-body-2 mb-4">👨👩👧 Invita a un adulto a crear tu hogar</h3>

    <v-form @submit.prevent="submitForm">
      <v-text-field
        v-model="homeName"
        label="Nombre del hogar"
        placeholder="Ej: Casa de los Pérez"
        variant="outlined"
        density="comfortable"
        :rules="[v => !!v || 'El nombre del hogar es requerido']"
        class="mb-4"
      ></v-text-field>

      <v-text-field
        v-model="adultEmail"
        label="Correo del adulto"
        placeholder="ejemplo@dominio.com"
        type="email"
        variant="outlined"
        density="comfortable"
        :rules="[
          v => !!v || 'El correo es requerido',
          v => /.+@.+/.test(v) || 'Formato de correo inválido'
        ]"
        class="mb-6"
      ></v-text-field>

      <!-- Botones alineados a la derecha -->
      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <v-btn
          variant="tonal"
          class="text-grey-darken-1"
          @click="handleGoBack"
        >
          Cancelar
        </v-btn>
        <v-btn
          variant="flat"
          color="cyan-darken-3"
          class="text-white text-subtitle-1"
          style="text-transform: none;"
          :loading="loading"
          :disabled="!isValid"
          type="submit"
        >
          Enviar invitación
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'InviteAdultForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit-invite', 'go-back'], // 👈 ahora emite 'go-back'
  data() {
    return {
      homeName: '',
      adultEmail: '',
    };
  },
  computed: {
    isValid() {
      return this.homeName.trim() !== '' && 
             this.adultEmail.trim() !== '' && 
             /.+@.+/.test(this.adultEmail);
    }
  },
  methods: {
    submitForm() {
      if (!this.isValid) return;
      
      this.$emit('submit-invite', {
        homeName: this.homeName.trim(),
        adultEmail: this.adultEmail.trim()
      });
    },
    handleGoBack() {
      this.$emit('go-back'); // 👈 emite el mismo evento que BirthdateStep
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