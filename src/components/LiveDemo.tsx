"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

type Status = "idle" | "connecting" | "live" | "ended" | "error";

const MAX_SECONDS = 180; // 3-minute demo cap

export default function LiveDemo() {
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback((finalStatus: Status = "idle") => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    micRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    setStatus(finalStatus);
  }, []);

  // Clean up on page leave
  useEffect(() => () => stop(), [stop]);

  async function start() {
    setError("");
    setSeconds(0);
    setStatus("connecting");
    try {
      const tokenRes = await fetch("/api/demo-session", { method: "POST" });
      if (tokenRes.status === 429) {
        throw new Error("You've reached the demo limit for now — book a personal demo and we'll call you instead.");
      }
      if (!tokenRes.ok) throw new Error("The demo is temporarily unavailable. Please try again in a minute.");
      const { value: token } = await tokenRes.json();

      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      micRef.current = mic;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;
      pc.ontrack = (e) => {
        if (audioRef.current) audioRef.current.srcObject = e.streams[0];
      };
      pc.addTrack(mic.getTracks()[0], mic);

      // Data channel kicks off her greeting; we intentionally do NOT render
      // any transcript — imperfect speech-to-text would undermine the demo.
      const dc = pc.createDataChannel("oai-events");
      dc.onopen = () => {
        // Trigger her greeting, just like picking up a real call
        dc.send(JSON.stringify({ type: "response.create" }));
        setStatus("live");
        timerRef.current = setInterval(() => {
          setSeconds((s) => {
            if (s + 1 >= MAX_SECONDS) stop("ended");
            return s + 1;
          });
        }, 1000);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const sdpRes = await fetch("https://api.openai.com/v1/realtime/calls?model=gpt-realtime-2", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/sdp" },
        body: offer.sdp,
      });
      if (!sdpRes.ok) throw new Error("Could not connect the audio. Please try again.");
      await pc.setRemoteDescription({ type: "answer", sdp: await sdpRes.text() });
    } catch (err) {
      stop();
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(
        err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "NotFoundError")
          ? "We need microphone access for the demo — please allow it in your browser and try again."
          : msg
      );
      setStatus("error");
    }
  }

  const mmss = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="mx-auto w-full max-w-xl">
      <audio ref={audioRef} autoPlay playsInline className="hidden" />

      {/* ── Idle / error: the big start moment ── */}
      {(status === "idle" || status === "error" || status === "connecting") && (
        <div className="text-center">
          <button
            onClick={start}
            disabled={status === "connecting"}
            className="group relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-blue text-white shadow-2xl shadow-blue/30 transition-all duration-300 hover:bg-blue-deep hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
            aria-label="Start the live demo"
          >
            <span className="ring-pulse absolute inset-0 rounded-full bg-blue/25" />
            <span className="ring-pulse-2 absolute inset-0 rounded-full bg-blue/15" />
            <span className="relative flex flex-col items-center gap-2">
              <Icon name="phone" className="h-9 w-9" />
              <span className="text-sm font-semibold">
                {status === "connecting" ? "Connecting…" : "Start talking"}
              </span>
            </span>
          </button>
          <p className="mt-7 text-sm text-ink-soft">
            {status === "connecting"
              ? "Setting up your private demo call…"
              : "One click. Allow your microphone. She answers."}
          </p>
          {status === "error" && (
            <p className="mx-auto mt-4 max-w-sm rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}

      {/* ── Live call ── */}
      {status === "live" && (
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 bg-night px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue text-white">
              <Icon name="phone" className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-white">Klinika Adria (demo)</p>
              <p className="text-xs text-[#7fa6f8]">AI receptionist · live · {mmss}</p>
            </div>
            <div className="flex h-4 items-center gap-[3px]">
              {[10, 16, 7, 13, 9].map((h, i) => (
                <span key={i} className="wave-bar w-[3px] rounded-full bg-[#7fa6f8]" style={{ height: `${h}px`, animationDelay: `${i * 0.13}s` }} />
              ))}
            </div>
            <button
              onClick={() => stop("ended")}
              className="ml-2 rounded-full bg-red-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-400 transition-colors"
            >
              End call
            </button>
          </div>

          {/* Live call visual — no transcript, just talk and listen */}
          <div className="flex h-80 flex-col items-center justify-center gap-8 bg-gradient-to-b from-sky/40 to-white px-6">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <span className="ring-pulse absolute inset-0 rounded-full bg-blue/20" />
              <span className="ring-pulse-2 absolute inset-3 rounded-full bg-blue/15" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue text-white shadow-lg shadow-blue/30">
                <Icon name="phone" className="h-8 w-8" />
              </span>
            </div>

            {/* Animated voice waveform */}
            <div className="flex h-8 items-center gap-1.5">
              {[14, 22, 12, 26, 16, 24, 13].map((h, i) => (
                <span
                  key={i}
                  className="wave-bar w-1 rounded-full bg-blue"
                  style={{ height: `${h}px`, animationDelay: `${i * 0.11}s` }}
                />
              ))}
            </div>

            <p className="text-sm font-medium text-ink-soft">
              Just talk — she&apos;s listening. Speak naturally, in any language.
            </p>
          </div>
        </div>
      )}

      {/* ── Demo over: the sell ── */}
      {status === "ended" && (
        <div className="card p-10 text-center">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky text-blue">
            <Icon name="sparkles" className="h-7 w-7" />
          </span>
          <h3 className="font-display mb-3 text-3xl">That was <em className="text-blue">RingLoop.</em></h3>
          <p className="mx-auto mb-9 max-w-sm leading-relaxed text-ink-soft">
            Exactly this answers your clinic&apos;s missed calls — 24/7, in your patients&apos; language, booked and confirmed. Setup takes one day.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn-primary group px-8 py-3.5">
              Get this for my clinic
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <button onClick={start} className="rounded-full border border-[var(--line)] bg-white px-8 py-3.5 font-semibold text-ink-soft transition-all duration-300 hover:border-blue/30 hover:text-blue">
              Talk to her again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
