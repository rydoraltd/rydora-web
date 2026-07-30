"use client";

export default function ContactForm() {
  const focusStyle = (e: React.FocusEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "var(--line-subtle)";
  };

  const inputBase = {
    fontFamily: "var(--font-body)",
    backgroundColor: "var(--surface-raised)",
    border: "1.5px solid var(--line-subtle)",
    color: "var(--ink-strong)",
  } as const;

  return (
    <form
      className="flex flex-col gap-6"
      action="mailto:hello@rydora.com"
      method="post"
      aria-label="Contact form"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}
        >
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="h-12 rounded-lg px-4 text-base outline-none transition-all duration-150"
          style={inputBase}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 rounded-lg px-4 text-base outline-none transition-all duration-150"
          style={inputBase}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="type"
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}
        >
          Enquiry type
        </label>
        <select
          id="type"
          name="type"
          className="h-12 rounded-lg px-4 text-base outline-none transition-all duration-150 appearance-none cursor-pointer"
          style={inputBase}
          onFocus={focusStyle}
          onBlur={blurStyle}
        >
          <option value="">Select one</option>
          <option value="owner">I want to register a vehicle</option>
          <option value="driver">I want to apply as a driver</option>
          <option value="business">I need corporate fleet management</option>
          <option value="general">General enquiry</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="rounded-lg px-4 py-3 text-base outline-none transition-all duration-150 resize-none"
          style={inputBase}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
      </div>

      <button
        type="submit"
        className="h-12 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        style={{
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--brand-primary)",
          color: "var(--ink-on-brand)",
        }}
      >
        Send message
      </button>
    </form>
  );
}
