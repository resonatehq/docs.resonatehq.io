"use client";

/**
 * ConsentManager — GDPR/ePrivacy + CPRA-aware cookie consent.
 *
 * Replaces the old Accept-only banner. Provides:
 *   - Accept All / Reject All with EQUAL prominence (no dark-pattern nudging)
 *   - Granular categories (necessary always-on, analytics opt-in)
 *   - Persisted choice (cookie at the registrable root domain, 1 year)
 *   - Google Analytics gated behind opt-in — gtag.js is NOT loaded until the
 *     visitor grants the analytics category. Consent Mode v2 defaults are set
 *     to "denied" in the layout <head> before anything runs (belt + braces).
 *   - A CPRA "Do Not Sell or Share" path (opt out of analytics/sharing).
 *
 * Reopen the panel anywhere via window.__openConsentPreferences().
 * Trigger the CPRA opt-out anywhere via window.__doNotSellOrShare()
 * or by visiting any page with the #do-not-sell hash.
 */

import { useCallback, useEffect, useState } from "react";

const GA_ID = "G-0660YY8LZF";
const COOKIE_NAME = "resonate_consent";
const CONSENT_VERSION = 1;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type Consent = {
  v: number;
  necessary: true;
  analytics: boolean;
  ts: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __openConsentPreferences?: () => void;
    __doNotSellOrShare?: () => void;
    __resonateGaLoaded?: boolean;
  }
}

/** Registrable root domain so consent + GA are shared across subdomains. */
function rootDomain(): string | null {
  const host = window.location.hostname;
  if (host === "localhost" || /^[0-9.]+$/.test(host)) return null; // dev / IP
  const parts = host.split(".");
  return parts.length <= 2 ? host : parts.slice(-2).join(".");
}

function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw.split("=").slice(1).join("=")));
    if (parsed && parsed.v === CONSENT_VERSION) return parsed as Consent;
    return null; // version bump → re-prompt
  } catch {
    return null;
  }
}

function writeConsent(analytics: boolean): Consent {
  const consent: Consent = {
    v: CONSENT_VERSION,
    necessary: true,
    analytics,
    ts: Date.now(),
  };
  const domain = rootDomain();
  const value = encodeURIComponent(JSON.stringify(consent));
  document.cookie =
    `${COOKIE_NAME}=${value}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax` +
    (domain ? `; domain=${domain}` : "");
  return consent;
}

/** Inject gtag.js exactly once and start analytics. */
function loadGoogleAnalytics() {
  if (window.__resonateGaLoaded) return;
  window.__resonateGaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_ID, { anonymize_ip: true });
}

/** Remove GA's first-party cookies on opt-out. */
function clearGaCookies() {
  const domain = rootDomain();
  document.cookie
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_") || name === "_gid")
    .forEach((name) => {
      document.cookie = `${name}=; path=/; max-age=0` + (domain ? `; domain=${domain}` : "");
      document.cookie = `${name}=; path=/; max-age=0`;
    });
}

function applyConsent(consent: Consent) {
  if (consent.analytics) {
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    loadGoogleAnalytics();
  } else {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    clearGaCookies();
  }
}

export default function ConsentManager() {
  const [open, setOpen] = useState(false); // banner or preferences visible
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [decided, setDecided] = useState(true); // has a stored choice

  // Initialise from any stored choice and honour it.
  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setDecided(true);
      setAnalytics(stored.analytics);
      applyConsent(stored);
    } else {
      setDecided(false);
      setOpen(true);
    }

    const openPrefs = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setShowDetails(true);
      setOpen(true);
    };
    const doNotSell = () => {
      const c = writeConsent(false);
      applyConsent(c);
      setAnalytics(false);
      setDecided(true);
      setOpen(false);
    };

    window.__openConsentPreferences = openPrefs;
    window.__doNotSellOrShare = doNotSell;
    if (window.location.hash === "#do-not-sell") doNotSell();

    return () => {
      window.__openConsentPreferences = undefined;
      window.__doNotSellOrShare = undefined;
    };
  }, []);

  const commit = useCallback((analyticsChoice: boolean) => {
    const c = writeConsent(analyticsChoice);
    applyConsent(c);
    setAnalytics(analyticsChoice);
    setDecided(true);
    setOpen(false);
    setShowDetails(false);
  }, []);

  // Small persistent re-entry control once a choice has been made.
  if (!open) {
    if (!decided) return null;
    return (
      <button
        type="button"
        aria-label="Cookie preferences"
        onClick={() => window.__openConsentPreferences?.()}
        className="fixed bottom-4 left-4 z-[1000] rounded-full border border-gray-300 bg-white/90 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm backdrop-blur hover:bg-white dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-200 dark:hover:bg-gray-900"
      >
        Cookie preferences
      </button>
    );
  }

  const btn =
    "flex-1 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[1000] border-t border-gray-200 bg-white p-4 font-sans shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:border-gray-800 dark:bg-gray-950 sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
            We value your privacy
          </p>
          <p>
            We use strictly necessary cookies to run this site. With your consent
            we also use Google Analytics to understand traffic. We do not load
            analytics until you choose to allow it.{" "}
            <a href="/privacy-policy" className="underline hover:no-underline">
              Privacy Policy
            </a>
            .
          </p>

          {showDetails && (
            <div className="mt-4 space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-md border border-gray-200 p-3 dark:border-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Strictly necessary
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Required for the site to function. Always on.
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-gray-400">
                  Always on
                </span>
              </div>
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-md border border-gray-200 p-3 dark:border-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Analytics
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Google Analytics — aggregate traffic and usage.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-gray-900 dark:accent-gray-100"
                />
              </label>
              <button
                type="button"
                onClick={() => window.__doNotSellOrShare?.()}
                className="text-xs font-medium text-gray-600 underline hover:no-underline dark:text-gray-400"
              >
                Do Not Sell or Share My Personal Information
              </button>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 md:w-72">
          <div className="flex gap-2">
            {/* Equal prominence: Reject and Accept share identical styling. */}
            <button
              type="button"
              onClick={() => commit(false)}
              className={`${btn} border border-gray-900 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-100 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900`}
            >
              Reject all
            </button>
            <button
              type="button"
              onClick={() => commit(showDetails ? analytics : true)}
              className={`${btn} bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200`}
            >
              {showDetails ? "Save choices" : "Accept all"}
            </button>
          </div>
          {!showDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="rounded-md px-5 py-2 text-sm font-medium text-gray-600 underline hover:no-underline dark:text-gray-400"
            >
              Customize
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
