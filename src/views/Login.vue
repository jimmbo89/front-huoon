<template>
  <v-snackbar v-model="snackbar" :timeout="sb_timeout" :color="sb_type" location="top right" elevation="24" multi-line>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <v-avatar :icon="sb_icon" :color="sb_type" size="40" class="me-3"></v-avatar>
      </v-col>
      <v-col>
        <strong>{{ sb_title }}</strong><br />
        {{ sb_message }}
      </v-col>
    </v-row>
  </v-snackbar>

  <v-container fluid class="login-wrapper pa-0" style="height: 100vh;">
  <v-row no-gutters class="flex-column flex-md-row" style="min-height: 100vh;">
    <!-- PANEL IZQUIERDO (Onboarding) -->
    <v-col cols="12" md="7" class="d-flex flex-column justify-center align-center px-5 dark-panel">


      <!-- Logo -->
      <v-img src="@/assets/logo-verde.png" max-width="80" class="mb-6" />

      <!-- Carrusel -->
      <div style="max-width: 100%; width: 100%; overflow: hidden;">
      <v-carousel 
          height="150px" 
          show-arrows="hover" 
          hide-delimiter-background 
          cycle 
          interval="5000"
          class="onboarding-carousel"
          style="
        max-width: 100%;
        margin: 0 auto;
      "
        >
          <v-carousel-item 
            v-for="(key, i) in slideKeys" 
            :key="i"
            style="
              display: flex;
              justify-content: center;
              align-items: flex-start; /* Contenido al inicio vertical */
              padding-top: 20px; /* Espacio mínimo arriba */
              height: 100%;
            "
          >
            <div class="text-center" style="width: 100%">
              <h2 class="text-h5 text-white font-weight-bold mb-3">
                {{ $t(`slides.${key}.title`) }}  <span style="color: #006064">  {{ $t(`slides.${key}.emphasis`) }} </span><br />
               {{ $t(`slides.${key}.subtitle`) }} 
            </h2>
            <p class="text-white text-subtitle-2" style="max-width: 360px; opacity: 0.8; margin: auto;">
                {{ $t(`slides.${key}.description`) }} 
            </p>
          </div>
        </v-carousel-item>
      </v-carousel>
      </div>
    </v-col>

    <!-- PANEL DERECHO (Login) -->
    <v-col cols="12" md="5" class="d-flex flex-column justify-center align-center pa-4 bg-white">
      <v-card class="w-100" max-width="500" flat>
        <v-card-text>
        <v-row class="mb-6 mt-2 ">

          <v-avatar class="ml-2" image="@/assets/logo-verde.png" size="60"></v-avatar>

          <span class="text-h5 font-weight-bold mt-4 ml-3 text-cyan-darken-3">huoon</span>
        </v-row>



        <p class="text-h5 font-weight-bold ">{{ $t('login.title') }}</p>

        <p class="text-subtitle-2 mb-6 font-weight-light">{{ $t('login.subtitle') }}:</p>

        <v-btn size="x-large" prepend-icon="mdi-google" class="flex-grow-1" variant="tonal" color="info"
          style="text-transform: none;" rounded="lg" @click="loginWithGoogle">
          {{ $t('login.buttons.google') }}&nbsp;&nbsp;&nbsp;&nbsp;
        </v-btn>
        <v-btn size="x-large" prepend-icon="mdi-facebook" class="flex-grow-1 ml-12" style="text-transform: none;"
          variant="tonal" color="primary" rounded="lg" @click="loginWithFacebook">
          {{ $t('login.buttons.facebook') }}&nbsp;&nbsp;
        </v-btn>


         <v-form ref="form" v-model="valid">
        <div class="text-center mt-6 text-caption my-2">{{ $t('login.or') }}</div>

        <v-text-field v-model="editedItem.name" variant="outlined" class="mb-3" v-if="this.register"
          :placeholder="$t('login.placeholders.name')"  :rules="nameRules" density="comfortable"/>

        <v-text-field v-model="editedItem.email" :label="$t('login.fields.email')" variant="outlined" placeholder="johndoe@mail.com" 
          density="comfortable" class="mb-3" :rules="this.register ? emailRules : []"/>

        <v-text-field v-model="editedItem.password" :label="$t('login.fields.password')" variant="outlined" placeholder="johndoe@mail.com"
          :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword" density="comfortable" class="mb-5" :rules="reuquiredRules"/>

        <v-text-field v-model="editedItem.user" density="comfortable" variant="outlined" class="mb-3" v-if="this.register"
          :placeholder="$t('login.placeholders.user')"  :rules="reuquiredRules"/>

        <v-btn block size="x-large" color="cyan-darken-3" class="text-white text-subtitle-1 mb-3"
          style="text-transform: none;" rounded="lg" :loading="loading" @click="login()" :disabled="this.register ? !this.valid : false">
          {{ this.register ? $t('login.signUp') : $t('login.signInButton') }}
        </v-btn>
        </v-form>
        <div class="text-center mt-2">
          <span class="text-body-2 text-decoration-underline" sstyle="cursor: pointer;" @click="openRecovery">
            {{ $t('login.forgotPassword') }}
          </span>
        </div>



        <v-row justify="center" class="mb-2 mt-4">
          <span class="text-caption">{{ $t('login.noAccount') }}
            <span class="text-primary" style="cursor: pointer;" @click="goToLogin"> {{ $t('login.signUp') }}</span>
          </span>
        </v-row>

        <div class="text-caption text-grey text-center mt-10" v-html="$t('login.footer', { privacy: `<a href='#' class='text-primary'>${$t('login.privacy')}</a>`, support: `<a href='#' class='text-primary'>${$t('login.support')}</a>` })"></div>
      </v-card-text>
      </v-card>
    </v-col>
    </v-row>
    <!-- Modal de recuperación de contraseña -->
    <v-dialog v-model="recoveryDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-body-2 font-weight-bold">
            Recuperar contraseña
          </v-card-title>

        <v-card-text>
      <!-- Campo de correo (siempre visible después del paso 1) -->
      <v-text-field
        v-model="recoveryEmail"
        label="Correo electrónico"
        variant="outlined"
        density="comfortable"
        :rules="emailRules"
        class="mb-4"
      />

      <!-- Paso 1: Solo el botón para continuar -->
      <v-btn
        v-if="recoveryStep === 1"
        block
        color="primary"
        @click="goToOptions"
        :disabled="!recoveryEmail || !emailRules.every(r => r(recoveryEmail))"
      >
        Continuar
      </v-btn>

      <!-- Paso 2: Opciones y campos condicionales -->
      <template v-else>
        <!-- Mensaje de éxito al reenviar -->
        <v-alert
          v-if="showResendSuccess"
          type="success"
          variant="tonal"
          class="mb-4"
        >
          Código enviado a {{ recoveryEmail }}
        </v-alert>

        <!-- Selector de opción -->
        <v-radio-group v-model="selectedRecoveryOption" row class="mb-4" @update:model-value="onRecoveryOptionChange">
          <v-radio label="Ya tengo un código" value="haveCode"></v-radio>
          <v-radio label="Enviar código" value="resendCode"></v-radio>
        </v-radio-group>

        <!-- Campo de código (solo si selecciona "Ya tengo un código") -->
        <v-text-field
          v-if="selectedRecoveryOption === 'haveCode'  && recoveryStep === 2"
          v-model="recoveryCode"
          label="Código de 6 dígitos"
          variant="outlined"
          density="comfortable"
          :rules="codeRules"
          @keyup.enter="verifyCode"
          class="mb-4"
        />

        <!-- Botones de acción -->
        <div class="d-flex gap-2">
          <v-btn
            v-if="selectedRecoveryOption === 'resendCode'  && recoveryStep === 2"
            color="success"
            @click="resendCode"
            :loading="loadingRecovery"
            block
          >
            Reenviar código
          </v-btn>

          <v-btn
            v-if="selectedRecoveryOption === 'haveCode' && recoveryStep === 2"
            color="primary"
            @click="verifyCode"
            :loading="loadingRecovery"
            block
          >
            Verificar código
          </v-btn>
        </div>

        <!-- Formulario de nueva contraseña (solo si el código fue verificado) -->
        <div v-if="recoveryStep === 3" class="mt-4">
          <v-text-field
            v-model="newPassword"
            label="Nueva contraseña"
            variant="outlined"
            density="comfortable"
            :type="showNewPass ? 'text' : 'password'"
            :append-inner-icon="showNewPass ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showNewPass = !showNewPass"
            :rules="passwordRules"
            class="mb-4"
          />
          <v-text-field
            v-model="confirmPassword"
            label="Confirmar contraseña"
            variant="outlined"
            density="comfortable"
            :type="showConfirmPass ? 'text' : 'password'"
            :append-inner-icon="showConfirmPass ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPass = !showConfirmPass"
            :rules="confirmPasswordRules()"
          />
        </div>
      </template>
    </v-card-text>

    <!-- Acciones del modal -->
    <v-card-actions>
    <v-spacer></v-spacer>
      <v-btn
        variant="flat"
        @click="closeRecovery"
        color="grey"
      >
        Cancelar
      </v-btn>
      <v-btn
        v-if="recoveryStep === 3"
        variant="flat"
        @click="updatePassword"
        :loading="loadingRecovery"
        color="#03626C"
      >
        Cambiar contraseña
      </v-btn>
    </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import router from '@/router/index';
