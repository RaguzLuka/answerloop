"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { completeWhatsAppSignup, disconnectWhatsApp } from "@/lib/actions/connections";
import Icon from "@/components/Icon";

/* "Connect WhatsApp" with Meta's Embedded Signup window. The owner logs in with
   Facebook, picks their WhatsApp Business number (their existing app number, or
   a new one) and allows RingLoop; Meta hands back a one-time code + the IDs. */

type FB = {
  init: (o: Record<string, unknown>) => void;
  login: (cb: (r: { authResponse?: { code?: string } }) => void, o: Record<string, unknown>) => void;
};
declare global {
  interface Window {
    FB?: FB;
    fbAsyncInit?: () => void;
  }
}

function loadSdk(appId: string) {
  return new Promise<FB>((resolve) => {
    if (window.FB) return resolve(window.FB);
    window.fbAsyncInit = () => {
      window.FB!.init({ appId, autoLogAppEvents: true, xfbml: false, version: "v23.0" });
      resolve(window.FB!);
    };
    const s = document.createElement("script");
    s.src = "https://connect.facebook.net/en_US/sdk.js";
    s.async = true;
    s.defer = true;
    s.crossOrigin = "anonymous";
    document.body.appendChild(s);
  });
}

export default function ConnectWhatsApp({
  appId, configId, simulate, connected, displayPhone, ownApp,
}: {
  appId: string | null;
  configId: string | null;
  /** development only: fake the Meta window */
  simulate: boolean;
  connected: boolean;
  displayPhone: string | null;
  ownApp: boolean;
}) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const session = useRef<{ wabaId?: string; phoneNumberId?: string; coexistence?: boolean }>({});
  const available = simulate || (!!appId && !!configId);

  // Meta reports the chosen account/number via postMessage from its window
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!/(^|\.)facebook\.com$/.test(new URL(e.origin).hostname)) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.type !== "WA_EMBEDDED_SIGNUP") return;
        if (String(data.event).startsWith("FINISH")) {
          session.current = {
            wabaId: data.data?.waba_id,
            phoneNumberId: data.data?.phone_number_id,
            coexistence: data.event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING",
          };
        }
      } catch {}
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const finish = (code: string, coexistence: boolean) =>
    start(async () => {
      const r = await completeWhatsAppSignup({
        code,
        wabaId: session.current.wabaId ?? "",
        phoneNumberId: session.current.phoneNumberId ?? "",
        coexistence: session.current.coexistence ?? coexistence,
      });
      setMsg(r.ok ? { ok: true, text: r.message } : { ok: false, text: r.error });
    });

  async function connect(coexistence: boolean) {
    setMsg(null);
    if (simulate) {
      session.current = { wabaId: "209876543211", phoneNumberId: String(109876543200 + Math.floor(Math.random() * 99)), coexistence };
      return finish("dry-code", coexistence);
    }
    const fb = await loadSdk(appId!);
    fb.login(
      (r) => {
        const code = r.authResponse?.code;
        if (code) finish(code, coexistence);
        else setMsg({ ok: false, text: "The WhatsApp window was closed before finishing." });
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          sessionInfoVersion: "3",
          ...(coexistence ? { featureType: "whatsapp_business_app_onboarding" } : {}),
        },
      },
    );
  }

  if (connected) {
    return (
      <div className="space-y-3">
        <p className="flex items-center gap-2 font-medium text-ok">
          <Icon name="checkCircle" className="h-5 w-5" /> Connected{displayPhone ? `: ${displayPhone}` : ""}
        </p>
        <p className="text-sm text-ink-soft">
          {ownApp
            ? "Halo writes from your WhatsApp Business number. Keep using your app as usual: Halo only answers people who called and couldn't get through, and steps back as soon as you write."
            : "Halo writes from this number, under your business name."}
        </p>
        <button
          className="btn btn-quiet btn-sm text-danger"
          disabled={pending}
          onClick={() => window.confirm("Disconnect WhatsApp? Missed callers will get an SMS instead.") && start(() => disconnectWhatsApp())}
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (!available) {
    return (
      <p className="text-sm text-ink-soft">
        Connecting WhatsApp yourself is coming soon. Until then we connect it with you. Request a visit under Help, and
        missed callers get an SMS in the meantime.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="btn btn-primary" disabled={pending} onClick={() => connect(true)}>
          <Icon name="message" className="h-4 w-4" /> {pending ? "Connecting…" : "Use my WhatsApp Business number"}
        </button>
        <button className="btn btn-secondary" disabled={pending} onClick={() => connect(false)}>
          Use a new number
        </button>
      </div>
      <p className="text-sm text-muted">
        You log in with Facebook and choose your number. Customers see your business name. Meta charges a few cents for
        each first message; replies are free.{simulate ? " (Development: simulated.)" : ""}
      </p>
      {msg && <p className={`text-sm ${msg.ok ? "text-ok" : "text-danger"}`}>{msg.text}</p>}
    </div>
  );
}
