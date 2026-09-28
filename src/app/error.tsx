"use client";

import { useEffect } from "react";
import { LinkButton } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to the server console only — never show a stack trace to the user.
    console.error(error);
  }, [error]);

  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-serif text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-ink-muted">
        We couldn&apos;t load this page. Please try again, or head back home.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark"
        >
          Try Again
        </button>
        <LinkButton href="/" variant="secondary">Go Home</LinkButton>
      </div>
    </div>
  );
}
