import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminLogin,
});

function AdminLogin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin/dashboard" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast.success("Welcome back");
      navigate({ to: "/admin/dashboard" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error("Authentication failed", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-full border border-gold flex items-center justify-center">
            <span className="font-display text-gold text-xl">F</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm tracking-[0.25em]">THE FUNCTION</div>
            <div className="font-display text-sm tracking-[0.25em] text-gold -mt-0.5">JUNCTION</div>
          </div>
        </Link>

        <div className="border border-border bg-card/40 p-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold text-center mb-2">Private</p>
          <h1 className="font-display text-3xl text-center mb-2">Admin Access</h1>
          <div className="hairline w-16 mx-auto mb-8" />

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 px-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 px-1 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full border border-gold bg-gold text-primary-foreground py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-transparent hover:text-gold transition-all disabled:opacity-60"
            >
              {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            {mode === "signin" ? "First time? " : "Have an account? "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-gold hover:underline"
            >
              {mode === "signin" ? "Create admin account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-center mt-8">
          <Link to="/" className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-gold">
            ← Return to site
          </Link>
        </p>
      </div>
    </div>
  );
}
