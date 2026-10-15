import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

/** Hakkımızda sayfasının İspanyolca metni. */
export default function AboutEs() {
  return (
    <LegalPage
      lang="es"
      eyebrow="Publicación de viajes independiente"
      title="Quiénes somos"
      summary="Wangoh nació para describir una ciudad sin reducirla a una lista de cosas que ver. Nuestro objetivo es reunir en una sola guía la información práctica que necesitas antes de un viaje, el espíritu de un barrio y la historia que hay detrás de su comida."
      showUpdated={false}
    >
      <LegalSection title="¿Por qué Wangoh?">
        <p>
          Al planificar un viaje es fácil perderse entre cientos de pestañas del navegador. Wangoh
          reúne en un conjunto claro las rutas, el transporte, los barrios donde alojarse, la
          comida local y sugerencias para distintas preferencias alimentarias. Nuestro contenido
          está para ayudarte a tomar decisiones de viaje; no hacemos reservas, no vendemos
          excursiones ni actuamos como agencia de viajes.
        </p>
      </LegalSection>

      <LegalSection title="Qué publicamos">
        <ul>
          <li>Guías de viaje completas por país y ciudad,</li>
          <li>Ideas de ruta día a día y notas de planificación centradas en los barrios,</li>
          <li>Información práctica sobre transporte, presupuesto, temporadas y ritmo de viaje,</li>
          <li>Sugerencias claramente clasificadas para necesidades veganas, halal y otras dietas,</li>
          <li>Juegos de preguntas y herramientas de descubrimiento que hacen el viaje más divertido.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Nuestros principios editoriales">
        <p>
          Lo primero es la utilidad para el lector. Buscamos presentar el contenido de forma
          clara, original y útil, y dar con fecha y contexto, siempre que sea posible, la
          información que puede cambiar, como precios, horarios, visados y transporte. En los
          temas que requieren fuentes oficiales, damos prioridad a las declaraciones vigentes de
          las instituciones correspondientes.
        </p>
        <p>
          Con el tiempo, los restaurantes, negocios y atracciones pueden cerrar, trasladarse o
          cambiar sus servicios. Por eso, para planes importantes y necesidades alimentarias
          especiales, te recomendamos confirmarlo directamente con el negocio o el organismo
          oficial correspondiente antes de tu visita.
        </p>
      </LegalSection>

      <LegalSection title="Independencia, publicidad y colaboraciones">
        <p>
          Wangoh puede financiarse con publicidad. Los anuncios seleccionados por los sistemas de
          publicidad no representan nuestra opinión editorial. Si se publican colaboraciones de
          pago o contenido patrocinado, se identificarán claramente para que los lectores puedan
          reconocerlos con facilidad. Una relación comercial no garantiza una valoración
          positiva.
        </p>
        <LegalCallout>
          Si detectas un error factual, información desactualizada o un problema con una fuente,
          puedes escribirnos indicando el tema y el enlace a la página.
        </LegalCallout>
      </LegalSection>

      <LegalSection title="Contacto">
        <p>
          Para solicitudes de corrección, sugerencias editoriales, colaboraciones y preguntas
          generales, puedes escribir a <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Para saber
          cómo se tratan los datos personales, lee la{" "}
          <Link href="/gizlilik-politikasi">Política de privacidad y aviso KVKK</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
