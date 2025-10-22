<template>
  <div>
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
  
  <v-card class="mx-auto pa-3 " elevation="2" flat style="background: transparent">
    <div class="d-flex align-center justify-space-between" min-wdth="600">
      <!-- Icono a la izquierda -->
      <div class="d-flex align-center">
        <v-avatar
          size="large"
          class="mr-3"
          :style="{ backgroundColor: 'rgba(3, 98, 108, 0.1)' }"
          @click="$router.push('/home')"
          style="cursor: pointer"
        >
          <v-img src="@/assets/logo-verde.png" alt="Imagen de perfil"></v-img>
        </v-avatar>
        <span style="font-size: 1.25rem; font-weight: bold; color: #03626c">huoon</span>
      </div>

      <!-- Espaciador -->
      <v-spacer></v-spacer>

       
      <v-btn icon class="text-none" variant="text" v-if="this.statusOnboarding">
        <v-badge color="#E53935" :content="cantHome">
          <v-icon color="#00796B" icon="mdi-home" @click="openMenu"></v-icon>
        </v-badge>

        <!-- Menú desplegable -->
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          offset-y
          max-height="300"
          min-width="auto"
          content-class="rounded-menu"
        >
          <template v-slot:activator="{ props }">
            <!-- Este div vacío es necesario para activar el menú -->
            <div v-bind="props"></div>
          </template>

          <!-- Contenido del menú con scroll -->
          <v-list style="max-height: 300px; overflow-y: auto">
            <v-list-item
              v-for="(home, index) in homes"
              :key="index"
              @click="selectHome(home)"
              :class="{ 'selected-home': home.id === this.home_id }"
            >
              <v-row align="center" no-gutters>
                <!-- Avatar con efecto de superposición y ampliación -->
                <v-col cols="auto" class="pr-2">
                  <div
                    class="avatar-container"
                    @mouseover="isHovered = home.id"
                    @mouseleave="isHovered = null"
                  >
                    <v-avatar size="40" class="avatar">
                      <v-img
                        :src="`${this.$axios.defaults.baseURL}images/${home.image}`"
                        alt="Avatar"
                      ></v-img>
                    </v-avatar>
                  </div>
                </v-col>

                <!-- Nombre y rol con tooltip -->
                <v-col style="min-width: 0">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-list-item-title v-bind="props" class="text-truncate">{{
                        home.name
                      }}</v-list-item-title>
                    </template>
                    <span>{{ home.name }}</span>
                  </v-tooltip>
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-list-item-subtitle v-bind="props" class="text-truncate">{{
                        home.nameRole
                      }}</v-list-item-subtitle>
                    </template>
                    <span>{{ home.nameRole }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <!-- Nueva fila para el sistema de estrellas con v-rating -->
              <v-row no-gutters>
                <!-- Sistema de estrellas -->
                <v-col cols="auto" class="pl-2">
                  <div class="star-rating">
                    <v-rating
                      :model-value="home.percent"
                      color="orange-darken-2"
                      density="compact"
                      size="small"
                      readonly
                    ></v-rating>
                  </div>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <!-- Campanita de notificaciones -->
      <v-btn icon class="text-none" variant="text" v-if="this.statusOnboarding">
          <!-- Mostrar badge solo si hay notificaciones -->
          <v-badge v-if="countNoti" color="#E53935" :content="countNoti">
            <v-icon color="#00796B" icon="mdi-bell-ring" @click="openNoti()"></v-icon>
          </v-badge>

          <!-- Mostrar solo el icono (sin badge) -->
          <v-icon v-else style="color: #00796b" icon="mdi-bell"></v-icon>

        <!-- Componente de menú de notificaciones -->
        <v-menu
          v-model="menuNoti"
          :close-on-content-click="false"
          offset-y
          max-height="300"
          min-width="350px"
          max-width="350px"
          content-class="rounded-menu"
        >
          <template v-slot:activator="{ props }">
            <div v-bind="props"></div>
          </template>

          <v-list style="max-height: 300px; overflow-y: auto" class="notification-list">
            <!-- Items de notificaciones -->
            <v-list-item
              v-for="(notification, index) in notifications"
              :key="index"
              :class="{ 'notification-unread': notification.status === 0 }"
              class="notification-item"
              @click="handleItemClickNotif(notification)"
            >
              <v-row align="center" no-gutters>
                <!-- Imagen -->
                <v-col cols="auto" class="pr-1">
                  <v-avatar size="45" class="notification-image">
                    <v-img
                      :src="`${this.$axios.defaults.baseURL}images/${notification.image}`"
                      alt="Avatar"
                    ></v-img>
                  </v-avatar>
                </v-col>

                <!-- Contenido textual -->
                <v-col style="min-width: 0">
                  <!-- Título con tooltip -->
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-list-item-title
                        v-bind="props"
                        :class="{ 'unread-title': notification.status === 0 }"
                        class="text-truncate title-text"
                      >
                        {{ notification.title }}
                      </v-list-item-title>
                    </template>
                    <span>{{ notification.title }}</span>
                  </v-tooltip>

                  <!-- Descripción con tooltip -->
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-list-item-subtitle
                        v-bind="props"
                        class="text-truncate description-text"
                      >
                        {{ notification.description }}
                      </v-list-item-subtitle>
                    </template>
                    <span>{{ notification.description }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-list-item>

            <!-- Botón de carga adicional -->
            <v-list-item v-if="hasMore" @click="getNotifications" class="load-more-item">
              <v-btn variant="text" color="primary" block class="load-more-btn">
                {{ $t("buttons.seeMore") }}
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <!-- Botón de Configuración -->
      <v-btn icon class="text-none" variant="text" v-if="this.statusOnboarding">
        <v-menu
          v-model="menuSettings"
          offset-y
          min-width="200px"
          content-class="rounded-menu"
        >
          <template v-slot:activator="{ props }">
            <v-icon style="color: #00796b" icon="mdi-cog" v-bind="props"></v-icon>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="(item, i) in settingsItems"
              :key="i"
              @click="$router.push(item.to)"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon" size="small"></v-icon>
              </template>
              <v-list-item-title class="text-body-1"> {{
                    $t(`settings.${item.to.replace("/", "")}`) !== `settings.${item.to.replace("/", "")}`
                      ? $t(`settings.${item.to.replace("/", "")}`)
                      : item.title
                  }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <!-- Menú desplegable activado por avatar -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-avatar v-bind="props">
            <v-img
              :src="`${this.$axios.defaults.baseURL}images/${imageUrl}`"
              alt="Avatar del profesional"
            ></v-img>
          </v-avatar>
        </template>

        <!-- Lista del menú -->
        <v-list>
        <template v-for="(item, i) in items" :key="i">
          <v-list-item
            v-if="isItemVisible(item.title)"
            @click="handleItemClick(item)"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
      </v-menu>
    </div>
  </v-card>
  <v-dialog v-model="dialogChangePass" max-width="400px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">Actualizar Contraseña</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  density="compact"
                  placeholder="Contraseña actual"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="underlined"
                  @click:append-inner="visible = !visible"
                  v-model="editedItem.currentPassword"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  :append-inner-icon="visible1 ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible1 ? 'text' : 'password'"
                  density="compact"
                  placeholder="Contraseña nueva"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="underlined"
                  @click:append-inner="visible1 = !visible1"
                  v-model="editedItem.newPassword"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible2 ? 'text' : 'password'"
                  density="compact"
                  placeholder="Contraseña nueva"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="underlined"
                  @click:append-inner="visible2 = !visible2"
                  v-model="editedItem.newPassword1"
                ></v-text-field>
              </v-col>
              <!-- Alerta de error si las contraseñas no coinciden -->
              <v-alert
                v-if="
                  editedItem.newPassword !== editedItem.newPassword1 &&
                  editedItem.newPassword1 !== ''
                "
                type="error"
                dense
              >
                Las contraseñas no coinciden.
              </v-alert>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
          <v-btn
            color="#03626C"
            variant="flat"
            :loading="loading"
            @click="save"
            :disabled="
              editedItem.newPassword !== editedItem.newPassword1 ||
              editedItem.newPassword === ''
            "
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">Seleccionar Hogar</span>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12">
            <v-autocomplete
              :no-data-text="'No hay datos disponibles'"
              v-model="this.home_id"
              :items="homes"
              label="Hogares"
              prepend-icon="mdi-home"
              item-title="name"
              item-value="id"
              variant="underlined"
              @update:model-value="changeHome()"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="`${this.$axios.defaults.baseURL}images/${item.raw.image}`"
                  :title="item.raw.name"
                >
                  <v-list-item-subtitle class="d-flex flex-column">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ props }">
                        <div
                          class="description-text"
                          v-bind="props"
                          :title="item.raw.nameHomeType"
                        >
                          Tipo: {{ item.raw.nameHomeType }}
                        </div>
                      </template>
                      <!-- Tooltip con el texto completo -->
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ props }">
                        <div
                          class="description-text"
                          v-bind="props"
                          :title="item.raw.nameRole"
                        >
                          Rol: {{ item.raw.nameRole }}
                        </div>
                      </template>
                      <!-- Tooltip con el texto completo -->
                    </v-tooltip>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#DA7171" variant="flat" @click="closeDialog">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogPerson"
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("personManagement.formInstructions") }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item
                  v-for="(s, index) in steps"
                  :key="index"
                  :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  "
                  :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  "
                  size="large"
                >
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`personManagement.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`personManagement.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`personManagement.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6" class="d-flex flex-column align-center">
                  <div style="position: relative" class="mb-4">
                    <v-avatar
                      size="200"
                      class="avatar-hover"
                      @click="$refs.fileInput.click()"
                    >
                      <v-img
                        v-if="imagenDisponible()"
                        :src="imgedit"
                        alt="User Avatar"
                      ></v-img>
                      <v-icon v-else size="100">mdi-account-circle</v-icon>

                      <!-- Icono de edición superpuesto con efecto hover -->
                      <div class="edit-overlay">
                        <v-icon size="40" color="white" class="edit-icon"
                          >mdi-pencil</v-icon
                        >
                      </div>
                    </v-avatar>
                  </div>

                  <!-- Input de archivo oculto -->
                  <v-file-input
                    ref="fileInput"
                    v-model="file"
                    :label="$t('personManagement.fields.profile_image')"
                    accept="image/*"
                    variant="underlined"
                    @change="onFileSelected"
                    class="mt-4"
                    :prepend-icon="false"
                    style="display: none"
                  ></v-file-input>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItemPerson.name"
                    :label="$t('personManagement.fields.name')"
                    variant="underlined"
                    :rules="nameRules"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="editedItemPerson.user"
                    :label="$t('personManagement.fields.username')"
                    variant="underlined"
                  ></v-text-field>

                  <v-select
                    v-model="editedItemPerson.language"
                    :items="languages"
                    :label="$t('personManagement.fields.language')"
                    variant="underlined"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Paso 2: Información personal -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" sm="6">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="dateFormatted"
                        variant="underlined"
                        :label="$t('personManagement.fields.birth_date')"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="dateInput"
                        @update:model-value="updateDate"
                        format="yyyy-MM-dd"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItemPerson.age"
                    :label="$t('personManagement.fields.age')"
                    type="number"
                    variant="underlined"
                    min="0"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItemPerson.gender"
                    :items="genders"
                    item-title="name"
                    item-value="id"
                    :label="$t('personManagement.fields.gender')"
                    variant="underlined"
                    clearable
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItemPerson.emergencyContact"
                    :label="$t('personManagement.fields.emergency_contact')"
                    variant="underlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItemPerson.email"
                    :label="$t('personManagement.fields.email')"
                    type="email"
                    variant="underlined"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItemPerson.phone"
                    :label="$t('personManagement.fields.phone')"
                    variant="underlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editedItemPerson.address"
                    :label="$t('personManagement.fields.address')"
                    variant="underlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Paso 3: Información médica -->
              <v-row dense v-if="step === 2">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItemPerson.medical_record_number"
                    :label="$t('personManagement.fields.medical_record_number')"
                    variant="underlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItemPerson.document_type"
                    :items="documentTypes"
                    item-title="name"
                    item-value="id"
                    :label="$t('personManagement.fields.document_type')"
                    variant="underlined"
                    clearable
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItemPerson.document_number"
                    :label="$t('personManagement.fields.document_number')"
                    variant="underlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItemPerson.health_coverage"
                    :items="healthCoverages"
                    item-title="name"
                    item-value="id"
                    :label="$t('personManagement.fields.health_coverage')"
                    variant="underlined"
                    clearable
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItemPerson.coverage_name"
                    :label="$t('personManagement.fields.coverage_name')"
                    variant="underlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItemPerson.blood_type"
                    :items="bloodTypes"
                    :label="$t('personManagement.fields.blood_type')"
                    variant="underlined"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn
                  variant="text"
                  class="text-grey-darken-1"
                  @click="step > 0 ? step-- : closePerson()"
                >
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn
                  variant="text"
                  class="text-deep-purple-accent-3"
                  @click="nextStep"
                  :disabled="!valid"
                >
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
  <v-dialog v-model="dialogJoinHome" max-width="500px">
   <v-card class="bg-grey-lighten-4">
      <v-card-text>
    <JoinHomeStep
      :loading="joiningHome"
      @home-joined="handleJoinHomeFromDialog"
      @go-back="closeJoinDialog"
      @error="closeJoinDialog"
    />
    </v-card-text>
  </v-card>
  </v-dialog>
  <v-dialog v-if="showShareHomeCodeDialog" v-model="showShareHomeCodeDialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="pa-4">
      <div class="d-flex flex-column flex-md-row align-center justify-space-between w-100" style="gap: 16px;">
        <!-- Texto principal -->
        <div class="text-body-2 font-weight-bold text-center text-md-start">
          ¿Quieres invitar a {{ approvalData.minorName ?? 'Sin Nombre' }} a un hogar existente?
        </div>

        <!-- Campo de búsqueda -->
        <div class="flex-grow-1" style="max-width: 300px;">
          <v-text-field
            v-model="search"
            density="compact"
            :label="$t('dataTable.search')"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            hide-details
            single-line
            flat
            clearable
          ></v-text-field>
        </div>
      </div>
    </v-card-title>
      <v-card-text class="pa-4">
        <v-data-table
      :headers="headers"
      :items="homes"
      :search="search"
      :items-per-page-text="$t('dataTable.itemsPerPageText')"
      :no-data-text="$t('dataTable.noDataText')"
      :loading-text="$t('dataTable.loadingText')"
      :loading="loading"
      :hide-default-header="true"
      class="mt-1"
      style="
        max-height: 68vh;
        overflow-y: auto;
        background: transparent;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        padding: 0;
      "
    >
      <!-- Header personalizado (simulado) -->
      <template v-slot:top>
        <v-card
          :elevation="1"
          :hover="false"
          flat
          class="mb-2 mx-1 rounded-lg"
          style="
            border: 1px solid #eceff1;
            height: 40px;
            min-height: 40px;
            display: flex;
            align-items: center;
            transition: none !important;
          "
        >
          <v-card-text
            class="d-flex pa-2"
            style="
              width: 100%;
              min-width: 0;
              height: 100%;
              padding: 0 16px !important;
              display: flex;
              align-items: center;
            "
          >
            <div style="width: 40%; min-width: 0" class="text-left">
              {{ $t("home.fields.name") }} / {{ $t("home.fields.address") }}
            </div>
            <div style="width: 20%; min-width: 0" class="text-left">
              {{ $t("home.fields.ranking") }}
            </div>
            <div style="width: 20%; min-width: 0" class="text-center">
              {{ $t("home.fields.type") }}
            </div>
            <div style="width: 13%; min-width: 0" class="text-center">
              {{ $t("home.fields.status") }}
            </div>
            <div style="width: 7%; min-width: 0" class="d-flex justify-end">
              {{ $t("settings.actions") }}
            </div>
          </v-card-text>
        </v-card>
      </template>

      <!-- Fila personalizada -->
      <template v-slot:item="slotProps">
            <v-card
              class="mb-2 mx-1 rounded-lg"
              elevation="1"
              density="comfortable"
              flat
            >
              <v-card-text
                class="d-flex align-center pa-2"
                style="width: 100%; min-width: 0"
              >
                <div style="width: 40%; min-width: 0" class="d-flex align-center">
                <!-- Avatar de la vivienda -->
                  <v-avatar
                    size="48"
                    class="mr-3 icono-concavo"
                    color="grey-lighten-4"
                    style="flex-shrink: 0"
                  >
                    <v-img
                      :src="getImageUrl(slotProps.item.image)"
                      cover
                      class="icono-concavo"
                    />
                  </v-avatar>

                  <!-- Contenedor de texto -->
                  <div class="d-flex flex-column" style="min-width: 0">
                    <div class="font-weight-bold text-body-2 text-truncate">
                      {{ slotProps.item.name }}
                    </div>
                    <div class="text-caption text-grey-darken-1 text-truncate">
                      {{ slotProps.item.address }}
                    </div>
                    <v-tooltip
                      activator="parent"
                      location="bottom"
                      max-width="350px"
                    >
                      <span style="white-space: normal; word-break: break-word">
                        {{ slotProps.item.address }}
                      </span>
                    </v-tooltip>
                  </div>
                </div>

                <!-- Rating - 15% -->
                <div style="width: 20%; min-width: 0" class="d-flex align-center">
                  <v-rating
                    :model-value="parseFloat(slotProps.item.percent) || 0"
                    color="orange-darken-2"
                    density="compact"
                    size="small"
                    readonly
                  ></v-rating>
                </div>

                <!-- Tipo - 10% -->
                <div style="width: 20%; min-width: 0; text-align: center">
                  <span class="text-body-2 text-truncate">
                    {{ slotProps.item.nameHomeType }}
                  </span>
                </div>

                <!-- Estado - 13% -->
                <div style="width: 13%; min-width: 0; text-align: center">
                  <span class="text-body-2 text-truncate">
                    {{ slotProps.item.nameStatus }}
                  </span>
                </div>

                <!-- Acciones - 5% -->
                <div
                  class="d-flex gap-1"
                  style="width: 7%; justify-content: flex-end; flex-wrap: nowrap"
                >
                   <v-btn
                    size="35"
                    icon
                    variant="text"
                    color="blue-darken-2"
                    class="flex-shrink-0"
                    title="Generar Código"
                    @click="openShareCodeDialog(slotProps.item)"
                  >
                    <v-icon size="20">mdi-share-variant</v-icon>
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
        variant="tonal"
          text="Cerrar"
          @click="closeShareHomeCodeDialog"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogHome" fullscreen persistent transition="dialog-bottom-transition" content-class="fullscreen-dialog">
  <v-form ref="form" v-model="valid" class="h-100">
    <v-card class="pa-10">
      <v-card-text class="pt-12">
        <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`home.actions.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
        <p class="text-grey-lighten-1">{{ $t('home.instructions') }}</p>
        
        <v-row class="mt-12">
          <!-- Pasos laterales -->
          <v-col cols="3">
            <v-timeline align="start" side="end" dense>
              <v-timeline-item 
                v-for="(stepKey, index) in ['basic', 'details']" 
                :key="index" 
                :dot-color="stepHome > index ? 'green' : stepHome === index ? 'deep-purple' : 'grey-lighten-1'" 
                :icon="stepHome >= index ? (stepHome === index ? `mdi-numeric-${index + 1}` : 'mdi-check') : null" 
                size="large">
                <template #opposite>
                  <div class="text-end">
                    <strong>{{ $t(`home.steps.${stepKey}.title`) }}</strong>
                    <div class="text-caption text-grey">
                      {{ $t(`home.steps.${stepKey}.subtitle`) }}
                    </div>
                  </div>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-col>

          <!-- Contenido dinámico según paso -->
          <v-col cols="9">
            <h3 class="text-deep-purple-accent-3 mb-8">
              {{ $t(`home.steps.${['basic', 'details'][stepHome]}.title`) }}
            </h3>

            <!-- Paso 1: Información Básica -->
            <v-row dense v-if="stepHome === 0">
              <v-col cols="12">
                <v-text-field
                  v-model="editedItemHome.name"
                  :label="$t('home.fields.name')"
                  variant="underlined"
                  :rules="nameRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItemHome.address"
                  :label="$t('home.fields.address')"
                  variant="underlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="this.editedIndex != -1">
                <v-autocomplete
                  :no-data-text="$t('noData')"
                  v-model="editedItemHome.status_id"
                  :items="status"
                  :label="$t('home.fields.status')"
                  item-title="nameStatus"
                  item-value="id"
                  variant="underlined"
                  density="compact"
                  :rules="selectRules"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar size="24">
                          <v-icon>{{ item.raw.iconStatus }}</v-icon>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItemHome.home_type_id"
                  :items="hometypes"
                  item-title="name"
                  item-value="id"
                  :label="$t('home.fields.type')"
                  variant="underlined"
                  density="compact"
                  :rules="selectRules"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="item.raw.description"
                    ></v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <!-- Paso 2: Detalles Adicionales -->
            <v-row dense v-if="stepHome === 1">
              <v-col cols="12">
                <v-text-field
                  v-model="editedItemHome.geo_location"
                  :label="$t('home.fields.geoLocation')"
                  density="compact"
                  variant="underlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="this.editedIndex != -1">
                  <v-text-field
                    v-model="editedItemHome.timezone"
                    :label="$t('home.fields.timezone')"
                    variant="underlined"
                    density="compact"
                  >
                  </v-text-field>
                </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItemHome.residents"
                  :label="$t('home.fields.residents')"
                  type="number"
                  variant="underlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-row>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('home.fields.image')"
                    variant="underlined"
                    density="compact"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"
                    prepend-icon=""
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible()"
                      :src="imgedit"
                      height="120"
                      width="210"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-row>

            <!-- Paso 3: Miembros del Hogar -->
            <!--<v-row :dense="roles.length > 4" v-if="step === 2">
              <v-col
                  v-for="role in roles"
                  :key="role.id"
                  cols="12"
                  :sm="roles.length >= 2 ? 6 : 12"
                  :md="getDynamicColSize(roles.length)"
                >
                  <v-card class="mx-auto" max-width="98%">
                    <v-list v-model:selected="selectedItems[role.id]" @update:selected="updateSelection(role, $event)"
                      select-strategy="leaf" multiple>
                      <v-list-subheader>{{ role.nameRol }}</v-list-subheader>
                      <v-list-item v-for="person in filteredPeople(role.id)" :key="`${role.id}-${person.id}`"
                        :value="person.id" active-class="text-green"
                        :prepend-avatar="`${$axios.defaults.baseURL}images/${person.imagePerson}`" class="py-3">
                        <template v-slot:prepend>
                          <v-avatar>
                            <v-img :src="`${$axios.defaults.baseURL}images/${person.imagePerson}`" />
                          </v-avatar>
                        </template>

                        <v-list-item-title>{{ person.namePerson }}</v-list-item-title>
                        <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                          {{ person.roleName }}
                        </v-list-item-subtitle>


                        <template v-slot:append>
                          <v-icon v-if="isPersonSelected(person.id, role.id)" :color="
                              getRoleIcon(role.id) === 'mdi-star'
                                ? 'green-darken-3'
                                : 'green-darken-3'
                            ">
                            {{
                            getRoleIcon(role.id) === "mdi-star"
                            ? "mdi-star"
                            : "mdi-circle-slice-8"
                            }}
                          </v-icon>
                          <v-icon v-else class="opacity-30" :color="
                              getRoleIcon(role.id) === 'mdi-star'
                                ? 'green-darken-3'
                                : undefined
                            ">
                            {{
                            getRoleIcon(role.id) === "mdi-star"
                            ? "mdi-star-outline"
                            : "mdi-checkbox-blank-circle-outline"
                            }}
                          </v-icon>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
            </v-row>-->

            <div class="d-flex justify-space-between mt-8">
              <v-btn variant="text" class="text-grey-darken-1" @click="stepHome > 0 ? stepHome-- : closeHome()">
                {{ stepHome === 0 ? $t('buttons.close') : $t('buttons.previous') }}
              </v-btn>

              <v-btn 
                variant="text" 
                class="text-deep-purple-accent-3" 
                @click="nextStepHome" 
                :disabled="stepHome === 1 && !valid">
                {{
                  stepHome === 1 
                    ? $t('buttons.saveAndClose') 
                    : $t('buttons.next')
                }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</v-dialog>
  </div>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import router from "@/router/index";
import JoinHomeStep from "@/components/onboarding/JoinHomeStep.vue";
export default {
  components: {
    JoinHomeStep
  },
  data: () => ({
    search: '',
    showShareHomeCodeDialog: false,
    headers: [
      { title: "Nombre", value: "name", width: "20%" },
      { title: "Dirección", value: "address", width: "25%" },
      { title: "Ranking", value: "percent", width: "5%" },
      { title: "Personas", value: "people", width: "15%" },
      { title: "Tipo", value: "nameHomeType", width: "10%" },
      { title: "Estado", value: "nameStatus", width: "10%" },
      { title: "Acciones", value: "actions", sortable: false, width: "15%" },
    ],
    dialogJoinHome: false,
      joiningHome: false,
    loaded: false,
    drawer: false,
    menu: false,
    menuNoti: false,
    statusOnboarding: false,
    dateMenu: false,
    dateInput: null,
    onboarding_status: null,
    file: null,
    imgMiniatura: "",
    isHovered: null,
    drawerItems: [
      { title: "Inicio", icon: "mdi-home" },
      { title: "Configuración", icon: "mdi-cog" },
      { title: "Ayuda", icon: "mdi-help-circle" },
    ],
    menuSettings: false,
    settingsItems: [
      { title: "Categorías", icon: "mdi-text-box-outline", to: "/category" },
      { title: "Almacénes", icon: "mdi-warehouse", to: "/warehouse" },
      { title: "Prioridades", icon: "mdi-star-circle-outline", to: "/priority" },
      { title: "Roles", icon: "mdi-account-cog-outline", to: "/role" },
      { title: "Estados", icon: "mdi-check-circle-outline", to: "/status" },
      { title: "Tipos de Hogar", icon: "mdi-home-group", to: "/hometype" },
      { title: "Tipos", icon: "mdi-tag", to: "/type" },
      { title: "Iniciativas de Metas", icon: "mdi-target", to: "/initiatives" },
      //{ title: "Historias Clínicas", icon: "mdi-clipboard-text-outline", to: "/history" },
      /*{ title: "Consultas Médicas", icon: "mdi-stethoscope", to: "/consultation" },
      { title: "Exámenes Médicos", icon: "mdi-microscope", to: "/exam" },
      {
        title: "Emergencias Médicas",
        icon: "mdi-alert-circle-outline",
        to: "/emergency",
      },*/
    ],
    visible: false,
    visible1: false,
    visible2: false,
    snackbar: false,
    loading: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    user: "",
    name: "",
    imageUrl: "",
    cantHome: "",
    home_id: "",
    dialogChangePass: false,
    data: {},
    person: {},
    homes: [],
    dialog: false,
    editedItem: {
      currentPassword: "",
      newPassword: "",
      newPassword1: "",
    },
    defaultItem: {
      currentPassword: "",
      newPassword: "",
      newPassword1: "",
    },
    person_id: "",
    cursor: null,
    hasMore: false,
    notifications: [],
    countNoti: "",
    items: [
      { title: "Mi Perfil", icon: "mdi-account-tie-outline", id: "miPerfil" },
      { title: "Cambiar Contraseña", icon: "mdi-form-textbox-password", id: "cambiarContrasena" },
      { title: "Unirte a un Hogar", icon: "mdi-home", id: "joinHome" },
      { title: "Cerrar Sesión", icon: "mdi-exit-to-app", id: "closeSesion" },
    ],
    dialogPerson: false,
    valid: false,
    step: 0,
    stepHome: 0,
    showPassword: false,
    birthDateMenu: false,
    imageFile: null,
    editedItemPerson: {
      user_id: null,
      name: "",
      user: null,
      password: null,
      language: null,
      birth_date: null,
      age: null,
      gender: null,
      emergencyContact: null,
      email: null,
      phone: null,
      address: null,
      image: null,
      medical_record_number: null,
      document_type: null,
      document_number: null,
      health_coverage: null,
      coverage_name: null,
      blood_type: null,
    },
    originalItemPerson: {
      user_id: null,
      name: "",
      user: null,
      password: null,
      language: null,
      birth_date: null,
      age: null,
      gender: null,
      emergencyContact: null,
      email: null,
      phone: null,
      address: null,
      image: null,
      medical_record_number: null,
      document_type: null,
      document_number: null,
      health_coverage: null,
      coverage_name: null,
      blood_type: null,
    },
    defaultItemPerson: {
      user_id: null,
      name: "",
      user: null,
      password: null,
      language: null,
      birth_date: null,
      age: null,
      gender: null,
      emergencyContact: null,
      email: null,
      phone: null,
      address: null,
      image: null,
      medical_record_number: null,
      document_type: null,
      document_number: null,
      health_coverage: null,
      coverage_name: null,
      blood_type: null,
    },
    steps: [
      { title: "basic_info", fields: ["name", "user", "password", "language", "image"] },
      { title: "personal_info", fields: [ "birth_date", "age", "gender", "emergencyContact", "email", "phone", "address", ], },
      { title: "medical_info", fields: [ "medical_record_number", "document_type", "document_number", "health_coverage", "coverage_name", "blood_type", ], },
    ],
    languages: ["es", "en", "pt"],
    genders: [],
    documentTypes: [],
    healthCoverages: [],
    bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    approvalData: null,
    dialogHome: false,
    status: [],
    people: [],
    roles: [],
    hometypes: [],
     editedItemHome: {
      id: "",
      name: "",
      address: "",
      home_type_id: "",
      status_id: "",
      person_id: null,
      residents: "",
      geo_location: "",
      timezone: "",
      image: null,
      people: [],
      code: "",
      approvalData: {}
    },

    defaultItemHome: {
      id: "",
      name: "",
      address: "",
      home_type_id: "",
      status_id: "",
      person_id: null,
      residents: "",
      geo_location: "",
      timezone: "",
      image: null,
      people: [],
      code: "",
      approvalData: {}
    },

    originalItemHome: {
      id: "",
      name: "",
      address: "",
      home_type_id: "",
      status_id: "",
      person_id: null,
      residents: "",
      geo_location: "",
      timezone: "",
      image: null,
      people: [],
      code: "",
      approvalData: {}
    },
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    codeRules: [
      (v) => !v || v.length >= 8 || "El código debe tener al menos 8 caracteres",
      //v => !v || /^[a-zA-Z0-9]+$/.test(v) || 'Solo se permiten letras y números'
    ],
  currentHomeId: null,
  }),
  computed: {
    formTitle() {
      return this.editedItemPerson.user_id
        ? this.$t("personManagement.edit_title")
        : this.$t("personManagement.edit_title");
    },
    /*translatedGenders() {
      if (!this.genders) return [];
      return this.genders.map((gender) => ({
        title: this.$t(`personManagement.genders.${gender.text}`), // Usar 'title' en vez de 'text'
        value: gender.value,
      }));
    },
    translatedDocumentTypes() {
      return this.documentTypes.map((type) => ({
        title: this.$t(`personManagement.documentTypes.${type.text}`),
        value: type.value,
      }));
    },
    translatedHealthCoverages() {
    return this.healthCoverages.map(coverage => ({
      title: this.$t(`personManagement.healthCoverages.${coverage.text}`),
      value: coverage.value
    }))
  },*/
    nameRules() {
      return [(v) => !!v || this.$t("personManagement.validation.name_required")];
    },
    emailRules() {
      return [
        (v) =>
          !v || /.+@.+\..+/.test(v) || this.$t("personManagement.validation.email_valid"),
      ];
    },
    imageRules() {
      return [
        (v) => !v || v.size < 500000 || this.$t("personManagement.validation.image_size"),
      ];
    },
    imgedit() {
      return this.imgMiniatura;
    },
    dateFormatted() {
      const date = this.dateInput ? new Date(this.dateInput) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.dateInput ? new Date(this.dateInput) : new Date();
    },
  },
   watch: {
  '$route.query.home_id': {
    handler(newId) {
      if (newId && newId !== this.currentHomeId) {
        this.loadHomeData(newId);
      }
    },
    immediate: true
  }
},
  async mounted() {
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.user = JSON.parse(LocalStorageService.getItem("user"));
    this.user_id = JSON.parse(LocalStorageService.getItem("user_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.currentHomeId = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.onboarding_status = JSON.parse(LocalStorageService.getItem('onboarding_status'));
    this.approvalData = JSON.parse(LocalStorageService.getItem('approvalData'));
    
    //this.role = JSON.parse(LocalStorageService.getItem('role'));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    // Aquí se debe usar una función
    /*if (this.onboarding_status === 1) {
      this.$router.push({ path: "home" });
    } else {
      this.$router.push({ path: "onboarding" });
    }*/
      const allowedStatuses = [0, 1];

      if (allowedStatuses.includes(parseInt(this.onboarding_status, 10))) {
        this.statusOnboarding = false;
    }
    else{
      this.statusOnboarding = true;
      await this.initialize();
      await this.getNotifications();
    }
  },
  methods: {
    closeShareHomeCodeDialog(){
      this.showShareHomeCodeDialog = false;
              // Opcional: limpiar approvalData ya que ya se usó
      LocalStorageService.removeItem('approvalData');
      this.approvalData = null;
    },
    async openShareCodeDialog(item){
      this.data = {};
      this.data.home_id = item.id;
      this.data.homeName = item.name;
      this.data.minorName = this.approvalData.minorName;
      this.data.minorEmail = this.approvalData.minorEmail;
      this.data.request_id = this.approvalData.request_id;
      try {
        const result = await handleRequest({
          endpoint: "send-code-home",
          method: "POST",
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
           this.showAlert(
          "success",
          result.message ?? "Código para unirse al hogar enviado correctamente.",
          3000
        );        
       this.showShareHomeCodeDialog = false;
        LocalStorageService.removeItem('approvalData');
        this.approvalData = null;
        } else {
          this.showAlert(
          "warning",
          "No se pudo enviar el código para unirse al hogar.",
          3000
        );
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado.",
          3000
        );
      } finally {
       this.initialize();
    }
    },
    showDialogJoin(){
      this.dialogJoinHome = true;
    },
    async handleJoinHomeFromDialog({ code }) {
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
          LocalStorageService.setItem("home_id", JSON.stringify(homeId));
          LocalStorageService.setItem("onboarding_status", 3);
          this.statusOnboarding = true;
          window.location.href = '/home';
        } else {          
          this.dialogJoinHome = false;
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las hogares.",
          3000
        );
         this.dialogJoinHome = false;
      } finally {
         this.dialogJoinHome = false;
      }
    },

    // ✅ Se llama al dar "Volver" o "Cancelar"
    closeJoinDialog() {
      this.dialogJoinHome = false;
    },
    isItemVisible(title) {
      const status = this.statusOnboarding;
     if (title === "Cerrar Sesión") {
      return true; // Siempre visible
    }

    if (title === "Mi Perfil") {
      return status;
    }

    if (title === "Unirte a un Hogar") {
      return !status;
    }

    if (title === "Cambiar Contraseña") {
      return status;
    }

    return false;
    },
    getImageUrl(imagePath) {
      return `${this.$axios.defaults.baseURL}images/${imagePath}?t=${this.getCacheTimestamp()}`;
    },
    getCacheTimestamp() {
      // Usamos medianoche (00:00:00) del día actual
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.getTime(); // Ej: 1714003200000 (cambia una vez al día)
    },
    updateDate(val) {
      this.dateInput = val;
      this.editedItem.birth_date = this.dateFormatted;
      this.dateMenu = false;
    },
    async initialize() {
      try {
        const result = await handleRequest({
          endpoint: "person-homes",
          method: "POST",
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.homes = result.data?.homes || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.homes = [];
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las hogares.",
          3000
        );
      } finally {
        this.cantHome = this.homes.length;
        // Reiniciar el formulario
        if (!this.home_id && this.homes.length) {
          localStorage.setItem("home_id", this.homes[0].id);
          this.home_id = this.homes[0].id;
        }

         // 🔹 NUEVA LÓGICA: Mostrar formulario si se rechazó y tiene hogares
      if (
        this.approvalData &&
        this.approvalData.action === 'reject' &&
        this.homes.length > 0
      ) {
        this.showShareHomeCodeDialog = true;
      }
      if (
        this.approvalData &&
        this.approvalData.action === 'approve' 
      ) {
        console.log(this.approvalData);
        console.log('this.approvalData');
        this.showAddHome();
      }
      }
    },
    async showAddHome() {
      this.stepHome = 0;
      this.editedIndex = -1;
      (this.file = null), (this.editedIndex = -1);
      (this.imgMiniatura = ""), (this.data = {});
      try {
        const result = await handleRequest({
          endpoint: "hometype-status-people-apk",
          method: "GET",
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.status = result.data?.homestatus || [];
          this.people = result.data?.homepeople || [];
          this.roles = result.data?.homeroles || [];
          this.hometypes = result.data?.hometypes || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.status = [];
          this.people = [];
          this.roles = [];
          this.hometypes = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        const activeStatus = this.status.find(
            (status) => status.nameStatus === "Activa" || status.nameStatus.toLowerCase() === "activa"
          );

          if (activeStatus) {
            this.editedItemHome.status_id = activeStatus.id;
          }
           const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          this.editedItemHome.timezone = timezone;
          this.editedItemHome.name = this.approvalData.homeName;
           const adminRole = this.roles.find(
              (role) => role.name === "Administrador" || role.name.toLowerCase() === "administrador"
            );

            if (adminRole) {
              this.editedItemHome.people = [
                {
                  person_id: Number(this.person_id),
                  role_id: Number(adminRole.id),
                  roleName: adminRole.name,
                },
              ];
            }
           this.dialogHome = true;
      }
    },
    async getNotifications() {
      try {
        this.data = {};
        this.data.cursor = this.cursor;
        const result = await handleRequest({
          endpoint: "get-user-notifications",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          // Asignar todas las notificaciones al array
          this.notifications.push(...(result.data?.notifications || []));
          // Filtrar las notificaciones con status 0 solo para contar
          this.countNoti =
            this.notifications.filter((notification) => notification.status === 0)
              .length || 0;
          this.cursor = result.data?.nextCursor || null;
          this.hasMore = result.data?.hasMore || false;
          console.log("this.cursor");
          console.log(this.cursor);
          console.log("this.hasMore");
          console.log(this.hasMore);
        } else {
          // Si no hay datos, asignamos un array vacío
          this.notifications = [];
          this.cursor = null;
          this.hasMore = false;
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las notificaciones.",
          3000
        );
      }
    },
    async openMenu() {
      if (!this.statusOnboarding){
        this.homes = [];
        return;
      }
      try {
        const result = await handleRequest({
          endpoint: "person-homes",
          method: "POST",
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.homes = result.data?.homes || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.homes = [];
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las hogares.",
          3000
        );
      } finally {
        this.cantHome = this.homes.length;
        // Reiniciar el formulario

        this.menu = true; // Abre el menú
      }
    },
    openNoti() {
      this.menuNoti = true;
    },
    selectHome(home) {
      // Lógica para manejar la selección de un hogar
      //localStorage.setItem("home_id", home.id);

      // Obtiene la ruta actual
      const currentRoute = this.$route.fullPath;
      console.log("currentRoute:", currentRoute);
      this.home_id = home.id;
      // Redirige a la ruta 'Home'
      this.$router.push({ name: 'Home', query: { home_id: home.id } });
      this.menu = false; // Cierra el menú después de seleccionar
    },
    loadHomeData(homeId) {
      // Aquí usas homeId para cargar datos
      localStorage.setItem('home_id', homeId);
      this.currentHomeId = homeId;
      //window.history.replaceState({}, document.title, window.location.pathname);
      // ... resto de la lógica
    },
    onClick() {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.loaded = true;
      }, 2000);
    },
    async handleItemClick(item) {
      if (item.title === "Cambiar Contraseña") {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.dialogChangePass = true;
      }
      if (item.title === "Cerrar Sesión") {
        try {
          const result = await handleRequest({
            endpoint: "logout",
            method: "GET",
          });

          if (result.success) {
            // Mostrar mensaje de éxito
            this.showAlert("success", "Sesión cerrada correctamente", 3000);
            setTimeout(() => {
              // Eliminar el token y redirigir al login
              LocalStorageService.logout();
              this.$router.push({ path: "/" });
            }, 1000);
          } else {
            // Mostrar mensaje de error
            this.showAlert("warning", result.message, 3000);
          }
        } catch (error) {
          // En caso de que algo salga mal, manejar errores adicionales aquí si es necesario
          this.showAlert("error", "Ocurrió un error inesperado.", 3000);
        }
      }
      if (item.title === "Mi Perfil") {
        this.data = {};
        this.data.id = this.person_id;
        try {
          const result = await handleRequest({
            endpoint: "person-show",
            method: "POST",
            data: this.data,
          });

          if (result.success) {
            // Si la solicitud es exitosa, asignamos las sucursales
            this.person = result.data?.person || []; // Si no hay roles, asigna un arreglo vacío
            this.genders = result.data?.options?.genders || [];
            this.documentTypes = result.data?.options?.documentTypes || [];
            this.healthCoverages = result.data?.options?.healthCoverages || [];
          } else {
            // Si no hay datos, asignamos un array vacío
            this.person = [];
            this.genders = [];
            this.documentTypes = [];
            this.healthCoverages = [];
          }
        } catch (error) {
          // Captura de errores no controlados
          this.showAlert(
            "error",
            "Ocurrió un error inesperado al cargar las hogares.",
            3000
          );
        } finally {
          this.editedItemPerson = Object.assign({}, this.person);
          this.originalItemPerson = Object.assign({}, this.person);
          this.file = null;
          // Crear la imagen y configurar el src
          const img = new Image();
          img.src = `${this.$axios.defaults.baseURL}images/${this.person.image}`; // Se asume que item.image_url es la URL de la imagen

          // Usar una función asíncrona para manejar la carga de la imagen
          img.onload = async () => {
            try {
              // Asignar la imagen cargada a imgMiniatura
              this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${this.person.image}`;
            } catch (error) {
              this.showAlert("error", "Error al cargar la imagen.", 3000);
            }
          };
          this.editedItemPerson.birth_date = this.person.birth_date;
          this.dialogPerson = true;
        }
      }
      if(item.id === 'joinHome'){
        this.showDialogJoin();
      }
    },
    close() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialogChangePass = false;
    },
    async save() {
      this.loading = true; // Iniciar loader
      try {
        this.data = {};
        // Preparar el payload
        this.data.id = this.user_id;
        this.data.currentPassword = this.editedItem.currentPassword;
        this.data.newPassword = this.editedItem.newPassword;

        // Petición al servidor utilizando handleRequest
        const result = await handleRequest({
          endpoint: "update-password",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Manejo en caso de éxito
          this.showAlert("success", "Contraseña actualizada correctamente", 3000);
          // Reiniciar el formulario
          this.editedItem = Object.assign({}, this.defaultItem);
        } else {
          // Manejo de errores definidos por la API
          this.showAlert("warning", result.message || "Error inesperado", 3000);
        }
      } catch (error) {
        // Manejo de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al iniciar sesión.", 3000);
        console.error(error);
      } finally {
        this.loading = false; // Detener el loader
        this.dialogChangePass = false;
      }
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
    async openDialog() {
      try {
        const result = await handleRequest({
          endpoint: "person-homes",
          method: "POST",
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.homes = result.data?.homes || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.homes = [];
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las hogares.",
          3000
        );
      } finally {
        LocalStorageService.setItem("cantHome", this.homes.length);
        this.cantHome = this.homes.length;
        // Reiniciar el formulario

        // Redirigir al Dashboard
        /* setTimeout(() => {
           router.push({ name: 'Dashboard' });
         }, 1000);*/
      }
      this.dialog = true; // Abrir el diálogo
    },
    closeDialog() {
      this.dialog = false; // Cerrar el diálogo
    },
    changeHome() {
      this.dialog = false;
      // Guardar el home_id seleccionado en localStorage
      localStorage.setItem("home_id", this.home_id);
      const currentRoute = this.$route.fullPath;
      console.log("currentRoute");
      console.log(currentRoute);
      router.push({ name: "Home" });
    },
    /*handleItemClickNotif(item) {
      //alert(item.id);
    },*/
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.savePerson();
      }
    },
    nextStepHome() {
       if (this.stepHome < 1) { // 0=basic, 1=details, 2=members
        this.stepHome++
      } else {
        this.saveHome()
      }
    },
    async saveHome() {
    this.loading = true;
    this.valid = false;

    const fieldsToUpdate = [
      "name",
      "address",
      "home_type_id",
      "status_id",
      "category_id",
      "residents",
      "geo_location",
      "timezone",
      "people",
      "image",
      "approvalData"
    ];

    let updatedFields = Object.keys(this.editedItemHome)
      .filter(
        (key) =>
          fieldsToUpdate.includes(key) &&
          this.editedItemHome[key] !== this.originalItemHome[key]
      )
      .reduce((obj, key) => {
        if (key === "people") {
          // ✅ Transformar people como en la vista que funciona
          obj[key] = this.editedItemHome.people.map((person) => ({
            person_id: Number(person.id || person.person_id),
            role_id: Number(person.roleId || person.role_id),
            roleName: person.roleName,
          }));
        } else {
          obj[key] = this.editedItemHome[key];
        }
        return obj;
      }, {});

    if (Object.keys(updatedFields).length > 0) {
      if (this.file) {
        updatedFields.image = this.file; // 👈 Asegúrate de usar this.file, no this.editedItemHome.image
      }

      const formData = new FormData();

      // ✅ Agregar cada campo al FormData
      for (let key in updatedFields) {
        if (key === "people") {
          // ✅ Formato compatible con Express/multer: people[0][person_id], etc.
          updatedFields[key].forEach((person, index) => {
            for (const [personKey, value] of Object.entries(person)) {
              formData.append(`people[${index}][${personKey}]`, value);
            }
          });
        } else if (key === "approvalData") {
          // ✅ Enviar approvalData como JSON string
          formData.append("approvalData", JSON.stringify(this.approvalData));
        } else {
          formData.append(key, updatedFields[key]);
        }
      }

      try {
        const result = await handleRequest({
          endpoint: "home-approve",
          method: "POST",
          data: formData,
        });

        if (result.success) {
          this.loading = false;
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.loading = false;
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        this.loading = false;
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
      }
    } else {
      this.loading = false;
      this.showAlert("info", "No hay cambios para guardar.", 3000);
    }

    this.closeHome();
  },
  closeHome(){
    this.dialogHome = false;
              // Opcional: limpiar approvalData ya que ya se usó
    LocalStorageService.removeItem('approvalData');
    this.approvalData = null;
    },
    async savePerson() {
      this.valid = false;
      const fieldsToUpdate = [
        "name",
        "user",
        "language",
        "birth_date",
        "age",
        "gender",
        "emergencyContact",
        "email",
        "phone",
        "address",
        "image",
        "medical_record_number",
        "document_type",
        "document_number",
        "health_coverage",
        "coverage_name",
        "blood_type",
      ];

      let updatedFields = Object.keys(this.editedItemPerson)
        .filter(
          (key) =>
            fieldsToUpdate.includes(key) &&
            this.editedItemPerson[key] !== this.originalItemPerson[key]
        )
        .reduce((obj, key) => {
          obj[key] = this.editedItemPerson[key];
          return obj;
        }, {});

      if (Object.keys(updatedFields).length > 0) {
        updatedFields.id = this.editedItemPerson.id;

        const formData = new FormData();

        // Manejo especial para la imagen
        if (this.imageFile) {
          formData.append("image", this.imageFile);
          delete updatedFields.image; // Eliminamos del objeto ya que lo manejamos por separado
        }

        for (let key in updatedFields) {
          formData.append(key, updatedFields[key]);
        }

        try {
          const result = await handleRequest({
            endpoint: "person-update",
            method: "POST",
            data: formData,
          });

          // Manejo de la respuesta
          if (result.success) {
            this.loading = false;
            this.showAlert("success", result.message, 3000);
            const person = result.data.personUpdate;
            // Comparar el idioma de person con el almacenado
            const currentLocale = LocalStorageService.getItem("userLocale");
            const personLocale = person.language; // Asumo que el idioma viene en person.language

            if (personLocale && personLocale !== currentLocale) {
              // Actualizar localStorage
              LocalStorageService.setItem("userLocale", personLocale);

              // Actualizar i18n y Vuetify
              this.$i18n.locale = personLocale;
              this.$vuetify.locale.current = personLocale;
              // Forzar actualización de componentes que no reaccionan automáticamente
              this.$forceUpdate(); // Esto actualiza la vista sin recargar
              // Opcional: recargar la página para asegurar que todos los componentes se actualicen
              // window.location.reload();
            }
            LocalStorageService.setItem("image", person.image);
            this.closePerson();
            window.location.reload();
          } else {
            this.loading = false;
            this.showAlert("warning", result.message, 3000);
          }
        } catch (error) {
          this.loading = false;
          this.showAlert(
            "error",
            "Ocurrió un error inesperado al procesar la solicitud.",
            3000
          );
        }
      } else {
        this.loading = false;
        this.showAlert("info", "No se realizaron cambios.", 3000);
        this.closePerson();
      }
    },
    closePerson() {
      this.dialogPerson = false;
      this.editedItemPerson = Object.assign({}, this.defaultItemPerson);
    },
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;
        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      // Validar el tamaño del archivo (500 KB máximo)
      const maxSize = 500 * 1024; // 500 KB en bytes
      if (file && file.size > maxSize) {
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return; // Detener el proceso si el archivo es demasiado grande
      }
      this.editedItemPerson.image = file;
      this.editedItemHome.image = file;
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>

<style scope="this api replaced by slot-scope in 2.5.0+">
.v-input.custom-text-field.v-input {
  border-color: #03626c !important;
}

.text-truncate {
  white-space: nowrap;
  /* Evita que el texto se divida en varias líneas */
  overflow: hidden;
  /* Oculta el texto que desborda */
  text-overflow: ellipsis;
  /* Agrega puntos suspensivos (...) al final del texto recortado */
}

/* Agrega esto en tu sección de estilos */
.avatar-hover {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.avatar-hover:hover .edit-overlay {
  opacity: 1;
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.edit-icon {
  transition: transform 0.3s ease;
}

.avatar-hover:hover .edit-icon {
  transform: scale(1.1);
}
/* Estilos para resaltar el hogar seleccionado */
.selected-home {
  background-color: #f0f0f0;
  /* Color de fondo para el elemento seleccionado */
}

/* Estilos principales del menú */
.rounded-menu {
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid #eee !important;
}

/* Items de notificación */
.notification-item {
  transition: all 0.25s ease;
  padding: 12px 16px !important;
  border-bottom: 1px solid #03626c;
  cursor: pointer;
}

/* Notificación no leída */
.notification-unread {
  background-color: #f8f9fa;
  border-left: 4px solid #03626c !important;
  border-radius: 4px;
}

.notification-unread .unread-title {
  font-weight: 600 !important;
  color: #03626c !important;
}

/* Textos */
.title-text {
  font-size: 0.95rem !important;
  line-height: 1 !important;
  margin-bottom: 2px;
}

.description-text {
  font-size: 0.85rem !important;
  line-height: 1.4 !important;
  color: #616161 !important;
}

/* Imagen */
.notification-image {
  border: 2px solid #eee;
  transition: transform 0.3s ease;
}

.notification-image:hover {
  transform: scale(1.05);
}

/* Botón de carga adicional */
.load-more-item {
  padding: 2px 0 !important;
}

.load-more-btn {
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
}

/* Hover effects */
.v-list-item:hover {
  background-color: #f5f5f5 !important;
}

/* Scrollbar personalizada */
.notification-list::-webkit-scrollbar {
  width: 8px;
}

.notification-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
