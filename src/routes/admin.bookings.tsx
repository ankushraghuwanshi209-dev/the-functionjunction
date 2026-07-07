import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsPage,
});

type Booking = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  eventDate?: string;
  guests?: string;
  budget?: string;
  location?: string;
  message?: string;
  status?: string;
  createdAt?: { seconds: number };
};

const statuses = ["new", "reviewing", "confirmed", "declined", "archived"];

function BookingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as Booking)));
    });
    return () => unsub();
  }, [user]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (filter !== "all" && (b.status ?? "new") !== filter) return false;
      if (search) {
        const s = search.toLowerCase();
        return [b.name, b.email, b.eventType, b.location].some((v) => v?.toLowerCase().includes(s));
      }
      return true;
    });
  }, [bookings, filter, search]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      toast.success("Status updated");
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      toast.error("Update failed", { description: msg });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      toast.success("Deleted");
      if (selected?.id === id) setSelected(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      toast.error("Delete failed", { description: msg });
    }
  };

  const exportCsv = () => {
    const headers = ["Name","Email","Phone","Event Type","Date","Guests","Budget","Location","Status","Message","Created"];
    const rows = filtered.map((b) => [
      b.name, b.email, b.phone, b.eventType, b.eventDate, b.guests, b.budget, b.location, b.status ?? "new",
      (b.message ?? "").replace(/[\r\n"]/g, " "),
      b.createdAt ? new Date(b.createdAt.seconds * 1000).toISOString() : "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tfj-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div className="p-10">
      <header className="flex flex-wrap gap-4 items-end justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-2">Manage</p>
          <h1 className="font-display text-4xl">Bookings</h1>
        </div>
        <button
          onClick={exportCsv}
          className="border border-gold text-gold px-6 py-2.5 text-[11px] tracking-[0.3em] uppercase hover:bg-gold hover:text-primary-foreground transition-all"
        >
          Export CSV
        </button>
      </header>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, event, location…"
          className="flex-1 min-w-[240px] bg-card/40 border border-border focus:border-gold outline-none px-4 py-2.5 text-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-card/40 border border-border focus:border-gold outline-none px-4 py-2.5 text-sm"
        >
          <option value="all" className="bg-background">All statuses</option>
          {statuses.map((s) => <option key={s} value={s} className="bg-background">{s}</option>)}
        </select>
      </div>

      <div className="border border-border bg-card/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left p-4">Client</th>
              <th className="text-left p-4">Event</th>
              <th className="text-left p-4 hidden md:table-cell">Date</th>
              <th className="text-left p-4 hidden lg:table-cell">Budget</th>
              <th className="text-left p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No bookings match.</td></tr>
            )}
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-card/60">
                <td className="p-4">
                  <p className="text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.email}</p>
                </td>
                <td className="p-4">
                  <p>{b.eventType}</p>
                  <p className="text-xs text-muted-foreground">{b.location}</p>
                </td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">{b.eventDate}</td>
                <td className="p-4 hidden lg:table-cell text-muted-foreground">{b.budget}</td>
                <td className="p-4">
                  <select
                    value={b.status ?? "new"}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className={`bg-transparent border px-2 py-1 text-[10px] tracking-[0.2em] uppercase ${
                      b.status === "confirmed" ? "border-gold text-gold" :
                      b.status === "declined" ? "border-destructive text-destructive" :
                      "border-border text-muted-foreground"
                    }`}
                  >
                    {statuses.map((s) => <option key={s} value={s} className="bg-background text-foreground">{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setSelected(b)} className="text-[10px] tracking-[0.3em] uppercase text-gold hover:underline mr-3">View</button>
                  <button onClick={() => remove(b.id)} className="text-[10px] tracking-[0.3em] uppercase text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="max-w-2xl w-full bg-card border border-gold p-10 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-2">Inquiry</p>
                <h2 className="font-display text-3xl">{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-gold text-2xl leading-none">×</button>
            </div>
            <div className="hairline mb-6" />
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Event Type", selected.eventType],
                ["Date", selected.eventDate],
                ["Guests", selected.guests],
                ["Budget", selected.budget],
                ["Location", selected.location],
                ["Status", selected.status ?? "new"],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">{k}</dt>
                  <dd className="text-foreground">{v || "—"}</dd>
                </div>
              ))}
            </dl>
            {selected.message && (
              <div className="mt-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Message</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            )}
            <div className="mt-8 flex gap-3">
              <a href={`mailto:${selected.email}`} className="border border-gold bg-gold text-primary-foreground px-6 py-2.5 text-[11px] tracking-[0.3em] uppercase hover:bg-transparent hover:text-gold transition-all">Reply by email</a>
              <button onClick={() => setSelected(null)} className="border border-border px-6 py-2.5 text-[11px] tracking-[0.3em] uppercase text-foreground hover:border-gold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
