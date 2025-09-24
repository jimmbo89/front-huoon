<template>
  <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
    :multi-line="true" vertical v-model="snackbar">
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
  <v-container>
    <v-card class="pa-4" elevation="4" rounded="lg" style="
    position: relative;
    overflow: visible;
    z-index: auto;
  ">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-row class="mb-4" align="center" dense>
          <!-- Columna ícono + texto título: ocupando un ancho fijo o proporcional -->
          <v-col cols="12" sm="10" md="10" class="d-flex align-center">
            <v-avatar size="48" class="me-3" color="grey-lighten-4" variant="tonal">
              <v-icon color="green-darken-2">mdi-finance</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-bold mb-1">
                {{ $t("finances.header.title") }}
              </div>
              <div class="text-body-2 text-grey-darken-1">
                {{ $t("finances.header.subtitle") }}
              </div>
            </div>
          </v-col>

          <!-- Columna de la tarjeta de sugerencia -->
          <v-col cols="12" sm="2" md="2">
            <div class="d-flex align-right justify-end pa-2">
              <v-switch v-model="budget_type" true-value="Personal" false-value="Hogar" :base-color="switchColor"
                :color="switchColor" hide-details inset class="mb-4 font-weight-bold">
                <template v-slot:label>
                  <span class="text-body-1" :style="{ color: switchColor }">
                    {{ getCurrentName }}
                  </span>
                </template>
              </v-switch>
            </div>
          </v-col>
        </v-row>

        
        <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
          <v-btn
            v-for="tool in tools"
            :key="tool.name"
            @click="tool.action()"
            size="small"
            color="primary"
            variant="text"
            prepend-icon="mdi-plus"
            class="text-capitalize"
          >
            {{ tool.name }}
          </v-btn>
        </v-card-actions>
        <v-divider />
        <!-- todo 712-->

        <v-row dense class="mt-4">
          <v-col cols="12" sm="12" md="12">
            <v-card class="mx-auto" elevation="1" rounded="lg" border flat>
              <v-list-item height="60">
                <template v-slot:prepend>
                  <v-avatar size="40" color="teal">
                    <v-icon icon="mdi-calendar"></v-icon>
                  </v-avatar>
                </template>

                <template v-slot:title> Día {{ todayDay }} de {{ lastDayOfMonth }} </template>
                <template v-slot:subtitle> {{ fullDate }} </template>
                <template v-slot:append>
                  <v-chip class="ma-2" color="teal" label rounded="lg">
                    <v-icon icon="mdi-emoticon" start></v-icon>
                    <div class="text-subtitle-2">Excelente!!</div>
                  </v-chip>
                </template>
              </v-list-item>

              <v-divider></v-divider>

              <v-card-text class="text-medium-emphasis pa-2">
                <v-sheet max-width="2150" rounded="lg">
                  <div class="pa-4">
                    <!-- Título: Presupuesto del mes -->
                    <div class="text-subtitle-2 font-weight-bold">
                      Presupuesto del mes de {{ fullMonth }}
                    </div>

                    <!-- Disponible (restante) -->
                    <div class="d-flex justify-space-between mt-2">
                      <div class="text-caption grey--text"></div>
                      <div class="text-caption font-weight-medium">
                        <v-chip color="teal-darken-2" label rounded="lg" variant="text">
                          <v-icon icon="mdi-trending-up"></v-icon>
                          <span class="text-subtitle-2">{{ balance.available }} CLP disponibles</span>
                        </v-chip>
                      </div>
                    </div>
                    <!-- Barra de progreso -->
                    <v-progress-linear :model-value="currentUsageAsNumber" :max="100" :color="progressColor"
                      :bg-color="progressBgColor" :buffer-value="projectedUsage" buffer-opacity="0.3" height="16"
                      rounded class="mt-2" style="height: 16px !important;">
                      <template v-slot:default>
                        <span class="text-caption font-weight-bold">
                          {{ currentUsageAsNumber }}%
                        </span>
                      </template>
                    </v-progress-linear>

                    <div class="d-flex justify-space-between align-center mt-2">
                      <!-- Consumido - Izquierda -->
                      <v-chip color="red-darken-4" label rounded="lg" variant="text">
                        <v-icon icon="mdi-trending-down" size="small"></v-icon>
                        <span class="text-subtitle-2 ml-1">{{ balance.spent }} CLP consumidos</span>
                      </v-chip>

                      <!-- Presupuesto - Derecha -->
                      <v-chip color="green-darken-4" label rounded="lg" variant="text">
                        <v-icon icon="mdi-wallet" size="small"></v-icon>
                        <span class="text-subtitle-2 ml-1">{{ balance.income }} CLP ingresado</span>
                      </v-chip>
                    </div>
                  </div>
                </v-sheet>

                <v-alert v-if="budgetAlerts && budgetAlerts.length > 0" color="warning" icon="mdi-alert-circle"
                  variant="outlined" theme="dark" border density="compact" class="py-1 px-4" @click="showAddBuget()"
                  style="cursor: pointer;">
                  <div class="text-body2 text-black">
                    {{ budgetAlerts[0].message }}
                  </div>
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" class="d-flex mt-4">
            <v-card class="mx-auto flex-grow-1 d-flex flex-column" elevation="1" rounded="lg" border flat>

              <!-- Título y Select -->
              <v-card-title class="d-flex align-center justify-space-between pb-2">
                <div class="text-subtitle-2">Gastos por categorías</div>
                <v-select v-model="selectedGroup" :items="selectItems" item-title="title" item-value="value"
                  density="compact" max-width="250" variant="solo-filled" flat hide-details single-line
                  placeholder="Todas">
                  <!-- Selección con ícono y color -->
                  <template v-slot:selection="data">
                    <template v-if="data.item">
                      <v-icon :icon="data.item.raw?.icon || data.item.icon"
                        :color="data.item.raw?.color || data.item.color" size="18" class="mr-1"></v-icon>
                      <span>{{ data.item.title }}</span>
                    </template>
                    <span v-else class="text-grey">Todas</span>
                  </template>

                  <!-- Opciones con ícono y color -->
                  <template v-slot:item="data">
                    <v-list-item v-bind="data.props">
                      <template v-slot:prepend>
                        <v-icon :icon="data.item?.raw?.icon || data.item?.icon"
                          :color="data.item?.raw?.color || data.item?.color" size="20" class="ml-1"></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-card-title>

              <!-- Contenedor del gráfico (flexible con scroll si es necesario) -->
              <div class="flex-grow-1 d-flex align-center justify-center position-relative">
                <v-pie :key="selectedGroup" :items="currentItems" v-model="selectedItems"
                  :legend="{ position: $vuetify.display.mdAndUp ? 'right' : 'bottom' }" :tooltip="true" gap="4"
                  inner-cut="70" item-key="id" rounded="1" animation hide-slice reveal size="230">

                  <template v-slot:center>
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">{{ totalDisplay }}</div>
                      <div class="opacity-70 mt-1 mb-n1">Total</div>
                    </div>
                  </template>

                  <template v-slot:tooltip="{ item }">
                    <div class="font-weight-bold">{{ item.title }}</div>

                    <div>
                      Consumido:
                      {{ formatCurrency(parseFloat(item.raw.amount || 0)) }}
                      de
                      {{ formatCurrency(
                          selectedGroup 
                            ? parseFloat(item.raw.budget || 0) 
                            : dataSpent.totalAmount
                        ) }}
                      ({{ item.value }}%)
                    </div>
                  </template>

                  <template v-slot:legend="{ items, toggle, isActive }">
                    <v-list class="py-0 bg-transparent" density="compact"
                      :width="$vuetify.display.mdAndUp ? 250 : '100%'" max-height="200" style="overflow-y: auto;">
                      <v-list-item v-for="item in items" :key="item.key"
                        :class="['my-1', { 'opacity-40': !isActive(item) }]" :title="item.title" rounded="lg" link
                        @click="toggle(item)">
                        <template v-slot:prepend>
                          <v-avatar :color="item.color" :size="16" />
                        </template>
                        <template v-slot:append>
                          <div class="text-right">
                            <div>{{ item.value }}%</div>
                          </div>
                        </template>
                      </v-list-item>
                    </v-list>
                  </template>
                </v-pie>
              </div>

            </v-card>
          </v-col>

          <v-col cols="12" md="6" class="d-flex mt-4">
            <IncomeSpentChart v-if="initializated" :incomeData="customIncomeData" :spentData="customSpentData"
              :year="new Date().getFullYear()" />
          </v-col>
          <v-col cols="12" class="d-flex">
            <v-alert v-if="spentAlerts" color="warning" icon="mdi-alert-circle" variant="outlined" theme="dark" border
              density="compact" class="py-1 px-4 mt-1" @click="showAddIncomeSpent()" style="cursor: pointer;">
              <div class="text-body2 text-black">
                {{ spentAlerts.message }}
              </div>
            </v-alert>
          </v-col>
        </v-row>

        <div class="h-0">
          <svg height="0" version="1.1" width="0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern-0" height="20" patternUnits="userSpaceOnUse" width="20">
                <path d="M0 10h20zm0 20h20zm0 20h20zm0 20h20z" fill="none" stroke="rgb(var(--v-theme-surface))"
                  stroke-width="3" />
              </pattern>
            </defs>
          </svg>
        </div>

        <v-divider class="my-4" />

        <SuggestionsList :items="suggestions" :title="$t('finances.sections.suggestions')" icon="mdi-finance">
          <template #detail="{ taskData, onClose }">
            <ChatTask :taskData="taskData" @close-dialog="onClose" />
          </template>
        </SuggestionsList>
      </v-card-text>
    </v-card>
  </v-container>
  <!--dialogo de ingresos-->
  <v-dialog v-model="dialogIncome" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Income />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--dialogo de gastos-->
  <v-dialog v-model="dialogSpent" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Spent />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogAddFinance" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p :class="[isIncome ? 'text-green' : 'text-red', 'text-grey-lighten-1']">
            {{
            isIncome
            ? $t("finances.formInstructions.income")
            : $t("finances.formInstructions.expense")
            }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item v-for="(s, index) in steps" :key="index" :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  " :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  " size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`finances.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`finances.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`finances.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles del ingreso -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="12">
                  <v-switch v-model="isIncome" inset hide-details :label="''" :base-color="isIncome ? 'green' : 'red'"
                    :color="isIncome ? 'green' : 'red'" class="mb-4 font-weight-bold">
                    <template #label>
                      <span :class="isIncome ? 'text-green' : 'text-red'">
                        {{
                        isIncome
                        ? $t("finances.fields.income")
                        : $t("finances.fields.spent")
                        }}
                      </span>
                    </template>
                  </v-switch>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete v-model="editedItem.type" :items="types" :label="$t('finances.fields.type')"
                    item-title="name" item-value="id" variant="underlined" :rules="typeRules"
                    :disabled="editedIndex === -1">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div class="truncate" v-bind="tooltipProps" style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                ">
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-if="isIncome" v-model="editedItem.income" :label="$t('finances.fields.income')"
                    variant="underlined" type="number" :rules="incomeRules" required />
                  <v-text-field v-else v-model="editedItem.spent" :label="$t('finances.fields.spent')"
                    variant="underlined" type="number" :rules="[validateSpent]" :hint="spentHint" persistent-hint
                    required :class="{
                      'has-negative-hint': availableAmount < 0,
                      'has-positive-hint': availableAmount > 0,
                      'has-neutral-hint': availableAmount === 0
                    }" />
                </v-col>

                <v-col cols="12" sm="12" v-if="!isIncome">
                  <v-autocomplete v-model="editedItem.budget_id" :items="filteredBudgets"
                    :label="$t('budget.fields.category')" item-title="categoryName" item-value="id" variant="underlined"
                    :rules="selectRules">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <template v-if="isImage(item.raw.icon)">
                              <img :src="`${this.$axios.defaults.baseURL}images/${item.raw.icon}`" alt="icon" />
                            </template>
                            <template v-else>
                              <v-icon>{{ getIconName(item.raw.icon) }}</v-icon>
                            </template>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="d-flex flex-column">
                          <div>
                            {{ $t("finances.fields.available") }}:
                            {{ formatCurrency(item.raw.amount - item.raw.used_amount) }}
                          </div>
                          <div>
                            {{ $t("finances.fields.total") }}:
                            {{ formatCurrency(item.raw.amount) }}
                          </div>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input v-model="file" ref="fileInput" :label="$t('finances.fields.attach_file')"
                    variant="underlined" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected"
                    :prepend-icon="null"></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img v-if="imagenDisponible() && this.showImage" :src="imgedit" height="120"
                      :label="$t('finances.fields.file')" width="210" />
                    <v-icon v-else class="d-flex align-center justify-center"
                      style="height: 120px; width: 210px; font-size: 120px">{{ this.icono }}</v-icon>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Step 2: Descripción y fecha -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea v-model="editedItem.description" :label="$t('finances.fields.description')"
                    variant="underlined" rows="3" auto-grow :rules="descriptionRules" />
                </v-col>

                <v-col cols="12">
                  <v-menu v-model="dateMenu" :close-on-content-click="true" transition="scale-transition" offset-y
                    min-width="auto">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :model-value="dateInput" :label="$t('finances.fields.date')"
                        variant="underlined" readonly></v-text-field>
                    </template>
                    <v-date-picker color="#03626C" :model-value="parseDateString(dateInput)"
                      @update:model-value="updateDate" :max="maxDate"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1"
                  @click="step > 0 ? step-- : this.closeDialogFinances()">
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep" :disabled="!valid">
                  {{
                  step === steps.length - 1
                  ? $t("buttons.saveAndClose")
                  : $t("buttons.next")
                  }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>

  <v-dialog v-model="dialogAddSpent" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <p class="text-grey-lighten-1">
            {{ $t("finances.formInstructions.expense") }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item v-for="(s, index) in steps" :key="index" :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  " :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  " size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`finances.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`finances.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`finances.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles del ingreso -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-autocomplete v-model="editedItem.type" :items="types" :label="$t('finances.fields.type')"
                    item-title="name" item-value="id" variant="underlined" :rules="typeRules">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div class="truncate" v-bind="tooltipProps" style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                ">
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="editedItem.spent" :label="$t('finances.fields.spent')" variant="underlined"
                    type="number" :rules="incomeRules" required />
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input v-model="file" ref="fileInput" :label="$t('finances.fields.attach_file')"
                    variant="underlined" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected"
                    :prepend-icon="null"></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img v-if="imagenDisponible() && this.showImage" :src="imgedit" height="120"
                      :label="$t('finances.fields.file')" width="210" />
                    <v-icon v-else class="d-flex align-center justify-center"
                      style="height: 120px; width: 210px; font-size: 120px">{{ this.icono }}</v-icon>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Step 2: Descripción y fecha -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea v-model="editedItem.description" :label="$t('finances.fields.description')"
                    variant="underlined" rows="3" auto-grow :rules="descriptionRules" />
                </v-col>

                <v-col cols="12">
                  <v-menu v-model="dateMenu" :close-on-content-click="true" transition="scale-transition" offset-y
                    min-width="auto">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :model-value="dateInput" :label="$t('finances.fields.date')"
                        variant="underlined" readonly></v-text-field>
                    </template>
                    <v-date-picker color="#03626C" :model-value="parseDateString(dateInput)"
                      @update:model-value="updateDate" :max="maxDate"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : this.closeDialogSpents()">
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep" :disabled="!valid">
                  {{
                  step === steps.length - 1
                  ? $t("buttons.saveAndClose")
                  : $t("buttons.next")
                  }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>

  <v-dialog v-model="dialogBugets" fullscreen transition="dialog-bottom-transition">
    <v-card class="bg-grey-lighten-4">
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Budget 
        :types="types"
        :type="budget_type"/>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" @click="closeDialogBugets">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogIncomeSpent" fullscreen transition="dialog-bottom-transition">
    <v-card class="bg-grey-lighten-4">
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <IncomeSpent 
        :types="types"
        :type="budget_type"/>
        
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialogIncomeSpent">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showSuggestedTasksDialog" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-title class="d-flex justify-space-between align-center pt-12">
          <div>
            <h5 class="text-grey-darken-2 font-weight-medium">
              {{ $t("suggestedTasks.dialog.title") }}
            </h5>
            <p class="text-grey-lighten-1 mb-0">
              {{ $t("suggestedTasks.dialog.subtitle") }}
            </p>
          </div>
        </v-card-title>

        <v-card-text>
          <v-row class="mt-6">
            <!-- Timeline lateral con un solo paso -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item dot-color="deep-purple" icon="mdi-numeric-1" size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t("suggestedTasks.steps.selection.title") }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t("suggestedTasks.steps.selection.subtitle") }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido principal -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t("suggestedTasks.steps.selection.title") }}
              </h3>

              <!-- Lista de tareas sugeridas -->
              <div class="task-list-container">
                <v-card v-for="(task, index) in suggestedTasks" :key="index" class="mb-3 rounded-lg" elevation="2"
                  :class="{ 'selected-task': task.selected }" @click="task.selected = !task.selected">
                  <v-row no-gutters class="align-center">
                    <!-- Checkbox 
                    <v-col cols="auto" class="d-flex justify-center">
                      <v-checkbox
                        v-model="task.selected"
                        hide-details
                        class="ma-0"
                        @click.stop
                      ></v-checkbox>
                    </v-col>-->

                    <!-- Fecha y hora -->
                    <v-col cols="auto" class="pa-2 d-flex flex-column align-center date-time-col">
                      <div class="text-body-2 font-weight-medium text-center date-time-text">
                        {{ formatDate(task.start_date) }}
                      </div>
                      <div v-if="task.start_time"
                        class="text-body-2 font-weight-medium text-center mt-1 date-time-text">
                        {{ formatTime(task.start_time) }}
                      </div>
                    </v-col>

                    <!-- Detalles de la tarea -->
                    <v-col cols="8" class="py-3 px-4 task-details">
                      <div class="font-weight-semibold text-body-1">{{ task.title }}</div>
                      <div class="text-caption text-grey-darken-1 mt-1">
                        {{ task.description }}
                      </div>
                    </v-col>

                    <v-col cols="auto" class="d-flex align-center px-2">
                      <v-chip color="amber" variant="outlined" class="score-chip"
                        :title="$t('suggestedTasks.scoreTooltip')">
                        <v-icon left size="small">mdi-star</v-icon>
                        {{ task.score }}
                      </v-chip>
                    </v-col>

                    <v-col cols="1" class="d-flex align-center pe-4 gap-2">
                      <div>
                        <span class="text-black">{{
                          task.priority_name_translated
                          }}</span>
                      </div>
                    </v-col>

                    <!-- Participantes -->
                    <v-col cols="auto" class="d-flex align-center pe-4 gap-2">
                      <div class="avatar-row d-flex flex-wrap justify-end gap-1">
                        <template v-if="task.people && task.people.length > 0">
                          <v-tooltip v-for="(person, personIndex) in task.people" :key="personIndex" bottom>
                            <template v-slot:activator="{ props }">
                              <v-avatar class="avatar-item hover-expand" size="32" v-bind="props">
                                <v-img :src="`${this.$axios.defaults.baseURL}images/${person.image}`" alt="avatar" />
                              </v-avatar>
                            </template>
                            <span>{{ person.name }}<br />{{ person.roleName }}</span>
                          </v-tooltip>
                        </template>
                        <v-chip v-else small color="grey" class="mt-1">
                          {{ $t("suggestedTasks.dialog.unassigned") }}
                        </v-chip>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </div>

              <!-- Acciones del formulario -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="showSuggestedTasksDialog = false">
                  {{ $t("buttons.close") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="sendSuggestedTasksToAPI"
                  :disabled="selectedSuggestedTasksCount === 0">
                  {{ $t("buttons.saveAndClose") }}
                  <v-chip color="deep-purple" small class="ml-2">
                    {{ selectedSuggestedTasksCount }}
                  </v-chip>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
  <!--<v-dialog v-model="dialogChatTask" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <ChatTaskFinance :taskData="currentTask" @close-dialog="closeDialgChat()" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>-->
  <v-dialog v-model="dialogAlerta" max-width="500">
    <v-card rounded-lg>
      <v-card-title class="text-body-2">Alertas para Hoy</v-card-title>
      <v-card-text>
        <v-list v-if="suggestions.length">
          <v-list-item v-for="(alerta, i) in suggestions" :key="i">
            <template v-slot:prepend>
              <v-icon color="deep-orange" icon="mdi-alert"></v-icon>
            </template>

            <v-list-item-title class="text-subtitle-2">
              {{ alerta.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption text-truncate">
              {{ alerta.description }}
              <v-tooltip activator="parent" location="bottom" max-width="350px" class="custom-tooltip">
                <span style="white-space: normal; word-break: break-word">
                  {{ alerta.description }}
                </span>
              </v-tooltip>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div v-else class="text-caption text-grey">No hay alertas para hoy.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogAlerta = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import Income from "./Income.vue";
import Spent from "./Spent.vue";
import _ from "lodash";
import Budget from "./Budget.vue";
import ChatTask from "../chat/ChatTask.vue";
import SuggestionsList from "../suggestion/SuggestionsList.vue";
import IncomeSpent from "./IncomeSpent.vue";
import IncomeSpentChart from "./IncomeSpentChart.vue";
export default {
  components: {
    Income,
    Spent,
    Budget,
    ChatTask,
    SuggestionsList,
    IncomeSpent,
    IncomeSpentChart,
  },
  data() {
    return {
      initializated: false,
      tools: [
        {
          name: this.$t("finances.titles.new.finance"),
          icon: "mdi-plus",
           action: () => this.showAddFinance(),
        },/*
        {
          name: this.$t("finances.fields.spent"),
          icon: "mdi-trending-down",
          action: () => this.showSpent(),
        },*/
        {
          name: this.$t("finances.sections.movements"),
          icon: "mdi-cash",
          action: () => this.showAddIncomeSpent(),
        },
        {
          name: this.$t("finances.sections.budget"),
          icon: "mdi-cash",
          action: () => this.showAddBuget(),
        },
      ],
      customIncomeData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      customSpentData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget1: 100000,
      spent1: 80000,
      currency: "CLP",
      locale: "es-CL",
      timeZone: "America/Santiago",
      now: new Date(),
      dialogAlerta: false,
      dialogChatTask: false,
      dialogIncomeSpent: false,
      shouldAutoShowAdd: false,
      chatDialog: false,
      dialogBugets: false,
      currentTask: null,
      selectedSuggestion: null,
      showSuggestedTasksDialog: false,
      dialogIncome: false,
      dialogSpent: false,
      dialogAddFinance: false,
      dialogAddSpent: false,
      isIncome: true,
      snackbar: false,
      sb_type: "",
      sb_message: "",
      sb_timeout: 2000,
      sb_title: "",
      sb_icon: "",
      valid: true,
      person_id: "",
      tab: null,
      loading: false,
      file: null,
      showImage: false,
      icono: "mdi-file",
      imgMiniatura: "",
      step: 0,
      steps: [
        {
          title: "financialDetails",
          subtitle: "basic_information",
        },
        {
          title: "description",
          subtitle: "additional_details",
        },
      ],
      financeSuggestions: [
        {
          id: 1,
          title: "Revisa gasto en delivery",
          description:
            "Este mes gastaste $85.000 en pedidos, un 20% más que el anterior.",
          due_date: "2025-06-30",
          due_time: "09:00",
          status: "pendiente",
        },
        {
          id: 2,
          title: "Agrega gasto de luz",
          description: "No se ha registrado el gasto de electricidad este mes.",
          due_date: "2025-06-28",
          due_time: "12:00",
          status: "pendiente",
        },
        {
          id: 3,
          title: "Superaste presupuesto en transporte",
          description: "Gastos en transporte sobrepasan el límite definido por $40.000.",
          due_date: "2025-06-29",
          due_time: "18:00",
          status: "revisado",
        },
        // 🔮 Sugerencias generadas por IA
        {
          id: 4,
          title: "Podrías reducir el plan de streaming",
          description:
            "Pagas $18.000 al mes por plataformas que no se usan regularmente.",
          due_date: "2025-06-30",
          due_time: "14:00",
          status: "pendiente",
          source: "ia",
        },
        {
          id: 5,
          title: "Considera un presupuesto para vacaciones",
          description:
            "Según tus hábitos, un ahorro mensual de $50.000 permitiría viajar en verano.",
          due_date: "2025-07-01",
          due_time: "11:00",
          status: "pendiente",
          source: "ia",
        },
      ],
      filtrosActivos: false,
      filtroDesde: "",
      filtroHasta: "",
      filtroTipo: "",
      filtroEstado: "",
      filtroTexto: "",
      filtroActivo: "todos",
      filtroActivo2: "",
      cards: [
        {
          title: "Ingresos",
          icon: "mdi-cash-multiple",
          amount: "$138,500",
          lastMonth: "$128,000",
          change: "+8.20",
          changeColor: "green-lighten-4",
          changeIcon: "mdi-arrow-up",
          color: "green",
        },
        {
          title: "Gastos",
          icon: "mdi-cash-minus",
          amount: "$97,400",
          lastMonth: "$94,800",
          change: "+2.74",
          changeColor: "red-lighten-4",
          changeIcon: "mdi-arrow-up",
          color: "red",
        },
        {
          title: "Balance",
          icon: "mdi-scale-balance",
          amount: "$41,100",
          lastMonth: "$47,750",
          change: "-13.92",
          changeColor: "blue-lighten-4",
          changeIcon: "mdi-arrow-down",
          color: "blue",
        },
      ],
      modal: false,
      tipoModal: "ingreso",
      nuevo: {
        titulo: "",
        monto: null,
        categoria: "",
        fecha: "",
      },
      categorias: [
        "Alimentación",
        "Transporte",
        "Servicios",
        "Educación",
        "Salud",
        "Otros",
      ],
      transacciones: [
        { titulo: "Sueldo Juan", monto: 1200000, tipo: "ingreso", fecha: "2025-06-01" },
        { titulo: "Supermercado", monto: 95000, tipo: "gasto", fecha: "2025-06-05" },
        { titulo: "Gas", monto: 23000, tipo: "gasto", fecha: "2025-06-08" },
      ],
      loadingImage: false,
      selectedImageUrl: "",
      dateMenu: false,
      dateInput: null,
      editedItem: {
        id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        available: null,
        description: "",
        date: null,
        image: null,
        budget_id: "",
      },
      defaultItem: {
        id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        available: null,
        description: "",
        date: null,
        image: null,
        budget_id: "",
      },
      originalItem: {
        id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        available: null,
        description: "",
        date: null,
        image: null,
        budget_id: "",
      },
      editedItemTask: {
        id: "",
        title: "",
        description: "",
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        type: "Tarea",
        parent_id: "",
        status_id: "",
        category_id: "",
        person_id: null,
        home_id: "",
        recurrence: "",
        estimated_time: 1,
        attachments: null,
        comments: "",
        geo_location: "",
        people: [],
      },
      editedIndex: -1,
      search: "",
      types: [],
      budgets: [],
      budgetAlerts: [],
      spentAlerts: null,
      suggestedTasks: [],
      home_id: "",
      suggestions: [],
      statusuggestions: [],
      people: [],
      movent: {},
      finances: {
        incomeCard: {
          current: "0",
          percentage: "0.00",
          lastMonth: "0",
          color: "green",
          icon: "mdi-cash",
        },
        spentCard: {
          current: "0",
          percentage: "0.00",
          lastMonth: "0",
          color: "red",
          icon: "mdi-cart",
        },
        balanceCard: {
          current: "0",
          color: "blue-darken-2",
          icon: "mdi-scale-balance",
        },
        movementsCard: {
          total: "0",
          lastMovement: {
            amount: "0",
            description: "No hay movimientos",
            icon: "mdi-cash",
            type: "income",
          },
          color: "amber-darken-2",
          icon: "mdi-calendar-clock",
        },
      },
      income: {},
      spent: {},
      //grafico de pie
        selectedGroup: null, // null = mostrar resumen; si es ID, mostrar subcategorías
        selectedItems: [],
    dataSpent: null,     // datos del backend
      balance: {},
      budget: {},
      nameRules: [
        (v) => !!v || "El campo es requerido",
        (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
        (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
      ],
      selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
      priceRules: [
        (v) => !!v || "El precio es obligatorio", // El campo es obligatorio
        (v) =>
          /^[0-9]+(\.[0-9]{1,2})?$/.test(v) ||
          "El precio debe ser un número válido con hasta 2 decimales", // Valida el formato del precio
        (v) => v > 0 || "El precio debe ser un número positivo", // El precio debe ser positivo
      ],
    budget_type: 'Personal', // ← valor que usas en lógica
      switchValue: 0, // ← 0 = Personal, 1 = Hogar (estado del switch)
    };
  },
  computed: {
     maxDate() {
    const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    // Esto asegura que sea el inicio del día (evita problemas de hora/minuto)
  },
     

  /*totalDisplay() {
    if (!this.dataSpent) return "0.00";
    return (this.selectedGroup 
      ? (this.dataSpent.totalBudgetByGroup?.[this.selectedGroup] || 0)
      : this.dataSpent.totalAmount
    ).toFixed(2);
  },*/
   currentItems() {
    if (!this.dataSpent) return [];

    if (!this.selectedGroup) {
      // Vista "Todas": summary (padres)
      return this.dataSpent.summary.map(item => ({
        ...item,
        amount: item.total, // para reutilizar lógica
        budget: this.dataSpent.totalBudgetByGroup?.[item.id] || 0,
      }));
    }

    // Vista detalle: subcategorías
    return this.dataSpent.details[this.selectedGroup] || [];
  },
  totalDisplay() {
  if (!this.dataSpent) return "0.00";

  // Si no hay selecciones, usar el valor original
  if (this.selectedItems.length === 0) {
    return (this.selectedGroup 
      ? (this.dataSpent.totalBudgetByGroup?.[this.selectedGroup] || 0)
      : this.dataSpent.totalAmount
    ).toFixed(2);
  }

  // Si hay selecciones, sumar solo los montos de los items seleccionados
  const total = this.selectedItems.reduce((sum, key) => {
    const item = this.currentItems.find(i => i.id === key);
    return sum + (parseFloat(item?.raw?.amount || item?.amount || 0) || 0);
  }, 0);

  return total.toFixed(2);
},
  selectItems() {
    if (!this.dataSpent) return [];
    return [
      { 
        title: "Todas las categorías", 
        value: null,
        icon: "mdi-view-dashboard" // opcional: ícono para "Todas"
      },
      ...this.dataSpent.categories // ya incluyen: id, title, value, icon, color
    ];
  },
   currentUsageAsNumber() {
  const str = this.balance?.spentPercentage || '0';
  const num = parseFloat(str).toFixed(2);
  return isNaN(num) ? 0 : num;
},
    progressColor() {
    const usage = this.currentUsageAsNumber;
    if (usage >= 100) return 'red-darken-4';     // 🔴 Rojo muy oscuro
    if (usage >= 80) return 'deep-orange-darken-3'; // 🟠 Naranja intenso
    if (usage > 0) return 'orange-darken-3';
    return 'grey-darken-1';                      // ⚪ Gris oscuro
  },
  progressBgColor() {
    // ✅ Teal para el fondo no utilizado
    return this.currentUsageAsNumber >= 100 ? 'red-lighten-3' : 'teal-darken-2';
  },
    projectedUsage() {
      const usage = this.currentUsageAsNumber;
      return Math.min(100, usage * 1.2);
    },
     todayDay() {
      return this.now.getDate(); // Forma simple y segura
    },

    // Último día del mes actual
    lastDayOfMonth() {
      const year = this.now.getFullYear();
      const month = this.now.getMonth();
      // Día 0 del próximo mes = último día del mes actual
      const lastDay = new Date(year, month + 1, 0);
      return lastDay.getDate();
    },

    // Fecha formateada: "lunes, 5 de abril de 2025"
    fullDate() {
       const locale = this.$i18n.locale.value;
    const dateLocale = { es: 'es-ES', en: 'en-US', pt: 'pt-PT' }[locale] || 'es-ES';
    return this.now.toLocaleDateString(dateLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    },
    fullMonth() {
       const locale = this.$i18n.locale.value;
    const dateLocale = { es: 'es-ES', en: 'en-US', pt: 'pt-PT' }[locale] || 'es-ES';
    return this.now.toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'long',
    });
    },
    selectedSuggestedTasksCount() {
      return this.suggestedTasks?.filter((task) => task.selected).length || 0;
    },
    formattedCurrentMonth() {
      const date = new Date();
      return date.toLocaleDateString(this.$vuetify.locale.current, {
        month: "long",
        year: "numeric",
      });
    },
    typeRules() {
      return [
        (v) => !!v || this.$t("finances.validationMessages.type.required"), // Validación de requerido
        (v) =>
          !v || v.length <= 50 || this.$t("finances.validationMessages.type.maxLength"), // Validación de longitud máxima
      ];
    },
    methodRules() {
      return [
        (v) =>
          !v || v.length <= 50 || this.$t("finances.validationMessages.method.maxLength"),
      ];
    },
    incomeRules() {
      return [
        (v) =>
          v === null ||
          v === "" ||
          !isNaN(v) ||
          this.$t("finances.validationMessages.income.number"),
        (v) =>
          v === null ||
          v === "" ||
          /^-?\d+(\.\d{1,2})?$/.test(v) ||
          this.$t("finances.validationMessages.income.precision"),
      ];
    },
    spentRules() {
      return [
        (v) =>
          v === null ||
          v === "" ||
          !isNaN(v) ||
          this.$t("finances.validationMessages.spent.number"),
        (v) =>
          v === null ||
          v === "" ||
          /^-?\d+(\.\d{1,2})?$/.test(v) ||
          this.$t("finances.validationMessages.spent.precision"),
      ];
    },
    descriptionRules() {
      return [
        (v) =>
          !v ||
          v.length <= 255 ||
          this.$t("finances.validationMessages.description.maxLength"),
      ];
    },
    dateRules() {
      return [(v) => !!v || this.$t("finances.validationMessages.date.required")];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("finances.titles.edit.finance")
        : this.$t("finances.titles.new.finance");
    },
    imgedit() {
      return this.imgMiniatura;
    },
     switchColor() {
      return this.budget_type === 'Personal' ? '#03626C' : '#FB8C00';
    },
    getCurrentName() {
      const type = this.types.find(t => t.id === this.budget_type);
      return type ? type.name : this.budget_type;
    },
    filteredBudgets() {
    if (!this.editedItem.type) return this.budgets; // Si no hay tipo seleccionado, mostrar todos

    // Suponiendo que "types" tiene objetos con { id, name }, y editedItem.type es el ID
    // Necesitamos obtener el "name" del tipo seleccionado para compararlo con budget_type
    /*const selectedType = this.types.find(t => t.id === this.editedItem.type);
    const typeName = selectedType ? selectedType.name : null;

    if (!typeName) return [];*/

    // Filtrar budgets cuyo budget_type coincida con el nombre del tipo seleccionado
    return this.budgets.filter(budget => budget.budget_type === this.editedItem.type);
  },
    availableAmount() {
    if (!this.editedItem.type || !this.balance) return 0;
    return this.editedItem.type === 'Personal'
      ? this.balance.personal.available
      : this.balance.home?.available || 0;
  },
   spentHint() {
    const amount = this.availableAmount;
    const formatted = this.formatCurrency(amount);
    return `Disponible: ${formatted}`;
  }
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
   watch: {
    budget_type(newVal) {
      // Actualiza budget_type según el valor del switch
      //this.budget_type = newVal === 'Hogar' ? 'Hogar' : 'Personal';

      // Llama al método de inicialización
      this.initialize();
    }
  },
  methods: {
    validateSpent(value) {
    if (value === null || value === undefined || value === '') {
      return 'Este campo es requerido.';
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Debe ser un número válido.';
    }

    if (numValue < 0) {
      return 'El gasto no puede ser negativo.';
    }

    // Validar contra el disponible según el tipo
    if (!this.editedItem.type) {
      return 'Selecciona un tipo primero.';
    }

    if (!this.balance) {
      return 'Cargando balance...';
    }

    const available = this.editedItem.type === 'Personal'
      ? this.balance.personal.available
      : this.balance.home?.available || 0;

    if (numValue > available) {
      return `No puedes gastar más de lo disponible (${this.formatCurrency(available)}).`;
    }

    return true; // ✅ válido
  },
     /*handleGenerateDemo() {
      // Lógica para generar datos demo
      console.log('Generando datos demo...');
      this.customIncomeData = Array.from({ length: 12 }, () => 
        Math.floor(Math.random() * 20000) + 10000
      );
      this.customSpentData = Array.from({ length: 12 }, () => 
        Math.floor(Math.random() * 15000) + 5000
      );
    },*/
    fmt(n) {
      return new Intl.NumberFormat(this.locale, {
        style: "currency",
        currency: this.currency,
        maximumFractionDigits: this.currency === "CLP" ? 0 : 2,
      }).format(n || 0);
    },
    handleCloseDialog() {
      // Lógica adicional al cerrar el diálogo si es necesaria
      console.log("Diálogo cerrado");
      this.closeDialgChat();
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.currentTask = null; // Limpia la tarea actual
      this.initialize();
    },
    enrichPeopleData(taskPeople) {
      // 1. Verificar y extraer datos del Proxy
      const peopleProxy = this.people; // El Proxy recibido
      const rawPeople = peopleProxy
        ? peopleProxy.__v_raw || JSON.parse(JSON.stringify(peopleProxy))
        : [];
      // 2. Validar que taskPeople sea un array
      if (!Array.isArray(taskPeople)) {
        //console.error('taskPeople no es un array válido:', taskPeople);
        return [];
      }
      // 3. Recorrer y enriquecer los datos
      return taskPeople.map((person) => {
        // 3.1. Verificar que tenga person_id
        if (!person.person_id) {
          //console.warn('Persona sin person_id:', person);
          return person;
        }
        // 3.2. Buscar en los datos reales
        const fullPersonData = rawPeople.find((p) => p.id === Number(person.person_id));
        // 3.3. Mostrar información de debug si no se encuentra
        /*if (!fullPersonData) {
      console.warn(`No se encontró persona con ID ${person.person_id}`);
      console.log('IDs disponibles:', rawPeople.map(p => p.id));
    }*/
        // 3.4. Retornar objeto enriquecido
        return {
          ...person,
          name: fullPersonData?.namePerson || person.name || "Sin nombre",
          image: fullPersonData?.imagePerson || person.image || "default.jpg",
        };
      });
    },
    formatTime(timeString) {
      if (!timeString) return "";
      // Asume formato HH:mm
      return timeString;
    },
    formatDuration(duration) {
      if (!duration) return "";
      // Si es un número (horas)
      if (typeof duration === "number") {
        return `${duration} ${duration === 1 ? "hora" : "horas"}`;
      }
      // Si es un string con formato de tiempo
      if (typeof duration === "string") {
        // Puedes añadir lógica para formatear strings como "2 hours" o "120 mins"
        return duration;
      }
      return "Duración no especificada";
    },
    // Método para debug (puedes eliminarlo después)
    logTaskPeople(task) {
      console.log("People data for task:", task.people);
    },
    getPersonAvatar(person) {
      // Si la persona tiene imagen, usarla, sino una por defecto
      return person.image
        ? `${this.$axios.defaults.baseURL}images/${person.image}`
        : require("@/assets/default-avatar.png");
    },
    async sendSuggestedTasksToAPI() {
      try {
        this.loading = true;
        // Filtrar y formatear las tareas seleccionadas
        const tasksToCreate = this.suggestedTasks
          .filter((task) => task.selected)
          .map((task) => {
            const { selected, statusDialog, ...cleanTask } = task;
            // Convertir campos numéricos
            return {
              ...cleanTask,
              home_id: Number(cleanTask.home_id) || 0,
              parent_id: Number(cleanTask.parent_id) || null,
              priority_id: Number(cleanTask.priority_id) || 0,
              status_id: Number(cleanTask.status_id) || 1,
              estimated_time: this.convertEstimatedTime(cleanTask.estimated_time),
              people: cleanTask.people
                ? cleanTask.people.map((person) => ({
                    home_id: Number(person.home_id) || 0,
                    person_id: Number(person.person_id) || 0,
                    role_id: Number(person.role_id) || 0,
                    roleName: person.roleName,
                  }))
                : [],
            };
          });
        // Enviar al endpoint que maneja la creación múltiple
        const result = await handleRequest({
          endpoint: "task-bulk",
          method: "POST",
          data: { tasks: tasksToCreate },
        });
        if (result.success) {
          this.showAlert(
            "success",
            `${tasksToCreate.length} tareas creadas exitosamente`,
            3000
          );
          this.showSuggestedTasksDialog = false;
          this.initialize(); // Refrescar datos
        } else {
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        this.showAlert("error", "Error al crear las tareas", 3000);
        console.error("Error creating tasks:", error);
      } finally {
        this.loading = false;
      }
    },
    convertEstimatedTime(time) {
      if (!time) return 0;
      // Si ya es un número, devolverlo
      if (typeof time === "number") return time;
      // Si es string con formato "X horas"
      const match = time.toString().match(/(\d+)\s*horas?/i);
      if (match) return parseInt(match[1], 10);
      // Si es string con formato "HH:mm"
      const timeParts = time.toString().split(":");
      if (timeParts.length === 2) {
        return parseInt(timeParts[0], 10) + parseInt(timeParts[1], 10) / 60;
      }
      // Intentar convertir a número
      return Number(time) || 0;
    },
    isImage(icon) {
      // Validar si el valor es una URL válida (puedes personalizar esta lógica)
      return (
        typeof icon === "string" &&
        (icon.startsWith("http") || /\.(png|jpe?g|gif|svg|webp)$/i.test(icon))
      );
    },
    getIconName(icon) {
      if (!icon) return "mdi-help-circle"; // Ícono por defecto si no hay valor
      // Si el ícono tiene el prefijo "MdiIcons.", extraer solo el nombre
      if (icon.startsWith("MdiIcons.")) {
        return `mdi-${icon.split(".")[1].toLowerCase()}`;
      }
      // Si el ícono ya está en formato "mdi-*", devolverlo tal cual
      if (icon.startsWith("mdi-")) {
        return icon;
      }
      // En otros casos, devolver un ícono por defecto
      return "mdi-help-circle";
    },
    openChatbot(task) {
      this.currentTask = null;
      this.$nextTick(() => {
        const taskData =
          typeof task.taskData === "string" ? JSON.parse(task.taskData) : task.taskData;
        this.currentTask = _.cloneDeep(taskData);
        this.dialogChatTask = true;
      });
    },
    async handleTaskCompleted(payload) {
      const taskData = payload.taskData || {};
      const people = payload.people || [];
      //console.log("Tarea completada:", taskData);
      //console.log("Personas asignadas:", people);
      (this.people = []), (this.people = _.cloneDeep(people));
      this.editedItemTask = _.cloneDeep(taskData);
      const fieldsToUpdate = [
        "title",
        "description",
        "start_date",
        "end_date",
        "parent_id",
        "status_id",
        "category_id",
        "home_id",
        "recurrence",
        "comments",
        "estimated_time",
        "attachments",
        "geo_location",
        "priority_id",
        "people",
        "start_time",
        "end_time",
        "type",
      ];
      let updatedFields = Object.keys(this.editedItemTask)
        .filter(
          (key) =>
            fieldsToUpdate.includes(key) &&
            this.editedItemTask[key] !== this.originalItem[key]
        )
        .reduce((obj, key) => {
          if (key === "people") {
            // Transformar el campo `people`
            obj[key] = this.editedItemTask.people.map((person) => ({
              home_id: Number(this.home_id), // Asegurar que sea un número
              person_id: Number(person.id), // Asegurar que sea un número
              role_id: Number(person.roleId),
              roleName: person.roleName,
            }));
          } else {
            obj[key] = this.editedItemTask[key];
          }
          return obj;
        }, {});
      // Agregar campos adicionales si es necesario
      if (Object.keys(updatedFields).length > 0) {
        updatedFields.home_id = this.home_id;
        updatedFields.start_date = this.editedItemTask.start_date
          ? this.editedItemTask.start_date
          : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(new Date().getDate()).padStart(2, "0")}`;
        updatedFields.estimated_time = this.editedItemTask.estimated_time
          ? this.editedItemTask.estimated_time
          : 0;
        updatedFields.type = this.editedItemTask.type
          ? this.editedItemTask.type
          : "Tarea";
        // Crear el objeto FormData
        const formData = new FormData();
        for (let key in updatedFields) {
          if (key === "people") {
            // Agregar cada elemento del array `people` al FormData
            updatedFields[key].forEach((person, index) => {
              for (const [personKey, value] of Object.entries(person)) {
                formData.append(`people[${index}][${personKey}]`, value);
              }
            });
          } else {
            formData.append(key, updatedFields[key]);
          }
        }
        try {
          const result = await handleRequest({
            endpoint: "task",
            method: "POST",
            data: formData,
          });
          // Manejo de la respuesta según el resultado
          if (result.success) {
            this.loading = false;
            if (
              result.data &&
              result.data.suggestedTasks &&
              result.data.suggestedTasks.length > 0
            ) {
              // Aquí puedes manejar las sugerencias de tareas
              // Por ejemplo, mostrarlas en un diálogo o procesarlas automáticamente
              console.log("Tareas sugeridas:", result.data.suggestedTasks);
              this.suggestedTasks = result.data.suggestedTasks.map((task) => ({
                ...task,
                people: this.enrichPeopleData(task.people || []),
              }));
              this.showSuggestedTasksDialog = true;
            }
            this.showAlert("success", result.message, 3000);
            this.initialize();
          } else {
            this.loading = false;
            this.showAlert("warning", result.message, 3000);
          }
        } catch (error) {
          this.loading = false;
          // Este bloque captura errores inesperados fuera del manejo estándar
          this.showAlert(
            "error",
            "Ocurrió un error inesperado al procesar la solicitud.",
            3000
          );
        }
      } else {
        this.loading = false;
        this.showAlert("success", "Debe completar los datos de la tarea.", 3000);
      }
      // Aquí puedes enviar los datos a tu API o hacer lo que necesites
      this.chatDialog = false;
    },
    getTranslatedStatusName(status) {
      const match = this.statusuggestions.find((s) => s.id === status);
      return match ? match.name : status;
    },
    updateDate(value) {
      // value viene como objeto Date desde el date-picker
      // Convertimos a formato YYYY-MM-DD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItem.date = this.dateInput;
      this.dateMenu = false;
    },
    // Método para convertir string a Date (solo cuando sea necesario)
    parseDateString(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return new Date(year, month - 1, day);
    },
    getFinanceStatusColor(status) {
      switch (status) {
        case "Pendiente":
          return "orange";
        case "Revisado":
          return "blue";
        case "Completado":
          return "green";
        default:
          return "grey";
      }
    },

    /*openModal(imageUrl) {
      this.dialogPhoto = true;
      this.loadingImage = true;
      var img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${imageUrl}`;

      img.onload = () => {
        this.selectedImageUrl = `${this.$axios.defaults.baseURL}images/${imageUrl}`;
        this.loadingImage = false;
        //this.dialogPhoto = true; // Abre el modal solo después de que la imagen esté cargada
      };

      img.onerror = () => {
        this.selectedImageUrl = '';
        this.dialogPhoto = false; // Abre el modal incluso si la carga falla, puede mostrar un mensaje de error o una imagen de respaldo
        this.loadingImage = false;
      };
    },*/
    formatCurrency(value) {
  // Convertir a número si es string
      if (typeof value === 'string') {
        // Eliminar cualquier caracter no numérico excepto punto y signo menos
        value = value.trim().replace(/[^\d.-]/g, '');
        value = parseFloat(value);
      }

      // Validar si es numérico válido
      if (value === null || value === undefined || isNaN(value)) {
        return '0.00';
      }

      // Redondear a 2 decimales con protección contra errores de punto flotante
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Formatear con 2 decimales siempre, usando formato en-US
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    clearFields() {
      // Limpiar los valores de ingreso y gasto al cambiar el tipo
      this.editedItem.income = "";
      this.editedItem.spent = "";
      this.showType = !this.showType;
    },

    editFinanceTask(task) {
      // lógica para editar la tarea
      console.log("Editar", task);
    },

    deleteFinanceTask(task) {
      // lógica para eliminar la tarea
      console.log("Eliminar", task);
    },

    formatDate(dateStr) {
      if (!dateStr) return "";

      // Solución 1: Parseo manual (recomendado)
      const [year, month, day] = dateStr.split("-");
      const date = new Date(year, month - 1, day); // Los meses son 0-based

      // Solución 2: Ajustar a UTC (alternativa)
      // const date = new Date(dateStr + 'T00:00:00Z');

      const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC", // Asegura consistencia
      };

      return date.toLocaleDateString("es-CL", options);
    },

    resetFiltros() {
      this.filtroDesde = "";
      this.filtroHasta = "";
      this.filtroTipo = "";
      this.filtroEstado = "";
      this.filtroTexto = "";
    },
    aplicarFiltros() {
      console.log("Aplicando filtros:", {
        desde: this.filtroDesde,
        hasta: this.filtroHasta,
        tipo: this.filtroTipo,
        estado: this.filtroEstado,
        texto: this.filtroTexto,
      });
      this.filtrosActivos = false;
    },
    abrirModal(tipo) {
      this.tipoModal = tipo;
      this.nuevo = { titulo: "", monto: null, categoria: "", fecha: "" };
      this.modal = true;
    },
    guardarTransaccion() {
      if (this.nuevo.titulo && this.nuevo.monto && this.nuevo.fecha) {
        this.transacciones.unshift({
          ...this.nuevo,
          tipo: this.tipoModal,
        });
        this.modal = false;
      }
    },
    async initialize() {
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        this.data.type = this.budget_type || 'Personal'
        //this.data.type = 'Todas';
        this.loading = true;
        this.initializated = false;
        const result = await handleRequest({
          endpoint: "finance-statistics-month",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.income = result.data?.incomeCard || [];
          this.spent = result.data?.spentCard || [];
          this.balance = result.data?.balance || [];
          this.suggestions = result.data?.suggestions || [];
          this.statusuggestions = result.data?.statusuggestions || [];
          this.movent = result.data?.movementsCard || {};
          //this.budget = result.data?.budgetCard || [];
          this.customIncomeData = result.data?.financeData.customIncomeData || Array(12).fill(0);
          this.customSpentData = result.data?.financeData.customSpentData || Array(12).fill(0);
          console.log("customIncomeData:", this.customIncomeData);
          console.log("movent:", this.movent);
          this.initializated = true;
          this.dataSpent = result.data.dataSpent;
          this.budgetAlerts = result.data?.alertsBudget || [];
          this.spentAlerts = result.data?.alertsSpent || null;
        } else {
          // Si no hay datos, asignamos un array vacío
          this.spent = [];
          this.income = [];
          this.balance = [];
          this.suggestions = [];
          this.movent = {};
          this.statusuggestions = [];
          this.dataSpent = null;
          this.budgetAlerts = [];
          this.spentAlerts = {};
          //this.showAlert('info', 'No hay finanzas disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las finanzas.",
          3000
        );
      } finally {
        this.loading = false;
      }
    },

    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.dialogIncome = false;
        this.dialogSpent = false;
        this.step = 0;
        this.save();
      }
    },
    //Ingresos
    showIncome() {
      this.dialogIncome = true;
    },
    showSpent() {
      this.dialogSpent = true;
    },
    close() {
      this.dialogIncome = false;
      this.dialogSpent = false;
      this.initialize();
    },
    async showAddFinance() {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      this.editedItem.type = this.budget_type;
      this.file = null;
      this.imgMiniatura = "";
      this.data = {};
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItem.date = this.dateInput;
      this.data.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "get-finances-data",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.budgets = result.data?.budgets || [];
          this.balance = result.data?.balance || {};
          if (!this.editedItem.type && this.types.length > 0) {
            this.editedItem.type = this.types[0].id;
          }
        } else {
          this.types = [];
          this.butgets = [];
          this.balance = {};
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los tipos de consulta.",
          3000
        );
      } finally {
        this.dialogAddFinance = true; // Abrimos el diálogo
      }
      //this.shouldAutoShowAdd = true; // Indicamos que debe auto-ejecutar showAdd
      //this.dialogAddFinance = true; // Abrimos el diálogo
    },
    closeDialogFinances() {
      this.dialogAddFinance = false; // Cerramos el diálogo
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
      this.initialize();
    },

    //Gastos
    async showAddSpent() {
      this.editedIndex = 2;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItem.date = this.dateInput;
      this.file = null;
      this.imgMiniatura = "";
      try {
        const result = await handleRequest({
          endpoint: "get-finances-data",
          method: "POST",
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.budgets = result.data?.budgets || [];
          this.balance = result.data?.balance || {};
        } else {
          this.types = [];
          this.budgets = [];
          this.balance = {};
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los tipos de consulta.",
          3000
        );
      } finally {
        this.dialogAddSpent = true; // Abrimos el diálogo
      }
      this.dialogAddSpent = true; // Abrimos el diálogo
    },
    closeDialogSpents() {
      this.dialogAddSpent = false; // Cerramos el diálogo
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
      this.initialize();
    },

    calculateNewAvailable(currentBalance, editedItem, mode, originalItem = {}) {
      // Determinar la clave según el texto del type
      const typeKey = editedItem.type === "Hogar" ? "home" : "personal";

      // Obtener la categoría actual
      const category = currentBalance[typeKey];
      if (!category) return 0;

      // Clonamos los valores actuales para trabajar con ellos
      let { income, spent, available } = { ...category };

      // Si es edición, revertimos el efecto del registro original
      if (mode === "update") {
        const origIncome = parseFloat(originalItem.income) || 0;
        const origSpent = parseFloat(originalItem.spent) || 0;

        income -= origIncome;
        spent -= origSpent;
        available = income - spent; // Recalculamos para evitar errores de redondeo
      }

      // Aplicamos los nuevos valores
      const newIncome = parseFloat(editedItem.income) || 0;
      const newSpent = parseFloat(editedItem.spent) || 0;

      income += newIncome;
      spent += newSpent;
      available = income - spent;

      return available; // 👈 Solo devolvemos el número, ej: 287000
    },
    async save() {
      this.loading = true;

      this.valid = false;
      const fieldsToUpdate = [
        "home_id",
        "spent",
        "income",
        "image",
        "date",
        "description",
        "image",
        "type",
        "method",
        "budget_id",
        "available"
      ];
      const updatedBalance = this.calculateNewAvailable(
          this.balance,
          this.editedItem,
          "create",
          this.originalItem
        );
        this.editedItem.available = updatedBalance;
      let updatedFields = Object.keys(this.editedItem)
        .filter(
          (key) =>
            fieldsToUpdate.includes(key) &&
            this.editedItem[key] !== this.originalItem[key]
        )
        .reduce((obj, key) => {
          obj[key] = this.editedItem[key];
          return obj;
        }, {});
      if (Object.keys(updatedFields).length > 0) {
        updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
        updatedFields.home_id = Number(this.home_id);
        if (this.file) {
          updatedFields.image = this.editedItem.image;
        }
        const formData = new FormData();
        for (let key in updatedFields) {
          formData.append(key, updatedFields[key]);
        }

        try {
          const result = await handleRequest({
            endpoint: "finance",
            method: "POST",
            data: formData,
          });

          // Manejo de la respuesta según el resultado
          if (result.success) {
            this.loading = false;
            this.showAlert("success", result.message, 3000);
          } else {
            this.loading = false;
            this.showAlert("warning", result.message, 3000);
          }
        } catch (error) {
          this.loading = false;
          // Este bloque captura errores inesperados fuera del manejo estándar
          this.showAlert(
            "error",
            "Ocurrió un error inesperado al procesar la solicitud.",
            3000
          );
        }
      } else {
        this.loading = false;
        this.showAlert("success", "Debe completar los datos de producto.", 3000);
      }
      /*if (this.editedIndex === 1) {
        this.closeDialogIncomes();
      } else if (this.editedIndex === 2) {
        this.closeDialogSpents();
      }*/
      this.closeDialogFinances();
    },

    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        let img = new Image();
        img.src = this.imgedit;
        return true;
      }
      return false;
    },

    onFileSelected(event) {
      this.imgMiniatura = "";
      let file = event.target.files[0];
      const maxSize = 500 * 1024; // 500 KB en bytes

      if (file && file.size > maxSize) {
        this.valid = false;
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return;
      }

      const mimeType = file.type;
      const extension = file.name.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];

      if (
        (mimeType.startsWith("image/") || imageExtensions.includes(extension)) &&
        imageExtensions.includes(extension)
      ) {
        this.cargarImage(file);
        this.showImage = true;
      } else {
        this.showImage = false;
        this.icono = "mdi-file";
      }

      this.valid = true;
      this.editedItem.image = file;
    },

    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    //Diagnosticos
    showAddBuget() {
      this.dialogBugets = true; // Abrimos el diálogo
    },
    showAddIncomeSpent() {
      this.shouldAutoShowAdd = false; // Indicamos que debe auto-ejecutar showAdd
      this.dialogIncomeSpent = true; // Abrimos el diálogo
    },
    closeDialogBugets() {
      this.dialogBugets = false; // Cerramos el diálogo
      this.initialize();
    },
    closeDialogIncomeSpent() {
      this.shouldAutoShowAdd = false; // Indicamos que debe auto-ejecutar showAdd
      this.dialogIncomeSpent = false; // Cerramos el diálogo
      this.initialize();
    },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "error") {
        this.sb_title = "Error";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },
  },
};
</script>

