import { CallToActionProps } from "@/types";

export function CallToAction(data: Readonly<CallToActionProps>) {
  if (!data) return null;

  const { heading, buttonLink } = data;

  return (
    <div className="container my-20">
      <div className=" flex flex-col items-center justify-between gap-6 bg-primary/10 mt-10 p-4 text-center sm:flex-row sm:text-left rounded-2xl">
        <h2 className="font-heading text-2xl font-semibold">{heading}</h2>
        {buttonLink && (
          <a
            href={buttonLink.href}
            target={buttonLink.isExternal ? "_blank" : "_self"}
            rel={buttonLink.isExternal ? "noopener noreferrer" : undefined}
            className="rounded-md bg-primary px-5 py-3 text-white transition-colors hover:bg-primary/80"
          >
            {buttonLink.text}
          </a>
        )}
      </div>
    </div>
  );
}
