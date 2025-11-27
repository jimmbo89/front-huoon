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
  
  <v-container :fluid="isMobile">
  <v-card elevation="4" rounded="lg">

        <v-card-title class="d-flex justify-space-between" color="#03626C" dark>
          <span class="font-weight-bold text-body-2">Configuración de tu hogar</span>
        </v-card-title>
        <v-card-text>
            <div ref="chatBody" class="chat-body py-2" :class="isMobile ? 'px-0' : 'px-4'">
              <!-- Mensajes del chat -->
              <div
                v-for="(message, index) in chatMessages"
                :key="index"
                class="d-flex mb-2"
                :class="message.from === 'user' ? 'justify-end' : 'justify-start'"
              >
                <!-- Contenedor principal alineado al centro -->
                <div class="d-flex align-center"> <!-- align-center para centrado vertical -->
                  <!-- Avatar de IA (izquierda) -->
                  <v-avatar 
                    v-if="message.from === 'ai'" 
                    size="28"
                    class="mr-3"
                  >
                    <v-img src="@/assets/logo-verde.png" alt="Imagen de perfil"></v-img>
                  </v-avatar>
                  
                  <!-- Contenido del mensaje -->
                  <div
                    class="chat-bubble py-3 rounded-xl w-100"
                    :class="{
                      'bg-primary text-white': message.from === 'user',
                      'bg-grey-lighten-2 text-black': message.from === 'ai',
                      'px-4': !isMobile,
                      'px-2': isMobile  // 👈 menos padding en móvil
                    }"
                  >
                    <div v-if="message.text">
                      {{ message.text }}
                    </div>
                    <component
                      v-if="message.component"
                      :is="message.component"
                      class="w-100 onboarding-content"
                      :class="isMobile ? 'mobile-full-width' : ''"
                      v-bind="message.props"
                      :loading="isLoading"
                      @next-step="nextStep"
                      @next-later="nextLater"
                      @start-flow="startFreshFlow"
                      @join-home="handleJoinHome"
                      @home-created="handleHomeCreated"
                      @create-home="handleCreateHome"
                      @home-joined="handleHomeJoined"
                      @go-back="goBackToOptions"
                      @complete="handleOnboardingComplete"
                      @birthdate-submitted="handleBirthdateSubmitted"
                      @invite-adult="handleInviteAdult"
                      @submit-invite="handleSubmitInvite"
                    />
                  </div>
                  
                  <!-- Avatar de Usuario (derecha) -->
                  <v-avatar 
                    v-if="message.from === 'user'" 
                    size="28"
                    class="ml-3"
                  >
                    <template v-if="imagenDisponible()">
                      <img :src="imgedit" alt="User Avatar" class="avatar-image" />
                    </template>
                    <template v-else>
                      <v-icon>mdi-account</v-icon>
                    </template>
                  </v-avatar>
                </div>
              </div>
              
              <!-- Indicador de "escribiendo" -->
              <div v-if="isTyping" class="d-flex mb-8 justify-start">
                <div class="d-flex align-center">
                  <v-avatar size="28" class="mr-3">
                    <img src="@/assets/logo-verde.png" alt="Imagen de avatar" class="avatar-image" />
                  </v-avatar>
                  <div class="chat-bubble px-4 py-3 rounded-xl text-black">
                    <div class="typing-container">
                      <span class="typing-dots">•••</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </v-card-text>
  </v-card>
</v-container>
</template>

<script>
import WelcomeStep from "@/components/onboarding/WelcomeStep.vue";
import HomeOptionsStep from "@/components/onboarding/HomeOptionsStep.vue";
import CreateHomeStep from "@/components/onboarding/CreateHomeStep.vue";
import JoinHomeStep from "@/components/onboarding/JoinHomeStep.vue";
import ConfirmationStep from "@/components/onboarding/ConfirmationStep.vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import { markRaw } from 'vue'
import BirthdateStep from "@/components/onboarding/BirthdateStep.vue";
import MinorOnboardingCard from "@/components/onboarding/MinorOnboardingCard.vue";
import InviteAdultForm from "@/components/onboarding/InviteAdultForm.vue";

