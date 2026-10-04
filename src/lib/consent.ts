/**
 * Çerez/izin tercihi: tek kaynak.
 *
 * Google Consent Mode v2 kullanılıyor. Sayfa açılır açılmaz (kök layout'taki
 * CONSENT_DEFAULT_SCRIPT) bütün zorunlu olmayan depolama "denied" olarak
 * bildiriliyor; ziyaretçi izin verince ConsentManager "update" gönderiyor.
 *
 *   - Analitik: Google Analytics betiği yalnız analitik izni verildiğinde
 *     yükleniyor (temel uygulama). İzin yoksa Google'a hiçbir istek gitmiyor.
 *   - Reklam: AdSense sayfada yükleniyor ama izin sinyallerine uyuyor; izin
 *     yoksa reklam çerezi kullanmadan sınırlı/kişiselleştirilmemiş reklam.
 *
 * Tercih cihazda localStorage'da tutulur ve CONSENT_MAX_AGE_MS sonra yeniden
 * sorulur. Sürüm (v) değişirse herkese yeniden sorulur; kategori eklenince
 * artırılmalı.
 */

export const GA_MEASUREMENT_ID = "G-QJSHGD467K";

export const CONSENT_STORAGE_KEY = "wangoh.consent";
export const CONSENT_VERSION = 1;
/** Tercih 6 ay geçerli; sonra pencere yeniden gösterilir. */
export const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

/** Çerez tercihlerini açmak için (altbilgideki bağlantı) yayınlanan olay. */
export const OPEN_CONSENT_EVENT = "wangoh:open-consent";

export type ConsentChoice = { analytics: boolean; ads: boolean };
type StoredConsent = ConsentChoice & { v: number; ts: number };

/** Depolama kapalıysa (gizli pencere vb.) tercih bu sayfa ömrü boyunca bellekte. */
let memoryRaw: string | null = null;
const listeners = new Set<() => void>();

/** useSyncExternalStore için ham kayıt; string olduğu için kararlı karşılaştırılır. */
export function consentSnapshot(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? memoryRaw;
  } catch {
    return memoryRaw;
  }
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  // Başka bir sekmede verilen tercih bu sekmeye de yansısın.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Ham kaydı çözümler; yoksa, eski sürümse ya da süresi dolduysa null. */
export function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw) as Partial<StoredConsent>;
    if (stored.v !== CONSENT_VERSION || typeof stored.ts !== "number") return null;
    if (Date.now() - stored.ts > CONSENT_MAX_AGE_MS) return null;
    return { analytics: stored.analytics === true, ads: stored.ads === true };
  } catch {
    return null;
  }
}

export const readConsent = () => parseConsent(consentSnapshot());

export function writeConsent(choice: ConsentChoice) {
  const stored: StoredConsent = { v: CONSENT_VERSION, ts: Date.now(), ...choice };
  memoryRaw = JSON.stringify(stored);
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, memoryRaw);
  } catch {
    // Depolama kapalıysa tercih yalnız bu sayfa ömrü boyunca geçerli.
  }
  listeners.forEach((listener) => listener());
}

type Gtag = (...args: unknown[]) => void;

const signals = ({ analytics, ads }: ConsentChoice) => {
  const ad = ads ? "granted" : "denied";
  return {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: ad,
    ad_user_data: ad,
    ad_personalization: ad,
  };
};

/** Tercihi Google etiketlerine (Analytics, AdSense) bildirir. */
export function applyConsent(choice: ConsentChoice) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (!gtag) return;
  gtag("consent", "update", signals(choice));
  gtag("set", "ads_data_redaction", !choice.ads);
}

/** Analitik izni geri alındığında Google Analytics çerezlerini temizler. */
export function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (!name || !/^_ga(_|$)|^_gid$/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/**
 * Sayfadaki her şeyden önce çalışan satır içi betik: dataLayer/gtag'ı kurar ve
 * varsayılan izin durumunu bildirir. Daha önce verilmiş geçerli bir tercih
 * varsa doğrudan onu kullanır ki reklam/analitik etiketleri ilk istekte doğru
 * durumu görsün.
 */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
(function(){
  var c=null;
  try{c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}));}catch(e){}
  var ok=c&&c.v===${CONSENT_VERSION}&&typeof c.ts==="number"&&Date.now()-c.ts<=${CONSENT_MAX_AGE_MS};
  var a=ok&&c.analytics===true?"granted":"denied";
  var d=ok&&c.ads===true?"granted":"denied";
  gtag("consent","default",{
    analytics_storage:a,
    ad_storage:d,
    ad_user_data:d,
    ad_personalization:d,
    functionality_storage:"granted",
    security_storage:"granted",
    wait_for_update:500
  });
  gtag("set","ads_data_redaction",d==="denied");
})();
`;
