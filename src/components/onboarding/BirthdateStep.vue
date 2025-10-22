<!-- src/components/onboarding/BirthdateStep.vue -->
<template>
  <div class="onboarding-card rounded-lg pa-4">
    <h3 class="text-body-2 mb-4">
      ¡Perfecto! Para adaptar tu experiencia, ¿cuál es tu fecha de nacimiento?
    </h3>
    <v-card class="pa-2 w-100" elevation="1" style="max-width: 345px;" density="compact">
      <v-locale-provider :locale="locale">
        <v-date-picker 
        density="compact"
        header="Calendario"       
        title="Seleccione la fecha"
          v-model="selectedDate"
          color="#03626C"
          class="pa-0"
        />
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
      selectedDate: new Date().toISOString().split("T")[0]
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
  },
  methods: {
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
</style>