<style>
.has-negative-hint .v-field__hint {
  color: #f44336 !important;
}

.has-positive-hint .v-field__hint {
  color: #4caf50 !important;
}

.has-neutral-hint .v-field__hint {
  color: #9e9e9e !important;
}
.text-red {
  color: #c62828;
}
.text-blue {
  color: #1565c0;
}
/* Estilos para el texto en tareas seleccionadas */
.selected-task {
  background-color: #03626c;
}
.selected-task .date-time-text,
.selected-task .font-weight-semibold,
.selected-task .text-caption,
.selected-task .text-grey-darken-1,
.selected-task .v-icon {
  color: white !important;
}
.selected-task .text-caption {
  opacity: 0.9;
}
/* Opcional: para mantener consistencia en el hover */
.selected-task:hover .date-time-text {
  opacity: 0.95;
}
.avatar-border {
  border: 2px solid #000;
  /* Aquí se define el borde */
}
.avatar-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
}
.avatar-col {
  margin-right: -10px;
  /* Reduce the space between avatars */
}
.avatar-item {
  margin-right: -5px;
  /* Cambia el color del borde según desees */
  border-radius: 50%;
  /* Para que siga siendo redondo */
  box-sizing: border-box;
  /* Asegura que el borde no afecte el tamaño del avatar */
  /* Optional: reduce the space even further between avatars */
  /* Optional: reduce the space even further between avatars */
}
.hover-expand:hover {
  z-index: 2;
}
/* Estilo para el texto de duración */
.text-caption.text-grey-darken-1 {
  font-size: 0.7rem;
}
.dot-wrapper {
  position: absolute;
  top: -28px; /* sube el texto */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dot-label {
  font-size: 12px;
  font-weight: bold;
  color: black;
  margin-bottom: 4px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: red;
}
</style>
