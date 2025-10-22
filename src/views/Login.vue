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
        <p class="text-h5 font-weight-bold">
          {{ $t(this.register ? 'auth.register.title' : 'auth.login.title') }}
        </p>

        <p class="text-subtitle-2 mb-6 font-weight-light">
          {{ $t(this.register ? 'auth.register.subtitle' : 'auth.login.subtitle', { appName: 'huoon' }) }}
        </p>

        <v-row justify="center" class="mb-4">
          <v-col cols="auto">
            <v-btn
              size="x-large"
              prepend-icon="mdi-google"
              variant="tonal"
              color="info"
              style="text-transform: none; ; min-width: 170px;"
              rounded="lg"
              @click="loginWithGoogle"
            >
              {{ $t('login.buttons.google') }}
            </v-btn>
          </v-col>
          <v-col cols="auto" class="ml-4">
            <v-btn
              size="x-large"
              prepend-icon="mdi-facebook"
              variant="tonal"
              color="primary"
              style="text-transform: none; min-width: 170px;"
              rounded="lg"
              @click="loginWithFacebook"
            >
              {{ $t('login.buttons.facebook') }}
            </v-btn>
          </v-col>
        </v-row>


         <v-form ref="form" v-model="valid" class="my-2">
        <div v-if="!this.register" class="text-center mt-6 text-caption">{{ $t('login.or') }}</div>

        <v-text-field v-model="editedItem.name" variant="outlined" class="mb-3" v-if="this.register"
          :placeholder="$t('login.placeholders.name')"  :rules="nameRules" density="comfortable"/>

        <v-text-field v-model="editedItem.email" :label="$t('login.fields.email')" variant="outlined" placeholder="johndoe@mail.com" 
          density="comfortable" class="mb-3" :rules="this.register ? emailRules : []"/>

        <v-text-field v-model="editedItem.password" :label="$t('login.fields.password')" variant="outlined"
          :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword" density="comfortable" class="mb-5" :rules="this.register ? passwordRules1 : passwordRules"/>

          <v-text-field
          v-if="this.register"
            v-model="confirmPassword"
            label="Confirmar contraseña"
            variant="outlined"
            density="comfortable"
            :type="showConfirmPass ? 'text' : 'password'"
            :append-inner-icon="showConfirmPass ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPass = !showConfirmPass"
            :rules="confirmshowPassword()"
          />

        <!--<v-text-field v-model="editedItem.user" density="comfortable" variant="outlined" class="mb-3" v-if="this.register"
          :placeholder="$t('login.placeholders.user')"  :rules="reuquiredRules"/>-->

         <v-checkbox
          v-if="register"
          v-model="termsAccepted"
          density="comfortable"
          class="mt-2 mb-4"
          hide-details
          color="cyan-darken-3"
        >
          <template v-slot:label>
            <span class="text-caption">
              {{ $t('auth.register.acceptTermsStart') }}
              <a
                href="#"
                class="text-primary font-weight-medium"
                @click.prevent="goToTerms"
              >{{ $t('auth.login.terms') }}</a>
              {{ $t('auth.register.acceptTermsMiddle') }}
              <a
                href="#"
                class="text-primary font-weight-medium"
                @click.prevent="goToPrivacy"
              >{{ $t('auth.login.privacy') }}</a>
              {{ $t('auth.register.acceptTermsEnd') }}
            </span>
          </template>
        </v-checkbox>

        <v-btn block size="x-large" color="cyan-darken-3" class="text-white text-subtitle-1 mb-3"
          style="text-transform: none;" rounded="lg" :loading="loading" @click="login()" :disabled="isRegisterModeDisabled">
          {{ this.register ? $t('login.signUp') : $t('login.signInButton') }}
        </v-btn>
        </v-form>
        <div class="text-center mt-2" v-if="!this.register">
          <span class="text-body-2 text-decoration-underline" style="cursor: pointer;" @click="openRecovery">
            {{ $t('login.forgotPassword') }}
          </span>
        </div>



        <v-row justify="center" class="mb-2 mt-4">
          <span class="text-caption">
          {{
            $t(
              this.register
                ? 'auth.register.haveAccount'
                : 'auth.login.noAccount'
            )
          }}
          <span
            class="text-primary"
            style="cursor: pointer;"
            @click="goToLogin()"
            :class="{ 'opacity-50': loading }"
          >
            {{
              $t(
                this.register
                  ? 'auth.register.signIn'
                  : 'auth.login.signUp'
              )
            }}
          </span>
        </span>
        </v-row>

        <div class="text-caption text-grey text-center mt-10" v-html="$t('login.footer', { privacy: `¿Necesitas ayuda?`, support: `<a href='#' class='text-primary'>${$t('login.support')}</a>` })"></div>
      </v-card-text>
      </v-card>
    </v-col>
    </v-row>
  </v-container>
    <!-- Modal de recuperación de contraseña -->
    <v-dialog v-model="recoveryDialog" max-width="500" persistent>
      <v-card>
      <v-card-title class="py-5 font-weight-black"><div v-if="recoveryStep === 1">Recuperar Contraseña</div>
      <div v-if="recoveryStep === 2">Verificar Código</div>
      <div v-if="recoveryStep === 3">Nueva Contraseña</div>
      </v-card-title>
    <v-card-text>
    <div v-if="recoveryStep === 1">Ingresa tu correo electrónico registrado y te enviaremos un código para restablecer tu contraseña.</div>
    <div v-if="recoveryStep === 2">
      Código de verificación enviado al correo <strong>{{ recoveryEmail }}</strong>,
      activo por {{ formatTime(secondsRemaining) }}
    </div> 
    <div v-if="recoveryStep === 3">Ingresa tu nueva contraseña a continuación.</div>   
    </v-card-text>

        <v-card-text>
      <!-- Campo de correo (siempre visible después del paso 1) -->
      <v-text-field
        v-if="recoveryStep === 1"
        v-model="recoveryEmail"
        label="Correo electrónico"
        variant="outlined"
        density="comfortable"
        :rules="emailRules"
        class="mb-4"
      />

        <div class="d-flex justify-center mb-6"
          v-if="recoveryStep === 2">
        <v-text-field
          v-for="(digit, index) in code"
          :key="index"
          v-model="code[index]"
          :class="{ 'digit-filled': !!code[index] }"
          maxlength="1"
          variant="outlined"
          hide-details
          class="mx-1 large-centered-input"
          style="width: 48px;"
          :ref="el => { if (el) this.inputRefs[index] = el; }"
          @input="handleInput(index)"
          @keydown="handleKeydown(index, $event)"
          @focus="selectContent($event)"
          color="green"
        ></v-text-field>
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
            :rules="passwordRules1"
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
      <!--</template>-->
    </v-card-text>

    <!-- Acciones del modal -->
    <v-card-actions>
    <v-spacer></v-spacer>
      <v-btn
        class="text-none"
        color="grey-lighten-3"
        variant="flat"
         @click="closeRecovery"
         :disabled="this.recoveryStep === 1 ? this.loadingRecovery : false"
      >
        Cancelar
      </v-btn>
      <v-btn
            v-if="recoveryStep === 2 && !isTimerActive"
             color="cyan-darken-3" class="text-white text-subtitle-1" variant="flat" style="text-transform: none;"
            @click="resendCode"
            :disabled="loadingRecovery"
          >
            Reenviar código
          </v-btn>
          <v-btn
            v-if="selectedRecoveryOption === 'haveCode' && recoveryStep === 2"
            color="cyan-darken-3" class="text-white text-subtitle-1" variant="flat" style="text-transform: none;"
            @click="verifyCode"
            :disabled="loadingRecovery  || !isCodeComplete"
          >
            Verificar código
          </v-btn>
      <!--Revisar validación de continuar cone l correo-->
       <v-btn
        v-if="recoveryStep === 1" color="cyan-darken-3" class="text-white text-subtitle-1" variant="flat" style="text-transform: none;"
        @click="resendCode"
        :disabled="!isRecoveryEmailValid"
        :loading="this.loadingRecovery"
      >
        Continuar
      </v-btn>
      <v-btn
        v-if="recoveryStep === 3"
        variant="flat"
        class="text-white text-subtitle-1"
        @click="updatePassword"
        color="cyan-darken-3"
        style="text-transform: none;"
      >
        Cambiar contraseña
      </v-btn>
    </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="approvalModal" max-width="500" persistent>
  <v-card>
    <v-card-title class="text-h6 font-weight-bold text-center pa-6">
      {{ approvalTitle }}
    </v-card-title>
    <v-card-text class="text-body-1 text-center pa-4" v-html="approvalMessage">
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="cyan-darken-3"
        text-color="white"
        variant="flat"
        @click="closeApprovalModal"
        style="text-transform: none;"
      >
        Aceptar
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>


