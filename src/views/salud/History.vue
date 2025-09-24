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

  <v-container>
    <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-row dense>
          <!-- Foto del usuario -->
          <v-col cols="auto">
            <!-- Avatar -->
            <v-avatar size="80" class="me-4">
              <v-img
                :src="`${$axios.defaults.baseURL}images/${imageUrl}`"
                alt="Foto del paciente"
              />
            </v-avatar>
          </v-col>

          <!-- Datos del paciente (contenedor principal clickeable) -->
          <v-col>
            <v-menu
              v-model="menuPerson"
              :close-on-content-click="false"
              location="bottom start"
              offset-y
              :min-width="null"
              :max-width="null"
              class="rounded-lg"
            >
              <!-- 🔥 ACTIVADOR: Todo el contenedor de datos + avatar + ícono -->
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="cursor-pointer d-flex align-center"
                  style="max-width: fit-content; gap: 12px"
                >
                  <!-- Datos del paciente (apilados verticalmente) -->
                  <div class="flex-grow-1">
                    <!-- Nombre -->
                    <div class="text-body-2 font-weight-bold mb-1">
                      {{ selectedPerson.name }}
                    </div>

                    <!-- Edad -->
                    <div class="d-flex align-center justify-space-between mb-1">
                      <div class="text-body-2 text-grey-darken-1">
                        {{
                          selectedPerson.age !== null
                            ? $t("personDetails.age.withValue", {
                                age: selectedPerson.age,
                              })
                            : $t("personDetails.age.withoutValue")
                        }}
                      </div>
                    </div>

                    <!-- Tipo de documento -->
                    <div class="d-flex align-center justify-space-between mb-1">
                      <div class="text-body-2 text-grey-darken-1">
                        {{
                          selectedPerson.documentType
                            ? $t("personDetails.documentType.withValue", {
                                type: selectedPerson.documentType,
                              })
                            : $t("personDetails.documentType.withoutValue")
                        }}
                      </div>
                    </div>

                    <!-- Número de documento (ÚLTIMA LÍNEA) -->
                    <div class="d-flex align-center justify-space-between">
                      <div class="text-body-2 text-grey-darken-1">
                        {{
                          selectedPerson.documentNumber !== null
                            ? $t("personDetails.documentNumber.withValue", {
                                number: selectedPerson.documentNumber,
                              })
                            : $t("personDetails.documentNumber.withoutValue")
                        }}
                      </div>
                    </div>
                  </div>

                  <!-- ✅ ÍCONO DE DESPLIEGUE: A LA DERECHA, CENTRADO VERTICALMENTE CON TODO EL CONTENIDO -->
                  <v-icon
                    :class="{ rotate: menuPerson }"
                    class="transition-fast-in-fast-out ms-2"
                    size="20"
                    color="grey"
                    style="vertical-align: middle; flex-shrink: 0"
                    v-if="this.type === 'Hogar'"
                  >
                    mdi-menu-down
                  </v-icon>
                </div>
              </template>

              <!-- MENÚ DESPLEGABLE -->
              <v-card
                max-width="900px"
                class="mx-auto rounded-lg"
                v-if="this.type === 'Hogar'"
              >
                <v-card-text>
                  <v-container fluid>
                    <v-row justify="center">
                      <!-- TARJETAS UNIFORMES -->
                      <v-col
                        v-for="person in homePerson"
                        :key="person.id"
                        cols="auto"
                        min-width="200px"
                        class="pa-2"
                      >
                        <v-card
                          class="text-center store-card"
                          elevation="3"
                          rounded="lg"
                          width="200px"
                          height="auto"
                          @click="selectPerson(person)"
                          :class="{
                            'bg-blue-lighten-5': selectedPerson?.id === person.id,
                          }"
                        >
                          <!-- Imagen ajustada dentro de contenedor fijo -->
                          <div class="icon-wrapper rounded-lg mb-3">
                            <v-img
                              :src="`${$axios.defaults.baseURL}images/${
                                person.image
                              }?t=${getCacheTimestamp()}`"
                              alt="Foto de la persona"
                              width="100%"
                              height="130"
                              cover
                              class="rounded-lg"
                            />
                          </div>

                          <!-- Texto centrado y con espacio fijo -->
                          <div
                            class="store-name"
                            style="
                              font-size: 0.875rem;
                              font-weight: 500;
                              margin-top: 8px;
                              height: 1.2em;
                              line-height: 1.2em;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            "
                          >
                            {{ person.name }}
                          </div>

                          <div
                            class="store-products"
                            style="
                              font-size: 0.75rem;
                              color: #757575;
                              margin-top: 4px;
                              height: 1.2em;
                              line-height: 1.2em;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            "
                          >
                            {{
                              person.age !== null
                                ? $t("personDetails.age.withValue", { age: person.age })
                                : $t("personDetails.age.withoutValue")
                            }}
                          </div>

                          <!-- Check de selección -->
                          <v-icon
                            v-if="selectedPerson?.id === person.id"
                            color="primary"
                            size="18"
                            class="position-absolute"
                            style="top: 8px; right: 8px"
                          >
                            mdi-check-circle
                          </v-icon>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <div class="d-flex align-right justify-end pa-2">
              <v-switch
                v-model="type"
                true-value="Personal"
                false-value="Hogar"
                :base-color="switchColor"
                :color="switchColor"
                hide-details
                inset
                class="mb-4 font-weight-bold"
              >
                <template v-slot:label>
                  <span class="text-body-1" :style="{ color: switchColor }">
                    {{ getCurrentName }}
                  </span>
                </template>
              </v-switch>
            </div>
          </v-col>
        </v-row>
        <!-- Fila completa para herramientas -->
        <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
          <v-btn
            v-for="tool in tools"
            :key="tool.name"
            @click="tool.action"
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

        <v-row dense class="mt-4">
          <v-col cols="12" sm="12" md="12">
            <v-card class="mx-auto" elevation="1" rounded="lg" border flat>
              <v-list-item height="60">
                <template v-slot:prepend>
                  <v-avatar size="40" color="teal">
                    <v-icon icon="mdi-calendar"></v-icon>
                  </v-avatar>
                </template>

                <template v-slot:title> Salud Familiar</template>
                <template v-slot:subtitle>
                  {{ new Date().toLocaleDateString() }}
                </template>
                <template v-slot:append>
                  <v-chip class="ma-2" color="teal" label rounded="lg">
                    <v-icon icon="mdi-emoticon" start></v-icon>
                    <div class="text-subtitle-2">Estable</div>
                  </v-chip>
                </template>
              </v-list-item>

              <v-divider></v-divider>

              <v-card-text class="pa-4">
                <!-- Bloque de alerta -->
                <v-alert
                  color="warning"
                  variant="tonal"
                  border="start"
                  icon="mdi-alert-circle"
                  rounded="lg"
                  class="mb-4"
                  @click="openModal('consultation')"
                  style="cursor: pointer"
                >
                  ⚠️ {{this.totalMembersWithConsultations}} miembro{{ this.totalMembersWithConsultations !== 1  ? 's' : ''}} con control{{ this.totalMembersWithConsultations !== 1  ? 's' : ''}} pendiente{{ this.totalMembersWithConsultations !== 1  ? 's' : ''}}. Revisa la alerta.
                </v-alert>

                <!-- Fila Estado General + KPI Circulares -->
                <v-row dense>
                  <!-- KPI Circulares -->
                  <v-col cols="12" sm="12">
                    <v-row dense justify="space-between">
                      <!-- Peso saludable -->
                      <v-col cols="6" sm="6" md="3">
                        <v-tooltip top>
                          <template v-slot:activator="{ props }">
                            <v-card
                              class="pa-4 text-center"
                              rounded="lg"
                              outlined
                              v-bind="props"
                              @click="openModal('weight')"
                              style="cursor: pointer"
                            >
                              <v-progress-circular
                                :model-value="
                                  this.healthMetrics.totalMembers
                                    ? (this.healthMetrics.countHealthyWeight /
                                        this.healthMetrics.totalMembers) *
                                      100
                                    : 0
                                "
                                size="80"
                                width="8"
                                color="indigo"
                              >
                                <strong
                                  >{{ this.healthMetrics.countHealthyWeight }}/{{
                                    this.healthMetrics.totalMembers
                                  }}</strong
                                >
                              </v-progress-circular>
                              <div class="mt-2 font-weight-medium">Peso saludable</div>
                            </v-card>
                          </template>
                          <span
                            >{{ this.healthMetrics.countHealthyWeight }} de
                            {{ this.healthMetrics.totalMembers }} miembros tienen peso
                            saludable</span
                          >
                        </v-tooltip>
                      </v-col>

                      <!-- Presión arterial -->
                      <v-col cols="6" sm="6" md="3">
                        <v-tooltip top>
                          <template v-slot:activator="{ props }">
                            <v-card
                              class="pa-4 text-center"
                              rounded="lg"
                              outlined
                              v-bind="props"
                              @click="openModal('bloodpresure')"
                              style="cursor: pointer"
                            >
                              <v-progress-circular
                                :model-value="
                                  this.healthMetrics.totalMembers
                                    ? (this.healthMetrics.countNormalBloodPressure /
                                        this.healthMetrics.totalMembers) *
                                      100
                                    : 0
                                "
                                size="80"
                                width="8"
                                color="red-darken-2"
                              >
                                <strong
                                  >{{ this.healthMetrics.countNormalBloodPressure }}/{{
                                    this.healthMetrics.totalMembers
                                  }}</strong
                                >
                              </v-progress-circular>
                              <div class="mt-2 font-weight-medium">Presión normal</div>
                            </v-card>
                          </template>
                          <span
                            >{{ this.healthMetrics.countNormalBloodPressure }} de
                            {{ this.healthMetrics.totalMembers }} miembros tienen presión
                            arterial dentro del rango normal</span
                          >
                        </v-tooltip>
                      </v-col>

                      <!-- Vacunas completas -->
                      <v-col cols="6" sm="6" md="3">
                        <v-tooltip top>
                          <template v-slot:activator="{ props }">
                            <v-card
                              class="pa-4 text-center"
                              rounded="lg"
                              outlined
                              v-bind="props"
                              @click="openModal('vaccination')"
                              style="cursor: pointer"
                            >
                              <v-progress-circular
                                :model-value="
                                  this.healthMetrics.totalMembers
                                    ? (this.householdVaccination
                                        .totalPeopleWithPendingVaccines /
                                        this.healthMetrics.totalMembers) *
                                      100
                                    : 0
                                "
                                size="80"
                                width="8"
                                color="green-darken-2"
                              >
                                <strong
                                  >{{
                                    this.householdVaccination
                                      .totalPeopleWithPendingVaccines
                                  }}/{{ this.healthMetrics.totalMembers }}</strong
                                >
                              </v-progress-circular>
                              <div class="mt-2 font-weight-medium">Vacunas</div>
                            </v-card>
                          </template>
                          <span
                            >{{
                              this.householdVaccination.totalPeopleWithPendingVaccines
                            }}
                            de {{ this.healthMetrics.totalMembers }} miembros tienen
                            vacunas pendientes</span
                          >
                        </v-tooltip>
                      </v-col>

                      <!-- Citas médicas -->
                      <v-col cols="6" sm="6" md="3">
                        <v-tooltip top>
                          <template v-slot:activator="{ props }">
                            <v-card
                              class="pa-4 text-center"
                              rounded="lg"
                              outlined
                              v-bind="props"
                              style="cursor: pointer"
                              @click="openModal('consultation')"
                            >
                              <!--
                              @click="this.dialogCardConsultations = true"-->
                              <v-progress-circular
                                :model-value="
                                  this.healthMetrics.totalMembers
                                    ? (this.totalMembersWithConsultations /
                                        this.healthMetrics.totalMembers) *
                                      100
                                    : 0
                                "
                                size="80"
                                width="8"
                                color="amber-darken-3"
                              >
                                <strong
                                  >{{ this.totalMembersWithConsultations }}/{{
                                    this.membersConsultation?.length || 0
                                  }}</strong
                                >
                              </v-progress-circular>
                              <div class="mt-2 font-weight-medium">Citas esta semana</div>
                            </v-card>
                          </template>
                          <span>{{ this.tooltipText }}</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row dense class="mt-3">
          <v-col cols="12">
            <component
              :is="getComponentByType(selectedView)"
              v-if="selectedView"
              :key="selectedView"
            />
          </v-col>
        </v-row>
        <SuggestionsList
          :items="suggestions"
          :title="$t('finances.sections.suggestions')"
          icon="mdi-finance"
          v-if="this.type === 'Hogar'"
        >
          <template #detail="{ taskData, onClose }">
            <ChatTaskSalud :taskData="taskData" @close-dialog="onClose" />
          </template>
        </SuggestionsList>
      </v-card-text>
    </v-card>
  </v-container>
  <!--Datos de las consultas-->
  <v-dialog v-model="dialogVitalSigns" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text class="bg-grey-lighten-4">
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <VitalSigns :selectedPerson="selectedPerson" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeVitalSigns">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="dialogComplementaryData"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-text class="bg-grey-lighten-4">
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <ComplementaryData :selectedPerson="selectedPerson" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeComplementaryData">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="dialogMedicalInformationData"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-text class="bg-grey-lighten-4">
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <MedicalInformation :selectedPerson="selectedPerson" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeMedicalInformation">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogChatTask" fullscreen transition="dialog-bottom-transition">
    <v-card class="bg-grey-lighten-4">
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatTaskSalud :taskData="currentTask" @close-dialog="closeDialgChat()" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogPerson">
    <v-card max-width="900px" class="mx-auto">
      <v-card-title class="text-body-2"> Seleccionar Miembro </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row justify="center">
            <v-col
              v-for="person in homePerson"
              :key="person.id"
              cols="auto"
              min-width="200px"
            >
              <v-card
                class="text-center store-card"
                elevation="3"
                rounded="lg"
                @click="selectPerson(person)"
              >
                <div class="icon-wrapper mb-3">
                  <v-img
                    :src="`${$axios.defaults.baseURL}images/${
                      person.image
                    }?t=${getCacheTimestamp()}`"
                    alt="Foto de Mascota"
                    width="100%"
                    height="150"
                    contain
                  />
                </div>
                <div class="store-name">{{ person.name }}</div>
                <div class="store-products">{{ person.breed }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogWeight"
    max-width="55%"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="pa-1">
      <v-card-title class="text-h6 font-weight-bold">
        {{ $t("home.steps.members.title") }}
      </v-card-title>

      <v-card-text>
        <v-card-title class="d-flex flex-wrap align-right pb-2">
          <!-- Spacer (solo visible en md+) -->
          <v-spacer class="d-none d-md-block"></v-spacer>
          <div class="flex-grow-1" style="max-width: 300px">
            <v-text-field
              v-model="searchWeight"
              density="compact"
              :label="$t('dataTable.search')"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              hide-details
              single-line
              flat
            ></v-text-field>
          </div>
        </v-card-title>

        <v-data-table
          :headers="headersWeight"
          :items="weightData"
          :search="searchWeight"
          :items-per-page-text="$t('dataTable.itemsPerPageText')"
          :no-data-text="$t('dataTable.noDataText')"
          :loading-text="$t('dataTable.loadingText')"
          :loading="loading"
          :hide-default-header="true"
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
          <!-- Encabezado fijo -->
          <template v-slot:top>
            <v-card
              :elevation="1"
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
                <!-- Fecha / Periodo (7%) -->
                <div style="width: 40%; min-width: 0" class="text-left">
                  {{ $t("home.membersTable.name") }}
                </div>

                <!-- Descripción + Severidad (34%) -->
                <div style="width: 15%; min-width: 0" class="text-left">
                  {{ $t("physicalExam.fields.height") }}
                </div>

                <!-- Estado (15%) -->
                <div style="width: 15%; min-width: 0" class="text-left">
                  {{ $t("physicalExam.fields.weight") }}
                </div>

                <div style="width: 22%; min-width: 0" class="text-left">
                  {{ $t("physicalExam.fields.bmi") }}
                </div>

                <!-- Detalles (34%) -->
                <div style="width: 7%; min-width: 0" class="text-left">
                  {{ $t("taskForm.fields.status") }}
                </div>
              </v-card-text>
            </v-card>
          </template>

          <!-- Item (fila) -->
          <template v-slot:item="slotProps">
            <tr>
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
                    <!-- Descripción + Severidad (34%) -->
                    <div style="width: 40%; min-width: 0" class="d-flex align-left">
                      <v-avatar
                        size="48"
                        class="mr-1 icono-concavo"
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
                      <div class="d-flex flex-column justify-center" style="min-width: 0">
                        <div class="font-weight-bold text-body-2 text-truncate">
                          <span>{{ slotProps.item.name }}</span>
                          <v-tooltip
                            activator="parent"
                            location="bottom"
                            max-width="350px"
                          >
                            <span style="white-space: normal; word-break: break-word">
                              {{ slotProps.item.name }}
                            </span>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>

                    <!-- Estado (15%) -->
                    <div
                      style="width: 15%; min-width: 0"
                      class="text-body-2 text-truncate"
                    >
                      <span>{{ slotProps.item.weight }}</span>
                    </div>

                    <div
                      style="width: 15%; min-width: 0"
                      class="text-body-2 text-truncate"
                    >
                      <span>{{ slotProps.item.height }}</span>
                    </div>
                    <!-- Detalles (34%) -->
                    <div
                      style="width: 22%; min-width: 0"
                      class="text-body-2 text-truncate"
                    >
                      <span>{{ slotProps.item.bmi }}</span>
                    </div>

                    <div
                      style="
                        width: 7%;
                        min-width: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <v-switch
                        :model-value="slotProps.item.isHealthyWeight"
                        readonly
                        hide-details
                        density="compact"
                        :color="slotProps.item.isHealthyWeight ? 'success' : 'red'"
                        :base-color="slotProps.item.isHealthyWeight ? 'success' : 'red'"
                        inset
                      >
                      </v-switch>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{
                            slotProps.item.isHealthyWeight
                              ? "Peso saludable"
                              : "Peso no saludable"
                          }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-card-text>
                </v-card>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="closeModal()">
          {{ $t("buttons.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogBloodPresure"
    max-width="45%"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="pa-1">
      <v-card-title class="text-h6 font-weight-bold">
        {{ $t("home.steps.members.title") }}
      </v-card-title>

      <v-card-text>
        <v-card-title class="d-flex flex-wrap align-right pb-2">
          <!-- Spacer (solo visible en md+) -->
          <v-spacer class="d-none d-md-block"></v-spacer>
          <div class="flex-grow-1" style="max-width: 300px">
            <v-text-field
              v-model="searchBloodPresure"
              density="compact"
              :label="$t('dataTable.search')"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              hide-details
              single-line
              flat
            ></v-text-field>
          </div>
        </v-card-title>

        <v-data-table
          :headers="headersBloodPresure"
          :items="bloodPresureData"
          :search="searchBloodPresure"
          :items-per-page-text="$t('dataTable.itemsPerPageText')"
          :no-data-text="$t('dataTable.noDataText')"
          :loading-text="$t('dataTable.loadingText')"
          :loading="loading"
          :hide-default-header="true"
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
          <!-- Encabezado fijo -->
          <template v-slot:top>
            <v-card
              :elevation="1"
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
                <!-- Fecha / Periodo (7%) -->
                <div style="width: 73%; min-width: 0" class="text-left">
                  {{ $t("home.membersTable.name") }}
                </div>

                <!-- Descripción + Severidad (34%) -->
                <div style="width: 20%; min-width: 0" class="text-left">
                  {{ $t("physicalExam.fields.blood_pressure") }}
                </div>


                <!-- Detalles (34%) -->
                <div style="width: 7%; min-width: 0" class="text-left">
                  {{ $t("taskForm.fields.status") }}
                </div>
              </v-card-text>
            </v-card>
          </template>

          <!-- Item (fila) -->
          <template v-slot:item="slotProps">
            <tr>
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
                    <!-- Descripción + Severidad (34%) -->
                    <div style="width: 73%; min-width: 0" class="d-flex align-left">
                      <v-avatar
                        size="48"
                        class="mr-1 icono-concavo"
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
                      <div class="d-flex flex-column justify-center" style="min-width: 0">
                        <div class="font-weight-bold text-body-2 text-truncate">
                          <span>{{ slotProps.item.name }}</span>
                          <v-tooltip
                            activator="parent"
                            location="bottom"
                            max-width="350px"
                          >
                            <span style="white-space: normal; word-break: break-word">
                              {{ slotProps.item.name }}
                            </span>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>

                    <!-- Estado (15%) -->
                    <div
                      style="width: 20%; min-width: 0"
                      class="text-body-2 text-truncate"
                    >
                      <span>{{ slotProps.item.bloodPressure }}</span>
                    </div>

                    <div
                      style="
                        width: 7%;
                        min-width: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <v-switch
                        :model-value="slotProps.item.isNormalBloodPressure"
                        readonly
                        hide-details
                        density="compact"
                        :color="slotProps.item.isNormalBloodPressure ? 'success' : 'red'"
                        :base-color="slotProps.item.isNormalBloodPressure ? 'success' : 'red'"
                        inset
                      >
                      </v-switch>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{
                            slotProps.item.isNormalBloodPressure
                              ? "Presión dentro del rango normal"
                              : "Presión fuera del rango normal"
                          }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-card-text>
                </v-card>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="closeModal()">
          {{ $t("buttons.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogConsultation"
    max-width="45%"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="pa-1">
      <v-card-title class="text-h6 font-weight-bold">
        {{ $t("home.steps.members.title") }}
      </v-card-title>

      <v-card-text>
        <v-card-title class="d-flex flex-wrap align-right pb-2">
          <!-- Spacer (solo visible en md+) -->
          <v-spacer class="d-none d-md-block"></v-spacer>
          <div class="flex-grow-1" style="max-width: 300px">
            <v-text-field
              v-model="searchConsultation"
              density="compact"
              :label="$t('dataTable.search')"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              hide-details
              single-line
              flat
            ></v-text-field>
          </div>
        </v-card-title>

        <v-data-table
        :headers="headersConsultation"
        :items="membersConsultation"
        :search="searchConsultation"
        :items-per-page-text="$t('dataTable.itemsPerPageText')"
        :no-data-text="$t('dataTable.noDataText')"
        :loading-text="$t('dataTable.loadingText')"
        :loading="loading"
        :hide-default-header="true"
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
        <!-- Encabezado fijo (sin cambios) -->
        <template v-slot:top>
          <v-card
            :elevation="1"
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
              <div style="width: 85%; min-width: 0" class="text-left">
                {{ $t("home.membersTable.name") }}
              </div>
              <div style="width: 10%; min-width: 0" class="text-center">
                {{ $t("taskForm.fields.status") }}
              </div>
              <div style="width: 5%; min-width: 0" class="text-left">
                
              </div>
            </v-card-text>
          </v-card>
        </template>

        <!-- Fila principal -->
        <template v-slot:item="{ item }">
        <tr>
          <td colspan="100%" style="padding: 0; border: none">
            <v-card
              class="mb-2 mx-1 rounded-lg"
              elevation="1"
              density="comfortable"
              flat
            >
              <v-card-text class="d-flex align-center pa-2" style="width: 100%; min-width: 0">
                <!-- Nombre + imagen -->
                <div style="width: 85%; min-width: 0" class="d-flex align-center">
                  <v-avatar
                    size="48"
                    class="mr-1 icono-concavo"
                    color="grey-lighten-4"
                    style="flex-shrink: 0"
                  >
                    <v-img
                      :src="getImageUrl(item.image)"
                      cover
                      class="icono-concavo"
                    />
                  </v-avatar>

                  <div class="d-flex flex-column justify-center" style="min-width: 0">
                    <div class="font-weight-bold text-body-2 text-truncate">
                      <span>{{ item.name }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ item.name }}
                        </span>
                      </v-tooltip>
                    </div>
                    <div class="text-caption text--secondary">
                      {{ item.totalConsultations }} consulta{{ item.totalConsultations !== 1 ? 's' : '' }}
                    </div>
                  </div>
                </div>

                <!-- Switch de estado -->
                <div
                  style="width: 10%; min-width: 0; display: flex; align-items: center; justify-content: center"
                >
                  <v-switch
                    v-if="item.hasConsultations !== undefined"
                    :model-value="item.hasConsultations"
                    readonly
                    hide-details
                    density="compact"
                    :color="item.hasConsultations ? 'red' : 'success'"
                    :base-color="item.hasConsultations ? 'red' : 'success'"
                    inset
                  />
                  <v-tooltip
                    v-if="item.hasConsultations !== undefined"
                    activator="parent"
                    location="bottom"
                    max-width="350px"
                  >
                    <span style="white-space: normal; word-break: break-word">
                      {{
                        item.hasConsultations
                          ? "Tiene consultas médicas esta semana"
                          : "No tiene consultas médicas esta semana"
                      }}
                    </span>
                  </v-tooltip>
                  <span v-else class="text--disabled">—</span>
                </div>

                <!-- Ícono de expansión AL FINAL (solo si tiene consultas) -->
                <div style="width: 5%; min-width: 0; display: flex; justify-content: center">
                  <v-btn
                    v-if="item.hasConsultations"
                    icon
                    size="small"
                    variant="text"
                    @click.stop="toggleExpand(item.id)"
                    :class="{ 'rotate-180': isExpanded(item.id) }"
                    style="transition: transform 0.2s"
                  >
                    <v-icon size="small">mdi-chevron-down</v-icon>
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </td>
        </tr>

          <!-- Fila expandida -->
          <tr v-if="isExpanded(item.id) && item.hasConsultations">
            <td colspan="100%" class="pa-0" style="background: #fafafa">
              <div class="px-2 pb-4">
                <v-card
                  v-for="consultation in item.consultations"
                  :key="consultation.id"
                  class="mb-2 mx-1 rounded-lg"
                  elevation="1"
                  density="comfortable"
                  flat
                >
                  <v-card-text class="d-flex flex-wrap align-center pa-2" style="width: 100%">
                    <div style="width: 7%" class="text-body-2">
                      <v-avatar
                            class="mr-2 icono-concavo"
                            :class="`bg-${getTypeColor(consultation.typeName)}`"
                            :style="{
                              'min-height': '48px',
                              'min-width': '48px',
                              'border-radius': '8px',
                              'font-size': '0.90em'
                            }"
                          >
                            <div class="text-body-3 font-weight-medium">
                              {{ formatIntuitiveDate(consultation.date) }}
                            </div>
                          </v-avatar>
                    </div>
                    <div style="width: 63%" class="text-body-2 text-truncate ml-2">
                      <div class="text-body-2 text-truncate">
                      {{ consultation.typeName }}
                    </div>
                    <div class="text-caption text-grey-darken-1 text-truncate mt-1">
                      {{ consultation.reason || $t('consultations.fields.reason') }}
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t('consultations.fields.reason') }}: {{ consultation.reason }}
                        </span>
                      </v-tooltip>
                    </div>
                    </div>
                    <div style="width: 20%" class="text-body-2 text-truncate">
                      {{ consultation.professional }}
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t('consultations.fields.profesional') }}: {{ consultation.professional }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="closeModal()">
          {{ $t("buttons.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogVaccination"
    max-width="45%"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="pa-1">
      <v-card-title class="text-h6 font-weight-bold">
        {{ $t("home.steps.members.title") }}
      </v-card-title>

      <v-card-text>
        <v-card-title class="d-flex flex-wrap align-right pb-2">
          <!-- Spacer (solo visible en md+) -->
          <v-spacer class="d-none d-md-block"></v-spacer>
          <div class="flex-grow-1" style="max-width: 300px">
            <v-text-field
              v-model="searchVaccination"
              density="compact"
              :label="$t('dataTable.search')"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              hide-details
              single-line
              flat
            ></v-text-field>
          </div>
        </v-card-title>

        <v-data-table
        :headers="headersVaccination"
        :items="vaccinationData"
        :search="searchVaccination"
        :items-per-page-text="$t('dataTable.itemsPerPageText')"
        :no-data-text="$t('dataTable.noDataText')"
        :loading-text="$t('dataTable.loadingText')"
        :loading="loading"
        :hide-default-header="true"
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
        <!-- Encabezado fijo (sin cambios) -->
        <template v-slot:top>
          <v-card
            :elevation="1"
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
              <div style="width: 85%; min-width: 0" class="text-left">
                {{ $t("home.membersTable.name") }}
              </div>
              <div style="width: 10%; min-width: 0" class="text-center">
                {{ $t("taskForm.fields.status") }}
              </div>
              <div style="width: 5%; min-width: 0" class="text-left">
                
              </div>
            </v-card-text>
          </v-card>
        </template>

        <!-- Fila principal -->
        <template v-slot:item="{ item }">
        <tr>
          <td colspan="100%" style="padding: 0; border: none">
            <v-card
              class="mb-2 mx-1 rounded-lg"
              elevation="1"
              density="comfortable"
              flat
            >
              <v-card-text class="d-flex align-center pa-2" style="width: 100%; min-width: 0">
                <!-- Nombre + imagen -->
                <div style="width: 85%; min-width: 0" class="d-flex align-center">
                  <v-avatar
                    size="48"
                    class="mr-1 icono-concavo"
                    color="grey-lighten-4"
                    style="flex-shrink: 0"
                  >
                    <v-img
                      :src="getImageUrl(item.image)"
                      cover
                      class="icono-concavo"
                    />
                  </v-avatar>

                  <div class="d-flex flex-column justify-center" style="min-width: 0">
                    <div class="font-weight-bold text-body-2 text-truncate">
                      <span>{{ item.name }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ item.name }}
                        </span>
                      </v-tooltip>
                    </div>
                    <div class="text-caption text--secondary">
                      {{ item.totalVaccinations }} vacuna{{ item.totalVaccinations !== 1 ? 's' : '' }}
                    </div>
                  </div>
                </div>

                <!-- Switch de estado -->
                <div
                  style="width: 10%; min-width: 0; display: flex; align-items: center; justify-content: center"
                >
                  <v-switch
                    v-if="item.hasPendingVaccines !== undefined"
                    :model-value="item.hasPendingVaccines"
                    readonly
                    hide-details
                    density="compact"
                    :color="item.hasPendingVaccines ? 'red' : 'success'"
                    :base-color="item.hasPendingVaccines ? 'red' : 'success'"
                    inset
                  />
                  <v-tooltip
                    v-if="item.hasPendingVaccines !== undefined"
                    activator="parent"
                    location="bottom"
                    max-width="350px"
                  >
                    <span style="white-space: normal; word-break: break-word">
                      {{
                        item.hasConsultations
                          ? "Tiene vacunas pendientes"
                          : "No tiene vacunas pendientes"
                      }}
                    </span>
                  </v-tooltip>
                  <span v-else class="text--disabled">—</span>
                </div>

                <!-- Ícono de expansión AL FINAL (solo si tiene consultas) -->
                <div style="width: 5%; min-width: 0; display: flex; justify-content: center">
                  <v-btn
                    v-if="item.hasPendingVaccines"
                    icon
                    size="small"
                    variant="text"
                    @click.stop="toggleExpand(item.id)"
                    :class="{ 'rotate-180': isExpanded(item.id) }"
                    style="transition: transform 0.2s"
                  >
                    <v-icon size="small">mdi-chevron-down</v-icon>
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </td>
        </tr>

          <!-- Fila expandida -->
          <tr v-if="isExpanded(item.id) && item.hasPendingVaccines">
            <td colspan="100%" class="pa-0" style="background: #fafafa">
              <div class="px-2 pb-4">
                <v-card
                  v-for="vaccination in item.vaccinations"
                  :key="vaccination.id"
                  class="mb-2 mx-1 rounded-lg"
                  elevation="1"
                  density="comfortable"
                  flat
                >
                  <v-card-text class="d-flex flex-wrap align-center pa-2" style="width: 100%">
                    <div style="width: 7%" class="text-body-2">
                      <v-avatar
                            class="mr-2 icono-concavo"
                            :class="`bg-${getTypeColor(vaccination.typeName)}`"
                            :style="{
                              'min-height': '48px',
                              'min-width': '48px',
                              'border-radius': '8px',
                              'font-size': '0.90em'
                            }"
                          >
                            <div class="text-body-3 font-weight-medium">
                              {{ formatIntuitiveDate(vaccination.startDate) }}
                            </div>
                          </v-avatar>
                    </div>
                    <div style="width: 60%" class="text-body-2 text-truncate ml-2">
                      <div class="text-body-2 text-truncate">
                      {{ vaccination.description }}
                    </div>
                    <div class="text-caption text-grey-darken-1 text-truncate mt-1">
                      {{ vaccination.severity }}
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t('personalBackground.fields.severity') }}: {{ vaccination.severity }}
                        </span>
                      </v-tooltip>
                    </div>
                    </div>
                    <div style="width: 30%" class="text-body-2 text-truncate">
                      {{ vaccination.details }}
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t('personalBackground.fields.details') }}: {{ vaccination.details }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="closeModal()">
          {{ $t("buttons.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";

import SuggestionsList from "../suggestion/SuggestionsList.vue";
import ChatTaskSalud from "../chat/ChatTaskSalud.vue";
import VitalSigns from "./VitalSigns.vue";
import ComplementaryData from "./ComplementaryData.vue";
import MedicalInformation from "./MedicalInformation.vue";
export default {
  components: {
    ChatTaskSalud,
    SuggestionsList,
    VitalSigns,
    ComplementaryData,
    MedicalInformation,
  },
  data: () => ({
    dialogPerson: false,
    dialogVitalSigns: false,
    dialogComplementaryData: false,
    dialogMedicalInformationData: false,
    dialogChatTask: false,
    currentTask: null,
    selectedView: "",
    dialog: false,
    nuevoValor: "",
    signoSeleccionado: null,
    type: "Hogar",
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    home_id: "",
    tab: null,
    loading: false,
    person: {},
    healthMetrics: {},
    householdVaccination: {},
    homePerson: [],
    membersConsultation: [],
    suggestions: [],
    statusuggestions: [],
    types: [],
    menuPerson: false,
    selectedPerson: {},
    data: {},
    headers: [
      { title: "Antecedentes Familiares", value: "familyBackground" },
      { title: "Antecedentes Personales", value: "personalBackground" },
      { title: "Grupo Sanguíneo", value: "bloodType" },
      { title: "Vacunaciones", value: "vaccines" },
      { title: "Medicamentos Actuales", value: "currentMedications" },
      { title: "Acciones", value: "actions", sortable: false, width: "10%" },
    ],
    headersWeight: [
      { title: "Persona", key: "name" },
      { title: "Peso", key: "weight" },
      { title: "Altura", key: "height" },
      { title: "BMI", key: "bmi" },
      { title: "Estado", key: "isHealthyWeight" },
    ],
    headersBloodPresure: [
      { title: "Persona", key: "name" },
      { title: "Presión", key: "bloodPressure" },
      { title: "Estado", key: "isNormalBloodPressure" },
    ],
    headersConsultation: [
      { title: "Persona", key: "name" },
      { title: "Cantidad", key: "totalConsultations" },
      { title: "Estado", key: "hasConsultations" },
      { title: "Tipo de Consulta", key: "consultations.typeName" },
    ],
    headersVaccination: [
      { title: "Persona", key: "name" },
      { title: "Cantidad", key: "totalConsultations" },
      { title: "Estado", key: "hasPendingVaccines" },
      { title: "Descripción", key: "vaccinoations.description" },
    ],
    searchWeight: "",
    searchBloodPresure: "",
    searchConsultation: "",
    searchVaccination: "",
    editedItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    defaultItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    originalItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    editedIndex: -1,
    search: "",
    menu: false,
    input: null,
    imageUrl: "",
    name: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 2) || "El campo debe tener al menos de 2 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    dialogWeight: false,
    weightData: [],
    dialogBloodPresure: false,
    bloodPresureData: [],
    dialogConsultation: false,
    consultationData: [],
    expandedConsultationRows: [],
    dialogVaccination: false,
    vaccinationData: [],
  }),
  computed: {
    tools() {
      return [
        {
          name: this.$t("vitalSigns"), // Asegúrate de añadir la traducción
          action: () => this.showVitalSigns(),
        },
        {
          name: this.$t("complementaryData"), // Asegúrate de añadir la traducción
          action: () => this.showComplementaryData(),
        },
        {
          name: this.$t("medicalInformation"), // Asegúrate de añadir la traducción
          action: () => this.showMedicalInformation(),
        },
      ];
    },
    totalMembersWithConsultations() {
      return (
        this.membersConsultation?.filter((member) => member.hasConsultations).length || 0
      );
    },

    tooltipText() {
      return `${this.totalMembersWithConsultations} de ${
        this.membersConsultation?.length || 0
      } miembros tienen citas médicas programadas esta semana`;
    },

    membersWithConsultations() {
      if (!Array.isArray(this.membersConsultation)) {
        return [];
      }
      return this.membersConsultation.filter((member) => member.hasConsultations);
    },
    switchColor() {
      return this.type === "Personal" ? "#03626C" : "#FB8C00";
    },
    getCurrentName() {
      const type = this.types.find((t) => t.id === this.type);
      return type ? type.name : this.type;
    },
  },
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    openModal(type) {
      if (type === "weight") {
        this.weightData = this.healthMetrics.healthyWeightMembers;
        this.dialogWeight = true;
      } else if (type === "bloodpresure") {
        this.bloodPresureData = this.healthMetrics.normalBloodPressureMembers;
        this.dialogBloodPresure = true;
      }else if (type === "consultation") {
        this.dialogConsultation = true;
      }else if (type === "vaccination") {
        this.vaccinationData = this.householdVaccination.data;
        this.dialogVaccination = true;
      }
    },
    closeModal() {
      this.dialogWeight = false;
      this.dialogBloodPresure = false;
      this.dialogConsultation = false;
      this.dialogVaccination = false;
    },
    toggleExpand(id) {
    const index = this.expandedConsultationRows.indexOf(id);
    if (index > -1) {
      this.expandedConsultationRows.splice(index, 1);
    } else {
      this.expandedConsultationRows.push(id);
    }
  },

  isExpanded(id) {
    return this.expandedConsultationRows.includes(id);
  },
  formatIntuitiveDate(dateString) {
      if (!dateString) return "Sin fecha";
      // 1. Parsear la fecha de entrada (formato YYYY-MM-DD)
      const [year, month, day] = dateString.split("-");
      const inputDate = new Date(year, month - 1, day); // Mes es 0-based
      // 2. Obtener fecha actual (sin horas/minutos/segundos)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // 3. Normalizar ambas fechas a UTC para evitar problemas de zona horaria
      const inputUTC = Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      );
      const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      // 4. Calcular diferencia en días
      const diffDays = Math.floor((inputUTC - todayUTC) / (1000 * 60 * 60 * 24));
      // 5. Determinar el texto a mostrar
      switch (diffDays) {
        case 0:
          return "Hoy";
        case 1:
          return "Mañana";
        case -1:
          return "Ayer";
        default:
          return inputDate
            .toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric", // <-- Añadido: muestra el año
            })
            .replace(/\./g, "");
      }
    },
     getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "warning"; // Color por defecto
    },
    getImageUrl(imagePath) {
      return `${this.$axios.defaults.baseURL}images/${imagePath}`;
    },
    getCacheTimestamp() {
      // Usamos medianoche (00:00:00) del día actual
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.getTime(); // Ej: 1714003200000 (cambia una vez al día)
    },
    isSelected(person) {
      return this.selectedPerson.id === person.id;
    },
    selectPerson(person) {
      // Si necesitas el objeto completo también:
      this.selectedPerson = { ...person };
      this.menuPerson = false;
      this.dialogPerson = false;
      this.imageUrl = this.selectedPerson.image;
      this.initialize();
    },
    getComponentByType(type) {
      if (!type) return null;

      // Normalización: minúsculas + eliminar tildes
      const normalized = type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const map = {
        vitalsigns: VitalSigns,
        complementarydata: ComplementaryData,
        medicalinformation: MedicalInformation,
      };

      return map[normalized] || null;
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.currentTask = null; // Limpia la tarea actual
      this.initialize();
    },
    close() {
      this.dialog = false;
      this.loading = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.data.person_id = this.selectedPerson.id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-profile",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.person = result.data?.person || {};
          this.homePerson = result.data?.homeperson || [];
          this.suggestions = result.data?.suggestions || [];
          this.statusuggestions = result.data?.statusuggestions || [];
          this.membersConsultation = result.data?.membersConsultation || [];
          this.healthMetrics = result.data?.healthMetrics || {};
          this.householdVaccination = result.data?.householdVaccination || {};
          this.selectedPerson = this.person;
          this.types = result.data?.types || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.person = {};
          this.healthMetrics = {};
          this.homePerson = [];
          this.suggestions = [];
          this.statusuggestions = [];
          this.membersConsultation = [];
          this.types = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
      } finally {
        this.loading = false;
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
    //SignosVitales
    showVitalSigns() {
      this.dialogVitalSigns = true; // Abrimos el diálogo
    },
    closeVitalSigns() {
      this.dialogVitalSigns = false; // Cerramos el diálogo

      this.initialize();
    },

    showComplementaryData() {
      this.dialogComplementaryData = true; // Abrimos el diálogo
    },
    closeComplementaryData() {
      this.dialogComplementaryData = false; // Cerramos el diálogo

      this.initialize();
    },
    showMedicalInformation() {
      this.dialogMedicalInformationData = true; // Abrimos el diálogo
    },
    closeMedicalInformation() {
      this.dialogMedicalInformationData = false; // Cerramos el diálogo

      this.initialize();
    },
  },
};
</script>
<style scoped>
.icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.v-btn {
  flex-shrink: 0;
}

/* Espaciado entre elementos */
.gap-1 {
  gap: 4px;
}

.tools-bar {
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}

/* Estilos para personalizar el scroll */
.v-list {
  scrollbar-width: thin;
  /* Para navegadores que soportan scrollbar-width */
  scrollbar-color: #888 #f1f1f1;
  /* Color del scroll */
}

.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}

.v-list::-webkit-scrollbar {
  width: 6px;
  /* Ancho del scroll */
}

.v-list::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Color del thumb */
  border-radius: 3px;
  /* Bordes redondeados */
}

.v-list::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  /* Color del track */
}

.text-h6 {
  font-size: 1.2rem;
}

.signo-card {
  transition: 0.2s ease-in-out;
}

.signo-card .text-truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.signo-card:hover {
  transform: scale(1.01);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

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

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
