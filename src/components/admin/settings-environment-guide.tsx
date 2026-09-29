"use client";

import React, { useState } from "react";
import {
  Database,
  Shield,
  CreditCard,
  Cloud,
  Radio,
  Copy,
  Check,
  Rocket,
  Info,
} from "lucide-react";

interface SettingsEnvProps {
  currentEnv: {
    streamingProvider: string;
    paymentProvider: string;
    storageProvider: string;
    nodeEnv: string;
  };
}

export function SettingsEnvironmentGuide({ currentEnv }: SettingsEnvProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"env-guide" | "vercel-deploy" | "current-status">("env-guide");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const ENV_CONFIGS = [
    {
      key: "DATABASE_URL",
      category: "Database (PostgreSQL)",
      icon: Database,
      required: true,
      description: "Direct connection string to your PostgreSQL database with SSL mode enabled.",
      howToGet: "1. Create a free PostgreSQL database at Neon.tech, Supabase.com, or Cloud SQL.\n2. In Neon/Supabase dashboard, click 'Connect' or 'Database Settings'.\n3. Copy the pooled connection string (postgresql://...).",
      example: 'DATABASE_URL="postgresql://username:password@ep-cool-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"',
    },
    {
      key: "AUTH_SECRET",
      category: "Authentication Security",
      icon: Shield,
      required: true,
      description: "Cryptographic secret used by NextAuth v5 to sign JWT session cookies and secure login tokens.",
      howToGet: "Run this command in your terminal:\nnpx auth secret\nOr generate using openssl:\nopenssl rand -base64 33",
      example: 'AUTH_SECRET="7f3a9b2c8d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"',
    },
    {
      key: "NEXTAUTH_URL",
      category: "Authentication Security",
      icon: Shield,
      required: false,
      description: "Canonical public origin of your application. Set to your production domain or Vercel URL.",
      howToGet: "Use your deployed Vercel domain or custom church domain:\nhttps://your-church-platform.vercel.app or https://thebrookchurchng.org",
      example: 'NEXTAUTH_URL="https://your-church-app.vercel.app"',
    },
    {
      key: "PAYMENT_PROVIDER & PAYSTACK_SECRET_KEY",
      category: "Payments & Online Store",
      icon: CreditCard,
      required: true,
      description: "Payment gateway integration for digital book purchases and online church donations/tithes.",
      howToGet: "1. Sign up or log into Paystack at dashboard.paystack.com.\n2. Go to Settings → API Keys & Webhooks.\n3. Copy Secret Key (starts with sk_live_... for production, sk_test_... for testing).\n4. Set webhook URL to https://your-domain.com/api/webhooks/paystack.",
      example: 'PAYMENT_PROVIDER="paystack"\nPAYSTACK_SECRET_KEY="sk_live_1234567890abcdef..."',
    },
    {
      key: "STORAGE_PROVIDER & S3 CONFIG",
      category: "Media & File Storage",
      icon: Cloud,
      required: false,
      description: "Cloud object storage for audio sermons, video files, and book PDFs. Defaults to local disk storage in development.",
      howToGet: "For AWS S3 or Cloudflare R2:\n1. Create a bucket (e.g. 'tbc-media-storage').\n2. Create an IAM user with S3 Read/Write permissions.\n3. Copy Access Key ID and Secret Access Key.",
      example: 'STORAGE_PROVIDER="s3"\nS3_BUCKET_NAME="tbc-church-media"\nS3_PUBLIC_BASE_URL="https://tbc-church-media.s3.amazonaws.com"\nAWS_REGION="us-east-1"\nAWS_ACCESS_KEY_ID="AKIA..."\nAWS_SECRET_ACCESS_KEY="wJalr..."',
    },
    {
      key: "STREAMING_PROVIDER",
      category: "Live Streaming Engine",
      icon: Radio,
      required: false,
      description: "Controls the live streaming provider. The app natively supports Direct Cloud HLS/WebRTC streaming, browser Studio Cam, and YouTube embeds with zero external paid APIs required.",
      howToGet: "Set to 'mock' for built-in native streaming, or integrate Mux/Livepeer if desired.",
      example: 'STREAMING_PROVIDER="mock"',
    },
  ];

  const fullEnvTemplate = `# =========================================
# THE BROOK CHURCH PLATFORM - PRODUCTION ENV
# =========================================

# 1. Database (PostgreSQL - Neon / Supabase / Cloud SQL)
DATABASE_URL="postgresql://user:password@ep-cool-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 2. NextAuth v5 Security
AUTH_SECRET="your-generated-32-char-random-secret-key"
NEXTAUTH_URL="https://your-church-app.vercel.app"

# 3. Super Admin Seeding
SEED_SUPER_ADMIN_EMAIL="admin@church.local"
SEED_SUPER_ADMIN_PASSWORD="YourSecurePasswordHere!"

# 4. Providers Configuration
STREAMING_PROVIDER="mock"
PAYMENT_PROVIDER="paystack"
PAYSTACK_SECRET_KEY="sk_live_..."

# 5. Object Storage (Optional for S3/R2)
STORAGE_PROVIDER="local"
S3_BUCKET_NAME=""
S3_PUBLIC_BASE_URL=""
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
`;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">System Settings &amp; Deployment</h1>
        <p className="mt-1 text-xs text-ink-muted sm:text-sm">
          Master reference guide for environment variables, cloud integrations, and Vercel deployment.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("env-guide")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "env-guide"
              ? "bg-accent text-white shadow-xs"
              : "bg-surface-tint text-ink-muted hover:text-ink"
          }`}
        >
          Environment Keys Guide
        </button>
        <button
          onClick={() => setActiveTab("vercel-deploy")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "vercel-deploy"
              ? "bg-accent text-white shadow-xs"
              : "bg-surface-tint text-ink-muted hover:text-ink"
          }`}
        >
          <Rocket className="h-3.5 w-3.5" />
          <span>Vercel Deployment Guide</span>
        </button>
        <button
          onClick={() => setActiveTab("current-status")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "current-status"
              ? "bg-accent text-white shadow-xs"
              : "bg-surface-tint text-ink-muted hover:text-ink"
          }`}
        >
          Active Runtime Status
        </button>
      </div>

      {/* Tab 1: Environment Variables Guide */}
      {activeTab === "env-guide" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 p-5">
            <div>
              <h3 className="font-bold text-sm text-sky-900 dark:text-sky-200">
                Complete Production Environment Template
              </h3>
              <p className="mt-1 text-xs text-sky-700 dark:text-sky-300">
                Copy this complete template and paste it into your Vercel Project Settings or local .env file.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(fullEnvTemplate, "all")}
              className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-accent-dark transition shrink-0"
            >
              {copiedKey === "all" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedKey === "all" ? "Copied All!" : "Copy Full .env Template"}</span>
            </button>
          </div>

          <div className="space-y-6">
            {ENV_CONFIGS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.key}
                  className="rounded-3xl border border-border bg-paper p-6 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-ink">{c.key}</span>
                          {c.required && (
                            <span className="rounded-full bg-red-100 dark:bg-red-950/50 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-300">
                              Essential
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-ink-muted">{c.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(c.example, c.key)}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-tint transition self-start sm:self-center"
                    >
                      {copiedKey === c.key ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Value</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-ink-muted">{c.description}</p>

                  <div className="mt-4 rounded-xl bg-surface-tint p-4 border border-border">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink mb-1.5 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5 text-accent" />
                      <span>How to obtain this key:</span>
                    </p>
                    <pre className="text-xs leading-relaxed text-ink-muted font-sans whitespace-pre-line">
                      {c.howToGet}
                    </pre>
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] font-mono text-ink-muted mb-1">Example format:</p>
                    <pre className="rounded-xl bg-slate-950 p-3 text-xs text-sky-300 font-mono overflow-x-auto">
                      {c.example}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Vercel Deployment Guide */}
      {activeTab === "vercel-deploy" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-paper p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-ink">
              Deploying The Brook Church Platform on Vercel
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              This application is built with Next.js 15+ App Router and is fully optimized for zero-configuration Vercel deployment. Follow these 5 steps to deploy in under 3 minutes:
            </p>

            <div className="space-y-6 pt-2">
              <div className="flex gap-4 items-start">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-xs">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-sm text-ink">Commit &amp; Push to GitHub</h4>
                  <p className="mt-1 text-xs text-ink-muted">
                    Make sure all your latest code is pushed to your GitHub repository (e.g. <code>Agimuche/church-platform</code>).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-xs">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-sm text-ink">Import Project in Vercel</h4>
                  <p className="mt-1 text-xs text-ink-muted">
                    Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-accent underline font-semibold">vercel.com/new</a>, connect your GitHub account, and select <code>church-platform</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-xs">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-sm text-ink">Configure Environment Variables in Vercel</h4>
                  <p className="mt-1 text-xs text-ink-muted">
                    Before clicking deploy, expand the <strong>Environment Variables</strong> accordion on Vercel and paste your variables:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-xs text-ink-muted space-y-1">
                    <li><code>DATABASE_URL</code> (Your PostgreSQL connection URL from Neon/Supabase)</li>
                    <li><code>AUTH_SECRET</code> (Generated 32-character secret)</li>
                    <li><code>NEXTAUTH_URL</code> (Your production Vercel domain)</li>
                    <li><code>PAYMENT_PROVIDER</code> (Set to <code>paystack</code> or <code>mock</code>)</li>
                    <li><code>PAYSTACK_SECRET_KEY</code> (If using Paystack)</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-xs">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-sm text-ink">Click Deploy</h4>
                  <p className="mt-1 text-xs text-ink-muted">
                    Vercel will build the Next.js bundle and deploy globally on high-speed CDN edge nodes with SSL certificates automatically issued.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-xs">
                  5
                </span>
                <div>
                  <h4 className="font-bold text-sm text-ink">Push Database Schema &amp; Seed Admin</h4>
                  <p className="mt-1 text-xs text-ink-muted">
                    Run the migration against your live database from your terminal:
                  </p>
                  <pre className="mt-2 rounded-xl bg-slate-950 p-3 text-xs text-emerald-400 font-mono">
                    npx prisma db push{"\n"}
                    npm run db:seed
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Current Runtime Status */}
      {activeTab === "current-status" && (
        <div className="rounded-3xl border border-border bg-paper p-6 sm:p-8 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-ink">Current Environment Active Drivers</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Status of integrations running in the current container instance.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-semibold text-ink bg-surface-tint w-1/3">Environment Mode</td>
                  <td className="px-4 py-3 text-ink font-mono">{currentEnv.nodeEnv}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-ink bg-surface-tint">Database Engine</td>
                  <td className="px-4 py-3 text-ink font-mono">Prisma Client with Transparent In-Memory Store Fallback</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-ink bg-surface-tint">Streaming Driver</td>
                  <td className="px-4 py-3 text-ink font-mono">{currentEnv.streamingProvider} (Native Direct Stream &amp; Cam Studio active)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-ink bg-surface-tint">Payment Driver</td>
                  <td className="px-4 py-3 text-ink font-mono">{currentEnv.paymentProvider}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-ink bg-surface-tint">Storage Driver</td>
                  <td className="px-4 py-3 text-ink font-mono">{currentEnv.storageProvider} (.local-storage &amp; public/uploads)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
