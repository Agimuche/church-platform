import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-serif text-2xl font-semibold text-ink">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <LinkButton href="/" className="mt-6">Go Home</LinkButton>
    </div>
  );
}