export default {
  data: () => ({

    onboardingStep: 0,
    slideKeys: ['welcome', 'shareHome', 'smartTasks', 'controlFromPhone', 'designedForYou'],

    loading: false,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    user: null,
    homes: [],
    editedItem: {
      id: '',
      name: '',
      email: '',
      user: '',
      password: '',
      agreeTerms: false,
    },
    defaultItem: {
      id: '',
      name: '',
      email: '',
      user: '',
      password: '',
      agreeTerms: false,
    },
    register: false,
    showPassword: false,
    data: {},
    valid: true,
    // Modal de recuperación
   recoveryDialog: false,
    recoveryStep: 1, // 1 = ingresar email, 2 = opciones, 3 = nueva contraseña
    recoveryEmail: '',
    recoveryCode: '',
    recoveryUserId: null,
    newPassword: '',
    confirmPassword: '',
    showNewPass: false,
    showConfirmPass: false,
    selectedRecoveryOption: 'haveCode', // valor por defecto
    showResendSuccess: false, // para mostrar mensaje de reenvío exitoso
    loadingRecovery: false,

// Reglas
    codeRules: [
      v => !!v || 'El código es requerido'
    ],
    passwordRules: [
      v => !!v || 'La contraseña es requerida',
      v => (v && v.length >= 3) || 'Mínimo 3 caracteres'
    ],
    confirmPasswordRules() {
    return [
        v => !!v || 'Confirma la contraseña',
        v => v === this.newPassword || 'Las contraseñas no coinciden'
      ];
    },
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    emailRules: [
      (v) => !!v || "El Correo Electrónico es requerido",
      (v) => /.+@.+\..+/.test(v) || "El Correo Electrónico no es válido",
    ],
    reuquiredRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
  }),
  mounted() {
    // Obtiene los datos de la URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userData = urlParams.get('user');

    if (userData) {
      // Decodifica y parsea los datos
      const parsedData = JSON.parse(decodeURIComponent(userData));
      console.log('Datos recibidos:', parsedData);

      // Usa los datos según sea necesario
      this.user = parsedData;

      const user = this.user;
      LocalStorageService.setItem('token', user.token);
      LocalStorageService.setItem('authenticateUser', true);
      LocalStorageService.setItem('user_id', user.id);
      LocalStorageService.setItem('user', user.userName);
      LocalStorageService.setItem('image', user.personImage);
      LocalStorageService.setItem('name', user.personName);
      LocalStorageService.setItem('person_id', user.personId);
      LocalStorageService.setItem('home_id', user.home);
      LocalStorageService.setItem('userLocale', user.language);

      // Reiniciar el formulario
      this.editedItem = Object.assign({}, this.defaultItem);

      // Redirigir al Dashboard
       if(user.home === null){
              setTimeout(() => {
              router.push({ name: 'Onboarding' });
            }, 1000);
            }else{
            // Redirigir al Dashboard
            setTimeout(() => {
              router.push({ name: 'Home' });
            }, 1000);
          }
    }

    this.register = false;
  },
  methods: {
    onRecoveryOptionChange() {
    // Si estaba en paso 3, volver a paso 2
    if (this.recoveryStep === 3) {
      this.recoveryStep = 2;
      this.newPassword = '';
      this.confirmPassword = '';
      this.showResendSuccess = false;
      this.recoveryCode = '';
    }
  },
    goToLogin() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
      // Alterna el valor de la variable 'register' entre true y false
      this.register = !this.register;
    },
    async login() {
      this.loading = true; // Iniciar loader
      if (!this.register) {
        try {
          this.data = {};
          // Preparar el payload
          this.data.email = this.editedItem.email;
          this.data.password = this.editedItem.password;
          // Petición al servidor utilizando handleRequest
          const result = await handleRequest({
            endpoint: 'login',
            method: 'POST',
            data: this.data,
            includeToken: false
          });

          if (result.success) {
            this.user = result.data;

            // Guardar datos en LocalStorage
            const user = this.user;
            //console.log('Datos recibidos:', user);
            LocalStorageService.setItem('token', user.token);
            LocalStorageService.setItem('authenticateUser', true);
            //LocalStorageService.setItem('role_id', user.roleId);
            LocalStorageService.setItem('user_id', user.id);
            LocalStorageService.setItem('user', user.userName);
            LocalStorageService.setItem('image', user.personImage);
            LocalStorageService.setItem('name', user.personName);
            //LocalStorageService.setItem('role', user.nameRole);
            LocalStorageService.setItem('person_id', user.personId);
            LocalStorageService.setItem('home_id', user.home);
            LocalStorageService.setItem('userLocale', user.language);
            // Puedes descomentar los siguientes si son necesarios
            // LocalStorageService.setItem('branch_id', user.branch_id);
            // LocalStorageService.setItem('charge', user.charge);
            // LocalStorageService.setItem('charge_id', user.charge_id);
            // LocalStorageService.setItem('nameBranch', user.nameBranch);
            // LocalStorageService.setItem('nameBusiness', user.nameBusiness);
            // LocalStorageService.setItem('imageBusiness', user.imageBusiness);
            // LocalStorageService.setItem('business_id', user.business_id);
            // LocalStorageService.setItem('permissionsUser', user.permissions);
            // Reiniciar el formulario
            this.editedItem = Object.assign({}, this.defaultItem);
            // Manejo en caso de éxito
            if(user.home === null){
              setTimeout(() => {
              router.push({ name: 'Onboarding' });
            }, 1000);
            }else{
            // Redirigir al Dashboard
            setTimeout(() => {
              router.push({ name: 'Home' });
            }, 1000);
          }
          } else {
            // Manejo de errores definidos por la API
            this.showAlert('warning', result.message || 'Error inesperado', 3000);
          }
        } catch (error) {
          // Manejo de errores no controlados
          this.showAlert('error', 'Ocurrió un error inesperado al iniciar sesión.', 3000);
        } finally {
          this.loading = false; // Detener el loader
        }
      } else {
        try {
          this.data = {};
          // Preparar el payload
          this.data.name = this.editedItem.name;
          this.data.email = this.editedItem.email;
          this.data.password = this.editedItem.password;
          this.data.user = this.editedItem.user;
          // Petición al servidor utilizando handleRequest
          const result = await handleRequest({
            endpoint: 'register',
            method: 'POST',
            data: this.data,
            includeToken: false
          });

          if (result.success) {
            // Manejo en caso de éxito
            this.showAlert('success', 'Registrado correctamente', 1000);
            this.user = result.data;

            // Guardar datos en LocalStorage
            const user = this.user;
            LocalStorageService.setItem('token', user.token);
            LocalStorageService.setItem('authenticateUser', true);
            //LocalStorageService.setItem('role_id', user.roleId);
            LocalStorageService.setItem('user_id', user.id);
            LocalStorageService.setItem('user', user.userName);
            LocalStorageService.setItem('image', user.personImage);
            LocalStorageService.setItem('name', user.personName);
            //LocalStorageService.setItem('role', user.nameRole);
            LocalStorageService.setItem('person_id', user.personId);
            LocalStorageService.setItem('home_id', user.home);
            LocalStorageService.setItem('userLocale', user.language);
            // Puedes descomentar los siguientes si son necesarios
            // LocalStorageService.setItem('branch_id', user.branch_id);
            // LocalStorageService.setItem('charge', user.charge);
            // LocalStorageService.setItem('charge_id', user.charge_id);
            // LocalStorageService.setItem('nameBranch', user.nameBranch);
            // LocalStorageService.setItem('nameBusiness', user.nameBusiness);
            // LocalStorageService.setItem('imageBusiness', user.imageBusiness);
            // LocalStorageService.setItem('business_id', user.business_id);
            // LocalStorageService.setItem('permissionsUser', user.permissions);

            // Reiniciar el formulario
            this.editedItem = Object.assign({}, this.defaultItem);
            if(user.home === null){
              setTimeout(() => {
              router.push({ name: 'Home' });
            }, 1000);
            }else{
            // Redirigir al Dashboard
            setTimeout(() => {
              router.push({ name: 'Home' });
            }, 1000);
            }
          } else {
            // Manejo de errores definidos por la API
            this.showAlert('warning', result.message || 'Error inesperado', 3000);
          }
        } catch (error) {
          // Manejo de errores no controlados
          this.showAlert('error', 'Ocurrió un error inesperado al iniciar sesión.', 3000);
        } finally {
          this.loading = false; // Detener el loader
        }
      }
    },
    loginWithGoogle() {
      // Abrir una nueva ventana emergente
      window.location.href = "http://huoon.api.klint.cl/api/login-google";
    },
    loginWithFacebook() {
      this.showAlert('success', 'Aun no esta implementada esta funcionalidad', 1000);
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

  openRecovery() {
    this.recoveryDialog = true;
    this.resetRecovery();
  },

  resetRecovery() {
    this.recoveryStep = 1;
    this.recoveryEmail = '';
    this.recoveryCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.recoveryUserId = null,
    this.selectedRecoveryOption = 'haveCode';
    this.showResendSuccess = false;
  },

  goToOptions() {
    if (!this.recoveryEmail || !this.emailRules.every(r => r(this.recoveryEmail))) {
      this.showAlert('warning', 'Ingresa un correo válido', 2000);
      return;
    }
    this.recoveryStep = 2;
  },

  async resendCode() {
    this.loadingRecovery = true;
    this.showResendSuccess = false;
    this.data = {};
    this.data.email = this.recoveryEmail;
    try {
      const result = await handleRequest({
        endpoint: 'forgot-password',
        method: 'POST',
         data: this.data,
         includeToken: false
      });
      if (result.success) {
        this.showResendSuccess = true;
        // Opcional: limpiar el campo de código si estaba lleno
        this.recoveryCode = '';
      } else {
        this.showAlert('error', result.message || 'Error al reenviar', 2000);
      }
    } catch (error) {
      this.showAlert('error', 'Error de conexión', 2000);
    } finally {
      this.loadingRecovery = false;
    }
  },

  async verifyCode() {
    this.data = {};
    this.data.email = this.recoveryEmail;
    this.data.code = this.recoveryCode;
    this.loadingRecovery = true;
    try {
      const result = await handleRequest({
        endpoint: 'verify-code',
        method: 'POST',
         data: this.data,
         includeToken: false
      });
      if (result.success) {
        this.recoveryUserId = result.data.userId;
        this.selectedRecoveryOption = ''
        this.recoveryStep = 3; // Avanzar a nueva contraseña
      } else {
        this.showAlert('warning', result.message || 'Código incorrecto', 2000);
      }
    } catch (error) {
      this.showAlert('error', 'Error al verificar', 2000);
    } finally {
      this.loadingRecovery = false;
    }
  },

  async updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.showAlert('warning', 'Las contraseñas no coinciden', 2000);
      return;
    }
    this.data = {};
    this.data.email = this.recoveryEmail;
    this.data.user_id = this.recoveryUserId;
    this.data.newPassword = this.newPassword;
    this.loadingRecovery = true;
    try {
      const result = await handleRequest({
        endpoint: 'reset-password',
        method: 'POST',
        data: this.data
      });
      if (result.success) {
        this.showAlert('success', 'Contraseña actualizada correctamente', 2000);
        this.closeRecovery();
      } else {
        this.showAlert('error', result.message || 'Error al cambiar la contraseña', 2000);
      }
    } catch (error) {
      this.showAlert('error', 'Error de conexión', 2000);
    } finally {
      this.loadingRecovery = false;
    }
  },

  closeRecovery() {
    this.recoveryDialog = false;
    this.data = {};
    this.resetRecovery();
  },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type

      if (sb_type == "success") {
        this.sb_title = 'Éxito'
        this.sb_icon = 'mdi-check-circle'
      }

      if (sb_type == "error") {
        this.sb_title = 'Error'
        this.sb_icon = 'mdi-check-circle'
      }

      if (sb_type == "warning") {
        this.sb_title = 'Advertencia'
        this.sb_icon = 'mdi-alert-circle'
      }
      this.sb_message = sb_message
      this.sb_timeout = sb_timeout
      this.snackbar = true
    },
  },
};
</script>

