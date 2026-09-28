export default function Loading() {
  return (
    <div className="container-app py-24 text-center text-ink-muted">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="mt-4 text-sm">Loading…</p>
    </div>
  );
}
