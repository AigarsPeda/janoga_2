import { cn } from "@/lib/utils";
import type { SectionHeadingProps } from "@/types";

export function SectionHeading(data: Readonly<SectionHeadingProps>) {
  if (!data) return null;

  const { heading, subHeading, text, centered = true } = data;
  const headingStyle = centered ? "flex flex-col text-center items-center" : "";

  return (
    <div className={cn("container items-center justify-between gap-2 py-8 md:py-12", headingStyle)}>
      <div className="flex flex-col gap-4">
        {subHeading && (
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="font-semibold uppercase text-primary tracking-[0.2em] text-xs">
              {subHeading}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        )}
        {heading && (
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-2 tracking-tight"
            style={{ fontFamily: "'Lora', 'Georgia', serif" }}
          >
            {heading}
          </h2>
        )}
      </div>
      {text && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mt-2 font-light">
          {text}
        </p>
      )}
    </div>
  );
}
