<!-- src/views/PrivacyPolicy.vue -->
<template>
  <v-container class="py-8" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <v-card variant="text" class="pa-4">
          <v-card-title class="text-h4 font-weight-bold text-center mb-6">
            Política de Privacidad
          </v-card-title>

          <v-card-subtitle class="text-body-2 text-center mb-8 text-grey">
            Última actualización: 30/09/2025
          </v-card-subtitle>

          <v-card-text class="text-body-1">
            <p>
              En <strong>Huoon</strong>, respetamos la privacidad de nuestros usuarios y protegemos sus datos conforme a la
              <strong>Ley N° 19.628 sobre Protección de la Vida Privada de Chile</strong> y demás normativas aplicables.
            </p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">1. Datos que Recolectamos</h2>
            <ul>
              <li><strong>Identificación:</strong> nombre, correo, teléfono, edad.</li>
              <li><strong>Información del hogar:</strong> tareas, actividades, recordatorios, miembros del hogar.</li>
              <li><strong>Datos opcionales sensibles:</strong> información financiera básica (ej. gastos del hogar), datos de salud (ej. recordatorios médicos).</li>
              <li><strong>Datos de uso:</strong> estadísticas, logs de actividad, interacciones con la IA.</li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">2. Finalidad del Tratamiento</h2>
            <p>Los datos se usan para:</p>
            <ul>
              <li>Prestar y personalizar el Servicio.</li>
              <li>Generar recomendaciones mediante algoritmos de IA.</li>
              <li>Mejorar funcionalidades del software.</li>
              <li>Cumplir obligaciones legales y de seguridad.</li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">3. Base de Legitimación</h2>
            <p>El tratamiento se realiza sobre la base de:</p>
            <ul>
              <li>Consentimiento del Usuario.</li>
              <li>Ejecución del contrato (provisión del Servicio).</li>
              <li>Cumplimiento de obligaciones legales.</li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">4. Compartición de Datos</h2>
            <p>No vendemos datos personales.</p>
            <p>Podemos compartir información con:</p>
            <ul>
              <li>Proveedores tecnológicos (hosting, pasarelas de pago, servicios de IA en la nube).</li>
              <li>Autoridades, cuando sea legalmente requerido.</li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">5. Conservación</h2>
            <p>Los datos se conservarán mientras el Usuario mantenga una cuenta activa o hasta que solicite su eliminación.</p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">6. Derechos del Usuario</h2>
            <p>El Usuario podrá:</p>
            <ul>
              <li>Acceder a sus datos.</li>
              <li>Rectificarlos o actualizarlos.</li>
              <li>Solicitar su eliminación.</li>
              <li>Oponerse al tratamiento para fines comerciales.</li>
            </ul>
            <p><strong>Solicitudes:</strong> <a href="mailto:legal@huoon.com" class="text-primary">legal@huoon.com</a></p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">7. Seguridad</h2>
            <p>Implementamos medidas técnicas y organizativas para proteger los datos, incluyendo cifrado, respaldos y control de accesos.</p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">8. Transferencias Internacionales</h2>
            <p>Si los datos se procesan fuera de Chile, aseguramos niveles de protección adecuados conforme a estándares internacionales.</p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">9. Menores de Edad</h2>
            <p>El Servicio no está diseñado para menores de 14 años. Para mayores de 14 y menores de 18, se requiere autorización de sus padres o tutores.</p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">10. Cambios en la Política</h2>
            <p>Podemos actualizar esta Política. Los cambios serán notificados mediante la aplicación o correo electrónico.</p>
          </v-card-text>

         <!--<v-card-actions class="justify-center mt-6">
          <v-spacer></v-spacer>
            <v-btn
              color="cyan-darken-3"
              text="Cerrar"
              variant="flat"
              @click="$router.back()"
            ></v-btn>
          </v-card-actions>-->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from '@/router/index';
</script>

<style scoped>
h2 {
  color: rgba(0, 0, 0, 0.87);
}
a {
  text-decoration: none;
}
</style>