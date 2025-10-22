<template>
  <div class="onboarding-card rounded-lg">
    <h3 class="text-body-2 mb-4">Unirme a un hogar existente</h3>
    
    <v-form @submit.prevent="submitForm">
      <div class="d-flex justify-center mb-6">
        <v-text-field
          v-for="(digit, index) in code"
          :key="index"
          v-model="code[index]"
          maxlength="1"
          variant="outlined"
          hide-details
          class="mx-1 large-centered-input"
          style="width: 48px;"
          bg-color="white"
          :ref="el => { if (el) this.inputRefs[index] = el; }"
          @input="handleInput(index)"
          @keydown="handleKeydown(index, $event)"
          @focus="selectContent($event)"
        ></v-text-field>
      </div>
      
      <div class="d-flex justify-end">
        <v-btn 
          variant="tonal"
                class="text-grey-darken-1 mr-1"
          @click="$emit('go-back')"
        >
          Volver
        </v-btn>
        
        <v-btn 
           color="cyan-darken-3" class="text-white text-subtitle-1" variant="flat" style="text-transform: none;"
          type="submit"
          :loading="loading"
          :disabled="!isCodeComplete"
        >
          Unirme
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      code: ['', '', '', '', '', ''],
     inputRefs: [],
    };
  },
  computed: {
    isCodeComplete() {
    return this.code.length === 6 && this.code.every(digit => /^[a-zA-Z0-9]$/.test(digit));
  }
  },
  methods: {
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
    submitForm() {
      if (!this.code) {
        this.$emit('error', 'Por favor ingresa un código');
        return;
      }
      
      const codeString = this.code.join('');
  this.$emit('home-joined', { code: codeString });
    }
  },
  emits: ['home-joined', 'go-back', 'error']
};
</script>
<style scoped>
:deep(.large-centered-input input) {
  font-size: 20px !important;
  text-align: center !important;
}
</style>