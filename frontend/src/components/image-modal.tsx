"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { StrapiImage } from "./strapi-image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageModalProps {
  images: {
    name: string;
    image: {
      id: string;
      url: string;
      width: number;
      height: number;
    };
  }[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageModal({ images, initialIndex, open, onOpenChange }: ImageModalProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(initialIndex);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    // Set initial slide when modal opens
    if (open) {
      api.scrollTo(initialIndex, true);
      setCurrent(initialIndex);
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, initialIndex, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
        <DialogTitle className="sr-only">
          Image Gallery - Viewing image {current + 1} of {images.length}
        </DialogTitle>
        <div className="relative w-full h-full flex flex-col">
          {/* Close button */}
          {/* <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button> */}

          {/* Image counter */}
          {/* <div className="absolute top-4 left-4 z-50 bg-black/50 px-4 py-2 rounded-full text-white text-sm font-medium">
            {current + 1} / {images.length}
          </div> */}

          {/* Carousel */}
          <div className="flex-1 flex items-center justify-center p-8">
            <Carousel
              setApi={setApi}
              className="w-full h-full"
              opts={{
                loop: true,
                startIndex: initialIndex,
              }}
            >
              <CarouselContent className="h-full">
                {images.map((img, index) => (
                  <CarouselItem key={img.image.id} className="h-full">
                    <div className="flex items-center justify-center h-full w-full">
                      <div className="relative max-w-full max-h-full">
                        <StrapiImage
                          src={img.image.url}
                          alt={img.name || "Gallery Image"}
                          width={img.image.width}
                          height={img.image.height}
                          className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                        />
                        {/* {img.name && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <p className="text-white text-lg font-medium">{img.name}</p>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation buttons */}
              <CarouselPrevious className="left-4 h-12 w-12 bg-black/50 border-none text-white hover:bg-black/70 hover:text-white" />
              <CarouselNext className="right-4 h-12 w-12 bg-black/50 border-none text-white hover:bg-black/70 hover:text-white" />
            </Carousel>
          </div>

          {/* Thumbnail strip (optional - can be removed if not needed) */}
          <div className="bg-black/80 p-4 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {images.map((img, index) => (
                <button
                  key={img.image.id}
                  onClick={() => api?.scrollTo(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                    current === index
                      ? "ring-2 ring-white scale-110"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <StrapiImage
                    src={img.image.url}
                    alt={img.name || "Thumbnail"}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
