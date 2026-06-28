import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

type GreenNodeBannerPreviewProps = {
  className?: string;
  /**
   * Sandbox-only audio gate.
   * In production promotion, wire this value to HudContext sound/mute state.
   */
  hudSoundEnabled?: boolean;
  videoSrc?: string;
};

type HackSynthController = {
  start: () => void;
  stop: () => void;
  setMuted: (muted: boolean) => void;
};

const DEFAULT_GREEN_NODE_VIDEO = "/videos/green-wisp-nexus.mp4";

function createHackSynthController(): HackSynthController | null {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  const audioContext = new AudioContextClass();
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioContext.destination);

  let timerId: number | null = null;
  let isMuted = true;

  const triggerPulse = () => {
    if (isMuted || audioContext.state === "closed") {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = Math.random() > 0.55 ? "square" : "sawtooth";
    oscillator.frequency.value = 120 + Math.random() * 820;

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.075);

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.085);
  };

  const schedule = () => {
    triggerPulse();

    timerId = window.setTimeout(
      schedule,
      90 + Math.random() * 360
    );
  };

  return {
    start: () => {
      if (audioContext.state === "suspended") {
        void audioContext.resume();
      }

      if (timerId === null) {
        schedule();
      }
    },

    stop: () => {
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }

      masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.03);
    },

    setMuted: (muted: boolean) => {
      isMuted = muted;
      masterGain.gain.setTargetAtTime(muted ? 0 : 0.22, audioContext.currentTime, 0.045);
    },
  };
}

/**
 * GreenNodeBannerPreview
 *
 * Sandbox-only multimedia banner prototype.
 * Do not import into production UI until promoted through Media Engine review.
 */
function GreenNodeBannerPreviewComponent({
  className = "",
  hudSoundEnabled = false,
  videoSrc = DEFAULT_GREEN_NODE_VIDEO,
}: GreenNodeBannerPreviewProps) {
  const synthRef = useRef<HackSynthController | null>(null);
  const [armed, setArmed] = useState(false);

  const isAudioAllowed = hudSoundEnabled && armed;

  const handleArmAudio = useCallback(() => {
    setArmed(true);

    if (!synthRef.current) {
      synthRef.current = createHackSynthController();
    }

    synthRef.current?.start();
    synthRef.current?.setMuted(!hudSoundEnabled);
  }, [hudSoundEnabled]);

  useEffect(() => {
    if (!synthRef.current && armed) {
      synthRef.current = createHackSynthController();
    }

    synthRef.current?.setMuted(!isAudioAllowed);

    return () => {
      synthRef.current?.stop();
    };
  }, [armed, isAudioAllowed]);

  const statusLabel = useMemo(() => {
    if (!hudSoundEnabled) {
      return "HUD muted";
    }

    return armed ? "Matrix audio armed" : "Tap to arm audio";
  }, [armed, hudSoundEnabled]);

  return (
    <section
      className={[
        "relative isolate overflow-hidden rounded-3xl border border-emerald-400/15",
        "bg-[#0B0A0F] shadow-[0_0_60px_rgba(34,197,94,0.16)]",
        "min-h-[320px] text-slate-100",
        className,
      ].join(" ")}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-55 saturate-125"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#0B0A0F]/45 mix-blend-multiply"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,.18) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(34,197,94,.32), transparent 34%), radial-gradient(circle at 82% 64%, rgba(139,92,246,.18), transparent 34%), linear-gradient(180deg, transparent, rgba(11,10,15,.86))",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0px, rgba(255,255,255,.35) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative z-10 flex min-h-[320px] flex-col justify-end p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.45em] text-emerald-200/80">
            Green Node / Sandbox Preview
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-emerald-50 sm:text-5xl">
            Wisp Nexus Signal
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Video background layer with procedural Web Audio glitch pulses.
            Sandbox-only: promote through Media Engine review before production.
          </p>

          <button
            type="button"
            onClick={handleArmAudio}
            className={[
              "mt-6 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.28em]",
              "transition duration-300",
              hudSoundEnabled
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/15"
                : "border-slate-500/20 bg-slate-900/40 text-slate-400",
            ].join(" ")}
          >
            {statusLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export const GreenNodeBannerPreview = memo(GreenNodeBannerPreviewComponent);
GreenNodeBannerPreview.displayName = "GreenNodeBannerPreview";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