<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import router from '@/router/index';
export default {
  data: () => ({
    termsAccepted: false,
     recoveryTimer: null,        // ID del intervalo
    secondsRemaining: 180,      // 3 minutos en segundos
    approvalModal: false,
    approvalMessage: '',
    approvalTitle: '',
    approvalData: null, // para guardar los datos y usar register/action después
    isTimerActive: false ,
     showDialog: false,
     code: ['', '', '', '', '', ''],
     inputRefs: [],
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
    showPass: false,
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
    ],
    confirmPasswordRules() {
    return [
        v => !!v || 'Confirma la contraseña',
        v => v === this.newPassword || 'Las contraseñas no coinciden'
      ];
    },
    confirmshowPassword() {
    return [
        v => !!v || 'Confirma la contraseña',
        v => v === this.editedItem.password || 'Las contraseñas no coinciden'
      ];
    },
    nameRules: [
      (v) => !!v || "El nombre no puede estar vacío.",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    emailRules: [
      (v) => !!v || "El correo electrónico es requerido",
      (v) => /.+@.+\..+/.test(v) || "Ingresa un correo electrónico válido.",
    ],
    reuquiredRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
  }),
    computed: {
      isCodeComplete() {
        return this.code.every(digit => digit !== '');
      },
       passwordRules1() {
      return [
        v => !!v || this.$t('login.rules.password.required'),
        v => (v && v.length >= 8) || this.$t('login.rules.password.minLength'),
        v => (v && /[A-Z]/.test(v)) || this.$t('login.rules.password.uppercase'),
        v => (v && /\d/.test(v)) || this.$t('login.rules.password.number')
      ]
    },
      isRegisterModeDisabled() {
    if (!this.register) return false
    return !this.valid || !this.termsAccepted
  },
    isRecoveryEmailValid() {
      // Si no hay email, no es válido
      if (!this.recoveryEmail) return false;
      // Verifica que todas las reglas devuelvan true (no un string)
      return this.emailRules.every(rule => rule(this.recoveryEmail) === true);
    }
  },
  mounted() {
    // Obtiene los datos de la URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
     const approvalParam = urlParams.get('approval');
  if (approvalParam) {
      const approvalData = JSON.parse(decodeURIComponent(approvalParam));
      console.log('Datos de aprobación recibidos:', approvalData);
      // Eliminar el parámetro de la URL para evitar reejecución al refrescar
      window.history.replaceState({}, document.title, window.location.pathname);

      // Guardar datos temporalmente
      this.approvalData = approvalData;
      LocalStorageService.setItem('approvalData', approvalData);

      // Generar mensaje amigable
      const { action, register, homeName } = approvalData;
      if (action === 'approve') {
        this.approvalTitle = '✅ ¡Solicitud aceptada!';
        this.approvalMessage = register
          ? `Has aceptado la solicitud para crear el hogar <strong>${homeName}</strong>.<br>Para completar, <strong>debes registrarte</strong> en Huoon.`
          : `Has aceptado la solicitud para crear el hogar <strong>${homeName}</strong>.<br><strong>Inicia sesión</strong> para finalizar la creación del hogar.`;
      } else {
        this.approvalTitle = '❌ Solicitud rechazada';
        this.approvalMessage = register
          ? `Has rechazado la solicitud para crear el hogar <strong>${homeName}</strong>.<br>Si cambias de opinión, puedes <strong>registrarte</strong> más tarde para crear un hogar y compartir su código.`
          : `Has rechazado la solicitud para crear el hogar <strong>${homeName}</strong>.<br>Si cambias de opinión, <strong>inicia sesión</strong> y comparte el código de tu hogar para que tu hijo(a) pueda unirse.`;
      }

      // Mostrar modal
      this.approvalModal = true;
  }
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
      LocalStorageService.setItem('email', user.email);
      LocalStorageService.setItem('person_id', user.personId);
      LocalStorageService.setItem('home_id', user.home);
      LocalStorageService.setItem('home_id', user.email);
      LocalStorageService.setItem('userLocale', user.language);
      LocalStorageService.setItem('onboarding_status', user.onboarding_status);

      // Reiniciar el formulario
      this.editedItem = Object.assign({}, this.defaultItem);

      // Redirigir al Dashboard
       const allowedStatuses = [0];

          if (allowedStatuses.includes(parseInt(this.onboarding_status, 10))){
              setTimeout(() => {
              router.push({ name: 'Onboarding' });
            }, 500);
            }else{
            // Redirigir al Dashboard
            setTimeout(() => {
              router.push({ name: 'Home' });
            }, 500);
          }

          window.history.replaceState({}, document.title, window.location.pathname);
    }

    this.register = false;
  },
  methods: {
  goToTerms() {
    const routeData = this.$router.resolve({ name: 'TermsAndConditions' });
    window.open(routeData.href, '_blank');
  },
  goToPrivacy() {
    const routeData = this.$router.resolve({ name: 'PrivacyPolicy' });
    window.open(routeData.href, '_blank');
  },
  closeApprovalModal() {
    this.approvalModal = false;

    // Si debe registrarse, activar el modo registro
    if (this.approvalData?.register) {
      this.register = true;
      // Opcional: limpiar el formulario
      this.editedItem = Object.assign({}, this.defaultItem);
    }

    // Limpiar datos temporales
    this.approvalData = null;
    this.approvalTitle = '';
    this.approvalMessage = '';
  },
  startRecoveryTimer() {
    // Limpiar temporizador anterior si existe
    if (this.recoveryTimer) {
      clearInterval(this.recoveryTimer);
    }

    this.secondsRemaining = 180;
    this.isTimerActive = true;

    this.recoveryTimer = setInterval(() => {
      this.secondsRemaining--;
      if (this.secondsRemaining <= 0) {
        clearInterval(this.recoveryTimer);
        this.isTimerActive = false;
      }
    }, 1000);
  },

  // Formatea segundos a mm:ss
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },
    handleInput(index) {
      if (this.code[index]?.length === 1 && index < 5) {
        this.$nextTick(() => {
          const nextInput = this.inputRefs[index + 1];
          if (nextInput && nextInput.$el) {
            const inputEl = nextInput.$el.querySelector('input');
            if (inputEl) inputEl.focus();
          }
        });
      }
      // Auto-submit si se llena el último campo
      /*if (index === 5 && this.code[5]?.length === 1) {
        this.submitCode();
      }*/
    },

    handleKeydown(index, event) {
      if (event.key === 'Backspace' && !this.code[index] && index > 0) {
        this.$nextTick(() => {
          const prevInput = this.inputRefs[index - 1];
          if (prevInput && prevInput.$el) {
            const inputEl = prevInput.$el.querySelector('input');
            if (inputEl) {
              inputEl.focus();
              inputEl.select();
            }
          }
        });
      }
    },

    selectContent(event) {
      event.target.select();
    },
      submitCode() {
      const fullCode = this.code.join('')
      console.log('Código ingresado:', fullCode)
      // Aquí podrías emitir evento o llamar una API
      // this.$emit('submit', fullCode)
  },
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
             this.$refs.form.reset();
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
            LocalStorageService.setItem('email', user.email);
            LocalStorageService.setItem('person_id', user.personId);
            LocalStorageService.setItem('home_id', user.home);
            LocalStorageService.setItem('userLocale', user.language);
            LocalStorageService.setItem('onboarding_status', parseInt(user.onboarding_status));
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
            const allowedStatuses = [0];
          if (allowedStatuses.includes(parseInt(user.onboarding_status))){
              setTimeout(() => {
          this.loading = false; // Detener el loader
              router.push({ name: 'Onboarding' });
            }, 500);
            }else{
            // Redirigir al Dashboard
            setTimeout(() => {
              this.loading = false; // Detener el loader
              router.push({ name: 'Home' });
            }, 500);
          }
          } else {
            this.loading = false;
            // Manejo de errores definidos por la API
            this.showAlert('warning', result.message || 'Error inesperado', 3000);
          }
        } catch (error) {
          this.loading = false;
          // Manejo de errores no controlados
          this.showAlert('error', 'Ocurrió un error inesperado al iniciar sesión.', 3000);
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
             this.$refs.form.reset();
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
            LocalStorageService.setItem('email', user.email);
            LocalStorageService.setItem('person_id', user.personId);
            LocalStorageService.setItem('home_id', user.home);
            LocalStorageService.setItem('userLocale', user.language);
            LocalStorageService.setItem('onboarding_status', user.onboarding_status);
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
            const allowedStatuses = [0];
            console.log('NAVIGATING TO ONBOARDING');
            console.log(user.onboarding_status);
            console.log(allowedStatuses.includes(parseInt(user.onboarding_status)));
          if (allowedStatuses.includes(parseInt(user.onboarding_status))){
              setTimeout(() => {
              this.loading = false; // Detener el loader
              router.push({ name: 'Onboarding' });
            }, 500);
            }else{
            // Redirigir al Dashboard
            setTimeout(() => {
          this.loading = false; // Detener el loader
              router.push({ name: 'Home' });
            }, 500);
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
    //this.showDialog = true;
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
    this.code = ['', '', '', '', '', ''];
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
        this.recoveryStep = 2;
        this.startRecoveryTimer();
        // Opcional: limpiar el campo de código si estaba lleno
        this.recoveryCode = '';
      } else {
        this.recoveryStep = 1;
        this.showAlert('warning', result.message || 'Error al reenviar', 2000);
      }
    } catch (error) {
      this.recoveryStep = 1;
      this.showAlert('error', 'Error de conexión', 2000);
    } finally {
      this.loadingRecovery = false;
    }
  },

  async verifyCode() {
    const fullCode = this.code.join('');
    this.data = {};
    this.data.email = this.recoveryEmail;
    this.data.code = fullCode;
    this.loadingRecovery = true;
    try {
      const result = await handleRequest({
        endpoint: 'verify-code-password',
        method: 'POST',
         data: this.data,
         includeToken: false
      });
      if (result.success) {
        this.recoveryUserId = result.data.userId;
        this.selectedRecoveryOption = ''
        this.recoveryStep = 3; // Avanzar a nueva contraseña
      } else {
        this.code = ['', '', '', '', '', ''];
        this.recoveryStep = 2;
        this.showAlert('warning', result.message || 'Código incorrecto', 2000);
      }
    } catch (error) {
      this.recoveryStep = 2;
      this.code = ['', '', '', '', '', ''];
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
        this.$refs.form.reset();
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
     if (this.recoveryTimer) {
      clearInterval(this.recoveryTimer);
      this.recoveryTimer = null;
    }
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
:deep(.digit-filled .v-field__outline__border) {
  border-color: rgb(var(--v-theme-green)) !important;
}

/* También aplica a las partes del notch (aunque hide-details lo oculta, por consistencia) */
:deep(.digit-filled .v-field__outline__notch::before),
:deep(.digit-filled .v-field__outline__notch::after) {
  border-color: rgb(var(--v-theme-green)) !important;
}

/* Estilo del input */
:deep(.large-centered-input input) {
  font-size: 24px !important;
  text-align: center !important;
  font-weight: 500;
}
.v-card {
  background-color: #F9FCFF;
}
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