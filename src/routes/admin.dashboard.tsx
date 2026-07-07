import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

type Booking = { id: string; status?: string; budget?: string; eventType?: string; createdAt?: { seconds: number } };

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as Booking)));
    }, () => {});
    return () => unsub();
  }, [user]);

  if (!user) return null;

  const total = bookings.length;
  const newCount = bookings.filter((b) => (b.status ?? "new") === "new").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const recent = bookings.slice(0, 5);

  const stats = [
    { label: "Total Inquiries", value: total },
    { label: "New This Week", value: newCount },
    { label: "Confirmed", value: confirmed },
    { label: "Conversion", value: total ? Math.round((confirmed / total) * 100) + "%" : "—" },
  ];

  return (
    <div className="p-10">
      <header className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-2">Overview</p>
        <h1 className="font-display text-4xl">Good day.</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening at the Junction.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="border border-border bg-card/40 p-6">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">{s.label}</p>
            <p className="font-display text-4xl gold-gradient-text">{s.value}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">Recent Inquiries</h2>
          <a href="/admin/bookings" className="text-[11px] tracking-[0.3em] uppercase text-gold hover:underline">View all →</a>
        </div>
        <div className="border border-border bg-card/40 divide-y divide-border">
          {recent.length === 0 && <p className="p-8 text-sm text-muted-foreground text-center">No inquiries yet.</p>}
          {recent.map((b) => (
            <div key={b.id} className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm">{(b as Booking & { name?: string }).name ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{b.eventType} · {b.budget}</p>
              </div>
              <span className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1 border ${
                b.status === "confirmed" ? "border-gold text-gold" :
                b.status === "declined" ? "border-destructive text-destructive" :
                "border-border text-muted-foreground"
              }`}>{b.status ?? "new"}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