export default {
  emits: ["onboarding-complete"],
  components: {
    WelcomeStep,
    HomeOptionsStep,
    CreateHomeStep,
    JoinHomeStep,
    ConfirmationStep,
    BirthdateStep,
    MinorOnboardingCard,
    InviteAdultForm
  },
  data() {
    return {
      currentStep: 0,
      isFullscreen: false,
      steps: [
        { component: "WelcomeStep", props: {} },
        { component: "HomeOptionsStep", props: {} },
        // Los pasos 3A y 3B se determinarán dinámicamente
        { component: "ConfirmationStep", props: {} }
      ],
      selectedOption: null,
      homeData: {
        name: "",
        address: "",
        type: "house"
      },
      name: "",
      email: "",
      joinCode: "",
      createdHome: null,
      joinedHome: null,
      isTyping: false,
      imageUrl: "",
      isLoading: false,
      chatMessages: [],
      data: {},
      snackbar: false,
      sb_type: "success",
      sb_message: "",
      sb_timeout: 3000,
      sb_title: "",
      sb_icon: "mdi-check-circle"
    };
  },
  computed: {
    imgedit() {
      return `${this.$axios.defaults.baseURL}images/${this.imageUrl}`;
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
  mounted() {
    this.imageUrl = LocalStorageService.getItem("image")?.replace(/['"]+/g, "") || "";
     this.name = JSON.parse(LocalStorageService.getItem("name"));
     this.email = JSON.parse(LocalStorageService.getItem("email"));
    this.startOnboarding();
  },
  methods: {
     updateFullscreenMode() {
      this.$nextTick(() => {
        this.isFullscreen = this.isDesktop;
      });
    },
    handleInviteAdult() {
    this.addMessage({
      from: "ai",
      component: "InviteAdultForm",
      props: {
      loading: this.isLoading // 👈 esto es clave
      },
      timestamp: new Date().toLocaleTimeString()
    });
  },
  async handleSubmitInvite({ homeName, adultEmail }) {
      try {
        this.isLoading = true;

        const response = await handleRequest({
          endpoint: "invite-create-home",
          method: "POST",
          data: {
            homeName: homeName,
            minorName: this.name,      // 👈 Nombre del menor
            guardianEmail: adultEmail,  // 👈 Correo del adulto/tutor
            minorEmail: this.email,
          }
        });

        if (response.success) {
          // ✅ Mostrar mensaje personalizado en el chat
          this.addMessage({
            from: "ai",
            text: `✉️ Solicitud enviada a ${adultEmail}.\nTu hogar estará disponible una vez que el adulto lo apruebe.`,
            timestamp: new Date().toLocaleTimeString()
          });
          LocalStorageService.setItem('onboarding_status', 1);
          this.currentStep = 'invitation-sent';
          setTimeout(() => {
            this.$router.push({ name: "Home" }); // ← más robusto
          }, 1000);
        } else {
          // ❌ Error del backend
          this.addMessage({
            from: "ai",
            text: response.message || "No se pudo enviar la invitación. Por favor, inténtalo de nuevo.",
            timestamp: new Date().toLocaleTimeString()
          });

         setTimeout(() => {
            this.goBackToOptions(); // ← más robusto
          }, 1000);
        }
      } catch (error) {
        console.error("Error al enviar invitación:", error);
        this.addMessage({
          from: "ai",
          text: "Ocurrió un error inesperado al procesar la solicitud.",
          timestamp: new Date().toLocaleTimeString()
        });
        setTimeout(() => {
            this.goBackToOptions(); // ← más robusto
          }, 1000);
      } finally {
        this.isLoading = false;
      }
    },
    handleBirthdateSubmitted(birthdateString) {
    // birthdateString es como "1990-05-15"
    const birthDate = new Date(birthdateString);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 18) {
      // ✅ Mayor de edad → mostrar formulario para crear hogar
      this.addMessage({
        from: "ai",
        component: "CreateHomeStep",
        props: {},
        timestamp: new Date().toLocaleTimeString()
      });
      this.currentStep = 3; // o el valor que uses para "crear hogar"
    } else {
      // ❌ Menor de edad
      this.addMessage({
      from: "ai",
      component: "MinorOnboardingCard", // ← Nombre del componente que creamos
      props: {},
      timestamp: new Date().toLocaleTimeString()
    });
    }
    },
    startOnboarding() {
      // Reinicia completamente el estado del onboarding
      this.currentStep = 0;
      this.selectedOption = null;
      this.chatMessages = []; // ← ¡Importante!
      this.createdHome = null;
      this.joinedHome = null;

      this.isTyping = true;
      setTimeout(() => {
        this.addMessage({
          from: "ai",
          component: "WelcomeStep",
          props: {},
          timestamp: new Date().toLocaleTimeString()
        });
        this.isTyping = false;
      }, 1000);
    },
    
    addMessage(message) {
      // Solo evitar duplicados para mensajes de texto (no componentes)
      if (message.text) {
        const lastMessage = this.chatMessages.length > 0 
          ? this.chatMessages[this.chatMessages.length - 1] 
          : null;

        // Si el último mensaje es idéntico en from + text, no lo agregues
        if (
          lastMessage &&
          lastMessage.text === message.text &&
          lastMessage.from === message.from
        ) {
          return; // Evita duplicado consecutivo
        }
      }
      // Agregar el mensaje y hacer scroll
      this.chatMessages.push(message);
      this.scrollToBottom();
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    
    imagenDisponible() {
      return this.imgedit && this.imgedit !== "";
    },
    
    showAlert(type, message, timeout = 3000) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar = true;
    },
    
    // Manejo de eventos de los componentes
    handleCreateHome() {
      this.cleanupAfterHomeOptions();
      this.selectedOption = "create";
      this.currentStep = 1;
      this.nextStep();
    },
    
    handleJoinHome() {
      this.cleanupAfterHomeOptions();
      this.selectedOption = "join";
      this.currentStep = 1;
      this.nextStep();
    },

     handleOnboardingComplete() {
      this.$router.push({ path: "home" });
    },
    
    goBackToOptions() {
      this.selectedOption = null;
      this.currentStep = 1;

      // Encuentra el índice del ÚLTIMO mensaje con HomeOptionsStep
      const lastHomeOptionsIndex = this.chatMessages
        .map((msg, i) => (msg.component === 'HomeOptionsStep' ? i : -1))
        .filter(i => i !== -1)
        .pop(); // Obtiene el último índice, o undefined si no existe

      if (lastHomeOptionsIndex !== undefined) {
        // Conserva todos los mensajes HASTA e INCLUYENDO HomeOptionsStep
        this.chatMessages = this.chatMessages.slice(0, lastHomeOptionsIndex + 1);
      } else {
        // Si no existe HomeOptionsStep, limpia todo y lo agregamos
        this.chatMessages = [];
        this.addMessage({
          from: "ai",
          component: "HomeOptionsStep",
          props: {},
          timestamp: new Date().toLocaleTimeString()
        });
        return;
      }

      // Opcional: si quieres asegurarte de que esté visible (aunque ya está),
      // podrías hacer scroll, pero no es necesario agregarlo de nuevo.
    },
    
    /*async handleHomeCreated(homeData) {
      try {
        this.isLoading = true;
        const response = await handleRequest({
          endpoint: "homes",
          method: "POST",
          data: homeData
        });
        
        if (response.success) {
          this.createdHome = response.data;
          LocalStorageService.setItem("home_id", JSON.stringify(response.data.id));
          this.nextStep();
        } else {
          this.showAlert("error", response.message || "Error al crear el hogar");
        }
      } catch (error) {
        this.showAlert("error", "Error al conectar con el servidor");
      } finally {
        this.isLoading = false;
      }
    },*/
    async handleHomeCreated(homeData) {
       if (!homeData) {
        console.error('Error: homeData es undefined');
        this.addMessage({
          from: "ai",
          text: "Error interno: no se recibieron datos del formulario",
          timestamp: new Date().toLocaleTimeString()
        });
        this.goBackToOptions(); // Regresar al paso anterior
        return;
      }

       console.log('Datos recibidos para crear hogar:', homeData); // Debug
      try {
        this.isLoading = true;
        
        // Definir los campos que se pueden actualizar
        const fieldsToUpdate = [
          'name', 'address', 'home_type_id', 'status_id', 'category_id', 
          'residents', 'geo_location', 'timezone', 'people', 'image', 'code'
        ];
        
        // Filtrar solo los campos modificados
        let updatedFields = Object.keys(homeData)
          .filter((key) => fieldsToUpdate.includes(key) && homeData[key] !== null)
          .reduce((obj, key) => {
            if (key === 'people') {
              // Transformar el campo `people`
              obj[key] = homeData.people.map(person => ({
                person_id: Number(person.id),
                role_id: Number(person.roleId),
                roleName: person.roleName
              }));
            } else {
              obj[key] = homeData[key];
            }
            return obj;
          }, {});

        // Verificar si hay campos para actualizar
        if (Object.keys(updatedFields).length === 0) {
          this.addMessage({
            from: "ai",
            text: "Debe completar los datos del hogar para continuar.",
            timestamp: new Date().toLocaleTimeString()
          });
          return;
        }

        // Crear FormData y agregar los campos
        const formData = new FormData();
        for (let key in updatedFields) {
          if (key === 'people') {
            updatedFields[key].forEach((person, index) => {
              for (const [personKey, value] of Object.entries(person)) {
                formData.append(`people[${index}][${personKey}]`, value);
              }
            });
          } else {
            // Para la imagen, asegurarse de agregarla correctamente
            if (key === 'image' && updatedFields[key] instanceof File) {
              formData.append(key, updatedFields[key], updatedFields[key].name);
            } else {
              formData.append(key, updatedFields[key]);
            }
          }
        }

        // Hacer la petición al API
        const result = await handleRequest({
          endpoint: 'home',
          method: 'POST',
          data: formData,
        });

        if (result.success) {
          const homeId = result.data.home.id;
          const homeName = result.data.home.name;
          const homeCode = result.data.home.code;
            LocalStorageService.setItem("home_id", JSON.stringify(homeId));
          
            // Mostrar ConfirmationStep
          this.addMessage({
            from: "ai",
            component: "ConfirmationStep",
            props: {
              homeName: homeName,
              homeCode: homeCode,
              personName: this.name,
              isAdmin: true,
              action: "crear"
            }
          });
        } else {
          // Mostrar error en el chat y volver al paso anterior
          this.addMessage({
            from: "ai",
            text: result.message || "Error al crear el hogar",
            timestamp: new Date().toLocaleTimeString()
          });
          this.goBackToOptions();
        }
      } catch (error) {
        console.error("Error en la creación del hogar:", error);
        this.addMessage({
          from: "ai",
          text: "Ocurrió un error inesperado al procesar la solicitud.",
          timestamp: new Date().toLocaleTimeString()
        });
        this.goBackToOptions();
      } finally {
        this.isLoading = false;
      }
    },
    async handleHomeJoined({ code }) {
      if (!code) {
        console.error('Error: código no proporcionado');
        this.addMessage({
          from: "ai",
          text: "Debe ingresar un código válido para unirse al hogar",
          timestamp: new Date().toLocaleTimeString()
        });
        this.goBackToOptions();
        return;
      }

      try {
        this.isLoading = true;
        this.data = {};
        this.data.code = code;
        // Hacer la petición al nuevo endpoint
        const response = await handleRequest({
          endpoint: "home-verify-code",
          method: "POST",
          data: this.data
        });

        if (response.success) {
          // Guardar el ID del hogar en localStorage como en ambos ejemplos
          const homeId = response.data.home.id;
          const homeName = response.data.home.name;
          LocalStorageService.setItem("home_id", JSON.stringify(homeId));
          LocalStorageService.setItem("onboarding_status", 1);
          
          this.addMessage({
            from: "ai",
            component: "ConfirmationStep",
            props: {
              homeName: homeName,
              personName: this.name,
              isAdmin: false,
              action: "unirse"
            }
          });
          setTimeout(() => {
            this.handleOnboardingComplete();
          }, 1000);
        } else {
          // Manejo de errores similar a handleHomeCreated
          this.addMessage({
            from: "ai",
            text: response.message || "Código inválido o error al unirse al hogar",
            timestamp: new Date().toLocaleTimeString()
          });
          
          // Opcional: volver a opciones como en handleHomeCreated
          //this.goBackToOptions();
        }
      } catch (error) {
        this.addMessage({
          from: "ai",
          text: "Ocurrió un error inesperado al procesar la solicitud.",
          timestamp: new Date().toLocaleTimeString()
        });
        this.goBackToOptions();
      } finally {
        this.isLoading = false;
      }
    },
    
    nextStep() {
      this.isTyping = true;

      setTimeout(() => {
        let nextComponent;

        if (this.currentStep === 0) {
          // ✅ Reiniciar flujo: limpiar todo después del WelcomeStep
          this.selectedOption = null;
          this.createdHome = null;
          this.joinedHome = null;

          // Eliminar todos los mensajes excepto el primero (WelcomeStep)
          // Asumimos que el primer mensaje es WelcomeStep
          if (this.chatMessages.length > 1) {
            this.chatMessages = [this.chatMessages[0]]; // Mantener solo WelcomeStep
          }

          // Verificar si ya existe HomeOptionsStep en los mensajes
          const hasHomeOptions = this.chatMessages.some(
            msg => msg.component === "HomeOptionsStep"
          );

          if (!hasHomeOptions) {
            nextComponent = "HomeOptionsStep";
            this.currentStep = 1;
          } else {
            // Ya está presente, no avanzamos ni agregamos nada
            this.isTyping = false;
            return;
          }
        } else if (this.currentStep === 1) {
          if (this.selectedOption === "create") {
             nextComponent = "BirthdateStep"; // 👈 Cambiado
            this.currentStep = 2;
            //nextComponent = "CreateHomeStep";
          } else {
            nextComponent = "JoinHomeStep";
          }
          this.currentStep = 2;
        }

        // Solo agregamos mensaje si hay un componente definido
        if (nextComponent) {
          this.addMessage({
            from: "ai",
            component: nextComponent,
            props: {
              homeName: this.createdHome?.name || this.joinedHome?.name || "",
              homeType: this.homeData.type,
              ...(nextComponent === "ConfirmationStep" ? {
                isAdmin: this.selectedOption === "create"
              } : {})
            },
            timestamp: new Date().toLocaleTimeString()
          });
        }

        this.isTyping = false;
      }, 800);
    },
    nextLater(){
      console.log('next-later');
      this.$router.push({ path: "home" });
    },
      cleanupAfterHomeOptions() {
      // Encontrar el índice del último HomeOptionsStep
      const homeOptionsIndex = this.chatMessages.findIndex(
        msg => msg.component === "HomeOptionsStep"
      );

      if (homeOptionsIndex !== -1) {
        // Mantener todos los mensajes hasta (e incluyendo) HomeOptionsStep
        this.chatMessages = this.chatMessages.slice(0, homeOptionsIndex + 1);
      }
      // Si no existe HomeOptionsStep, no hacemos nada (raro, pero seguro)
    },
    startFreshFlow() {
  // Limpiar todo el historial
  this.chatMessages = [];
  this.currentStep = 1;
  this.selectedOption = null;
  this.createdHome = null;
  this.joinedHome = null;

  // Mostrar WelcomeStep
  this.addMessage({
    from: "ai",
    component: "WelcomeStep",
    props: {},
    timestamp: new Date().toLocaleTimeString()
  });

  // Simular "comenzar": después de un breve delay, mostrar HomeOptionsStep
  this.isTyping = true;
  setTimeout(() => {
    this.isTyping = false;
    this.addMessage({
      from: "ai",
      component: "HomeOptionsStep",
      props: {},
      timestamp: new Date().toLocaleTimeString()
    });
    this.currentStep = 1; // ahora estamos en el paso 1
  }, 800);
},
  }
};
</script>

<style scoped>
.chat-bubble .w-100,
.chat-bubble .w-100 .v-card,
.chat-bubble .w-100 .v-form,
.chat-bubble .w-100 .v-container,
.chat-bubble .w-100 .v-row,
.chat-bubble .w-100 .v-col {
  width: 100% !important;
  max-width: 100% !important;
}

.chat-bubble .v-col {
  flex: 1 1 100% !important;
  max-width: 100% !important;
}

.onboarding-step-card {
  width: 100%;
  max-width: 100%;
}
.chat-body {
  flex: 1;
  overflow-y: auto;
  max-height: 85vh;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 8px;
}
/* Estilos similares al componente original */
.priority-options-container {
  margin-top: 12px;
  max-width: 100%;
  overflow-x: auto;
}
.chat-bubble {
  max-width: 100%;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.4;
}
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.message-item {
  margin-bottom: 5px;
}

.user-message-container {
  flex-direction: row-reverse;
}

.user-message {
max-width: 100%;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.4;
}

.ai-message {
  max-width: 100%;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.4;
}

.v-card-text {
  line-height: 1.5;
}

.typing-dots {
  font-size: 1.5rem;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

/* Estilos específicos para componentes de onboarding */
.onboarding-card {
  border-radius: 0;
  padding: 4px;
  margin: 0 0;
}

.onboarding-option {
  cursor: pointer;
  transition: all 0.3s;
}

.onboarding-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.onboarding-button {
  margin-top: 16px;
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
.onboarding-content.mobile-full-width {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Si usan v-container, forzar fluid en móvil */
.onboarding-content.mobile-full-width .v-container {
  padding-left: 0 !important;
  padding-right: 0 !important;
  max-width: 100% !important;
}

/* Si usan v-row con gutters, eliminarlos en móvil */
.onboarding-content.mobile-full-width .v-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.onboarding-content.mobile-full-width .v-col {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>