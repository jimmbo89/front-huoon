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
  <v-container class="pa-4">
    <v-card elevation="2" rounded="lg" flat>
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-col cols="12" sm="9" md="9" class="d-flex align-center">
          <v-avatar size="48" class="me-3" color="grey-lighten-4" variant="tonal">
            <v-icon color="brown">mdi-home</v-icon>
          </v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold mb-1">
              {{ $t("home.title") }}
            </div>
            <div class="text-body-2 text-grey-darken-1"></div>
          </div>
        </v-col>

        <v-divider />
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
        <v-card-title class="d-flex flex-wrap align-center gap-4 pb-0">
          <!-- Spacer (solo visible en md+) -->
          <v-spacer class="d-none d-md-block"></v-spacer>
          <!-- Campo de búsqueda global -->
          <div class="flex-grow-1" style="max-width: 300px">
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
        </v-card-title>

        <!-- Tabla de datos -->
        <div
          class="ma-0 pa-0 responsive-data-table-wrapper"
          :class="isMobile ? 'mobile-scroll' : ''"
        >
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
              overflow-x: hidden;
              background: transparent;
              border: none !important;
              outline: none !important;
              box-shadow: none !important;
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
                  <div style="width: 10%; min-width: 0" class="text-left">
                    {{ $t("home.fields.ranking") }}
                  </div>
                  <div style="width: 20%; min-width: 0" class="text-left">
                    {{ $t("home.fields.residents") }}
                  </div>
                  <div style="width: 10%; min-width: 0" class="text-center">
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
              <tr
                style="display: table; width: 100%"
                :class="isMobile ? 'mobile-table' : 'desktop-table'"
              >
                <td colspan="100%" style="padding: 0; border: none">
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
                      <div style="width: 10%; min-width: 0" class="d-flex align-center">
                        <v-rating
                          :model-value="parseFloat(slotProps.item.percent) || 0"
                          color="orange-darken-2"
                          density="compact"
                          size="small"
                          readonly
                        ></v-rating>
                      </div>

                      <!-- Personas (avatars) - 10% -->
                      <div
                        style="width: 20%; min-width: 0; text-align: left"
                        class="avatar-row d-flex justify-left"
                      >
                        <div class="d-flex flex-wrap gap-1">
                          <v-tooltip
                            v-for="person in slotProps.item.people"
                            :key="person.id"
                            bottom
                            :open-delay="300"
                            :close-delay="100"
                            max-width="350px"
                          >
                            <template v-slot:activator="{ props }">
                              <v-avatar
                                class="avatar-item hover-expand"
                                size="32"
                                v-bind="props"
                              >
                                <v-img :src="getImageUrl(person.image)" alt="avatar" />
                              </v-avatar>
                            </template>
                            <div>
                              <div>{{ person.name }}</div>
                              <div class="text-secondary text-caption">
                                {{ person.roleName }}
                              </div>
                              <div class="star-rating mt-1">
                                <v-rating
                                  :model-value="parseFloat(person.percent) || 0"
                                  color="orange-darken-2"
                                  density="compact"
                                  size="x-small"
                                  readonly
                                ></v-rating>
                              </div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>

                      <!-- Tipo - 10% -->
                      <div style="width: 10%; min-width: 0; text-align: center">
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
                          color="green-darken-2"
                          @click="editItem(slotProps.item)"
                          class="flex-shrink-0 mr-1"
                          :title="$t('buttons.edit')"
                        >
                          <v-icon size="20">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          size="35"
                          icon
                          variant="text"
                          color="blue-darken-2"
                          @click="openInviteDialog(slotProps.item)"
                          class="flex-shrink-0 mr-1"
                          title="Invitar a unirse"
                        >
                          <v-icon size="20">mdi-email</v-icon>
                        </v-btn>
                        <v-btn
                          size="35"
                          icon
                          variant="text"
                          color="red-darken-2"
                          @click="deleteItem(slotProps.item)"
                          class="flex-shrink-0"
                          :title="$t('buttons.delete')"
                        >
                          <v-icon size="20">mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
  </v-container>

  <v-dialog
    v-model="dialog"
    :fullscreen="isFullscreen"
    :max-width="isMobile ? '100%' : 'none'"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card :class="isMobile ? 'pa-0' : 'pa-10'">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`home.actions.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("home.instructions") }}</p>

          <v-container fluid class="pa-0 mt-6">
            <v-row>
              <!-- Timeline (solo escritorio) -->
              <v-col v-if="isDesktop" cols="12" md="3" class="pr-md-6">
                <v-timeline align="start" side="end" dense>
                  <v-timeline-item
                    v-for="(stepKey, index) in ['basic', 'details', 'members']"
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
              <v-col :cols="12" :md="isMobile ? 12 : 9" :class="{ 'mt-6': isMobile }">
                <!-- En móvil: indicador del paso -->
                <div
                  v-if="isMobile"
                  class="d-flex justify-space-between align-center mb-4"
                >
                  <v-chip
                    label
                    size="small"
                    color="deep-purple-lighten-4"
                    class="text-deep-purple"
                  >
                    {{ $t(`home.steps.${["basic", "details", "members"][step]}.title`) }}
                  </v-chip>
                </div>

                <!-- En escritorio: título del paso -->
                <h3 v-else class="text-deep-purple-accent-3 mb-6">
                  {{ $t(`home.steps.${["basic", "details", "members"][step]}.title`) }}
                </h3>

                <!-- Paso 1: Información Básica -->
                <v-row dense>
                  <template v-if="step === 0">
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.name"
                        :label="$t('home.fields.name')"
                        variant="underlined"
                        :rules="nameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.address"
                        :label="$t('home.fields.address')"
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="this.editedIndex != -1">
                      <v-autocomplete
                        :no-data-text="$t('noData')"
                        v-model="editedItem.status_id"
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
                        v-model="editedItem.home_type_id"
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
                  </template>

                  <!-- Paso 2: Detalles Adicionales -->
                  <template v-if="step === 1">
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.geo_location"
                        :label="$t('home.fields.geoLocation')"
                        density="compact"
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="this.editedIndex != -1">
                      <v-text-field
                        v-model="editedItem.timezone"
                        :label="$t('home.fields.timezone')"
                        variant="underlined"
                        density="compact"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.residents"
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
                        <v-card
                          elevation="6"
                          class="mx-auto"
                          max-width="210"
                          max-height="120"
                        >
                          <img
                            v-if="imagenDisponible()"
                            :src="imgedit"
                            height="120"
                            width="210"
                          />
                        </v-card>
                      </v-col>
                    </v-row>
                  </template>

                  <!-- Paso 3: Miembros del Hogar -->
                  <template v-if="step === 2">
                    <v-col
                      v-for="role in roles"
                      :key="role.id"
                      cols="12"
                      :sm="roles.length >= 2 ? 6 : 12"
                      :md="getDynamicColSize(roles.length)"
                    >
                      <v-card class="mx-auto" max-width="98%">
                        <v-list
                          v-model:selected="selectedItems[role.id]"
                          @update:selected="updateSelection(role, $event)"
                          select-strategy="leaf"
                          multiple
                        >
                          <v-list-subheader>{{ role.nameRol }}</v-list-subheader>
                          <v-list-item
                            v-for="person in filteredPeople(role.id)"
                            :key="`${role.id}-${person.id}`"
                            :value="person.id"
                            active-class="text-green"
                            :prepend-avatar="`${$axios.defaults.baseURL}images/${person.imagePerson}`"
                            class="py-3"
                          >
                            <!-- Contenido del ítem - Nueva estructura Vuetify 3 -->
                            <template v-slot:prepend>
                              <v-avatar>
                                <v-img
                                  :src="`${$axios.defaults.baseURL}images/${person.imagePerson}`"
                                />
                              </v-avatar>
                            </template>

                            <!-- Nombre y rol -->
                            <v-list-item-title>{{ person.namePerson }}</v-list-item-title>
                            <v-list-item-subtitle
                              class="mb-1 text-high-emphasis opacity-100"
                            >
                              {{ person.roleName }}
                            </v-list-item-subtitle>

                            <!-- Icono de selección -->
                            <template v-slot:append>
                              <v-icon
                                v-if="isPersonSelected(person.id, role.id)"
                                :color="
                                  getRoleIcon(role.id) === 'mdi-star'
                                    ? 'green-darken-3'
                                    : 'green-darken-3'
                                "
                              >
                                {{
                                  getRoleIcon(role.id) === "mdi-star"
                                    ? "mdi-star"
                                    : "mdi-circle-slice-8"
                                }}
                              </v-icon>
                              <v-icon
                                v-else
                                class="opacity-30"
                                :color="
                                  getRoleIcon(role.id) === 'mdi-star'
                                    ? 'green-darken-3'
                                    : undefined
                                "
                              >
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
                  </template>
                </v-row>

                <div class="d-flex justify-space-between mt-8">
                  <v-btn
                    variant="text"
                    class="text-grey-darken-1"
                    @click="step > 0 ? step-- : close()"
                  >
                    {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                  </v-btn>

                  <v-btn
                    variant="text"
                    class="text-deep-purple-accent-3"
                    @click="nextStep"
                    :disabled="!valid || (step === 2 && !editedItem.people.length)"
                  >
                    {{ step === 2 ? $t("buttons.saveAndClose") : $t("buttons.next") }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4"> Eliminar un hogar</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el hogar?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">Cancelar</v-btn>
        <v-btn
          color="#03626C"
          variant="flat"
          :loading="loading"
          @click="deleteItemConfirm"
          >Aceptar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogInvite" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 bg-blue-lighten-5">
        {{ $t("home.invite.title") }}
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="inviteForm" v-model="inviteFormValid">
          <v-text-field
            v-model="inviteData.name"
            :label="$t('home.invite.name')"
            :rules="[(v) => !!v || $t('home.invite.nameRequired')]"
            variant="underlined"
            density="comfortable"
          ></v-text-field>
          <v-text-field
            v-model="inviteData.email"
            :label="$t('home.invite.email')"
            :rules="[
              (v) => !!v || $t('home.invite.emailRequired'),
              (v) => /.+@.+/.test(v) || $t('home.invite.emailInvalid'),
            ]"
            variant="underlined"
            density="comfortable"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="closeInviteDialog">
          {{ $t("buttons.cancel") }}
        </v-btn>
        <v-btn
          color="blue"
          variant="flat"
          :loading="inviteLoading"
          :disabled="!inviteFormValid"
          @click="sendInvitation"
        >
          {{ $t("home.invite.send") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import LocalStorageService from "@/LocalStorageService";
import _ from "lodash";
export default {
  data: () => ({
    dialogInvite: false,
    inviteFormValid: false,
    inviteLoading: false,
    inviteData: {
      name: "",
      email: "",
    },
    selectedHomeForInvite: null,
    snackbar: false,
    isFullscreen: false,
    sb_type: "",
    sb_message: "",
    showCode: false,
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    btnLoading: false,
    dialog: false,
    dialogAssignedPeople: false,
    dialogDelete: false,
    file: null,
    imgMiniatura: "",
    homes: [],
    hometypes: [],
    status: [],
    people: [],
    tittlePerson: -1,
    persons: [],
    roles: [],
    data: {},
    selectedItems: {},
    step: 0,
    person_id: null,
    role_id: null,
    dialogAddPeople: false,
    selectedPerson: null, // Persona seleccionada en el formulario
    selectedRole: null, // Rol seleccionado en el formulario
    selectedHome: null, // Rol seleccionado en el formulario
    headers: [
      { title: "Nombre", value: "name", width: "20%" },
      { title: "Dirección", value: "address", width: "25%" },
      { title: "Ranking", value: "percent", width: "5%" },
      { title: "Personas", value: "people", width: "15%" },
      { title: "Tipo", value: "nameHomeType", width: "10%" },
      { title: "Estado", value: "nameStatus", width: "10%" },
      { title: "Acciones", value: "actions", sortable: false, width: "15%" },
    ],
    headersPeople: [
      { title: "Nombre", value: "name", width: "60%" },
      { title: "Rol", value: "roleName", width: "20%" },
      { title: "Acciones", value: "actions", sortable: false, width: "20%" },
    ],
    editedItem: {
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
    },

    defaultItem: {
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
    },

    originalItem: {
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
    },

    tab: null,
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    editedIndex: -1,
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    codeRules: [
      (v) => !v || v.length >= 8 || "El código debe tener al menos 8 caracteres",
      //v => !v || /^[a-zA-Z0-9]+$/.test(v) || 'Solo se permiten letras y números'
    ],
  }),
  computed: {
    isMobile() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm;
    },
    isDesktop() {
      return !this.isMobile;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Nuevo Hogar" : "Editar Hogar";
    },
    formTitlePerson() {
      return this.tittlePerson === -1
        ? "Asignar Personas al Hogar"
        : "Editar rol de la persona";
    },
    imgedit() {
      return this.imgMiniatura;
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
  created() {
    this.tools = [
      {
        name: this.$t("home.addButton"),
        action: () => this.showAdd(),
      },
    ];
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
  },
  methods: {
    openInviteDialog(home) {
  this.selectedHomeForInvite = home;
  this.inviteData = { name: '', email: '' };
  this.dialogInvite = true;
},
closeInviteDialog() {
  this.dialogInvite = false;
  this.inviteData = { name: '', email: '' };
  this.selectedHomeForInvite = null;
},
async sendInvitation() {
  if (!this.inviteFormValid) return;

  this.inviteLoading = true;
  try {
    const payload = {
      home_id: this.selectedHomeForInvite.id,
      homeName: this.selectedHomeForInvite.name,
      name: this.inviteData.name,
      email: this.inviteData.email,
    };

    const result = await handleRequest({
      endpoint: "send-code-home", // ← ajusta al endpoint real de tu backend
      method: "POST",
      data: payload,
    });

    if (result.success) {
      this.showAlert("success", result.message || "Invitación enviada correctamente.", 3000);
      this.closeInviteDialog();
    } else {
      this.showAlert("warning", result.message || "No se pudo enviar la invitación.", 3000);
    }
  } catch (error) {
    this.showAlert("error", "Error inesperado al enviar la invitación.", 3000);
  } finally {
    this.inviteLoading = false;
  }
},
    updateFullscreenMode() {
      this.$nextTick(() => {
        this.isFullscreen = this.isDesktop;
      });
    },
    getImageUrl(imagePath) {
      return `${this.$axios.defaults.baseURL}images/${imagePath}`;
    },
    getDynamicColSize(roleCount) {
      if (roleCount <= 2) return 6; // 2 columnas
      if (roleCount <= 4) return 4; // 3 columnas
      if (roleCount <= 6) return 3; // 4 columnas
      return 2; // Máximo 6 columnas
    },
    nextStep() {
      if (this.step < 2) {
        // 0=basic, 1=details, 2=members
        this.step++;
      } else {
        this.save();
      }
    },
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "brown"; // Color por defecto
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
    async showAssiegnedPeople() {
      this.tittlePerson = -1;
      // Filtrar las personas que no están en editedItem.people usando el 'id' para la comparación
      this.people = this.people.filter((person) => {
        // Verificar si la persona no está en editedItem.people
        return !this.editedItem.people.some(
          (editedPerson) => editedPerson.id === person.id
        );
      });
      this.dialogAssignedPeople = true;
    },
    async showAdd() {
      this.step = 0;
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
        // Crear el objeto de persona con el rol "Padre"
        /*const newMember = {
          id: this.person_id,
          roleId: fatherRole.id,
          roleName: fatherRole.nameRol,
        };*/
        const activeStatus = this.status.find(
          (status) =>
            status.nameStatus === "Activa" || status.nameStatus.toLowerCase() === "activa"
        );

        if (activeStatus) {
          this.editedItem.status_id = activeStatus.id;
        }
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.editedItem.timezone = timezone;
        this.initializeSelections();
        this.dialog = true;
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.file = null;
      this.imgMiniatura = "";
      this.editedIndex = -1;
      this.dialogAddPeople = false;
    },
    filteredPeople(roleId) {
      return this.people.filter((person) => {
        const assignedPerson = this.editedItem.people.find((p) => p.id === person.id);
        return !assignedPerson || assignedPerson.roleId === roleId;
      });
    },
    isPersonSelected(personId, roleId) {
      return this.editedItem.people.some((p) => p.id === personId && p.roleId === roleId);
    },
    getRoleIcon(roleId) {
      const role = this.roles.find((r) => r.id === roleId);
      if (!role) return "mdi-account";

      switch (role.name.toLowerCase()) {
        case "administrador":
          return "mdi-star";
        case "miembro":
          return "mdi-account-group";
        default:
          return "mdi-account";
      }
    },
    updateSelection(role, selectedIds) {
      console.log("Selection changed:", { role, selectedIds });

      // Eliminar personas de este rol que ya no están seleccionadas
      this.editedItem.people = this.editedItem.people.filter(
        (p) => p.roleId !== role.id || selectedIds.includes(p.id)
      );

      // Agregar nuevas selecciones
      selectedIds.forEach((personId) => {
        if (
          !this.editedItem.people.some((p) => p.id === personId && p.roleId === role.id)
        ) {
          const person = this.people.find((p) => p.id === personId);
          if (person) {
            this.editedItem.people.push({
              id: person.id,
              name: person.namePerson,
              image: person.imagePerson,
              roleId: role.id,
              roleName: role.nameRol,
            });
          }
        }
      });

      console.log("Updated people:", this.editedItem.people);
    },
    initializeSelections() {
      // Verificar si person_id no está en editedItem.people
      if (
        this.person_id &&
        !this.editedItem.people.some((p) => p.id === this.person_id)
      ) {
        // Buscar el rol "Responsable" en los roles disponibles
        const responsableRole = this.roles.find((role) => role.name === "Administrador");
        // Buscar la persona correspondiente al person_id (asumiendo que tienes acceso a las personas)
        const person = this.people.find((p) => p.id === this.person_id); // Asegúrate de tener this.people disponible

        if (responsableRole && person) {
          // Agregar la persona con el rol de Responsable y toda la estructura requerida
          this.editedItem.people.push({
            id: person.id,
            name: person.namePerson,
            image: person.imagePerson,
            roleId: responsableRole.id,
            roleName: responsableRole.nameRol,
          });
        }
      }

      // Inicializar selectedItems para cada rol
      this.roles.forEach((role) => {
        this.selectedItems[role.id] = this.editedItem.people
          .filter((p) => p.roleId === role.id)
          .map((p) => p.id);
      });
    },
    closeAssignedPeople() {
      this.dialogAssignedPeople = false;
      this.selectedPerson = null;
      this.selectedRole = null;
      this.tittlePerson = -1;
    },
    saveAssignedPeople() {
      if (this.selectedPerson && this.selectedRole) {
        const person = this.people.find((p) => p.id === this.selectedPerson);
        const role = this.roles.find((r) => r.id === this.selectedRole);

        if (!person || !role) {
          console.error("Persona o rol no encontrado.");
          return;
        }

        // Crear un nuevo objeto con los datos actuales
        const newPerson = {
          id: person.id,
          name: person.namePerson,
          image: person.imagePerson,
          roleId: role.id,
          roleName: role.nameRol,
        };
        // Verificar si la relación ya existe en editedItem.people
        const existingPersonIndex = this.editedItem.people.findIndex(
          (p) => p.id === newPerson.id
        );

        if (existingPersonIndex === -1) {
          // No existe, por lo tanto, se agrega uno nuevo
          this.editedItem.people.push(newPerson);
        } else {
          // Existe, por lo tanto se edita el existente
          this.editedItem.people.splice(existingPersonIndex, 1, newPerson); // Actualiza el elemento en el array
        }
      }

      // Reiniciar selección y cerrar diálogo
      this.closeAssignedPeople();
    },
    editItemPeople(item) {
      this.selectedPerson = item.id;
      this.selectedRole = item.roleId;
      this.dialogAssignedPeople = true;
      this.tittlePerson = 1;
    },
    deleteItemPeople(item) {
      const index = this.editedItem.people.findIndex((p) => p.id === item.id);
      if (index !== -1) {
        this.editedItem.people.splice(index, 1);
      }
    },
    async initialize() {
      this.data = {};
      try {
        this.loading = true;
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
          this.showAlert(
            "success",
            result.message || "No hay hogares disponibles.",
            3000
          );
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las tareas.",
          3000
        );
      } finally {
        this.loading = false;
      }
    },
    getTypeIcon(type) {
      switch (type) {
        case "home":
          return "mdi-clipboard-text"; // Ícono para tareas
        case "Sistema":
          return "mdi-cog"; // Ícono para productos
        case "Home":
          return "mdi-home"; // Ícono para hogar
        default:
          return "mdi-help-circle"; // Ícono por defecto
      }
    },
    getTypeDetails(type) {
      switch (type) {
        case "home":
          return { icon: "mdi-clipboard-text", name: "Tarea" }; // Ícono y nombre para tareas
        case "Sistema":
          return { icon: "mdi-cog", name: "Sistema" }; // Ícono y nombre para sistema
        case "Home":
          return { icon: "mdi-home", name: "Hogar" }; // Ícono y nombre para hogar
        default:
          return { icon: "mdi-help-circle", name: "Desconocido" }; // Ícono y nombre por defecto
      }
    },
    /*getTypeColor(type) {
      switch (type) {
        case "Task":
          return "#FFB300"; // Color sugerente para tareas (amarillo)
        case "Sistema":
          return "#43A047"; // Color sugerente para productos (verde)
        case "Home":
          return "#03626C"; // Color base para hogar
        default:
          return "#E0E0E0"; // Color gris claro para otros tipos
      }
    },*/
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
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
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            if (key === "people") {
              // Transformar el campo `people`
              obj[key] = this.editedItem.people.map((person) => ({
                person_id: Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName,
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }

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
              endpoint: "home",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
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
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos del hogar.", 3000);
        }
      } else {
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
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              (key !== "people"
                ? this.editedItem[key] !== this.originalItem[key]
                : this.arePeopleDifferent(this.originalItem[key], this.editedItem[key])) // Compara el array people
          )
          .reduce((obj, key) => {
            if (key === "people") {
              // Transformar el campo `people`
              obj[key] = this.editedItem.people.map((person) => ({
                person_id: person.id ? Number(person.id) : Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId), // Asegurar que sea un número
                roleName: person.roleName,
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
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
              endpoint: "home-update",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.editedIndex = -1;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.editedIndex = -1;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.editedIndex = -1;
          this.loading = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    arePeopleDifferent(originalPeople, editedPeople) {
      // Convertir ambos arrays en cadenas de texto para una comparación profunda
      const sortedOriginal = [...originalPeople].sort((a, b) => a.id - b.id);
      const sortedEdited = [...editedPeople].sort((a, b) => a.id - b.id);
      // Comparar las cadenas generadas
      return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.btnLoading = true;
      this.step = 0;
      // Filtrar las personas que tengan 'select' igual a 1
      //const selectedPeople = item.people.filter(person => person.select === 1);

      // Asignar a originalItem y editedItem solo las personas seleccionadas
      this.originalItem = _.cloneDeep(item);
      this.editedItem = _.cloneDeep(item);

      // Asignamos las personas seleccionadas a las propiedades 'people' de los dos objetos
      //this.originalItem.people = _.cloneDeep(selectedPeople); // Aseguramos una copia profunda
      //this.editedItem.people = _.cloneDeep(selectedPeople); // Aseguramos una copia profunda
      this.file = null;
      // Crear la imagen y configurar el src
      const img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${item.image}`; // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.image}`;
        } catch (error) {
          this.showAlert("error", "Error al cargar la imagen.", 3000);
        }
      };
      this.data = {};
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
          this.btnLoading = false;
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.btnLoading = false;
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        if (this.editedItem.timezone === null) {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          this.editedItem.timezone = timezone;
        }
        this.initializeSelections();
        this.dialog = true;
        this.btnLoading = false;
      }
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "home-destroy",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.loading = false;
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
      } finally {
        this.loading = false;
        this.closeDelete();
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
      this.editedItem.image = file;
      //console.log(this.editedItem.image_cardgift);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    //asignar personas
    async addPeople(item) {
      this.editedIndex = 1;
      this.selectedHome = item.id;
      this.originalItem = _.cloneDeep(item);
      this.editedItem = _.cloneDeep(item);

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
        this.initializeSelections();
        this.dialogAddPeople = true;
      }
    },
    closeAddPeople() {
      this.person_id = null;
      this.role_id = null;
      this.selectedHome = null;
      this.dialogAddPeople = false;
    },
    async saveAddPeople() {
      this.valid = false;
      this.data = {};
      this.data.person_id = this.person_id;
      this.data.role_id = this.role_id;
      this.data.home_id = this.selectedHome;
      // Buscar el rol correspondiente en el array roles
      const selectedRole = this.roles.find((role) => role.id === this.role_id);

      // Agregar el nombre del rol a this.data
      if (selectedRole) {
        this.data.roleName = selectedRole.nameRol;
      } else {
        this.data.roleName = "Rol no encontrado"; // O algún valor por defecto
      }
      try {
        const result = await handleRequest({
          endpoint: "home-person",
          method: "POST",
          data: this.data,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.showAlert("warning", result.message, 3000);
          this.closeAddPeople();
        }
      } catch (error) {
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
        this.closeAddPeople();
      } finally {
        this.closeAddPeople();
      }
    },
  },
};
</script>
<style scoped>
.fullscreen-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
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

