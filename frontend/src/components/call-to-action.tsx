import { CallToActionProps } from "@/types";
import { ArrowRight } from "lucide-react";

export function CallToAction(data: Readonly<CallToActionProps>) {
  if (!data) return null;

  const { heading, buttonLink } = data;

  return (
    <div className="container my-16 md:my-24">
      <div className="relative overflow-hidden flex flex-col items-center justify-between gap-8 bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 p-8 sm:p-12 md:p-16 text-center sm:flex-row sm:text-left rounded-3xl border border-primary/10 shadow-xl">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex-1">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
            style={{ fontFamily: "'Lora', 'Georgia', serif" }}
          >
            {heading}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base font-light">
            Bezmaksas konsultācija • Personalizēts piedāvājums
          </p>
        </div>

        {buttonLink && (
          <div className="relative z-10">
            <a
              href={buttonLink.href}
              target={buttonLink.isExternal ? "_blank" : "_self"}
              rel={buttonLink.isExternal ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base sm:text-lg font-semibold text-background shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)]"
            >
              {buttonLink.text}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
