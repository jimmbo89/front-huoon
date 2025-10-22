<!-- src/views/TermsAndConditions.vue -->
<template>
  <v-container class="py-8" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <v-card variant="text" class="pa-4">
          <v-card-title class="text-h4 font-weight-bold text-center mb-6">
            Términos y Condiciones de Uso
          </v-card-title>

          <v-card-subtitle class="text-body-2 text-center mb-8 text-grey">
            Última actualización: 30/09/2025
          </v-card-subtitle>

          <v-card-text class="text-body-1">
            <p>
              Bienvenido(a) a <strong>Huoon</strong> (“nosotros”, “nuestro”). Estos Términos regulan el acceso y uso de la
              plataforma de gestión del hogar con inteligencia artificial (“el Servicio”), disponible en versión web y móvil.
            </p>
            <p>
              Al registrarse o utilizar el Servicio, usted (“el Usuario”) declara haber leído y aceptado estos Términos.
              Si no está de acuerdo, debe abstenerse de usarlo.
            </p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">1. Objeto</h2>
            <p>
              El Servicio permite a los Usuarios organizar, planificar y gestionar aspectos del hogar (ej. finanzas, tareas,
              salud, actividades familiares), incorporando herramientas de inteligencia artificial (IA) que generan
              sugerencias y análisis automatizados.
            </p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">2. Registro y Cuenta</h2>
            <ul>
              <li>El Usuario deberá registrarse con información veraz y actualizada.</li>
              <li>Es responsable de mantener la confidencialidad de sus credenciales.</li>
              <li>
                El uso de cuentas por menores de 18 años requiere autorización de sus padres o representantes.
              </li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">3. Uso Permitido</h2>
            <p>El Usuario se compromete a utilizar el Servicio únicamente para fines personales y domésticos.</p>
            <p><strong>Está prohibido:</strong></p>
            <ul>
              <li>Usar el Servicio para fines ilícitos o comerciales sin autorización.</li>
              <li>Introducir información falsa o de terceros sin consentimiento.</li>
              <li>Intentar alterar, copiar o descompilar el software.</li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">4. Funcionalidad de IA</h2>
            <ul>
              <li>
                El Servicio puede generar recomendaciones automatizadas (ej. recordatorios, análisis de gastos, sugerencias
                de rutinas).
              </li>
              <li>
                Estas recomendaciones tienen carácter referencial y no constituyen asesoría profesional (financiera,
                médica, psicológica ni legal).
              </li>
              <li>
                El Usuario es responsable de las decisiones tomadas en base a dichas sugerencias.
              </li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">5. Pagos y Suscripciones</h2>
            <ul>
              <li>Algunas funcionalidades pueden requerir suscripción pagada.</li>
              <li>Los precios y condiciones se informarán antes de la contratación.</li>
              <li>
                Los pagos son procesados por terceros autorizados (ej. Transbank, Stripe, PayPal).
              </li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">6. Propiedad Intelectual</h2>
            <ul>
              <li>
                Todo el software, marcas y contenidos son propiedad exclusiva de la Empresa o de sus licenciantes.
              </li>
              <li>
                El Usuario no adquiere derechos de propiedad intelectual por el uso del Servicio.
              </li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">7. Limitación de Responsabilidad</h2>
            <ul>
              <li>
                El Servicio se entrega “tal cual” y no se garantiza disponibilidad permanente ni ausencia de errores.
              </li>
              <li>
                La Empresa no se hace responsable por pérdidas derivadas del uso del Servicio, incluidas las basadas en
                sugerencias de IA.
              </li>
            </ul>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">8. Privacidad y Datos Personales</h2>
            <p>
              El tratamiento de los datos personales se regula por la
              <a href="#" @click.prevent="$router.push('/privacy')" class="text-primary">Política de Privacidad</a>,
              disponible en la aplicación.
            </p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">9. Modificaciones</h2>
            <p>
              Podemos modificar estos Términos. Los cambios serán informados mediante la app o correo electrónico.
            </p>

            <h2 class="text-h6 font-weight-bold mt-6 mb-3">10. Legislación Aplicable</h2>
            <p>
              Estos Términos se rigen por las leyes de Chile, especialmente la Ley N° 19.628 sobre Protección de la Vida
              Privada. Las disputas serán sometidas a los tribunales de Santiago de Chile.
            </p>
          </v-card-text>

          <!-- Opcional: botón para volver -->
          
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
export default {
  name: 'TermsAndConditions'
}
</script>

<style scoped>
h2 {
  color: rgba(0, 0, 0, 0.87);
}
a {
  text-decoration: none;
}
</style>