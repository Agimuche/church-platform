import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Give & Support | The Brook Church",
  description:
    "Partner with The Brook Church. Give your tithes, offerings, seed faith, and support The Brook Church Expansion Project online.",
};

const GIVING_CHANNELS = [
  {
    title: "The Brook Church Expansion Project",
    category: "Building & Expansion",
    description:
      "Support our ongoing building and facility expansion to reach and accommodate more souls in Calabar and beyond.",
    recommended: true,
    donateUrl: "https://dashboard.flutterwave.com/donate/dv6jh1y3sp3t",
  },
  {
    title: "Tithes & General Offerings",
    category: "Worship Giving",
    description:
      "Honour the Lord with your substance and the firstfruits of all your increase as an act of worship and obedience.",
    recommended: false,
    donateUrl: "https://dashboard.flutterwave.com/donate/dv6jh1y3sp3t",
  },
  {
    title: "Ministry Partnership & Seed Faith",
    category: "Partnership",
    description:
      "Sow a seed into the ministry and partner with us to spread the gospel of Grace, Pneumatology, and life-transformation.",
    recommended: false,
    donateUrl: "https://dashboard.flutterwave.com/donate/dv6jh1y3sp3t",
  },
  {
    title: "Nurturers Ministry & Conferences",
    category: "Special Project",
    description:
      "Support the women's ministry initiatives and special conferences hosted by Pastor Naomi Imiemohon.",
    recommended: false,
    donateUrl: "https://dashboard.flutterwave.com/donate/dv6jh1y3sp3t",
  },
];

export default function GivePage() {
  return (
    <div className="bg-slate-50 py-12">
      <div className="container-app">
        {/* Header Hero */}
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-12">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              Online Giving &amp; Partnership
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
              An Unfolding Story of God&apos;s Grace
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              Thank you for choosing to partner with The Brook Church. Your giving empowers us to
              spread the gospel, teach the ways of the Spirit, heal minds, and build a lasting legacy.
            </p>
          </div>
        </div>

        {/* Giving Options Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Choose a Giving Channel</h2>
              <p className="text-sm text-slate-600">
                Secure online donations processed instantly via Flutterwave.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {GIVING_CHANNELS.map((channel) => (
              <div
                key={channel.title}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                  channel.recommended
                    ? "border-sky-500 ring-2 ring-sky-500/20"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                      {channel.category}
                    </span>
                    {channel.recommended && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        Priority Project
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{channel.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {channel.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href={channel.donateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-sky-700"
                  >
                    <span>Give via Flutterwave</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Details & Information */}
        <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900">Direct Bank Transfer</h2>
          <p className="mt-1 text-sm text-slate-600">
            You can also transfer directly to The Brook Church bank accounts at any commercial bank
            in Nigeria or via your mobile banking app:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account Name
              </p>
              <p className="mt-1 font-bold text-slate-900">THE BROOK CHURCH</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Purpose
              </p>
              <p className="text-xs text-slate-700">Tithes &amp; General Offerings</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account Name
              </p>
              <p className="mt-1 font-bold text-slate-900">THE BROOK CHURCH (EXPANSION)</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Purpose
              </p>
              <p className="text-xs text-slate-700">Church Expansion Project</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Contact for Receipts / Enquiries
              </p>
              <p className="mt-1 font-bold text-slate-900">+234 802 331 5468</p>
              <p className="mt-2 text-xs text-slate-600">
                Kindly include your name and giving category in the transfer narrative or send SMS
                confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Scripture on Giving */}
        <div className="mt-10 rounded-2xl bg-sky-900 p-8 text-center text-white">
          <blockquote className="font-serif text-lg italic sm:text-xl text-sky-100">
            &ldquo;Every man according as he purposeth in his heart, so let him give; not grudgingly,
            or of necessity: for God loveth a cheerful giver.&rdquo;
          </blockquote>
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-sky-300">
            2 Corinthians 9:7
          </p>
        </div>
      </div>
    </div>
  );
}
