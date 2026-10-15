import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";

/** Çerez politikasının İspanyolca metni. */
export default function CookiesEs() {
  return (
    <LegalPage
      lang="es"
      eyebrow="Almacenamiento del navegador y preferencias"
      title="Política de cookies"
      summary="Esta política explica las cookies y las tecnologías de almacenamiento del navegador similares a las cookies que se usan en wangoh.com, junto con su finalidad, su duración y tus opciones de control."
    >
      <LegalCallout>
        Solo usamos cookies de analítica y de publicidad con tu permiso. Google Analytics no se
        carga en absoluto a menos que permitas la analítica, y las cookies de publicidad también
        dependen de tu consentimiento. Te pedimos tu elección en tu primera visita y puedes
        cambiarla en cualquier momento con el enlace &laquo;Configuración de cookies&raquo; al pie de
        la página.
      </LegalCallout>

      <LegalSection title="1. ¿Qué son las cookies y las tecnologías similares?">
        <p>
          Una cookie es un pequeño fragmento de datos que un sitio web guarda en tu navegador.
          Tecnologías similares, como localStorage, también pueden guardar en tu dispositivo
          información sobre preferencias o funciones. Estas tecnologías pueden usarse con
          distintos fines, como funciones esenciales, preferencias del usuario, medición del
          rendimiento o publicidad.
        </p>
      </LegalSection>

      <LegalSection title="2. Qué guarda actualmente Wangoh en tu dispositivo">
        <div className="legal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tecnología / tipo</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>wangoh.consent</td>
                <td>localStorage propio / necesaria</td>
                <td>Recordar tu elección de cookies y consentimiento y la fecha en que la hiciste</td>
                <td>6 meses; después se te vuelve a preguntar</td>
              </tr>
              <tr>
                <td>wangoh.flaggame.v2</td>
                <td>localStorage propio / funcional</td>
                <td>
                  Recordar tu puntuación, nivel, racha y banderas aprendidas en el juego de
                  banderas
                </td>
                <td>Hasta que se borren los datos del navegador</td>
              </tr>
              <tr>
                <td>wangoh.distancegame.v2</td>
                <td>localStorage propio / funcional</td>
                <td>
                  Recordar tu mejor resultado, las partidas jugadas, la media, los resultados del Tour
                  del día, la racha diaria y tu elección de efectos de sonido en el juego &ldquo;¿Cuántos
                  kilómetros?&rdquo;
                </td>
                <td>Hasta que se borren los datos del navegador</td>
              </tr>
              <tr>
                <td>wangoh.mapgame.v1</td>
                <td>localStorage propio / funcional</td>
                <td>
                  Recordar tu mejor resultado, las partidas jugadas, la media, los resultados del Tour
                  del día, la racha diaria y tu elección de efectos de sonido en el juego &ldquo;Encuéntralo
                  en el mapa&rdquo;
                </td>
                <td>Hasta que se borren los datos del navegador</td>
              </tr>
              <tr>
                <td>wangoh.origin</td>
                <td>localStorage propio / funcional</td>
                <td>
                  Recordar la ciudad de salida que elegiste para la animación de vuelo y las
                  tarjetas de ruta. Solo se crea cuando eliges la ciudad manualmente.
                </td>
                <td>Hasta que se borren los datos del navegador</td>
              </tr>
              <tr>
                <td>wangoh.origin.detected</td>
                <td>sessionStorage propio / funcional</td>
                <td>
                  Conservar la ciudad y las coordenadas aproximadas detectadas a partir de tu
                  conexión para no volver a solicitarlas en la misma sesión
                </td>
                <td>Hasta que se cierre la pestaña o el navegador</td>
              </tr>
              <tr>
                <td>wangoh-shell-v1, wangoh-pages-v1, wangoh-assets-v1</td>
                <td>Caché propia del service worker (Cache Storage) / funcional</td>
                <td>
                  Guardar en tu dispositivo las páginas e imágenes que visitas para que también
                  puedan abrirse sin conexión a internet
                </td>
                <td>Hasta que se borren los datos del navegador o se renueve la versión de la caché</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Estos registros no se envían a los servidores de Wangoh ni se usan para seguirte en
          otros sitios web. Son preferencias guardadas en el dispositivo vinculadas a tu uso de la
          función correspondiente.
        </p>
      </LegalSection>

      <LegalSection title="3. Medición de visitas">
        <p>
          Vercel Web Analytics mide como estadísticas agregadas las páginas vistas, las fuentes de
          referencia, el país aproximado, el dispositivo, el sistema operativo y el tipo de
          navegador. Esta función no usa cookies, no te sigue entre sitios web y no proporciona a
          Wangoh un perfil que identifique directamente a un visitante.
        </p>
        <p>
          Google Analytics 4 solo se carga cuando das tu consentimiento de &laquo;Analítica&raquo;. Usa
          las cookies propias que se indican a continuación para medir las páginas vistas, las
          interacciones en el sitio, la ubicación aproximada y la información del dispositivo y
          del navegador. Si retiras el consentimiento, Google Analytics deja de enviar datos de
          inmediato, estas cookies se eliminan y no se carga en tus visitas posteriores.
        </p>
        <div className="legal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tecnología / tipo</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Cookie de Google Analytics / analítica</td>
                <td>Distinguir a unos visitantes de otros</td>
                <td>Hasta 2 años</td>
              </tr>
              <tr>
                <td>_ga_QJSHGD467K</td>
                <td>Cookie de Google Analytics / analítica</td>
                <td>Mantener el estado de la sesión</td>
                <td>Hasta 2 años</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="4. Alojamiento y registros de seguridad">
        <p>
          Los proveedores de alojamiento y CDN, como Vercel, pueden tratar registros técnicos como
          la dirección IP, la hora de la solicitud, la URL solicitada y la información del
          navegador para mantener el sitio seguro y en funcionamiento. Estos registros no son
          cookies que Wangoh coloque en tu navegador; para más detalles, consulta la{" "}
          <Link href="/gizlilik-politikasi">Política de privacidad</Link>.
        </p>
      </LegalSection>

      <LegalSection title="5. Publicidad de Google AdSense">
        <p>
          Las páginas de Wangoh incluyen el script de anuncios de Google AdSense. Google y los
          proveedores autorizados de tecnología publicitaria pueden usar cookies o identificadores
          similares para mostrar anuncios, limitar su frecuencia, prevenir el fraude, medir el
          rendimiento de los anuncios y aplicar tus elecciones de consentimiento. Google puede
          cambiar con el tiempo los nombres y la duración de los identificadores que usa.
        </p>
        <ul>
          <li>
            Si no das tu consentimiento de publicidad, se comunica a Google (mediante el modo de
            consentimiento) que se deniega el almacenamiento publicitario; pueden mostrarse
            anuncios no personalizados o limitados sin cookies de publicidad.
          </li>
          <li>Si das tu consentimiento de publicidad, los anuncios pueden personalizarse según tus intereses.</li>
          <li>
            A los visitantes del Espacio Económico Europeo, el Reino Unido y Suiza también se les
            muestra un mensaje de consentimiento para la publicidad a través de la plataforma
            certificada de gestión del consentimiento de Google (Privacidad y mensajes de Google).
          </li>
        </ul>
        <p>
          Puedes saber cómo usa Google los datos publicitarios en su página{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites?hl=es"
            target="_blank"
            rel="noreferrer"
          >
            cómo utiliza Google la información de sitios o aplicaciones que utilizan sus servicios
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Base jurídica y gestión de preferencias">
        <p>
          Las tecnologías estrictamente necesarias para ofrecer el sitio de forma segura o para
          hacer funcionar una función que hayas solicitado expresamente pueden basarse, según la
          legislación aplicable, en fundamentos jurídicos distintos del consentimiento explícito.
          Las cookies de analítica y de publicidad solo se usan con tu consentimiento explícito;
          sin consentimiento de publicidad, los anuncios se muestran de forma limitada y sin
          cookies de publicidad.
        </p>
        <p>
          Puedes dar tu elección en la ventana de consentimiento que aparece en tu primera visita,
          elegir por categorías con &laquo;Gestionar preferencias&raquo; y cambiarla en cualquier
          momento con el enlace &laquo;Configuración de cookies&raquo; al pie de la página. Tu elección
          se guarda en tu dispositivo durante 6 meses, tras los cuales se te vuelve a preguntar.
          Retirar el consentimiento no afecta a la licitud del tratamiento realizado antes de la
          retirada.
        </p>
      </LegalSection>

      <LegalSection title="7. Borrar y bloquear en tu navegador">
        <p>
          Puedes ver, bloquear o borrar las cookies y los datos de sitios en la configuración de
          tu navegador. Para eliminar tu progreso en el juego de banderas, puedes borrar los datos
          del sitio wangoh.com; esto también elimina tu elección de ciudad de salida, tu registro
          de consentimiento y la caché de páginas sin conexión. Si bloqueas todo el
          almacenamiento, algunas funciones de preferencias pueden no funcionar como esperas.
        </p>
        <ul>
          <li>
            <a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noreferrer">
              Configuración de cookies de Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/es-es/105082" target="_blank" rel="noreferrer">
              Cookies y datos de sitios web en Safari
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noreferrer">
              Borrar cookies en Firefox
            </a>
          </li>
          <li>
            <a href="https://myadcenter.google.com/?hl=es" target="_blank" rel="noreferrer">
              Mi Centro de Anuncios de Google (configuración de personalización de anuncios)
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Cambios y contacto">
        <p>
          Cuando se añade una nueva tecnología de analítica, publicidad o preferencias, se
          actualizan esta tabla y el mecanismo de consentimiento. Si tienes preguntas, puedes
          escribirnos a <a href="mailto:info@wangoh.com">info@wangoh.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
