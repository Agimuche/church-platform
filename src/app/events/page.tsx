import { listUpcomingStreams } from "@/lib/data/streams";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events & Calendar | The Brook Church",
  description:
    "Explore upcoming services, conferences, and programs at The Brook Church Calabar including Phronesis, Doxa, Wordshop, and special ministry conferences.",
};

const RECURRING_PROGRAMS = [
  {
    title: "PHRONESIS (Sunday 1st Service)",
    time: "Every Sunday at 8:00 AM",
    description: "Impartation of divine wisdom, clarity, and spiritual illumination.",
    category: "Sunday Service",
    color: "bg-sky-100 text-sky-800",
  },
  {
    title: "DOXA (Sunday 2nd Service)",
    time: "Every Sunday at 9:15 AM",
    description: "Intense praise, heartfelt worship, and the manifestation of God's tangible glory.",
    category: "Sunday Service",
    color: "bg-purple-100 text-purple-800",
  },
  {
    title: "ACCELERATE Morning Prayer",
    time: "Every Tuesday at 6:00 AM",
    description: "Start your week in the spirit with targeted prayer, decree, and alignment.",
    category: "Prayer Meeting",
    color: "bg-amber-100 text-amber-800",
  },
  {
    title: "WORDSHOP Mid-Week Service",
    time: "Every Wednesday at 6:00 PM",
    description: "Deep dive into scripture, doctrine, and pneumatic principles for daily victory.",
    category: "Bible Study",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "NURTURERS CONFERENCE",
    time: "Annual Special Gathering",
    description:
      "Empowering women in kingdom purpose and family leadership, hosted by Pastor Naomi Imiemohon.",
    category: "Women's Ministry",
    color: "bg-rose-100 text-rose-800",
  },
  {
    title: "CAPSTONE SERVICE",
    time: "End of Month Celebration",
    description: "Thanksgiving, prophetic decrees, and celebrating God's unfolding grace.",
    category: "Special Service",
    color: "bg-indigo-100 text-indigo-800",
  },
];

export default async function EventsPage() {
  const upcoming = await listUpcomingStreams(20);

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app">
        {/* Header Hero Banner */}
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-12">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              Church Calendar &amp; Programs
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
              Upcoming Events &amp; Services
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              Stay connected with our service schedules, special ministry conferences, and community
              gatherings at The Brook Church.
            </p>
          </div>
        </div>

        {/* Regular Weekly Programs */}
        <div className="mt-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Weekly &amp; Monthly Schedule
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            Regular Services &amp; Fellowships
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RECURRING_PROGRAMS.map((prog) => (
              <div
                key={prog.title}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs tbc-card-hover"
              >
                <div>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${prog.color}`}
                  >
                    {prog.category}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{prog.title}</h3>
                  <p className="mt-1 text-sm font-bold text-sky-700">{prog.time}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {prog.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500">📍 Sanctuary &amp; Online</span>
                  <Link
                    href="/live"
                    className="text-xs font-bold text-sky-600 hover:text-sky-800"
                  >
                    Watch Live →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast Feed */}
        {upcoming.length > 0 && (
          <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-slate-900">
              Scheduled Live Broadcasts
            </h2>
            <div className="mt-6 space-y-3">
              {upcoming.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-bold text-slate-900">{s.title}</p>
                    <p className="text-xs text-slate-500">{formatDate(s.scheduledStart)}</p>
                  </div>
                  <Link
                    href="/live"
                    className="mt-3 sm:mt-0 rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 transition"
                  >
                    View Stream Room
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
