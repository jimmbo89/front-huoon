<template>
  <div class="onboarding-card rounded-lg">
    <h3 class="text-body-2 mb-4">¿Quieres crear un hogar o unirte a uno existente?</h3>

    <v-row class="mb-4" :dense="isMobile">
  <v-col cols="12" md="6" class="d-flex">
    <v-card
      elevation="1"
      density="comfortable"
      class="rounded-lg h-100"
      @click="$emit('create-home')"
    >
      <v-card-item class="pa-3">
        <template v-slot:prepend>
          <div class="icono-concavo">
            <v-icon
              icon="mdi-home-plus"
              color="primary"
              :size="isMobile ? 'large' : 'x-large'"
            ></v-icon>
          </div>
        </template>

        <div>
          <v-card-title class="text-body-2 font-weight-medium pa-0"  style="
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    word-break: break-word;
    white-space: normal;
    min-width: 0;
    width: 100%;
  ">
            Crear un nuevo hogar
          </v-card-title>
          <v-card-subtitle class="text-caption pa-0 mt-1"  style="
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    word-break: break-word;
    white-space: normal;
    min-width: 0;
    width: 100%;
  ">
            Ideal si eres el primero en usar la app en tu casa.
             <v-tooltip activator="parent" location="bottom">
                      <span style="white-space: normal; word-break: break-word">
                       Ideal si eres el primero en usar la app en tu casa.
                      </span>
                    </v-tooltip>
          </v-card-subtitle>
        </div>
      </v-card-item>
    </v-card>
  </v-col>

  <v-col cols="12" md="6" class="d-flex">
    <v-card
      elevation="1"
      density="comfortable"
      class="rounded-lg h-100"
      @click="$emit('join-home')"
    >
      <v-card-item class="pa-3">
        <template v-slot:prepend>
          <div class="icono-concavo">
            <v-icon
              icon="mdi-key"
              color="primary"
              :size="isMobile ? 'large' : 'x-large'"
            ></v-icon>
          </div>
        </template>

        <div>
          <v-card-title class="text-body-2 font-weight-medium pa-0"  style="
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    word-break: break-word;
    white-space: normal;
    min-width: 0;
    width: 100%;
  ">
            Unirme a un hogar existente
          </v-card-title>
          <v-card-subtitle class="text-caption pa-0 mt-1"  style="
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    word-break: break-word;
    white-space: normal;
    min-width: 0;
    width: 100%;
  ">
            alguien ya creó tu hogar en la app, puedes unirte con un código.
            <v-tooltip activator="parent" location="bottom">
                      <span style="white-space: normal; word-break: break-word">
                       alguien ya creó tu hogar en la app, puedes unirte con un código.
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
  emits: ['create-home', 'join-home'],
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
  }
};
</script>
<style scoped>
.icono-concavo {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
 
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
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
</style>