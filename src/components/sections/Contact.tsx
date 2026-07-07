"use client";

import { useState } from "react";
import {
  Check, Copy, Github, Linkedin, Mail, MapPin, Phone, Twitter,
} from "lucide-react";
import { profile } from "@/lib/data";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/** Direct contact channels — email, phone, location, socials. */
export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { href: profile.socials.github, label: "GitHub", icon: <Github size={17} aria-hidden /> },
    { href: profile.socials.linkedin, label: "LinkedIn", icon: <Linkedin size={17} aria-hidden /> },
    { href: profile.socials.twitter, label: "X / Twitter", icon: <Twitter size={17} aria-hidden /> },
  ];

  return (
    <section id="contact" aria-label="Contact" className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
      <div
        aria-hidden
        className="animate-drift absolute bottom-0 left-1/2 -z-10 h-[50vh] w-[70vw] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]"
      />
      <SectionHeading
        eyebrow="Next Episode"
        title="Let's Work Together"
        blurb="Open to Data Analyst and AI/ML roles where speed, adaptability, and an AI-first approach add real value."
      />

      <div className="mx-auto max-w-xl">
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
      </div>
    </section>
  );
}
