(function initPfandigoDeepLinks(global) {
  "use strict";

  // Migration constants: keep legacy support until app rollout is complete.
  var LEGACY_SCHEME = "pfanda";
  var PRIMARY_SCHEME = "pfandigo";

  // TODO(app cleanup): Remove LEGACY_SCHEME fallback after migration window.
  // App-side follow-up required in Expo config / deep-link parser:
  // - schemes: ["pfanda", "pfandigo"]
  // - routes: auth/callback, wallet/connect-return, wallet/connect-refresh, stripe-redirect

  function normalizePath(path) {
    if (!path) return "";
    return String(path).replace(/^\/+/, "");
  }

  function buildAppUrl(scheme, path, search, hash) {
    var safePath = normalizePath(path);
    var safeSearch = search || "";
    var safeHash = hash || "";
    return scheme + "://" + safePath + safeSearch + safeHash;
  }

  function getSchemeUrls(path, search, hash) {
    return {
      primary: buildAppUrl(PRIMARY_SCHEME, path, search, hash),
      legacy: buildAppUrl(LEGACY_SCHEME, path, search, hash)
    };
  }

  function redirectWithFallback(path, options) {
    var cfg = options || {};
    var search = cfg.search != null ? cfg.search : global.location.search;
    var hash = cfg.hash != null ? cfg.hash : global.location.hash;
    var fallbackDelayMs = typeof cfg.fallbackDelayMs === "number" ? cfg.fallbackDelayMs : 900;

    var urls = getSchemeUrls(path, search, hash);
    global.location.replace(urls.primary);

    global.setTimeout(function fallbackToLegacy() {
      global.location.replace(urls.legacy);
    }, fallbackDelayMs);

    return urls;
  }

  global.PFANDIGO_DEEP_LINKS = {
    LEGACY_SCHEME: LEGACY_SCHEME,
    PRIMARY_SCHEME: PRIMARY_SCHEME,
    getSchemeUrls: getSchemeUrls,
    redirectWithFallback: redirectWithFallback
  };
})(window);

