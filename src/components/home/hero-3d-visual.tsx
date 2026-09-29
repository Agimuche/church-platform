"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Play, Sparkles, Video } from "lucide-react";

interface HeroVisualProps {
  isLive: boolean;
  liveTitle?: string;
  liveDescription?: string;
}

export function Hero3dVisual({ isLive, liveTitle, liveDescription }: HeroVisualProps) {
  const [activeMode, setActiveMode] = useState<"broadcast" | "interactive3d">("broadcast");
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Motion values for mouse hover tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative w-full perspective-1000">
      {/* Outer ambient glow */}
      <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500/30 via-accent/40 to-amber-500/20 blur-xl opacity-75 animate-pulse-glow" />

      {/* Mode switcher tabs above player */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/60 p-1 backdrop-blur-md text-[11px] font-semibold text-white">
          <button
            type="button"
            onClick={() => setActiveMode("broadcast")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition ${
              activeMode === "broadcast"
                ? "bg-accent text-white shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Video className="h-3 w-3" />
            <span>Sanctuary Stream</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("interactive3d")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition ${
              activeMode === "interactive3d"
                ? "bg-accent text-white shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>3D Grace Portal</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-sky-200">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>High-Def 1080p Stream</span>
        </div>
      </div>

      {/* 3D Tilting Card Container */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/25 bg-slate-950 shadow-2xl transition-all duration-200"
      >
        {activeMode === "broadcast" ? (
          isLive ? (
            <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center text-white">
              {/* Dynamic animated videographics background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/60 via-slate-950 to-slate-950" />
              
              {/* Animated audio wave graphic */}
              <div className="relative z-10 flex items-center gap-1 mb-4">
                {[4, 16, 28, 12, 22, 10, 26, 8, 18].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: [4, h, 6] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + (i % 3) * 0.2,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    className="w-1 rounded-full bg-cyan-400"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Live Broadcast Active
                </span>
                <h3 className="mt-3 text-xl font-bold font-serif sm:text-2xl text-white drop-shadow-md">
                  {liveTitle || "Phronesis & Doxa Sunday Experience"}
                </h3>
                <p className="mt-1 text-xs text-sky-200 max-w-md mx-auto line-clamp-2">
                  {liveDescription || "Streaming live from the Sanctuary with Pastors Ose & Naomi Imiemohon."}
                </p>
                <Link
                  href="/live"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl hover:bg-red-500 hover:scale-105 transition"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Enter Live Sanctuary →</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full">
              <iframe
                src="https://www.youtube.com/embed/Ya3yIiRPqT0?rel=0&modestbranding=1&controls=1&autoplay=0"
                title="The Brook Church — Latest Service Broadcast"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          )
        ) : (
          /* 3D Grace Portal Interactive Graphics Mode */
          <div className="relative flex h-full w-full flex-col items-center justify-center p-8 text-center text-white overflow-hidden">
            {/* Celestial space & water gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-950" />

            {/* Floating 3D Graphic Elements */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.08, 1],
              }}
              transition={{
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-12 -right-12 h-64 w-64 rounded-full border border-sky-400/20 bg-sky-500/10 blur-xl pointer-events-none"
            />
            <motion.div
              animate={{
                rotate: -360,
                scale: [1, 1.15, 1],
              }}
              transition={{
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full border border-amber-400/20 bg-amber-500/10 blur-xl pointer-events-none"
            />

            {/* Central Holographic Logo Emblem */}
            <motion.div
              animate={{ y: [-4, 6, -4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-sky-400/40 shadow-2xl p-1 bg-slate-900/80 backdrop-blur-md">
                <Image
                  src="/logo.jpg"
                  alt="The Brook Church"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>

              <span className="mt-3 inline-block rounded-full bg-sky-500/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-sky-300 border border-sky-400/30">
                Pneumatology &bull; Zoe Life &bull; Grace
              </span>
              <h3 className="mt-2 font-serif text-lg sm:text-xl font-bold text-white">
                The Divine Mandate
              </h3>
              <p className="mt-1 max-w-sm text-xs text-sky-100 leading-relaxed">
                &ldquo;Empowerment upon the spirit of man to fulfill God&apos;s purpose for his generation.&rdquo;
              </p>

              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/live"
                  className="rounded-full bg-accent px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition"
                >
                  Join Online Service
                </Link>
                <Link
                  href="/about"
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition"
                >
                  Our Mandate
                </Link>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bottom watermark badge */}
        <div className="absolute bottom-2.5 right-3 pointer-events-none z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span>The Brook Church Media</span>
        </div>
      </motion.div>
    </div>
  );
}
