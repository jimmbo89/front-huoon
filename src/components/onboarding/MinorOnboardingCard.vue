<template>
  <div class="onboarding-card rounded-lg">
    <h3 class="text-body-2 mb-4">
      👋 Parece que eres menor de 18 años.<br />
      Solo puedes unirte a un hogar creado por un adulto.
    </h3>

    <v-row class="mb-4">
      <!-- Opción 1: Unirse con código -->
      <v-col cols="12" md="6">
        <v-card
          elevation="1"
          density="comfortable"
          class="rounded-lg"
          @click="$emit('join-home')"
        >
          <v-card-item class="pa-3">
            <template v-slot:prepend>
              <div class="icono-concavo">
                <v-icon icon="mdi-key" color="primary" size="x-large"></v-icon>
              </div>
            </template>

            <div>
              <v-card-title class="text-body-2 font-weight-medium pa-0">
                🔑 Unirme a un hogar con código
              </v-card-title>
              <v-card-subtitle class="text-caption pa-0 mt-1">
                <span>Ingresa el código que te dio un adulto de tu hogar.</span>
                <v-tooltip activator="parent" location="bottom">
                  <span style="white-space: normal; word-break: break-word">
                    Ingresa el código que te dio un adulto de tu hogar.
                  </span>
                </v-tooltip>
              </v-card-subtitle>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Opción 2: Enviar invitación a un adulto -->
      <v-col cols="12" md="6">
        <v-card
          elevation="1"
          density="comfortable"
          class="rounded-lg"
          @click="$emit('invite-adult')"
        >
          <v-card-item class="pa-3">
            <template v-slot:prepend>
              <div class="icono-concavo">
                <v-icon icon="mdi-account-plus" color="primary" size="x-large"></v-icon>
              </div>
            </template>

            <div>
              <v-card-title class="text-body-2 font-weight-medium pa-0">
                👨👩👧 Enviar invitación a un adulto
              </v-card-title>
              <v-card-subtitle class="text-caption pa-0 mt-1">
                <span>
                  Un adulto debe crear el hogar por ti. Envíale una invitación por correo.
                </span>
                <v-tooltip activator="parent" location="bottom">
                  <span style="white-space: normal; word-break: break-word">
                    Un adulto debe crear el hogar por ti. Envíale una invitación por correo.
                  </span>
                </v-tooltip>
              </v-card-subtitle>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'MinorOnboardingCard',
  emits: ['join-home', 'invite-adult']
};
</script>

<style scoped>
.icono-concavo {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  position: relative;
  overflow: hidden;
}
</style>