"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check, Copy, Github, Linkedin, Mail, MapPin, Phone, Send, Twitter,
} from "lucide-react";
import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

type Field = "name" | "email" | "message";

/**
 * Contact form with inline validation and a success sequence.
 * Static site — on submit it composes a pre-filled email in the
 * visitor's mail app (no server, nothing stored, no spam surface).
 */
export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (values.name.trim().length < 2) e.name = "Tell me your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "That email doesn't look right";
    if (values.message.trim().length < 10) e.message = "A little more detail helps (10+ characters)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent(`Portfolio message from ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls = (field: Field) =>
    cn(
      "w-full rounded-lg border bg-raised px-4 py-3 text-sm text-ink placeholder:text-mute/60 transition-all duration-300 focus:outline-none focus:ring-2",
      errors[field]
        ? "border-accent focus:ring-accent/40"
        : "border-line focus:border-accent/50 focus:ring-accent/25"
    );

  const socials = [
    { href: profile.socials.github, label: "GitHub", icon: <Github size={17} aria-hidden /> },
    { href: profile.socials.linkedin, label: "LinkedIn", icon: <Linkedin size={17} aria-hidden /> },
    { href: profile.socials.twitter, label: "X / Twitter", icon: <Twitter size={17} aria-hidden /> },
  ];

  return (
    <section id="contact" aria-label="Contact" className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div
        aria-hidden
        className="animate-drift absolute bottom-0 left-1/2 -z-10 h-[50vh] w-[70vw] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]"
      />
      <SectionHeading
        eyebrow="Next Episode"
        title="Let's Work Together"
        blurb="Open to Data Analyst and AI/ML roles where speed, adaptability, and an AI-first approach add real value."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        {/* Direct channels */}
        <div className="space-y-4">
          <Reveal>
            <button
              onClick={copyEmail}
              data-cursor="hover"
              className="card-lift group flex w-full items-center justify-between rounded-xl border border-line bg-surface p-5 text-left"
              aria-label={`Copy email address ${profile.email}`}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                  <Mail size={17} aria-hidden />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-wider text-mute">Email</span>
                  <span className="text-sm font-semibold text-ink">{profile.email}</span>
                </span>
              </span>
              <span className="text-mute transition-colors group-hover:text-accent">
                {copied ? <Check size={16} className="text-[#46d369]" aria-hidden /> : <Copy size={16} aria-hidden />}
              </span>
            </button>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                <Phone size={17} aria-hidden />
              </span>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-mute">Phone</span>
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="text-sm font-semibold text-ink hover:text-accent">
                  {profile.phone}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                <MapPin size={17} aria-hidden />
              </span>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-mute">Location</span>
                <span className="text-sm font-semibold text-ink">{profile.location}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="flex gap-3 pt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor="hover"
                  className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-surface text-mute transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:text-accent hover:shadow-glow"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.1}>
          <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="cf-name" className="mb-1.5 block text-xs font-semibold text-mute">
                  Name
                </label>
                <input
                  id="cf-name"
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "cf-name-err" : undefined}
                  className={inputCls("name")}
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      id="cf-name-err"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-accent"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <label htmlFor="cf-email" className="mb-1.5 block text-xs font-semibold text-mute">
                  Email
                </label>
                <input
                  id="cf-email"
                  type="email"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "cf-email-err" : undefined}
                  className={inputCls("email")}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      id="cf-email-err"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-accent"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="cf-msg" className="mb-1.5 block text-xs font-semibold text-mute">
                Message
              </label>
              <textarea
                id="cf-msg"
                rows={5}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                placeholder="Tell me about the role or the problem you're solving…"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "cf-msg-err" : undefined}
                className={cn(inputCls("message"), "resize-none")}
              />
              <AnimatePresence>
                {errors.message && (
                  <motion.p
                    id="cf-msg-err"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-accent"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              data-cursor="hover"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-sm font-bold text-white shadow-glow transition-colors hover:bg-[#f6121d]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} aria-hidden /> Opening your mail app…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Send size={15} aria-hidden /> Send Message
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <p className="mt-3 text-center text-[11px] text-mute">
              Composes a pre-filled email in your mail app — nothing is stored.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
