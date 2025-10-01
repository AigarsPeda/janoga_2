"use client";

import * as React from "react";
import { StrapiImage } from "./strapi-image";
import clsx from "clsx";
import { ImageGalleryProps } from "@/types";

export function MasonryGallery({ images }: ImageGalleryProps) {
  console.log("MasonryGallery Props:", images);

  return (
    <section>
      {images && images.length > 0 ? (
        <div className="masonry-gallery">
          {images.map((img) => (
            <div key={img.image.id} className="masonry-item">
              <StrapiImage
                src={img.image?.url || ""}
                alt={img.name || "Gallery Image"}
                width={img.image?.width || 300}
                height={img.image?.height || 200}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No images available.</p>
      )}
    </section>
  );
}
