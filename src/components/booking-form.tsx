import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Reveal } from "./reveal";

const bookingSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Please select a date"),
  guests: z.string().min(1, "Please provide guest count"),
  budget: z.string().min(1, "Please select a budget range"),
  location: z.string().min(2, "Please enter a location"),
  message: z.string().max(2000).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const eventTypes = [
  "Luxury Wedding",
  "Corporate Gala",
  "Milestone Birthday",
  "Anniversary Celebration",
  "Product Launch",
  "Private Dinner",
  "Destination Event",
  "Other",
];

const budgets = [
  "Under $10,000",
  "$10,000 – $25,000",
  "$25,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000+",
];

export function BookingForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({ resolver: zodResolver(bookingSchema) });

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        ...values,
        status: "new",
        createdAt: serverTimestamp(),
      });
      toast.success("Inquiry received. Our team will be in touch shortly.");
      setSubmitted(true);
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast.error("Could not send inquiry", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const field = "w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 px-1 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors";
  const label = "block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1";

  if (submitted) {
    return (
      <Reveal>
        <div className="text-center py-20 px-6 border border-gold/30 bg-card/40">
          <p className="font-script text-4xl text-gold mb-4">Merci beaucoup</p>
          <h3 className="font-display text-3xl text-foreground mb-4">Your inquiry has been received</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            One of our senior event directors will personally reach out within 24 hours to arrange a private consultation.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-[11px] tracking-[0.3em] uppercase text-gold border border-gold px-6 py-2.5 hover:bg-gold hover:text-primary-foreground transition-all"
          >
            Submit another
          </button>
        </div>
      </Reveal>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-x-8 gap-y-6">
      <div>
        <label className={label}>Full Name</label>
        <input {...register("name")} className={field} placeholder="Your Name" />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className={label}>Email</label>
        <input {...register("email")} type="email" className={field} placeholder="you@example.com" />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className={label}>Phone</label>
        <input {...register("phone")} className={field} placeholder="+91 96********" />
        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <label className={label}>Event Type</label>
        <select {...register("eventType")} className={`${field} appearance-none cursor-pointer`}>
          <option value="" className="bg-background">Select</option>
          {eventTypes.map((t) => <option key={t} value={t} className="bg-background">{t}</option>)}
        </select>
        {errors.eventType && <p className="text-xs text-destructive mt-1">{errors.eventType.message}</p>}
      </div>
      <div>
        <label className={label}>Preferred Date</label>
        <input {...register("eventDate")} type="date" className={field} />
        {errors.eventDate && <p className="text-xs text-destructive mt-1">{errors.eventDate.message}</p>}
      </div>
      <div>
        <label className={label}>Guest Count</label>
        <input {...register("guests")} className={field} placeholder="e.g. 120" />
        {errors.guests && <p className="text-xs text-destructive mt-1">{errors.guests.message}</p>}
      </div>
      <div>
        <label className={label}>Budget</label>
        <select {...register("budget")} className={`${field} appearance-none cursor-pointer`}>
          <option value="" className="bg-background">Select</option>
          {budgets.map((b) => <option key={b} value={b} className="bg-background">{b}</option>)}
        </select>
        {errors.budget && <p className="text-xs text-destructive mt-1">{errors.budget.message}</p>}
      </div>
      <div>
        <label className={label}>Location / Venue</label>
        <input {...register("location")} className={field} placeholder="City or venue" />
        {errors.location && <p className="text-xs text-destructive mt-1">{errors.location.message}</p>}
      </div>
      <div className="md:col-span-2">
        <label className={label}>Tell us about your vision</label>
        <textarea {...register("message")} rows={4} className={`${field} resize-none`} placeholder="Share themes, inspirations, or specific requests…" />
      </div>
      <div className="md:col-span-2 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto inline-flex items-center justify-center gap-3 border border-gold bg-transparent px-10 py-4 text-[11px] tracking-[0.3em] uppercase text-gold hover:bg-gold hover:text-primary-foreground transition-all disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Submit Inquiry"}
          <span aria-hidden>→</span>
        </button>
        <p className="text-xs text-muted-foreground mt-4">
          We respond to every inquiry within 24 hours. Your information is confidential.
        </p>
      </div>
    </form>
  );
}
