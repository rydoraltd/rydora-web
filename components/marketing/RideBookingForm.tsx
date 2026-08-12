"use client";

import { useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const NOTES_MAX = 1000;

const EMPTY = {
  name: "", email: "", phone: "",
  rideType: "", pickup: "", dropoff: "",
  date: "", time: "", passengers: "1", notes: "", website: "",
};

type FormKey = keyof typeof EMPTY;
type Errors = Partial<Record<FormKey, string>>;
type Touched = Partial<Record<FormKey, boolean>>;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function minTimeStr(date: string) {
  if (date !== todayStr()) return "";
  const d = new Date();
  d.setHours(d.getHours() + 2);
  return d.toTimeString().slice(0, 5);
}

function validate(form: typeof EMPTY): Errors {
  const errs: Errors = {};
  const today = todayStr();

  if (!form.name.trim() || form.name.trim().length < 2)
    errs.name = "Please enter your full name (at least 2 characters).";

  if (!form.email.trim())
    errs.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errs.email = "Please enter a valid email address.";

  if (!form.phone.trim())
    errs.phone = "Phone number is required.";
  else if (form.phone.replace(/\D/g, "").length < 7)
    errs.phone = "Please enter a valid phone number.";

  if (!form.rideType)
    errs.rideType = "Please select a ride type.";

  if (!form.pickup.trim() || form.pickup.trim().length < 3)
    errs.pickup = "Please enter your pick-up location.";

  if (!form.dropoff.trim() || form.dropoff.trim().length < 3)
    errs.dropoff = "Please enter your drop-off location.";

  if (!form.date)
    errs.date = "Please select a date.";
  else if (form.date < today)
    errs.date = "Date cannot be in the past.";

  if (!form.time)
    errs.time = "Please select a time.";
  else if (form.date === today && form.time < minTimeStr(form.date))
    errs.time = "Please book at least 2 hours in advance for same-day rides.";

  if (form.notes.length > NOTES_MAX)
    errs.notes = `Please keep notes under ${NOTES_MAX} characters.`;

  return errs;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <span className="flex items-center gap-1 text-xs mt-1" style={{ color: "var(--state-error)" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
      </svg>
      {msg}
    </span>
  );
}

function inputStyle(touched: boolean, hasError: boolean, focused: boolean) {
  let border = "1.5px solid var(--line-subtle)";
  if (focused) border = "1.5px solid var(--brand-primary)";
  if (touched && hasError) border = "1.5px solid var(--state-error)";
  return {
    fontFamily: "var(--font-body)",
    backgroundColor: "var(--surface-raised)",
    border,
    color: "var(--ink-strong)",
    transition: "border-color 150ms",
  } as const;
}

export default function RideBookingForm() {
  const [form, setForm] = useState(EMPTY);
  const [touched, setTouched] = useState<Touched>({});
  const [focused, setFocused] = useState<Partial<Record<FormKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const set = useCallback((key: FormKey) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })), []);

  const touch = useCallback((key: FormKey) => () =>
    setTouched((t) => ({ ...t, [key]: true })), []);

  const focusIn = useCallback((key: FormKey) => () =>
    setFocused((f) => ({ ...f, [key]: true })), []);

  const focusOut = useCallback((key: FormKey) => () => {
    setFocused((f) => ({ ...f, [key]: false }));
    setTouched((t) => ({ ...t, [key]: true }));
  }, []);

  function showErr(key: FormKey) {
    return (touched[key] || submitted) ? errors[key] : undefined;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;

    setBusy(true);
    setServerError(null);
    try {
      const res = await fetch(`${API_BASE}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({ success: false, message: "Network error" }));
      if (!res.ok || !json.success) throw new Error(json.message || "Something went wrong. Please try again.");
      setSent(true);
      setForm(EMPTY);
      setTouched({});
      setSubmitted(false);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div
        className="rounded-2xl px-8 py-12 flex flex-col items-start gap-4"
        style={{ backgroundColor: "var(--surface-raised)", border: "1.5px solid var(--line-subtle)" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--brand-royal)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Booking request sent!
          </p>
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
            We have received your ride request and will contact you shortly to confirm the details.
            A confirmation email has been sent to your inbox.
          </p>
        </div>
        <div className="mt-2 p-4 rounded-xl w-full" style={{ backgroundColor: "var(--surface-base)", border: "1px solid var(--line-subtle)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-data)", color: "var(--ink-muted)" }}>What happens next</p>
          <ul className="flex flex-col gap-1.5">
            {["Our team reviews your booking details.", "We contact you to confirm timing and pricing.", "Your driver is assigned and you receive their details."].map((step) => (
              <li key={step} className="flex items-start gap-2 text-sm" style={{ color: "var(--ink-body)" }}>
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "var(--brand-primary)" }} />
                {step}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => setSent(false)}
          className="text-sm font-medium transition-opacity hover:opacity-70 mt-1"
          style={{ color: "var(--brand-primary)" }}
        >
          Submit another request →
        </button>
      </div>
    );
  }

  const today = todayStr();
  const minTime = minTimeStr(form.date);

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {/* Honeypot */}
      <input
        type="text" name="website" value={form.website} onChange={set("website")}
        tabIndex={-1} aria-hidden="true" style={{ display: "none" }}
      />

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="b-name" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Full name <span style={{ color: "var(--state-error)" }}>*</span>
          </label>
          <input
            id="b-name" type="text" autoComplete="name"
            value={form.name} onChange={set("name")}
            onFocus={focusIn("name")} onBlur={focusOut("name")}
            placeholder="e.g. Emeka Obi"
            className="h-12 rounded-lg px-4 text-base outline-none"
            style={inputStyle(!!touched.name || submitted, !!errors.name, !!focused.name)}
          />
          <FieldError msg={showErr("name")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="b-phone" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Phone number <span style={{ color: "var(--state-error)" }}>*</span>
          </label>
          <input
            id="b-phone" type="tel" autoComplete="tel"
            value={form.phone} onChange={set("phone")}
            onFocus={focusIn("phone")} onBlur={focusOut("phone")}
            placeholder="+234 800 000 0000"
            className="h-12 rounded-lg px-4 text-base outline-none"
            style={inputStyle(!!touched.phone || submitted, !!errors.phone, !!focused.phone)}
          />
          <FieldError msg={showErr("phone")} />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="b-email" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
          Email address <span style={{ color: "var(--state-error)" }}>*</span>
        </label>
        <input
          id="b-email" type="email" autoComplete="email"
          value={form.email} onChange={set("email")}
          onFocus={focusIn("email")} onBlur={focusOut("email")}
          placeholder="you@example.com"
          className="h-12 rounded-lg px-4 text-base outline-none"
          style={inputStyle(!!touched.email || submitted, !!errors.email, !!focused.email)}
        />
        <FieldError msg={showErr("email")} />
      </div>

      {/* Ride type */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="b-type" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
          Ride type <span style={{ color: "var(--state-error)" }}>*</span>
        </label>
        <div className="relative">
          <select
            id="b-type"
            value={form.rideType} onChange={set("rideType")}
            onFocus={focusIn("rideType")} onBlur={focusOut("rideType")}
            className="w-full h-12 rounded-lg px-4 pr-10 text-base outline-none appearance-none cursor-pointer"
            style={inputStyle(!!touched.rideType || submitted, !!errors.rideType, !!focused.rideType)}
          >
            <option value="" disabled>Select a ride type</option>
            <option value="dropoff">Drop-off Ride</option>
            <option value="fullday">Full-Day Booking</option>
            <option value="airport">Airport Pickup & Drop-off</option>
            <option value="corporate">Corporate & Event Transport</option>
            <option value="school">Child / School Pickup & Delivery</option>
            <option value="custom">Custom Ride Request</option>
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ color: "var(--ink-muted)" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <FieldError msg={showErr("rideType")} />
      </div>

      {/* Pickup + Dropoff */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="b-pickup" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Pick-up location <span style={{ color: "var(--state-error)" }}>*</span>
          </label>
          <input
            id="b-pickup" type="text"
            value={form.pickup} onChange={set("pickup")}
            onFocus={focusIn("pickup")} onBlur={focusOut("pickup")}
            placeholder="Street address or landmark"
            className="h-12 rounded-lg px-4 text-base outline-none"
            style={inputStyle(!!touched.pickup || submitted, !!errors.pickup, !!focused.pickup)}
          />
          <FieldError msg={showErr("pickup")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="b-dropoff" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Drop-off location <span style={{ color: "var(--state-error)" }}>*</span>
          </label>
          <input
            id="b-dropoff" type="text"
            value={form.dropoff} onChange={set("dropoff")}
            onFocus={focusIn("dropoff")} onBlur={focusOut("dropoff")}
            placeholder="Street address or landmark"
            className="h-12 rounded-lg px-4 text-base outline-none"
            style={inputStyle(!!touched.dropoff || submitted, !!errors.dropoff, !!focused.dropoff)}
          />
          <FieldError msg={showErr("dropoff")} />
        </div>
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="b-date" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Date <span style={{ color: "var(--state-error)" }}>*</span>
          </label>
          <input
            id="b-date" type="date"
            min={today}
            value={form.date} onChange={set("date")}
            onFocus={focusIn("date")} onBlur={focusOut("date")}
            className="h-12 rounded-lg px-4 text-base outline-none"
            style={inputStyle(!!touched.date || submitted, !!errors.date, !!focused.date)}
          />
          <FieldError msg={showErr("date")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="b-time" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Time <span style={{ color: "var(--state-error)" }}>*</span>
          </label>
          <input
            id="b-time" type="time"
            min={minTime || undefined}
            value={form.time} onChange={set("time")}
            onFocus={focusIn("time")} onBlur={focusOut("time")}
            className="h-12 rounded-lg px-4 text-base outline-none"
            style={inputStyle(!!touched.time || submitted, !!errors.time, !!focused.time)}
          />
          <FieldError msg={showErr("time")} />
          {form.date === today && (
            <span className="text-xs" style={{ color: "var(--ink-muted)" }}>
              Same-day rides require at least 2 hours notice.
            </span>
          )}
        </div>
      </div>

      {/* Passengers */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="b-passengers" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
          Number of passengers
        </label>
        <div className="relative">
          <select
            id="b-passengers"
            value={form.passengers} onChange={set("passengers")}
            onFocus={focusIn("passengers")} onBlur={focusOut("passengers")}
            className="w-full h-12 rounded-lg px-4 pr-10 text-base outline-none appearance-none cursor-pointer"
            style={inputStyle(false, false, !!focused.passengers)}
          >
            {["1", "2", "3", "4", "5", "6", "7+"].map((n) => (
              <option key={n} value={n}>{n} passenger{n !== "1" ? "s" : ""}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ color: "var(--ink-muted)" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="b-notes" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Additional information{" "}
            <span className="font-normal" style={{ color: "var(--ink-muted)" }}>(optional)</span>
          </label>
          <span
            className="text-xs tabular-nums"
            style={{ color: form.notes.length > NOTES_MAX ? "var(--state-error)" : "var(--ink-muted)" }}
          >
            {form.notes.length} / {NOTES_MAX}
          </span>
        </div>
        <textarea
          id="b-notes" rows={4}
          value={form.notes} onChange={set("notes")}
          onFocus={focusIn("notes")} onBlur={focusOut("notes")}
          placeholder="Luggage details, accessibility needs, flight number for airport transfers, gate or lobby instructions…"
          className="rounded-lg px-4 py-3 text-base outline-none resize-none"
          style={inputStyle(!!touched.notes, !!errors.notes, !!focused.notes)}
        />
        <FieldError msg={showErr("notes")} />
      </div>

      {/* Server error */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" style={{ color: "var(--state-error)" }}>
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-sm" style={{ color: "var(--state-error)" }}>{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={busy}
        className="py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
        style={{ fontFamily: "var(--font-body)", backgroundColor: "var(--brand-primary)", color: "var(--ink-on-brand)" }}
      >
        {busy ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Sending request…
          </>
        ) : "Book my ride"}
      </button>

      <p className="text-xs text-center" style={{ color: "var(--ink-muted)" }}>
        We will contact you to confirm your booking. No payment is taken at this stage.
      </p>
    </form>
  );
}
