import React, { memo } from "react";

export type ExperimentalShaderProps = {
  label?: string;
  enabled?: boolean;
  className?: string;
};

/**
 * ExperimentalShader
 *
 * Sandbox-only component for prototyping future Canvas/WebGL ideas.
 * It must not be imported into production Stage components until promoted
 * into a stable engine with review, profiling and build validation.
 */
function ExperimentalShaderComponent({
  label = "XETHKIOZ Sandbox Shader",
  enabled = false,
  className = "",
}: ExperimentalShaderProps) {
  if (!enabled) {
    return (
      <div
        className={[
          "rounded-2xl border border-violet-500/10 bg-[#16141F]/80 p-4",
          "text-xs uppercase tracking-[0.35em] text-slate-400",
          className,
        ].join(" ")}
      >
        {label} / disabled
      </div>
    );
  }

  return (
    <div
      className={[
        "relative isolate overflow-hidden rounded-2xl border border-violet-500/10",
        "bg-[#0B0A0F] p-6 text-slate-100 shadow-[0_0_48px_rgba(139,92,246,0.14)]",
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(139,92,246,.24), transparent 36%), radial-gradient(circle at 70% 62%, rgba(249,115,22,.14), transparent 34%), linear-gradient(135deg, rgba(22,20,31,.9), rgba(11,10,15,.98))",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.22) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-200/80">
          {label}
        </p>
        <p className="mt-3 max-w-xl text-sm text-slate-300">
          Sandbox placeholder for future Gemini/Omni-assisted shader prototypes.
          Promote only after performance review.
        </p>
      </div>
    </div>
  );
}

export const ExperimentalShader = memo(ExperimentalShaderComponent);
ExperimentalShader.displayName = "ExperimentalShader";
