import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "About Us | The Brook Church",
  description:
    "Learn about The Brook Church, our history from 2001 in Calabar, our Lead Pastors Ose & Naomi Imiemohon, and our divine mandate in Grace and Pneumatology.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app">
        {/* Header Hero Banner */}
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-14">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              Our Story &amp; Mandate
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
              An Unfolding Story of God&apos;s Grace
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              &ldquo;Destiny determines the route you take in life. At The Brook Church, we hold
              dearly to the ability of God being expressed through us. One word that explains what we
              believe is GRACE.&rdquo;
            </p>
          </div>
        </div>

        {/* Welcome Message / Core Philosophy */}
        <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Welcome to The Brook Church
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                Empowerment Upon the Spirit of Man
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                We are delighted at your visit to our platform. It is not a coincidence, but a
                response to a divine arrangement. At The Brook Church, we believe that Grace is the
                empowerment of God upon the spirit of man, equipping him to fulfill God’s purpose for
                his life.
              </p>
              <p className="mt-3 leading-relaxed text-slate-600">
                Whether you are joining us in person at our sanctuary in Calabar or connecting with
                our global family online, our prayer is that your life will experience the exceptional
                manifestation of God’s glory and wisdom.
              </p>
            </div>
            <div className="lg:col-span-4 rounded-2xl bg-sky-50 border border-sky-100 p-6 text-center">
              <span className="text-4xl">🕊️</span>
              <h3 className="mt-3 font-bold text-sky-900">The Zoe Life</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Walking in the abundant, uncreated life of God through regular immersion in the Word
                and fellowship with the Holy Spirit.
              </p>
            </div>
          </div>
        </section>

        {/* The Divine Mandate */}
        <section className="mt-14">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Our Calling
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">
              The Divine Mandate
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The foundational pillar given to our presiding pastor for this ministry:
            </p>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-900 p-8 text-white shadow-lg sm:p-12">
            <blockquote className="font-serif text-lg leading-relaxed text-slate-200 sm:text-xl italic">
              &ldquo;You will teach Pneumatology; the way and things of the Spirit. Whenever you
              teach the way of the Spirit, you will always sense an unusual anointing. Creative
              manifestation will happen whenever the anointing is at its peak in your life. Amazing
              manifestation of increase will occur. Creative abilities will be your major, empowering
              men in their generation, healing of the mind will be your own specialty.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* History & Key Milestones */}
        <section className="mt-14">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Journey Through Time
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">
              Church History &amp; Milestones
            </h2>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                August 26, 2001
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Vision Conceived</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                The divine vision for The Brook Church was received and nurtured in prayers, setting
                the stage for a new wave of grace and spiritual empowerment.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                July 28, 2002
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Inaugural Service</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                The church officially held its first public service at the former Metropolitan Hotel
                in Calabar, Cross River State, Nigeria.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                Year 2008 &amp; Beyond
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Sanctuary Dedication</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                The permanent church building was formally dedicated to God at Asim Oko Street, Off
                Parliamentary Extension, Calabar.
              </p>
            </div>
          </div>
        </section>

        {/* Pastoral Leadership */}
        <section className="mt-14">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Shepherds of the Flock
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">Pastoral Leadership</h2>
            <p className="mt-2 text-sm text-slate-600">
              Anointed servant-leaders dedicated to teaching the Word, discipling believers, and
              ministering grace.
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Pastor Ose & Naomi Imiemohon */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-purple-700 text-white font-bold text-xl shadow-md">
                  PST
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Pastors Ose &amp; Naomi Imiemohon
                  </h3>
                  <p className="text-xs font-semibold text-sky-600">Presiding Lead Pastors</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Pastor Ose Imiemohon is the founder and Senior Pastor of The Brook Church. An author
                and seasoned teacher of Pneumatology and Grace, he has a burning passion for raising
                men and women of exceptional impact. Together with his wife, Pastor Naomi Imiemohon
                (convener of the Nurturers Conference), they lead with love, wisdom, and spiritual
                depth.
              </p>
            </div>

            {/* Associate Ministers */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold text-xl shadow-md">
                  MIN
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Associate Pastoral Team</h3>
                  <p className="text-xs font-semibold text-sky-600">
                    Teaching &amp; Associate Pastors
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-900">Pastor Victor Owoeye</p>
                  <p className="text-xs text-slate-500">Associate Pastor &amp; Teacher</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Pastor Echeng Edu</p>
                  <p className="text-xs text-slate-500">Associate Pastor &amp; Minister</p>
                </div>
                <p className="pt-2 text-xs text-slate-500 leading-relaxed">
                  Working together to equip believers through the ministry of the Word, discipleship,
                  and community care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Services & Call to Action */}
        <section className="mt-14 rounded-3xl bg-sky-900 p-8 text-white shadow-xl sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Worship With Us
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">
                Experience the Fellowship of Grace
              </h2>
              <p className="mt-3 text-sm text-sky-100 leading-relaxed">
                Join our life-affirming services this week in Calabar or stream live online with our
                global congregation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/live"
                  className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-sky-900 shadow-sm transition hover:bg-sky-50"
                >
                  Watch Live Broadcast
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-sky-400 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-sky-800"
                >
                  Directions &amp; Contact
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-sky-950/60 p-6 border border-sky-800/50">
              <h3 className="font-bold text-white text-base">Service Times</h3>
              <div className="mt-4 space-y-3 text-xs text-sky-200">
                <div className="flex justify-between border-b border-sky-800/40 pb-2">
                  <span>Sunday 1st Service (Phronesis)</span>
                  <span className="font-bold text-white">8:00 AM</span>
                </div>
                <div className="flex justify-between border-b border-sky-800/40 pb-2">
                  <span>Sunday 2nd Service (Doxa)</span>
                  <span className="font-bold text-white">9:15 AM</span>
                </div>
                <div className="flex justify-between border-b border-sky-800/40 pb-2">
                  <span>Tuesday Morning Prayer (Accelerate)</span>
                  <span className="font-bold text-white">6:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday Mid-Week (Wordshop)</span>
                  <span className="font-bold text-white">6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
