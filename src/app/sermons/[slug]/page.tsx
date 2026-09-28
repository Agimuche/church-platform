import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSermonBySlug, getRelatedSermons } from "@/lib/data/media";
import { auth } from "@/lib/auth/auth";
import { hasPermission } from "@/lib/rbac/permissions";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaCard } from "@/components/ui/media-card";
import { formatCurrency, formatDate, formatDuration } from "@/lib/utils";

interface SermonDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SermonDetailPageProps) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);
  if (!sermon) return { title: "Sermon Not Found" };
  return {
    title: `${sermon.title} | Grace Assembly`,
    description: sermon.description?.slice(0, 160),
    openGraph: { images: sermon.thumbnailUrl ? [sermon.thumbnailUrl] : [] },
  };
}

export default async function SermonDetailPage({ params }: SermonDetailPageProps) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);
  if (!sermon) notFound();

  const session = await auth();
  const related = await getRelatedSermons(sermon.id, sermon.speakerId);

  const isMembersOnly = sermon.visibility === "MEMBERS_ONLY";
  const canView =
    sermon.visibility === "PUBLIC" ||
    (session?.user && hasPermission(session.user.role, "media:view:members_only"));

  const isPaid = sermon.price !== null;

  return (
    <div className="container-app py-12">
      <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div>
          <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-black">
            {!canView ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-white">
                <p className="font-medium">This message is for members only.</p>
                <LinkButton href="/login" size="sm">
                  Sign in to watch
                </LinkButton>
              </div>
            ) : sermon.thumbnailUrl ? (
              <Image
                src={sermon.thumbnailUrl}
                alt={sermon.title}
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/70">Video player</div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {isMembersOnly && <Badge variant="muted">Members Only</Badge>}
            {isPaid && <Badge variant="gold">{formatCurrency(sermon.price!.toString())}</Badge>}
            {sermon.allowDownload && <Badge variant="default">Download Available</Badge>}
          </div>

          <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">{sermon.title}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {[sermon.speaker?.name, sermon.publishedAt ? formatDate(sermon.publishedAt) : null, formatDuration(sermon.durationSeconds)]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {sermon.description && <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">{sermon.description}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            {isPaid ? (
              <LinkButton href={`/store?sermon=${sermon.id}`}>Purchase This Message</LinkButton>
            ) : sermon.allowDownload && canView ? (
              <a
                href={`/api/media/${sermon.id}/download`}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark"
              >
                Download
              </a>
            ) : null}
          </div>
        </div>

        <aside>
          {sermon.speaker && (
            <div className="rounded-xl border border-border bg-paper p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Speaker</p>
              <p className="mt-1 font-serif text-lg text-ink">{sermon.speaker.name}</p>
              {sermon.speaker.bio && <p className="mt-2 text-sm text-ink-muted">{sermon.speaker.bio}</p>}
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-xl font-semibold text-ink">Related Messages</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <MediaCard
                key={r.id}
                href={`/sermons/${r.slug}`}
                title={r.title}
                thumbnailUrl={r.thumbnailUrl}
                speakerName={r.speaker?.name}
                publishedAt={r.publishedAt}
                durationSeconds={r.durationSeconds}
                price={r.price?.toString()}
              />
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-sm text-ink-muted">
        <Link href="/sermons" className="text-accent hover:text-accent-dark">← Back to all sermons</Link>
      </p>
    </div>
  );
}
