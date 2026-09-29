"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Play, Radio, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface HeroSectionProps {
  liveStream: any;
  nextStream: any;
}

export function HeroSection({ liveStream, nextStream }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden tbc-hero-gradient text-white py-14 sm:py-24 shadow-2xl transition-colors">
      {/* 3D Motion Aurora Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 -top-20 h-[450px] w-[450px] rounded-full bg-sky-400/25 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-purple-500/25 blur-3xl"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />

      <div className="container-app relative grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        {/* Left Column: Headline, Mandate, & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {liveStream ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-600/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Live Broadcast in Progress
              </span>
            ) : nextStream ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20">
                <Radio className="h-3.5 w-3.5 text-sky-300" />
                Next Broadcast &bull; {formatDate(nextStream.scheduledStart)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                The Brook Church &bull; Calabar
              </span>
            )}
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl text-balance">
            An Unfolding Story of God&apos;s Grace
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-sky-100 sm:text-lg">
            {liveStream
              ? liveStream.description ?? "Join our live service broadcast right now."
              : "Welcome to The Brook Church. Discover the power of Grace, the ministry of the Holy Spirit (Pneumatology), and walk in the exceptional Zoe life designed for you."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/live"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-bold text-sky-950 shadow-xl transition-all hover:bg-sky-50 hover:scale-105 active:scale-95"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
              {liveStream ? "Watch Live Now" : "Launch Live Stream"}
            </Link>

            <Link
              href="/sermons"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Browse Sermons</span>
            </Link>

            <Link
              href="/give"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl transition-all hover:bg-emerald-600 hover:scale-105 active:scale-95"
            >
              <span>Give Online</span>
            </Link>
          </div>

          {/* Quick Pillars */}
          <div className="mt-10 pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <p className="font-serif text-lg sm:text-xl font-bold text-white">Grace</p>
              <p className="text-[11px] text-sky-200">Divine Empowerment</p>
            </div>
            <div>
              <p className="font-serif text-lg sm:text-xl font-bold text-white">Pneumatology</p>
              <p className="text-[11px] text-sky-200">Ways of the Spirit</p>
            </div>
            <div>
              <p className="font-serif text-lg sm:text-xl font-bold text-white">Zoe Life</p>
              <p className="text-[11px] text-sky-200">Uncreated Abundance</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Holographic Media Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative group"
        >
          {/* Subtle 3D tilt container */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/20 bg-slate-950 shadow-2xl tbc-glow">
            {liveStream ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white bg-radial from-slate-900 to-black">
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Live Broadcast Online
                </span>
                <p className="mt-3 font-serif text-2xl font-bold text-white">{liveStream.title}</p>
                <p className="mt-1 text-xs text-slate-400">Streaming live on web and all devices</p>
                <Link
                  href="/live"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl hover:bg-red-700 hover:scale-105 transition"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Join Sanctuary Live Broadcast</span>
                </Link>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/Ya3yIiRPqT0?rel=0&modestbranding=1&controls=1"
                title="The Brook Church — Latest Broadcast"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
