"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";

/** Altbilgide çerez tercih merkezini yeniden açan bağlantı görünümlü düğme. */
export default function ConsentSettingsButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      {label}
    </button>
  );
}
