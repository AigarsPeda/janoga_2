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
      <DialogContent
        /* Full height on mobile so image can use full viewport */
        className="max-w-[95vw] sm:max-w-7xl w-full h-screen sm:h-[90vh] p-0 bg-black/95 border-none overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          Image Gallery - Viewing image {current + 1} of {images.length}
        </DialogTitle>
        <div className="relative w-full h-full flex flex-col">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 rounded-full bg-black/50 p-1.5 sm:p-2 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Close</span>
          </button>

          {/* Image counter */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-50 bg-black/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium">
            {current + 1} / {images.length}
          </div>

          {/* Carousel - Main image area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
            <Carousel
              setApi={setApi}
              className="w-full h-full flex"
              opts={{
                loop: true,
                startIndex: initialIndex,
              }}
            >
              <CarouselContent className="h-full -ml-0 flex items-center">
                {images.map((img, index) => (
                  <CarouselItem
                    key={img.image.id}
                    className="h-full pl-0 flex items-center justify-center"
                  >
                    <div className="flex items-center justify-center h-full w-full px-2 py-2 sm:px-12 sm:py-6">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <StrapiImage
                          src={img.image.url}
                          alt={img.name || "Gallery Image"}
                          width={img.image.width}
                          height={img.image.height}
                          className="select-none max-w-full max-h-full w-auto h-auto object-contain mx-auto"
                          /* On mobile we subtract approximate thumbnail strip (110px incl. padding & counter area); on larger screens subtract less */
                          style={{
                            maxWidth: "100%",
                            maxHeight: "calc(100vh - 150px)", // mobile full-screen adjustment
                            width: "auto",
                            height: "auto",
                          }}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation buttons */}
              <CarouselPrevious className="left-1 sm:left-4 h-8 w-8 sm:h-12 sm:w-12 bg-black/50 border-none text-white hover:bg-black/70 hover:text-white" />
              <CarouselNext className="right-1 sm:right-4 h-8 w-8 sm:h-12 sm:w-12 bg-black/50 border-none text-white hover:bg-black/70 hover:text-white" />
            </Carousel>
          </div>

          {/* Thumbnail strip */}
          {/* <div className="bg-black/80 p-2 sm:p-3 overflow-x-auto flex-shrink-0 border-t border-white/10 hidden">
            <div className="flex gap-2 sm:gap-3 justify-center">
              {images.map((img, index) => (
                <button
                  key={img.image.id}
                  onClick={() => api?.scrollTo(index)}
                  className={`flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-md overflow-hidden transition-all ${
                    current === index
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-60 hover:opacity-100"
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
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
