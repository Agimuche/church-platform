import { auth } from "@/lib/auth/auth";
import { CounselingRequestForm } from "@/components/forms/counseling-request-form";

export const metadata = {
  title: "Pastoral Counseling | The Brook Church",
  description:
    "Book a confidential pastoral counseling appointment with the ministers of The Brook Church Calabar.",
};

export default async function CounselingPage() {
  const session = await auth();

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app max-w-2xl">
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-10">
          <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            Pastoral Care &amp; Guidance
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Pastoral Counseling
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-blue-100">
            Whatever season of life you are navigating, our pastoral team is here to listen, pray,
            and provide biblical guidance. All sessions are strictly confidential.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-slate-900">
            Schedule a Counseling Session
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Fill out the details below and a pastor will reach out to confirm your appointment time.
          </p>
          <div className="mt-6">
            <CounselingRequestForm isSignedIn={Boolean(session?.user)} />
          </div>
        </div>
      </div>
    </div>
  );
}
