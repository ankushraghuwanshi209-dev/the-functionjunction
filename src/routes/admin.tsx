import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AuthProvider>
      <AdminShell />
    </AuthProvider>
  );
}

function AdminShell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gold text-xs tracking-[0.4em] uppercase animate-pulse">Loading…</div>
      </div>
    );
  }

  // Public login flow (Outlet handles /admin index which is login)
  return (
    <div className="min-h-screen bg-background text-foreground">
      {user && (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-charcoal/50 p-6 flex flex-col">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-full border border-gold flex items-center justify-center">
              <span className="font-display text-gold text-lg">F</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-xs tracking-[0.2em]">THE FUNCTION</div>
              <div className="font-display text-xs tracking-[0.2em] text-gold -mt-0.5">JUNCTION</div>
            </div>
          </Link>
          <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Admin</p>
          <nav className="flex flex-col gap-1">
            <Link to="/admin/dashboard" className="px-3 py-2.5 text-sm hover:bg-card hover:text-gold rounded" activeProps={{ className: "px-3 py-2.5 text-sm bg-card text-gold rounded" }}>
              Dashboard
            </Link>
            <Link to="/admin/bookings" className="px-3 py-2.5 text-sm hover:bg-card hover:text-gold rounded" activeProps={{ className: "px-3 py-2.5 text-sm bg-card text-gold rounded" }}>
              Bookings
            </Link>
          </nav>
          <div className="mt-auto pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground truncate mb-3">{user.email}</p>
            <button
              onClick={async () => { await signOut(auth); navigate({ to: "/admin" }); }}
              className="w-full text-[11px] tracking-[0.3em] uppercase border border-border py-2 hover:border-gold hover:text-gold transition-all"
            >
              Sign Out
            </button>
          </div>
        </aside>
      )}
      <main className={user ? "ml-64 min-h-screen" : "min-h-screen"}>
        <Outlet />
      </main>
    </div>
  );
}
