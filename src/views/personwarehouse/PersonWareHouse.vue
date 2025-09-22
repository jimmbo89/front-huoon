<template>
  <v-snackbar class="mt-12 rounded-lg" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
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
    <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-row dense>
          <!-- Foto del usuario -->
          <v-col cols="12" sm="10" md="10" class="d-flex align-center">
            <v-avatar size="48" class="me-3" color="grey-lighten-4" variant="tonal">
              <v-icon size="35" color="error">mdi-store-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-bold mb-1">
                {{ $t("warehouse.list.title") }}
              </div>
            </div>
            <!--<div
              class="d-flex align-center cursor-pointer pet-selector"
              style="padding: 8px; border-radius: 12px; transition: background-color 0.2s"
              @click="menuWarehouse = !menuWarehouse"
            >
              <div style="position: relative; display: inline-block">
                <div class="icon-wrapper me-4">
                  <v-icon icon="mdi-store" color="white" size="40px"></v-icon>
                </div>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  color="blue-grey"
                  @click.stop="editItem(selectedWarehouse)"
                  style="position: absolute; bottom: 0; right: 12px"
                >
                  <v-icon color="primary" size="20">mdi-pencil</v-icon>
                </v-btn>
              </div>
              <div>
                <div class="text-body-2 font-weight-bold mb-1">
                  {{ selectedWarehouse.title }}
                </div>
                <div class="text-body-2 text-grey-darken-1 text-truncated">
                  {{ selectedWarehouse.description }}
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">
                      {{ $t("warehouse.fields.description") }}:
                      {{ selectedWarehouse.description }}
                    </span>
                  </v-tooltip>
                </div>
                <div class="text-body-2 text-grey-darken-1 text-truncated">
                  {{ selectedWarehouse.productCount }}
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">
                      {{ $t("product.fields.quantity") }}:
                      {{ selectedWarehouse.productCount }}
                    </span>
                  </v-tooltip>
                </div>
              </div>

              <v-icon
                :class="{ rotate: menuWarehouse }"
                class="ms-2 transition-fast-in-fast-out"
                size="20"
                color="grey"
              >
                mdi-menu-down
              </v-icon>
            </div>
            <v-menu
              v-model="menuWarehouse"
              :close-on-content-click="false"
              location="bottom start"
              offset-y
              :min-width="null"
              :max-width="null"
              class="rounded-lg"
            >
              <template #activator="{ props }">
                <div v-bind="props"></div>
              </template>
              <v-card max-width="900px" class="mx-auto rounded-lg">
                <v-card-text>
                  <v-container fluid>
                    <v-row justify="center">
                      <v-col
                        v-for="warehouse in personwarehouses"
                        :key="warehouse.id"
                        cols="12"
                        sm="6"
                        md="3"
                        lg="3"
                        xl="3"
                      >
                        <v-card
                          class="text-center store-card"
                          elevation="3"
                          rounded="lg"
                          @click="selectWarehouse(warehouse)"
                          :class="
                            selectedWarehouse?.id === warehouse.id
                              ? 'bg-blue-lighten-5'
                              : ''
                          "
                        >
                          <div class="icon-wrapper mb-3">
                            <v-icon icon="mdi-store" color="white" size="50px"></v-icon>
                          </div>

                          <div class="store-name text-truncate px-2">
                            {{ warehouse.title }}
                          </div>
                          <div class="store-products text-truncate px-2">
                            {{ warehouse.description }}
                          </div>

                          <v-tooltip
                            activator="parent"
                            location="bottom"
                            max-width="350px"
                          >
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("warehouse.fields.description") }}:
                              {{ warehouse.description }}
                            </span>
                          </v-tooltip>
                          <div class="store-products text-truncate px-2">
                            {{ warehouse.productCount }}
                          </div>

                          <v-tooltip
                            activator="parent"
                            location="bottom"
                            max-width="350px"
                          >
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("product.fields.quantity") }}:
                              {{ warehouse.productCount }}
                            </span>
                          </v-tooltip>

                          <v-icon
                            v-if="selectedWarehouse?.id === warehouse.id"
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
            </v-menu>-->
          </v-col>
          <v-col cols="12" sm="2" md="2">
            <div class="d-flex align-right justify-end pa-2">
              <v-switch v-model="type" true-value="Personal" false-value="Hogar" :base-color="switchColor"
                :color="switchColor" hide-details inset class="mb-4 font-weight-bold">
                <template v-slot:label>
                  <span class="text-body-1" :style="{ color: switchColor }">
                    {{ getCurrentName }}
                  </span>
                </template>
              </v-switch>
            </div>
          </v-col>
          <!-- Botón flotante de añadir (posición fija) 
          <v-btn icon size="large" color="deep-purple-accent-4" class="ma-4" elevation="6"
            style="position: fixed; top: 40px; right: 260px" @click="showAddWareHouse()">
            <v-icon size="32">mdi-plus</v-icon>
          </v-btn>-->
        </v-row>
        <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar mt-1" style="overflow-x: auto; white-space: nowrap;">
          <v-btn v-for="tool in tools" :key="tool.name" @click="tool.action()" size="small" color="primary"
            variant="text" :prepend-icon="tool.icon || 'mdi-plus'" class="text-capitalize mr-2 flex-shrink-0"
            style="white-space: nowrap;">
            {{ tool.name }}
          </v-btn>
        </v-card-actions>

        <v-divider />
        <v-row dense>
          <v-col cols="12" sm="12" md="12">
    <div class="mt-4">
      <v-alert
        v-if="categoryAlerts && categoryAlerts.length > 0"
        color="warning"
        icon="mdi-alert-circle"
        variant="outlined"
        theme="dark"
        border
        density="compact"
        class="py-1 px-2 alert-multiline-icon"
        @click="showProducts()"
        style="cursor: pointer;"
      >
        <div
          v-for="(alert, index) in categoryAlerts"
          :key="index"
          class="text-body2 text-black mb-1"
          :class="{ 'pt-1': index > 0 }"
        >
          {{ alert.message }}
        </div>
      </v-alert>
    </div>
  </v-col>
              <v-col cols="12" sm="12" md="12" class="mt-4">
                <v-card class="mx-auto" elevation="1" rounded="lg" border flat>
                  <v-list-item height="60">
                    <template v-slot:prepend>
                      <v-avatar size="40" color="amber">
                        <v-icon icon="mdi-chart-donut" color="white"></v-icon>
                      </v-avatar>
                    </template>

                    <template v-slot:title>Estados de los productos por categorías</template>
                    <template v-slot:subtitle>
                      {{ new Date().toLocaleDateString() }}
                    </template>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-card-text class="pa-4">
                    <v-row dense class="d-flex flex-wrap justify-left">
                      <div v-for="category in categoryAvailability" :key="category.id"
                        class="mx-1 my-1 d-flex justify-left">
                        <v-tooltip top>
                          <template v-slot:activator="{ props }">
                            <v-sheet class="pa-1 text-center d-flex flex-column justify-center align-center"
                              rounded="lg" outlined v-bind="props" :style="{
                                  width: $vuetify.display.xs ? '90px' : '120px',
                                  height: $vuetify.display.xs ? '90px' : '120px'
                                }" elevation="1">
                              <v-progress-circular :model-value="category.percentage"
                                :size="$vuetify.display.xs ? 50 : 70" width="5"
                                :color="getCategoryColor(category.percentage)" class="mb-1">
                                <strong class="font-weight-bold">{{ category.totalQuantity }}</strong>
                              </v-progress-circular>
                              <div class="mt-2 font-weight-medium text-center" style="line-height: 1.1">
                                {{ category.name }}
                              </div>
                            </v-sheet>
                          </template>
                          <span>
                            {{ category.totalQuantity }} productos de {{ totalGeneral }} totales ({{ category.percentage
                            }}%)
                          </span>
                        </v-tooltip>
                      </div>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
        </v-row>
        <SuggestionsList :items="suggestions" :title="$t('finances.sections.suggestions')" icon="mdi-finance" class="mt-4">
          <template #detail="{ taskData, onClose }">
            <ChatTask :taskData="taskData" @close-dialog="onClose" />
          </template>
        </SuggestionsList>
      </v-card-text>
    </v-card>
  </v-container>
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("warehouse.formInstructions") }}
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
                      <strong>{{ $t(`warehouse.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`warehouse.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`warehouse.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="12" v-show="editedIndex === -1">
                  <v-autocomplete v-model="editedItem.warehouse_id" :items="warehouses"
                    :label="$t('warehouse.fields.warehouse')" item-title="title" item-value="id" variant="underlined">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div class="description-text" v-bind="props" :title="item.raw.description">
                                {{ $t("warehouse.fields.description") }}:
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div class="description-text" v-bind="props" :title="item.raw.location">
                                {{ $t("warehouse.fields.home_location") }}:
                                {{ item.raw.location }}
                              </div>
                            </template>
                            <span>{{ item.raw.location }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItem.title" clearable :label="$t('warehouse.fields.name')"
                    variant="underlined" :rules="nameRules"></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItem.location" clearable :label="$t('warehouse.fields.home_location')"
                    variant="underlined" :rules="locationRules"></v-text-field>
                </v-col>
              </v-row>

              <!-- Paso 2: Configuración adicional -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" md="6">
                  <v-select v-model="editedItem.status" :items="[
                      { id: 0, label: $t('warehouse.status.public') },
                      { id: 1, label: $t('warehouse.status.private') },
                    ]" item-title="label" item-value="id" :label="$t('warehouse.fields.status')" variant="underlined"
                    :rules="statusRules"></v-select>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItem.description" clearable :label="$t('warehouse.fields.description')"
                    variant="underlined" :rules="descriptionRules"></v-textarea>
                </v-col>
              </v-row>

              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : this.close()">
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

  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          <span class="text-subtitle-2 ml-4">
            {{
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.warehouse`) })
            }}</span></span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
          }}</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">{{
          $t("taskForm.buttons.confirmDelete") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogProduct" fullscreen transition="dialog-bottom-transition">
    <v-card class="bg-grey-lighten-4">
      <v-card-text class="bg-grey-lighten-4">
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Warehouses :key="type" :warehouses="personwarehouses || []" @warehouse-updated="handleWarehouseUpdate"
          :types="types" :type="type" @update:type="type = $event" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialogProduct">{{$t("buttons.close")}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogProductMotion" fullscreen transition="dialog-bottom-transition">
    <v-card class="bg-grey-lighten-4">
      <v-card-text class="bg-grey-lighten-4">
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <MovementData :key="type" :warehouses="personwarehouses || []" @warehouse-updated="handleWarehouseUpdate"
          :types="types" :type="type" @update:type="type = $event" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialogProductMotion">{{$t("buttons.close")}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogAddProduct" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <!-- Pasos laterales -->
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`product.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("product.formInstructions") }}</p>

          <v-row class="mt-12">
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item v-for="(s, index) in stepsP" :key="index" :dot-color="
                      stepP > index
                        ? 'green'
                        : stepP === index
                        ? 'deep-purple'
                        : 'grey-lighten-1'
                    " :icon="
                      stepP >= index
                        ? stepP === index
                          ? `mdi-numeric-${index + 1}`
                          : 'mdi-check'
                        : null
                    " size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`product.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`product.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`product.steps.${stepsP[stepP].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="stepP === 0">
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItemProduct.name" :label="$t('product.fields.name')" variant="underlined"
                    :rules="validationRules.name"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete v-model="editedItemProduct.warehouse_id" :items="personwarehouses"
                    :label="$t('warehouse.fields.warehouse')" item-title="title" item-value="warehouse_id"
                    variant="underlined">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div class="description-text" v-bind="props" :title="item.raw.description">
                                {{ $t("warehouse.fields.description") }}:
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div class="description-text" v-bind="props" :title="item.raw.location">
                                {{ $t("warehouse.fields.home_location") }}:
                                {{ item.raw.location }}
                              </div>
                            </template>
                            <span>{{ item.raw.location }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItemProduct.brand" :label="$t('product.fields.brand')"
                    variant="underlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input clearable v-model="file" ref="fileInput" :label="$t('product.fields.image')"
                    variant="underlined" :prepend-icon="null" density="compact" name="file" accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210" />
                  </v-card>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItemProduct.additional_notes"
                    :label="$t('product.fields.additional_notes')" variant="underlined"></v-textarea>
                </v-col>
              </v-row>

              <!-- Paso 2: Información de compra -->
              <v-row dense v-if="stepP === 1">
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItemProduct.unit_price" :label="$t('product.fields.unit_price')"
                    variant="underlined" type="number" :rules="validationRules.unit_price"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItemProduct.quantity" :label="$t('product.fields.quantity')"
                    variant="underlined" type="number" :rules="validationRules.quantity"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field :model-value="formattedTotalPrice" :label="$t('product.fields.total_price')"
                    variant="underlined" type="number" readonly @update:model-value="
                        (val) => (editedItemProduct.total_price = parseFloat(val))
                      "></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete v-model="editedItemProduct.status_id" :items="status"
                    :label="$t('product.fields.status')" item-title="nameStatus" item-value="id" variant="underlined"
                    density="compact" :rules="validationRules.status_id"
                    :no-data-text="$t('product.validation.no_data')">
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
                <v-col cols="12" md="6">
                  <v-autocomplete v-model="editedItemProduct.category_id" :items="categories"
                    :label="$t('product.fields.category')" item-title="nameCategory" item-value="id"
                    variant="underlined" density="compact" :rules="validationRules.category_id"
                    :no-data-text="$t('product.validation.no_data')">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <template v-if="isImage(item.raw.iconCategory)">
                              <img :src="`${this.$axios.defaults.baseURL}images/${
                                    item.raw.iconCategory
                                  }?t=${Date.now()}`" alt="icon" />
                            </template>
                            <template v-else>
                              <v-icon>{{ getIconName(item.raw.iconCategory) }}</v-icon>
                            </template>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="290px">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="dateInput" variant="underlined"
                        :label="$t('product.fields.purchase_date')"
                        :rules="validationRules.purchase_date"></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker :title="$t('product.fields.purchase_date')" color="#03626C" :modelValue="dateInput"
                        @update:model-value="updateDate" format="yyyy-MM-dd"></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="dateInput1" variant="underlined"
                        :label="$t('product.fields.expiration_date')"></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker :title="$t('product.fields.expiration_date')" color="#03626C"
                        :modelValue="dateInput1" format="yyyy-MM-dd" :min="dateInput"
                        @update:model-value="updateDate1"></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Paso 3: Configuración adicional -->
              <v-row dense v-if="stepP === 2">
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItemProduct.frequency" :label="$t('product.fields.frequency')"
                    variant="underlined" type="number" :rules="validationRules.frequency"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="editedItemProduct.type"
                    :items="[$t('product.types.winter'), $t('product.types.summer')]" :label="$t('product.fields.type')"
                    variant="underlined"></v-select>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItemProduct.purchase_place" :label="$t('product.fields.purchase_place')"
                    variant="underlined"></v-text-field>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="stepP > 0 ? stepP-- : close()">
                  {{ stepP === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStepProduct" :disabled="!valid">
                  {{
                  stepP === stepsP.length - 1 ? $t("buttons.saveAndClose") : $t("buttons.next")
                  }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import SuggestionsList from "../suggestion/SuggestionsList.vue";
import ChatTask from "../chat/ChatTask.vue";
import Warehouses from "./WarehouseData";
import MovementData from "./MovementData";

export default {
  components: {
    Warehouses,
    SuggestionsList,
    ChatTask,
    MovementData
  },
  data: () => ({
    snackbar: false,
    dialogProduct: false,
    dialogProductMotion: false,
    dialogAddProduct: false,
    dialogAlerta: false,
    warehouseData: {},
    menuWarehouse: false,
    selectedWarehouse: {},
    warehouseTools: [],
    step: 0,
    stepP: 0,
    stepsP: [
      { title: "basic", subtitle: "basic_information" },
      { title: "purchase", subtitle: "purchase_details" },
      { title: "additional", subtitle: "additional_configuration" },
    ],
    steps: [
      {
        title: "basic",
        subtitle: "basic_information",
      },
      {
        title: "configuration",
        subtitle: "additional_configuration",
      },
    ],
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    dialog: false,
    dialogDelete: false,
    warehouses: [],
    home_id: "",
    personwarehouses: [],
    categoryAvailability: [],
    categoryAlerts: [],
    suggestions: [],
    statusuggestions: [],
    data: {},
    headers: [
      { title: "warehouse.list.columns.name", value: "title", width: "25%" },
      { title: "warehouse.list.columns.location", value: "location", width: "25%" },
      { title: "warehouse.list.columns.status", value: "status", width: "20%" },
      {
        title: "warehouse.list.columns.actions",
        value: "actions",
        sortable: false,
        width: "10%",
      },
    ],

    editedItem: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
    },
    defaultItem: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      warehouse_id: "",
      home_id: "",
    },
    originalItem: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
    },
    editedIndex: -1,
    isEditing: false,
    search: "",
    types: [],
    type: 'Personal',
    file: null,
    imgMiniatura: "",
    // Datos de prueba: almacenes y productos
    categories: [],
    status: [],
    editedItemProduct: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null, // Imagen
      product_id: null,
    },

    defaultItemProduct: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null, // Imagen
      product_id: null,
    },

    originalItemProduct: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null,
      product_id: null, // Imagen
    },
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    dateInput: null,
    dateInput1: null,
  }),
  watch: {
     "editedItemProduct.unit_price": {
      handler: "calculateTotalPrice",
      immediate: true,
    },
    "editedItemProduct.quantity": {
      handler: "calculateTotalPrice",
      immediate: true,
    },
    "editedItem.warehouse_id"(newVal) {
      if (!this.isEditing) {
        // Si está en modo edición, no ejecutar la lógica del watch
        return;
      }
      const selectedWarehouse = this.warehouses.find((w) => w.id === newVal);
      if (selectedWarehouse) {
        this.editedItem.title = selectedWarehouse.title;
        this.editedItem.description = selectedWarehouse.description;
        this.editedItem.location = selectedWarehouse.location;
      } else {
        this.editedItem.title = "";
        this.editedItem.description = "";
        this.editedItem.location = "";
      }
    },
     type() {
      // Actualiza budget_type según el valor del switch
      //this.budget_type = newVal === 'Hogar' ? 'Hogar' : 'Personal';
      this.editedItem.status = this.type === 'Personal' ? 0 : 1;
      // Llama al método de inicialización
      this.initialize();
    },
    
  },

created() {
    this.tools = [
      {
        name: this.$t("warehouse.formTitle.generateShoppingList"),
        action: () => '',
      },
      {
        name: this.$t("product.listing.addButton"),
        action: () => this.showAddProduct(),
      },
      {
        name: this.$t("warehouse.formTitle.create"),
        action: () => this.showAddWareHouse(),
      },
      {
        name: this.$t("warehouse.formTitle.inventory"),
        action: () => this.showProducts(),
      },
      {
        name: this.$t("warehouse.formTitle.movements"),
        action: () => this.showProductsMotions(),
      },
    ];
  },
  computed: {
    translatedHeaders() {
      return this.headers.map((header) => ({
        ...header,
        title: this.$t(header.title),
      }));
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("warehouse.formTitle.create")
        : this.$t("warehouse.formTitle.edit");
    },
    nameRules() {
      return [
        (v) =>
          (v && v.length >= 3) ||
          this.$t("warehouse.validation.min_length", {
            field: this.$t("warehouse.fields.name"),
            length: 3,
          }),
        (v) =>
          (v && v.length <= 50) ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.name"),
            length: 50,
          }),
      ];
    },
    locationRules() {
      return [
        (v) =>
          (v && v.length <= 100) ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.home_location"),
            length: 100,
          }),
      ];
    },
    statusRules() {
      return [
        (v) =>
          (v !== null && v !== undefined) ||
          this.$t("warehouse.validation.required", {
            field: this.$t("warehouse.fields.status"),
          }),
        (v) =>
          [0, 1].includes(v) ||
          this.$t("warehouse.validation.invalid_selection", {
            field: this.$t("warehouse.fields.status"),
          }),
      ];
    },
    descriptionRules() {
      return [
        (v) =>
          !v ||
          v.length <= 255 ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.description"),
            length: 255,
          }),
      ];
    },
    totalGeneral() {
      return this.categoryAvailability.reduce((sum, cat) => sum + cat.totalQuantity, 0);
    },    
     switchColor() {
      return this.type === 'Personal' ? '#03626C' : '#FB8C00';
    },
    getCurrentName() {
      const type = this.types.find(t => t.id === this.type);
      return type ? type.name : this.type;
    },
    validationRules() {
      return {
        name: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.name"),
            }),
          (v) =>
            (v && v.length >= 3) ||
            this.$t("product.validation.min_length", {
              field: this.$t("product.fields.name"),
              length: 3,
            }),
        ],
        unit_price: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.unit_price"),
            }),
          (v) =>
            !isNaN(v) ||
            this.$t("product.validation.invalid_number", {
              field: this.$t("product.fields.unit_price"),
            }),
          (v) =>
            v >= 0 ||
            this.$t("product.validation.min_value", {
              field: this.$t("product.fields.unit_price"),
              value: 0,
            }),
        ],
        quantity: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.quantity"),
            }),
          (v) =>
            !isNaN(v) ||
            this.$t("product.validation.invalid_number", {
              field: this.$t("product.fields.quantity"),
            }),
          (v) =>
            v >= 0 ||
            this.$t("product.validation.min_value", {
              field: this.$t("product.fields.quantity"),
              value: 0,
            }),
        ],
        status_id: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.status"),
            }),
        ],
        category_id: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.category"),
            }),
        ],
        purchase_date: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.purchase_date"),
            }),
        ],
        expiration_date: [
          (v) =>
            !v ||
            v >= this.editedItem.purchase_date ||
            this.$t("product.validation.invalid_date"),
        ],
      };
    },
    priceRules() {
      return this.validationRules.unit_price;
    },
    quantityRules() {
      return this.validationRules.quantity;
    },
    selectRules() {
      return [(v) => !!v || this.$t("product.validation.required")];
    },
    formattedTotalPrice() {
      return this.editedItemProduct.total_price
        ? parseFloat(this.editedItemProduct.total_price).toFixed(2)
        : "0.00";
    },
    imgedit() {
      return this.imgMiniatura;
    },
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.editedItem.status = this.type === 'Personal' ? 0 : 1;
    this.initialize();
  },
  methods: {
    updateDate(value) {
      // value viene como objeto Date desde el date-picker
      // Convertimos a formato YYYY-MM-DD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItemProduct.purchase_date = this.dateInput;
      this.menu = false;
    },
    updateDate1(value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.dateInput1 = `${year}-${month}-${day}`;
      this.editedItemProduct.expiration_date = this.dateInput1;
      this.menu2 = false;
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
    calculateTotalPrice() {
      this.editedItemProduct.total_price = (
        this.editedItemProduct.unit_price * this.editedItemProduct.quantity
      ).toFixed(2);
    },
    obtenerFechaLocal() {
      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = String(hoy.getMonth() + 1).padStart(2, "0");
      const day = String(hoy.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    async showAddProduct() {
      this.loadingProduct = true;
      this.data = {};
      this.editedIndex = -1;
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.editedItem.home_id;
      this.dateInput = this.obtenerFechaLocal();
      this.dateInput1 = null;
      this.editedItem.purchase_date = this.dateInput;
      try {
        const result = await handleRequest({
          endpoint: "productcategory-productstatus-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.productcategories || [];
          this.status = result.data?.productstatus || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
        this.loadingProduct = false;
      } finally {
        this.dialogAddProduct = true;
        this.loadingProduct = false;
      }
    },
    async saveProduct() {
        this.loadingProduct = true;
        this.valid = false;
        const fieldsToUpdate = [
          "id",
          "home_id",
          "warehouse_id",
          "product_id",
          "status_id",
          "category_id",
          "name",
          "unit_price",
          "quantity",
          "total_price",
          "purchase_date",
          "purchase_place",
          "expiration_date",
          "brand",
          "additional_notes",
          "maintenance_date",
          "due_date",
          "frequency",
          "type",
        ];

        let updatedFields = Object.keys(this.editedItemProduct)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItemProduct[key] !== this.originalItemProduct[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItemProduct[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.home_id = this.home_id;
          if (this.file) {
            updatedFields.image = this.editedItemProduct.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "person-home-warehouse-product",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
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
            this.loadingProduct = false;
          }
        } else {
          this.loadingProduct = false;
          this.showAlert("success", "Debe completar los datos de producto.", 3000);
        }
      this.close();
    },
    getColSize(totalCategories) {
    if (totalCategories <= 2) return 6;   // 2 por fila → 6 columnas cada uno
    if (totalCategories === 3) return 4;  // 3 por fila → 4 columnas cada uno
    return 3;                             // 4+ por fila → 3 columnas cada uno
  },
    getCategoryColor(percentage) {
      if (percentage >= 70) return "green-darken-2";
      if (percentage >= 40) return "amber-darken-3";
      return "red-darken-2";
    },
    formatIntuitiveDate(dateString) {
      if (!dateString) return "";

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
        default:
          return inputDate
            .toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric", // <-- Añadido: muestra el año
            })
            .replace(/\./g, ""); // Elimina los puntos de abreviaturas (ej: "mar." → "mar")
      }
    },
    selectWarehouse(warehouse) {
      // Si necesitas el objeto completo también:
      this.selectedWarehouse = { ...warehouse };
      this.menuWarehouse = false;
      //this.updateWarehouseTools();
    },
    /*handleWarehouseUpdate(updatedData) {
      // Actualizar los datos en el padre
      this.warehouseData = {
        ...this.warehouseData,
        ...updatedData,
      };
    },*/
    handleWarehouseUpdate(updatedWarehouse) {
  // 1. Actualiza el almacén seleccionado (opcional, si lo estás usando)
  /*if (this.warehouseData && this.warehouseData.id === updatedWarehouse.id) {
    this.warehouseData = { ...updatedWarehouse };
  }

  // 2. Actualiza el array personwarehouses (¡esto es lo clave!)
  this.personwarehouses = this.personwarehouses.map(wh =>
    wh.id === updatedWarehouse.id ? updatedWarehouse : wh
  );*/

  // Opcional: si quieres recargar todo (menos eficiente)
  this.initialize();
},
    showProducts() {
      this.warehouseData = this.selectedWarehouse;
      if (!this.selectedWarehouse.id) {
        this.showAlert("warning", "No posee ningún almacén asociado.", 3000);
        return;
      }
      this.dialogProduct = true;
    },
    closeDialogProduct() {
      this.dialogProduct = false; // Cerramos el diálogo
      this.initialize();
    },
    showProductsMotions() {
      this.warehouseData = this.selectedWarehouse;
      if (!this.selectedWarehouse.id) {
        this.showAlert("warning", "Primero selecciona un almacén.", 3000);
        return;
      }
      this.dialogProductMotion = true;
    },
    closeDialogProductMotion() {
      this.dialogProductMotion = false; // Cerramos el diálogo
      this.initialize();
    },
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.dialog = false;
        this.step = 0;
        this.save();
      }
    },
    nextStepProduct() {
      if (this.stepP < this.stepsP.length - 1) {
        this.stepP++;
      } else {
        this.dialogAddProduct = false;
        this.stepP = 0;
        this.saveProduct();
      }
    },
    async showAddWareHouse() {
      this.isEditing = true;
      this.data.home_id = this.home_id;
      this.editedItem.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "person-warehouse-home-select",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          //this.warehouses = result.data?.warehouses || [];
          this.warehouses =
            result.data?.warehouses?.filter(
              (warehouse) =>
                !this.personwarehouses.some(
                  (personwarehouse) => personwarehouse.warehouse_id === warehouse.id
                )
            ) || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.warehouses = [];
          this.showAlert(
            "info",
            result.message || "No hay alamacenes disponibles.",
            3000
          );
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
      } finally {
        this.dialog = true;
      }
    },
    close() {
      this.dialog = false;
      this.dialogAddProduct = false;
      this.loading = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItemProduct = Object.assign({}, this.defaultItemProduct);
        this.originalItem = Object.assign({}, this.defaultItem);
        this.originalItemProduct = Object.assign({}, this.defaultItemProduct);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.data.type = this.type;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-warehouse-home",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.personwarehouses = result.data?.store || [];
          this.categoryAvailability = result.data?.categoryAvailability.categories || [];
          this.categoryAlerts = result.data?.categoryAvailability.alerts || [];
          this.types = result.data?.types || [];
          this.suggestions = result.data?.suggestions || [];
          this.statusuggestions = result.data?.statusuggestions || [];
          if (!this.selectedWarehouse?.id && this.personwarehouses.length > 0) {
            this.selectedWarehouse = { ...this.personwarehouses[0] };
          }
          //this.updateWarehouseTools();
        } else {
          // Si no hay datos, asignamos un array vacío
          this.personwarehouses = [];
          this.categoryAvailability = [];
          this.suggestions = [];
          this.statusuggestions = [];
          //this.showAlert('success', result.message || 'No hay almacénes disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        this.data = {};
        this.data.title = this.editedItem.title;
        this.data.description = this.editedItem.description;
        this.data.location = this.editedItem.location;
        this.data.warehouse_id = this.editedItem.warehouse_id ?? "";
        this.data.home_id = this.editedItem.home_id;
        try {
          const result = await handleRequest({
            endpoint: "person-warehouse",
            method: "POST",
            data: this.data,
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
          this.loading = false;
          // Este bloque captura errores inesperados fuera del manejo estándar
          this.showAlert(
            "error",
            "Ocurrió un error inesperado al procesar la solicitud.",
            3000
          );
        } finally {
          this.loading = false;
        }
      } else {
        const fieldsToUpdate = ["id", "title", "location", "description", "status"];
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
          updatedFields.id = this.editedItem.id;
          this.loading = true;
          try {
            const result = await handleRequest({
              endpoint: "person-warehouse",
              method: "PUT",
              data: updatedFields,
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
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.data.home_id = this.home_id;
      this.editedItem.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "person-warehouse-home-select",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          //this.warehouses = result.data?.warehouses || [];
          this.warehouses =
            result.data?.warehouses?.filter(
              (warehouse) =>
                !this.personwarehouses.some(
                  (personwarehouse) => personwarehouse.warehouse_id === warehouse.id
                )
            ) || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.warehouses = [];
          this.showAlert(
            "info",
            result.message || "No hay alamacenes disponibles.",
            3000
          );
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
      } finally {
        this.dialog = true;
      }
      this.isEditing = false;
    },
    deleteItem(item) {
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "person-warehouse-destroy",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
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
      this.editedItemProduct.image = file;
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
  },
};
</script>
<style scoped>
.alert-multiline-icon :deep(.v-alert__icon) {
  align-self: center;
}
.store-card {
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%; /* Ocupa todo el ancho de la columna */
  height: 180px; /* Altura fija */
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Evita que el contenido desborde */
}

.store-card:hover {
  /*transform: translateY(-5px);*/
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  border-radius: 50%;
  background: #f44336;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.store-products {
  font-size: 13px;
  color: #777;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
.title-container {
  display: flex;
  align-items: center;
  min-width: 0; /* Fundamental para el truncado */
  width: 100%;
}

.v-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1 1 auto;
  min-width: 0; /* Necesario para el truncado */
}

.dynamic-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0; /* Evita que se reduzca */
  margin-left: 8px;
}

/* Clases de color para el círculo */
.dynamic-circle.primary {
  background-color: #03626c;
}
.dynamic-circle.error {
  background-color: #f44336;
}

.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 8px;
  color: white;
  position: relative;
  overflow: hidden;
}
.avatar-border {
  border: 2px solid #000;
  /* Aquí se define el borde */
}

.description-text {
  max-width: auto;
  /* Establece un límite de ancho */
  overflow: hidden;
  /* Oculta el texto que exceda */
  text-overflow: ellipsis;
  /* Añade "..." al final del texto largo */
  white-space: nowrap;
  /* Evita el salto de línea */
}
</style>
