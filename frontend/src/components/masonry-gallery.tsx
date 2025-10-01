"use client";

import * as React from "react";
import { StrapiImage } from "./strapi-image";
import { ImageGalleryProps } from "@/types";

export function MasonryGallery({ images }: ImageGalleryProps) {
  return (
    <section className="w-full py-8 container">
      {images && images.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {images.map((img) => (
            <div key={img.image.id} className="break-inside-avoid mb-4 group">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                <StrapiImage
                  src={img.image?.url || ""}
                  alt={img.name || "Gallery Image"}
                  width={img.image?.width || 300}
                  height={img.image?.height || 200}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                {img.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{img.name}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No images available.</p>
      )}
    </section>
  );
}