/* Solo en móvil: activar scroll horizontal */
.responsive-data-table-wrapper.mobile-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* En móvil: forzar ancho mínimo para que haya algo que scrollear */
.responsive-data-table-wrapper.mobile-scroll :deep(.v-data-table) {
  min-width: 800px;
}

/* En desktop: asegurar que no haya scroll innecesario */
@media (min-width: 960px) {
  .responsive-data-table-wrapper :deep(.v-data-table) {
    min-width: auto;
    overflow-x: hidden;
  }
}

.tools-bar {
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 2px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 1;
}

.icono-concavo::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 8px;
  background: transparent;
}
.icono-concavo:hover .img-concava {
  filter: brightness(1.1);
}
.img-concava {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra el espacio */
  border-radius: 8px; /* Para que coincida con el contenedor */
}
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* OCULTAR HEADER DE v-data-table - Vuetify 3.4.7 */
/* Máxima especificidad para ocultar el thead */
.v-data-table > .v-data-table__wrapper > table > thead,
.v-data-table > .v-data-table__wrapper > .v-table > table > thead,
.v-data-table__content > table > thead,
.v-data-table__content > thead,
table.v-table > thead,
.v-table > .v-table__wrapper > table > thead {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-spacing: 0 !important;
  border-collapse: collapse !important;
}
.hidden-header .v-data-table__content > table > thead {
  display: none !important;
}
</style>
