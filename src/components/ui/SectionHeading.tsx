import Reveal from "./Reveal";

/** Row header in the Netflix idiom: red eyebrow + display title + rule. */
export default function SectionHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <Reveal className="mb-12 sm:mb-16">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {blurb && <p className="max-w-md text-sm leading-relaxed text-mute">{blurb}</p>}
      </div>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-accent/70 via-line to-transparent" />
    </Reveal>
  );
}
