import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

/** Kullanım koşullarının İspanyolca metni. */
export default function TermsEs() {
  return (
    <LegalPage
      lang="es"
      eyebrow="Condiciones de uso del sitio"
      title="Condiciones de uso"
      summary="Al usar wangoh.com, aceptas que has leído las condiciones que se indican a continuación. Estas condiciones no limitan los derechos que te reconoce la legislación imperativa."
    >
      <LegalCallout>
        Wangoh no es una agencia de viajes, una plataforma de reservas ni una autoridad oficial. El
        contenido del sitio tiene fines de información general e inspiración para viajar.
      </LegalCallout>

      <LegalSection title="1. Alcance del servicio">
        <p>
          Wangoh ofrece contenido editorial y herramientas de descubrimiento sobre destinos,
          rutas, transporte, barrios donde alojarse, comida y bebida y experiencias de viaje. A
          través de Wangoh no se hacen reservas de vuelos, hoteles, excursiones, restaurantes,
          visados ni seguros, y no se cobra ningún pago.
        </p>
      </LegalSection>

      <LegalSection title="2. Exactitud de la información y responsabilidad personal">
        <p>
          Se pone un cuidado razonable para que el contenido sea exacto y útil; sin embargo, los
          precios, horarios, horarios de transporte, requisitos de entrada, normas de visado,
          condiciones de salud y seguridad e información de los negocios pueden cambiar
          rápidamente. No se garantiza que la información sea completa, que esté disponible sin
          interrupciones ni que sea adecuada para un fin concreto.
        </p>
        <p>
          Antes de tomar una decisión de viaje, comprar algo o basarte en la información para
          necesidades especiales de alimentación o accesibilidad, es responsabilidad del usuario
          verificarla con la aerolínea, el negocio, el consulado, la autoridad pública u otra
          fuente primaria correspondiente. Para asesoramiento de emergencia, salud, jurídico o de
          seguridad, consulta a un profesional autorizado.
        </p>
      </LegalSection>

      <LegalSection title="3. Sitios y servicios externos">
        <p>
          El sitio puede contener enlaces a mapas, instituciones oficiales, restaurantes, fuentes
          de imágenes u otros sitios de terceros. Estos enlaces se ofrecen por comodidad; no
          significan que respaldemos el contenido, la seguridad, los precios ni las prácticas de
          privacidad de la parte correspondiente. Tu relación con un tercero se rige por sus
          propias condiciones.
        </p>
      </LegalSection>

      <LegalSection title="4. Propiedad intelectual y uso permitido">
        <p>
          Los derechos sobre los textos, la maquetación original, los elementos de marca, el
          software y las recopilaciones elaborados por Wangoh pertenecen a Wangoh o a los
          titulares de derechos correspondientes. Pueden hacerse citas breves para un uso personal
          no comercial, citando la fuente e incluyendo un enlace. Se requiere permiso previo por
          escrito para copiar el contenido íntegro, extraerlo de forma automática y masiva,
          volver a publicarlo, venderlo o convertirlo en la base de datos de otro servicio.
        </p>
        <p>
          Las imágenes y marcas de terceros están sujetas a sus propias licencias y condiciones de
          uso. Los avisos sobre la titularidad de derechos pueden enviarse a{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> con el enlace a la página
          correspondiente y la información que explique el derecho.
        </p>
      </LegalSection>

      <LegalSection title="5. Uso aceptable">
        <p>Al usar el sitio, no debes:</p>
        <ul>
          <li>Intentar dañar el sitio, sus servidores o a otros usuarios,</li>
          <li>Eludir las medidas de seguridad, obtener acceso no autorizado ni enviar código malicioso,</li>
          <li>Afirmar de forma engañosa que actúas en nombre de Wangoh,</li>
          <li>
            Infringir derechos de autor, marcas, la privacidad u otros derechos de terceros,
          </li>
          <li>Usar el sitio para actividades ilícitas.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Publicidad y contenido comercial">
        <p>
          El sitio puede mostrar anuncios a través de sistemas de terceros como Google AdSense.
          Los anuncios pueden determinarse mediante los sistemas de pujas y segmentación de los
          anunciantes y no son una recomendación editorial de Wangoh. El contenido patrocinado y
          las colaboraciones de pago se identifican claramente cuando se publican.
        </p>
        <p>
          Al uso de datos por parte de las tecnologías publicitarias se aplican la{" "}
          <Link href="/gizlilik-politikasi">Política de privacidad</Link> y la{" "}
          <Link href="/cerez-politikasi">Política de cookies</Link>.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitación de responsabilidad">
        <p>
          Con sujeción a las normas legales imperativas, Wangoh no puede ser considerado
          responsable de los daños indirectos derivados de cambios en servicios de terceros, de
          decisiones que los usuarios tomen sin verificación, de las acciones de los sitios
          enlazados, de problemas de dispositivos o conexión ni de interrupciones ajenas a su
          control. Esta disposición no elimina las responsabilidades que no pueden limitarse por
          ley.
        </p>
      </LegalSection>

      <LegalSection title="8. Privacidad">
        <p>
          El tratamiento de los datos personales se rige por la{" "}
          <Link href="/gizlilik-politikasi">Política de privacidad y aviso KVKK</Link>. Cuando nos
          escribas, no compartas categorías especiales de datos innecesarias, contraseñas ni datos
          de pago.
        </p>
      </LegalSection>

      <LegalSection title="9. Cambios, acceso y legislación aplicable">
        <p>
          El contenido del sitio y estas condiciones pueden actualizarse según los cambios del
          servicio o de la legislación. El texto vigente se publica en esta página. El servicio
          puede suspenderse temporalmente por mantenimiento del sitio, seguridad o fuerza mayor.
          Estas condiciones se rigen por la legislación de la República de Turquía; quedan a salvo
          los derechos aplicables de los consumidores y en materia de datos personales.
        </p>
      </LegalSection>

      <LegalSection title="10. Contacto">
        <p>
          Puedes enviar tus preguntas sobre estas condiciones a{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
