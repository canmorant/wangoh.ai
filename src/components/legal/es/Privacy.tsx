import { Link } from "@/i18n/navigation";
import LegalPage, { LegalCallout, LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

/** Gizlilik politikası ve KVKK aydınlatma metninin İspanyolca metni. */
export default function PrivacyEs() {
  return (
    <LegalPage
      lang="es"
      eyebrow="Protección de datos personales"
      title="Política de privacidad y aviso KVKK"
      summary="Este aviso explica cuándo, con qué fines y sobre qué bases jurídicas se tratan los datos de los visitantes de wangoh.com y de las personas que se ponen en contacto con nosotros."
    >
      <LegalCallout>
        <strong>Responsable del tratamiento:</strong> {SITE.operatorEs} (&laquo;Wangoh&raquo;)
        <br />
        <strong>Contacto:</strong>{" "}
        <a href={`mailto:${SITE.email}`} className="text-[var(--gold)]/90">
          {SITE.email}
        </a>
      </LegalCallout>

      <LegalSection title="1. Alcance">
        <p>
          Este aviso abarca el tratamiento de datos personales que puede producirse cuando visitas
          el sitio, usas los enlaces externos del sitio o te pones en contacto con Wangoh por
          correo electrónico. Wangoh no tiene sistema de registro, cuentas de usuario, pagos en
          línea ni formulario de contacto.
        </p>
      </LegalSection>

      <LegalSection title="2. Categorías de datos tratados">
        <ul>
          <li>
            <strong>Datos de contacto:</strong> cuando nos escribes, tu dirección de correo
            electrónico, tu nombre o firma, el contenido de tu mensaje y los archivos que adjuntes
            de forma consciente.
          </li>
          <li>
            <strong>Seguridad de las operaciones y registros técnicos:</strong> dirección IP, hora
            de la solicitud, página solicitada, información del navegador o dispositivo y señales
            de error y seguridad que los proveedores de alojamiento y seguridad pueden tratar en los
            registros del servidor o de la CDN.
          </li>
          <li>
            <strong>Estadísticas de uso anónimas:</strong> con Vercel Web Analytics puede medirse
            información agregada como las páginas visitadas, la fuente de referencia, el país
            aproximado, el dispositivo, el sistema operativo y el tipo de navegador. Esta medición
            no usa cookies y no crea en los informes un perfil de usuario que te identifique
            directamente.
          </li>
          <li>
            <strong>Datos de Google Analytics (solo con tu consentimiento):</strong> si das tu
            consentimiento de analítica, Google Analytics trata las páginas vistas, las
            interacciones en el sitio, la ubicación aproximada y la información del dispositivo y
            del navegador junto con identificadores de cookies. Si no lo das, Google Analytics no se
            carga.
          </li>
          <li>
            <strong>Registro de consentimiento:</strong> tu elección de cookies y la fecha en que la
            hiciste se guardan solo en el localStorage de tu navegador y no se envían a los
            servidores de Wangoh.
          </li>
          <li>
            <strong>Datos del juego guardados en el dispositivo:</strong> tu puntuación, nivel,
            racha y banderas aprendidas en el juego de banderas se guardan solo en el localStorage
            de tu navegador. Este registro no se envía a los servidores de Wangoh.
          </li>
          <li>
            <strong>Ubicación aproximada (animación de vuelo y tarjetas de ruta):</strong> para el
            punto de salida de la animación de vuelo y de las tarjetas de ruta de la página de
            inicio, se envían a tu navegador la ciudad y las coordenadas aproximadas que nuestro
            proveedor de alojamiento, Vercel, deduce de tu dirección IP. Wangoh no guarda esta
            información ni la vincula a un perfil de usuario; solo se conserva durante esa sesión
            en el sessionStorage de tu navegador. Si eliges tú mismo la ciudad de salida, tu
            elección se guarda en localStorage.
          </li>
          <li>
            <strong>Datos de publicidad y consentimiento:</strong> a través de Google AdSense,
            Google puede tratar cookies o identificadores similares, señales de consentimiento e
            interacciones con anuncios, según tu elección de consentimiento y las normas de tu
            región.
          </li>
        </ul>
        <p>
          Wangoh no te pide categorías especiales de datos personales. Te rogamos que no envíes
          ese tipo de información por correo electrónico.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidades del tratamiento">
        <ul>
          <li>Responder a las solicitudes de contacto y revisar las correcciones editoriales,</li>
          <li>Ofrecer el sitio de forma segura, rápida y accesible y corregir errores,</li>
          <li>
            Entender, mediante estadísticas agregadas, qué guías resultan útiles (con Google
            Analytics, solo con tu consentimiento),
          </li>
          <li>Prevenir usos indebidos, accesos no autorizados e incidentes de seguridad,</li>
          <li>Cumplir obligaciones legales y establecer, ejercer o proteger derechos,</li>
          <li>
            Mostrar anuncios y gestionar los registros de consentimiento cuando exista una elección
            o un consentimiento explícitos.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Métodos de recogida y bases jurídicas">
        <p>
          Los datos pueden recogerse por medios electrónicos: directamente de ti por correo
          electrónico, de forma automática a través de las solicitudes técnicas enviadas al sitio,
          mediante el almacenamiento en el dispositivo, a través de Google Analytics si das tu
          consentimiento o a través de las tecnologías de publicidad y consentimiento de Google.
        </p>
        <p>
          Según su naturaleza, las actividades de tratamiento se basan en las condiciones del
          artículo 5 de la Ley n.º 6698 de Protección de Datos Personales de Turquía (KVKK):{" "}
          <strong>obligación legal</strong>,{" "}
          <strong>establecimiento, ejercicio o protección de un derecho</strong> y, siempre que no
          se perjudiquen tus derechos fundamentales, <strong>interés legítimo</strong>. Cuando la
          ley o las normas de la región correspondiente exigen consentimiento explícito, las
          actividades de publicidad y de almacenamiento no esencial solo se llevan a cabo sobre la
          base de tu elección separada e informada. El uso de cookies para Google Analytics y para
          la publicidad personalizada se basa en tu <strong>consentimiento explícito</strong>, que
          puedes retirar en cualquier momento con el enlace &laquo;Configuración de cookies&raquo; al pie
          de la página.
        </p>
      </LegalSection>

      <LegalSection title="5. Grupos de destinatarios a los que pueden transferirse los datos">
        <p>
          Los datos solo pueden compartirse con los siguientes grupos en la medida necesaria para
          la finalidad correspondiente:
        </p>
        <ul>
          <li>Proveedores de alojamiento, CDN, seguridad e infraestructura técnica (como Vercel),</li>
          <li>Proveedores de alojamiento de correo electrónico y servicios de comunicación,</li>
          <li>
            Proveedores de contenido o CDN cuyos recursos solo se solicitan desde el navegador
            cuando es necesario (por ejemplo, Unsplash, Wikimedia o jsDelivr),
          </li>
          <li>Google (Google Analytics), cuando das tu consentimiento de analítica,</li>
          <li>
            Google (AdSense) y los proveedores de tecnología publicitaria correspondientes, según
            tu elección de consentimiento,
          </li>
          <li>Autoridades públicas legalmente habilitadas, órganos judiciales y asesores jurídicos.</li>
        </ul>
        <p>
          Algunos proveedores de servicios técnicos pueden estar ubicados en el extranjero o
          tratar los datos en infraestructuras situadas en el extranjero. Cualquier transferencia
          de este tipo se limita al marco de los mecanismos de transferencia y las garantías
          previstos en la legislación aplicable.
        </p>
      </LegalSection>

      <LegalSection title="6. Plazos de conservación">
        <p>
          Los registros de contacto se conservan durante el tiempo necesario para resolver la
          solicitud y dar seguimiento a posibles controversias; los registros técnicos se
          conservan durante el periodo limitado que exigen la seguridad, la corrección de errores
          y la configuración de los proveedores. Cuando termina la obligación legal y ya no existe
          una finalidad para el tratamiento, los datos se borran, se destruyen o se anonimizan.
        </p>
        <p>
          El registro del juego de banderas permanece en tu dispositivo hasta que borres los datos
          del navegador. Tu elección de cookies se conserva durante 6 meses. Las cookies de Google
          Analytics permanecen en tu navegador hasta 2 años y se eliminan si retiras el
          consentimiento de analítica. Los plazos de conservación de las tecnologías publicitarias
          pueden variar según tu elección de consentimiento y la política del proveedor
          correspondiente.
        </p>
      </LegalSection>

      <LegalSection title="7. Seguridad de los datos">
        <p>
          El sitio se sirve mediante HTTPS; se aplican límites de acceso administrativos y
          técnicos, cabeceras de seguridad y componentes de software actualizados. Aun así,
          recuerda que ningún método de transmisión por internet puede ofrecer una seguridad
          absoluta. Si detectas algo sospechoso, puedes comunicárnoslo.
        </p>
      </LegalSection>

      <LegalSection title="8. Tus derechos según la KVKK">
        <p>
          Según el artículo 11 de la Ley n.º 6698, cuando se cumplan las condiciones, tienes
          derecho a:
        </p>
        <ul>
          <li>Saber si se están tratando tus datos personales,</li>
          <li>Solicitar información al respecto si han sido tratados,</li>
          <li>Conocer la finalidad del tratamiento y si se usan conforme a esa finalidad,</li>
          <li>Conocer los terceros en Turquía o en el extranjero a los que se han transferido,</li>
          <li>Pedir que se corrijan los datos incompletos o tratados de forma inexacta,</li>
          <li>Pedir que se borren o destruyan en las condiciones previstas en la ley,</li>
          <li>
            Pedir que las correcciones o supresiones se notifiquen a quienes se transfirieron los
            datos,
          </li>
          <li>Oponerte a un resultado en tu contra derivado de un análisis automatizado,</li>
          <li>Reclamar una indemnización si sufres daños por un tratamiento ilícito.</li>
        </ul>
        <p>
          Puedes enviar tu solicitud a <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Puede
          pedirse información adicional razonable para comprobar que la solicitud es tuya y dar
          una respuesta precisa. Las solicitudes se evalúan conforme a los procedimientos y plazos
          de la legislación aplicable.
        </p>
      </LegalSection>

      <LegalSection title="9. Privacidad de los menores">
        <p>
          El sitio no es un servicio dirigido específicamente a menores y no tiene intención de
          recoger a sabiendas datos personales de menores. Si crees que se han compartido datos de
          un menor sin permiso, puedes ponerte en contacto con nosotros para que se valore su
          supresión.
        </p>
      </LegalSection>

      <LegalSection title="10. Enlaces externos y cambios en la política">
        <p>
          Wangoh puede enlazar a sitios de terceros. Wangoh no es responsable de las prácticas de
          privacidad de esos sitios; te recomendamos revisar sus políticas antes de abrir un
          enlace. Este aviso puede actualizarse cuando cambien los servicios o la legislación; la
          versión vigente se publica en esta página.
        </p>
        <p>
          Para información más detallada sobre el almacenamiento en el dispositivo y las
          tecnologías publicitarias, consulta la <Link href="/cerez-politikasi">Política de cookies</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
