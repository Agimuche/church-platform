import Link from "next/link";
import Image from "next/image";
import { Badge } from "./badge";
import { formatDuration } from "@/lib/utils";

interface MediaCardProps {
  href: string;
  title: string;
  thumbnailUrl?: string | null;
  speakerName?: string | null;
  publishedAt?: Date | null;
  durationSeconds?: number | null;
  price?: string | number | null;
}

export function MediaCard({
  href,
  title,
  thumbnailUrl,
  speakerName,
  publishedAt,
  durationSeconds,
  price,
}: MediaCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-tint">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted">
            <span className="text-3xl">▶</span>
          </div>
        )}
        {durationSeconds ? (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(durationSeconds)}
          </span>
        ) : null}
        {price ? (
          <Badge variant="gold" className="absolute left-2 top-2">
            Paid
          </Badge>
        ) : null}
      </div>
      <h3 className="mt-3 line-clamp-2 font-medium text-ink group-hover:text-accent">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted">
        {[speakerName, publishedAt ? new Date(publishedAt).toLocaleDateString() : null]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </Link>
  );
}
