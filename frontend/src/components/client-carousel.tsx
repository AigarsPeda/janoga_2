"use client";

import { getStrapiMedia } from "@/lib/utils";
import { Client, ClientCarouselProps } from "@/types";
import type { EmblaOptionsType } from "embla-carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import { FC, useCallback, useEffect, useRef, useState } from "react";

// https://www.embla-carousel.com/api/events/
// https://www.embla-carousel.com/examples/predefined/

interface MediaTypes {
  id: number;
  attributes: {
    url: string;
    width: number;
    height: number;
    caption: string | null;
    alternativeText: string | null;
  };
}

export interface FeaturesType {
  isExternal: boolean;
  href: string | null;
  media: {
    data: MediaTypes;
  };
}

export interface Department {
  id: number;
  url: string;
  media: { data: MediaTypes };
}

const FADE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const OPTIONS: EmblaOptionsType = { loop: true, align: "start" };

export default function ClientCarousel({ clients }: Readonly<ClientCarouselProps>) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <div className="container mx-auto">
        <div className="relative min-h-[5rem] md:min-h-[5rem] flex justify-center items-center">
          <div className="absolute top-0 left-0 z-10 w-20 h-full bg-gradient-to-r from-[var(--color-background)] to-transparent"></div>
          <AnimatePresence mode="wait">
            <motion.div
              exit="hidden"
              initial="hidden"
              variants={FADE_VARIANTS}
              style={{ width: "100%" }}
              transition={{ duration: 1.1 }}
              animate={isVisible ? "visible" : "hidden"}
            >
              <EmblaCarousel
                options={OPTIONS}
                slides={clients}
                handelIsLoading={() => {
                  setIsVisible(true);
                }}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-0 right-0 z-10 w-20 h-full bg-gradient-to-l from-[var(--color-background)] to-transparent"></div>
        </div>
      </div>
    </>
  );
}

// Preload all images and resolve when all are loaded
export const preloadAllImages = (slides: Client[]) => {
  return new Promise<void>((resolve) => {
    let loadedCount = 0;
    slides.forEach((item) => {
      const img = new Image();
      img.src = getStrapiMedia(item.image.url) ?? "";
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === slides.length) {
          resolve();
        }
      };
      img.onerror = () => {
        loadedCount += 1; // Still count if there's an error loading an image
        if (loadedCount === slides.length) {
          resolve();
        }
      };
    });
  });
};

type PropType = {
  slides: Client[];
  options?: EmblaOptionsType;
  handArraySwitch?: () => void;
  handelIsLoading: () => void;
};

const EmblaCarousel: FC<PropType> = ({ slides, options, handArraySwitch, handelIsLoading }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: true, direction: "forward", speed: 1 }),
  ]);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const [userIsInteracting, setUserIsInteracting] = useState(false);

  // Preload all images before showing the carousel
  useEffect(() => {
    preloadAllImages(slides).then(() => {
      handelIsLoading();
    });
  }, [slides]);

  const onButtonAutoplayClick = useCallback(
    (callback: () => void) => {
      const autoScroll = emblaApi?.plugins()?.autoScroll;
      if (!autoScroll) return;

      const resetOrStop =
        autoScroll.options.stopOnInteraction === false ? autoScroll.reset : autoScroll.stop;

      resetOrStop();
      callback();
    },
    [emblaApi],
  );

  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;

    if (userIsInteracting || !autoScroll) {
      timerId.current = null;
      return;
    }

    emblaApi.reInit({ loop: true });
    autoScroll.play();

    const timeToSwitch = 10 * 1000 * 2.2;

    timerId.current = setTimeout(() => {
      handArraySwitch && handArraySwitch();
    }, timeToSwitch);

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
    };
  }, [emblaApi, handArraySwitch, slides, userIsInteracting]);

  useEffect(() => {
    emblaApi?.reInit();
    const autoScroll = emblaApi?.plugins()?.autoScroll;

    if (!autoScroll) return;

    autoScroll.play();

    emblaApi
      .on("pointerDown", () => {
        setUserIsInteracting(true);
        if (timerId.current) {
          clearTimeout(timerId.current);
          timerId.current = null;
        }
      })
      .on("pointerUp", () => {
        setUserIsInteracting(false);
        timerId.current = setTimeout(() => {
          if (!autoScroll.isPlaying()) {
            autoScroll.play();
          }
        }, 3000);
      });

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
    };
  }, [emblaApi, slides]);

  return (
    <div className="embla w-full">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex items-center gap-8">
          {slides.map((item, i) => (
            <div key={`${i}`} className="embla__slide shrink-0 flex-[0_0_auto]">
              <div className="embla__slide__number">
                <Link
                  prefetch={true}
                  href={item.href ?? "/"}
                  target={item.isExternal ? "_self" : "_blank"}
                  className="block"
                >
                  {item.image.url && (
                    <img
                      src={getStrapiMedia(item.image.url) ?? ""}
                      alt="our client logo"
                      className="object-contain h-12 md:h-16 w-auto mx-auto"
                      style={{ maxHeight: "80px" }}
                    />
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
