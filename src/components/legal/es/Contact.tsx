import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

/** İletişim sayfasının İspanyolca metni. */
export default function ContactEs() {
  return (
    <LegalPage
      lang="es"
      eyebrow="Escríbenos"
      title="Contacto"
      summary="¿Has visto en una guía información que haya que corregir o quieres sugerir una nueva ruta? Si nos envías tu mensaje con el contexto adecuado, podremos revisarlo más rápido."
      showUpdated={false}
    >
      <LegalCallout>
        <p className="text-[10px] tracking-[0.24em] text-[var(--gold)]/75 uppercase">
          Consultas generales
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="font-display mt-2 inline-block break-all text-[clamp(1.55rem,6vw,2.4rem)] text-white transition-colors hover:text-[var(--gold)]"
        >
          {SITE.email}
        </a>
      </LegalCallout>

      <LegalSection title="¿Sobre qué puedes escribirnos?">
        <ul>
          <li>
            <strong>Correcciones de contenido:</strong> con el enlace a la página, la sección
            incorrecta y, si es posible, una fuente que lo verifique.
          </li>
          <li>
            <strong>Sugerencias de rutas y contenidos:</strong> indicando la ciudad, el tema y cómo
            ayudaría a los lectores.
          </li>
          <li>
            <strong>Colaboraciones y prensa:</strong> con los datos de la marca u organización, el
            alcance y una persona de contacto.
          </li>
          <li>
            <strong>Solicitudes de privacidad y KVKK:</strong> indicando el alcance de la
            solicitud y los datos de contacto correspondientes.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Antes de enviar un mensaje">
        <p>
          Wangoh no es una agencia de viajes ni una plataforma de reservas. No hace reservas de
          vuelos, hoteles, restaurantes ni solicitudes de visado, y no pide pagos ni documentos de
          identidad en relación con ellas. No envíes por correo electrónico categorías especiales
          de datos personales innecesarias, contraseñas, datos de tarjetas de pago ni documentos
          de identidad.
        </p>
        <p>
          Para revisar tu mensaje, pueden tratarse tu nombre, tu dirección de correo electrónico,
          el contenido del mensaje y los archivos adjuntos que envíes. Para más detalles, lee la{" "}
          <Link href="/gizlilik-politikasi">Política de privacidad y aviso KVKK</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Correcciones editoriales">
        <p>
          Nos tomamos en serio los avisos; sin embargo, no podemos garantizar que todas las
          sugerencias se publiquen ni que se respondan en un plazo determinado. Para la
          información sobre seguridad, visados, salud y transporte oficial, prevalece la
          declaración vigente de la autoridad pública correspondiente.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