<style scoped>

.background-img {
  height: 100%;
  /* Ocupa toda la altura */
  object-fit: cover;
  /* Imagen ajustada */
}

.v-card {
  border-radius: 8px;
  /* Bordes redondeados */
}

.v-btn {
  color: white;
  /* Color blanco para texto */
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Ajusta la imagen para que cubra el contorno del avatar */
  border-radius: 50%;
  /* Asegura que la imagen sea circular */
}

.dark-panel {
  background: radial-gradient(circle at center, #1d1d1d, #0a0a0a);
  color: white;
}

.login-wrapper {
  min-height: 100vh;
  background: white;
}
/* Ajustes generales */
.login-wrapper {
  min-height: 100vh;
}

/* Panel izquierdo (carrusel) */
.dark-panel {
  background: radial-gradient(circle at center, #1d1d1d, #0a0a0a);
  min-height: 40vh; /* Altura mínima en móvil */
}

/* Panel derecho (login) */
.bg-white {
  min-height: 60vh; /* Altura mínima en móvil */
}

/* Ajustes para desktop */
@media (min-width: 960px) {
  .dark-panel {
    min-height: 100vh;
  }
  
  .bg-white {
    min-height: 100vh;
  }
}

/* Ajustes del carrusel */
.onboarding-carousel {
  height: auto;
  max-height: 60vh;
  margin: 20px 0;
}
</style>