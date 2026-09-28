import { listSermons } from "@/lib/data/media";
import { MediaCard } from "@/components/ui/media-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Audio Messages & MP3 | The Brook Church",
  description:
    "Listen and download audio sermons from Pastor Ose Imiemohon and The Brook Church ministers on the go.",
};

export default async function AudioPage() {
  const { items } = await listSermons({ type: "SERMON_AUDIO", pageSize: 24 });

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app">
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-12">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              Pneumatology &amp; Word
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
              Audio Messages &amp; MP3s
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              Listen to life-changing audio messages on the go. Stream online or download directly to
              your device.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">Audio Library</h2>
          {items.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <p className="text-base font-semibold">No audio messages published yet.</p>
              <p className="mt-1 text-xs">
                Check back soon or explore our full sermon video archives.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((s) => (
                <MediaCard
                  key={s.id}
                  href={`/sermons/${s.slug}`}
                  title={s.title}
                  thumbnailUrl={s.thumbnailUrl}
                  speakerName={s.speaker?.name ?? "Pastor Ose Imiemohon"}
                  publishedAt={s.publishedAt}
                  durationSeconds={s.durationSeconds}
                  price={s.price?.toString()}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
