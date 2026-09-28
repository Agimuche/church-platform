import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Contact Us | The Brook Church",
  description:
    "Get in touch with The Brook Church, Calabar. Find our physical sanctuary address on Asim Oko Street, phone numbers, service times, and contact form.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app">
        {/* Header Hero Banner */}
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-12">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              We&apos;d Love to Hear From You
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
              Connect With The Brook Church
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              Have questions about our services, programs, or how to partner with our ministry? Reach
              out to our team or visit us at our sanctuary in Calabar.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Contact Information & Service Schedule */}
          <div className="space-y-6 lg:col-span-5">
            {/* Address & Phone */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-slate-900">Sanctuary Location</h2>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-semibold text-slate-900">Physical Address</p>
                    <p className="mt-0.5">
                      Asim Oko Street, Off Parliamentary Extension, Calabar, Cross River State,
                      Nigeria.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="font-semibold text-slate-900">Telephone / Enquiries</p>
                    <p className="mt-0.5">
                      <a href="tel:+2348023315468" className="text-sky-600 font-medium hover:underline">
                        +234 802 331 5468
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                  <span className="text-xl">🌐</span>
                  <div>
                    <p className="font-semibold text-slate-900">Official Website</p>
                    <p className="mt-0.5 text-sky-600 font-medium">thebrookchurchng.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Times Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-slate-900">Weekly Services</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Sunday 1st Service (Phronesis)</span>
                  <span className="font-semibold text-slate-900">8:00 AM</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Sunday 2nd Service (Doxa)</span>
                  <span className="font-semibold text-slate-900">9:15 AM</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Tuesday Morning Prayer (Accelerate)</span>
                  <span className="font-semibold text-slate-900">6:00 AM</span>
                </li>
                <li className="flex justify-between">
                  <span>Wednesday Mid-week (Wordshop)</span>
                  <span className="font-semibold text-slate-900">6:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Pastoral Care Links */}
            <div className="rounded-2xl bg-sky-50 border border-sky-100 p-6">
              <h3 className="font-bold text-sky-950">Looking for Pastoral Support?</h3>
              <p className="mt-1 text-xs text-slate-600">
                You can also submit dedicated prayer requests or book private counseling sessions
                directly online:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/prayer"
                  className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
                >
                  Prayer Request
                </Link>
                <Link
                  href="/counseling"
                  className="rounded-full border border-sky-300 bg-white px-4 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-50"
                >
                  Pastoral Counseling
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-slate-900">Send Us a Message</h2>
              <p className="mt-1 text-sm text-slate-600">
                Fill out the form below and our church administrative team will respond promptly.
              </p>

              <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Brother John Doe"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +234 800 000 0000"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Subject
                    </label>
                    <select className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20">
                      <option>General Enquiry</option>
                      <option>First Time Visitor</option>
                      <option>Ministry Partnership &amp; Giving</option>
                      <option>TBC Store &amp; Publications</option>
                      <option>Testimony</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="How can we assist or minister to you?"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-sky-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
