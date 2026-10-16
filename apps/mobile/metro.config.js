// Expo varsayılan Metro yapılandırması (pnpm monorepo desteği dahil: workspace kökü izlenir, symlink'ler çözülür).
//
// Tek ekleme: tek kopya olması gereken paketleri (react, @tanstack/react-query ...) workspace
// paketlerinden (packages/api-client) gelen içe aktarmalar için de mobil uygulamanın kopyasına
// yönlendirmek.
//
// NEDEN: api-client kendi devDependency'si olarak react 19.2.4 kurar, mobil Expo'nun zorunlu
// kıldığı react 19.2.3'ü kullanır. pnpm bu yüzden iki ayrı @tanstack/react-query kopyası üretir
// (`..._react@19.2.3` ve `..._react@19.2.4`). Metro, api-client kaynağını gerçek konumundan
// (packages/api-client) okuyunca onun kopyasını da pakete katar; her kopyanın kendi React bağlamı
// olduğundan api-client kancaları (useContentListCountries ...) uygulamanın QueryClientProvider'ını
// göremez ve "No QueryClient set" hatası verir. İki React kopyası da "Invalid hook call"a yol açar.
// Bu dosya olmadan sorun yalnız bir ekran api-client kancası çağırınca ortaya çıkar.
const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

/** Paketde tek kopya bulunması gereken modüller (ve alt yolları). */
const SINGLETON_MODULES = ["react", "react-dom", "react-native", "@tanstack/react-query", "@tanstack/query-core"];

// Metro, bir modülü `originModulePath`'in bulunduğu klasörden yukarı doğru node_modules arayarak
// çözer. Kaynağı mobil projenin içinde göstererek arama apps/mobile/node_modules'tan başlar.
const projectOrigin = path.join(projectRoot, "index.js");

/** Workspace paketi mi: mobil projenin dışında ama bir node_modules (üçüncü taraf) içinde değil. */
function isWorkspaceSourceOutsideProject(originModulePath) {
  const outside = !originModulePath.startsWith(projectRoot + path.sep);
  return outside && !originModulePath.split(path.sep).includes("node_modules");
}

function isSingleton(moduleName) {
  return SINGLETON_MODULES.some((name) => moduleName === name || moduleName.startsWith(`${name}/`));
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (isSingleton(moduleName) && isWorkspaceSourceOutsideProject(context.originModulePath)) {
    return context.resolveRequest({ ...context, originModulePath: projectOrigin }, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
