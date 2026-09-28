import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="container-app max-w-sm py-16">
      <h1 className="font-serif text-2xl font-semibold text-ink">Sign In</h1>
      <p className="mt-1 text-sm text-ink-muted">Welcome back.</p>
      <div className="mt-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-4 text-center text-sm text-ink-muted">
        New here? <Link href="/register" className="text-accent hover:text-accent-dark">Create an account</Link>
      </p>
    </div>
  );
}
