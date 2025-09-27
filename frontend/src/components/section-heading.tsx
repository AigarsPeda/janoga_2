import { cn } from "@/lib/utils";
import type { SectionHeadingProps } from "@/types";

export function SectionHeading(data: Readonly<SectionHeadingProps>) {
  if (!data) return null;

  const { heading, subHeading, text, centered = true } = data;
  const headingStyle = centered ? "flex flex-col text-center" : "";

  return (
    <div className={cn("container items-center justify-between gap-2 py-5", headingStyle)}>
      <div className="flex flex-col gap-3">
        {subHeading && <span className="font-bold uppercase text-primary">{subHeading}</span>}
        {heading && (
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl mb-2">{heading}</h2>
        )}
      </div>
      {text && <p className="text-lg text-muted-foreground max-w-2xl">{text}</p>}
    </div>
  );
}
