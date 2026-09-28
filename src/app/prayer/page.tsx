import { auth } from "@/lib/auth/auth";
import { PrayerRequestForm } from "@/components/forms/prayer-request-form";

export const metadata = {
  title: "Prayer Requests | The Brook Church",
  description:
    "Submit your prayer request to The Brook Church pastoral intercessory team. We believe in the power of targeted prayer and God's transforming grace.",
};

export default async function PrayerPage() {
  const session = await auth();

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app max-w-2xl">
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-10">
          <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            Pastoral Intercession
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            We Stand With You in Prayer
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-blue-100">
            &ldquo;The effectual fervent prayer of a righteous man availeth much.&rdquo; Share what
            is on your heart with our dedicated prayer ministers.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-slate-900">Submit Your Request</h2>
          <p className="mt-1 text-xs text-slate-500">
            You can choose to keep your request confidential to the pastoral team or share it with
            the church prayer community.
          </p>
          <div className="mt-6">
            <PrayerRequestForm isSignedIn={Boolean(session?.user)} />
          </div>
        </div>
      </div>
    </div>
  );
}
