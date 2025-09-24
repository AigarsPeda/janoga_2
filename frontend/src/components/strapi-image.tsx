import { getStrapiMedia } from "@/lib/utils";
import Image from "next/image";

interface StrapiImageProps {
  src: string;
  alt: string;
  width?: number;
  fill?: boolean;
  height?: number;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export function StrapiImage({
  src,
  width,
  style,
  height,
  alt = "",
  className,
  fill = false,
  priority = false,
}: Readonly<StrapiImageProps>) {
  if (!src) return null;
  const imageUrl = getStrapiMedia(src);
  const imageFallback = `https://placehold.co/${width}x${height}`;

  return (
    <Image
      src={imageUrl ?? imageFallback}
      alt={alt}
      height={height}
      width={width}
      className={className}
      priority={priority}
      fill={fill}
      style={style}
    />
  );
}
