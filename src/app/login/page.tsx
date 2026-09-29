import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";
import { Sparkles, Key } from "lucide-react";

export const metadata = {
  title: "Admin & Member Login | The Brook Church",
  description: "Sign in to The Brook Church platform. Access the Admin Portal, manage live broadcasts, sermons, store products, and files.",
};

export default function LoginPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-5rem)] py-12 sm:py-16 transition-colors">
      <div className="container-app max-w-md">
        {/* Header Emblem */}
        <div className="text-center mb-8">
          <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-2xl border-2 border-accent/30 shadow-lg p-1 bg-paper mb-4">
            <Image
              src="/logo.jpg"
              alt="The Brook Church"
              fill
              className="object-cover rounded-xl"
              priority
            />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent border border-accent/20">
            <Sparkles className="h-3 w-3" />
            <span>The Brook Church Portal</span>
          </span>
          <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-ink">
            Sign In &amp; Admin Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Access the church administration console, update media, schedule livestreams, and manage church resources.
          </p>
        </div>

        {/* Login Form with 1-Click Fast Admin Sign In */}
        <Suspense fallback={<div className="h-96 rounded-2xl border border-border bg-paper animate-pulse" />}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Need a member account?{" "}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Register as a church member
          </Link>
        </p>

        {/* Credentials Reminder Box */}
        <div className="mt-8 rounded-2xl border border-border bg-surface-tint p-4 text-xs text-ink-muted">
          <p className="font-bold text-ink flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-accent" />
            <span>Default Super Admin Credentials:</span>
          </p>
          <div className="mt-2 space-y-1 font-mono text-[11px]">
            <p>Email: <span className="text-ink font-semibold">admin@thebrookchurch.org</span> or <span className="text-ink font-semibold">agimuche1@gmail.com</span></p>
            <p>Password: <span className="text-ink font-semibold">ChangeMe123!</span></p>
          </div>
          <p className="mt-2 text-[11px] text-ink-muted">
            Clicking the <strong>⚡ Enter Admin Dashboard Directly</strong> button logs you in automatically with full admin privileges.
          </p>
        </div>
      </div>
    </div>
  );
}
