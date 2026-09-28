import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="container-app max-w-sm py-16">
      <h1 className="font-serif text-2xl font-semibold text-ink">Create Your Account</h1>
      <p className="mt-1 text-sm text-ink-muted">Join the church family online.</p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-4 text-center text-sm text-ink-muted">
        Already a member? <Link href="/login" className="text-accent hover:text-accent-dark">Sign in</Link>
      </p>
    </div>
  );
}
