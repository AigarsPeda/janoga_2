"use client";

import { cn, getStrapiMedia } from "@/lib/utils";
import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";

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

// interface ClientSectionsProps {
//   data: { title: string; feature: FeaturesType[]; Department: Department[] };
// }

const OPTIONS: EmblaOptionsType = { loop: true, align: "start" };
// const ORDER_OF_LIST = ["carat", "iprospect", "dentsux", "dentsucreative"];

export default function ClientSections({
  data,
}: {
  data: { title: string; feature: FeaturesType[]; Department: Department[] };
}) {
  const [isVisible, setIsVisible] = useState(true);
  // const [currentCompany, setCurrentCompany] = useState("");

  // create obj with key as company name and value as array of features
  // const featuresByCompany = useMemo(() => {
  //   const obj = data.feature.reduce(
  //     (acc, item) => {
  //       const company = item.participatingCompany?.toLowerCase();
  //       if (company) {
  //         if (!acc[company]) {
  //           acc[company] = [];
  //         }

  //         item = {
  //           ...item,
  //           media: {
  //             data: {
  //               ...item.media.data,
  //               attributes: {
  //                 ...item.media.data.attributes,
  //                 url: getStrapiMedia(item.media.data?.attributes?.url) ?? " ",
  //               },
  //             },
  //           },
  //         };

  //         acc[company].push(item);
  //       }
  //       return acc;
  //     },
  //     {} as Record<string, FeaturesType[]>,
  //   );

  //   // make all 2 times the length
  //   Object.keys(obj).forEach((key) => {
  //     obj[key] = obj[key].concat(obj[key]);
  //   });

  //   return obj;
  // }, [data.feature]);

  // const filteredData = useMemo(() => {
  //   setIsVisible(false); // Trigger fade out
  //   return featuresByCompany[currentCompany] || [];
  // }, [currentCompany]);

  // const uniqueCompanies = data.feature.reduce((acc, item) => {
  //   if (item.participatingCompany) {
  //     acc.add(item.participatingCompany?.toLowerCase());
  //   }
  //   return acc;
  // }, new Set<string>());

  // const sortedCompanies = Array.from(uniqueCompanies).sort((a, b) => {
  //   return ORDER_OF_LIST.indexOf(a) - ORDER_OF_LIST.indexOf(b);
  // });

  // const handleSwitch = () => {
  //   const index = sortedCompanies.indexOf(currentCompany);
  //   const nextCompany = sortedCompanies[index + 1] || sortedCompanies[0];

  //   setCurrentCompany(nextCompany?.toLowerCase());
  // };

  // useEffect(() => {
  //   if (!currentCompany) {
  //     setCurrentCompany(sortedCompanies[0]?.toLowerCase());
  //   }
  // }, []);

  return (
    <>
      {/* <div
        className={cn(
          "grid-cols-1 lg:grid-cols-4 gap-6 space-y-7 md:space-y-0 container mx-auto py-14 grid",
        )}
      >
        {data.Department?.map((item) => {
          const imgSrc = getStrapiMedia(item.media.data?.attributes?.url);

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-center lg:block object-contain max-h-6 hover:opacity-50 transition-all",
                currentCompany !== item.url ? "opacity-35" : "",
              )}
            >
              {imgSrc ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentCompany(item.url);
                  }}
                >
                  <img
                    src={imgSrc}
                    alt="our client logo"
                    className={cn("object-contain max-h-6 transition-all")}
                  />
                </button>
              ) : (
                <div className="flex items-center justify-center w-24 h-24 bg-gray-200">
                  No Image Available
                </div>
              )}
            </div>
          );
        })}
      </div> */}
      <div className="container mx-auto">
        <h2 className="pb-2 text-xl font-normal text-center md:text-3xl">{data.title}</h2>
        <div className="relative min-h-[5.7rem] md:min-h-[10rem] flex justify-center items-center">
          <div className="absolute top-0 left-0 z-10 w-20 h-full bg-gradient-to-r from-white to-transparent"></div>
          <AnimatePresence mode="wait">
            <motion.div
              exit="hidden"
              initial="hidden"
              // key={/* currentCompany */"all-companies"}
              variants={FADE_VARIANTS}
              style={{ width: "100%" }}
              transition={{ duration: 1.1 }}
              animate={isVisible ? "visible" : "hidden"}
            >
              <EmblaCarousel
                options={OPTIONS}
                slides={[]}
                // handArraySwitch={handleSwitch}
                handelIsLoading={() => {
                  setIsVisible(true);
                }}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-0 right-0 z-10 w-20 h-full bg-gradient-to-l from-white to-transparent"></div>
        </div>
      </div>
    </>
  );
}

// Preload all images and resolve when all are loaded
export const preloadAllImages = (slides: FeaturesType[]) => {
  return new Promise<void>((resolve) => {
    let loadedCount = 0;
    slides.forEach((item) => {
      const img = new Image();
      img.src = item.media.data.attributes.url;
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
  slides: FeaturesType[];
  options?: EmblaOptionsType;
  handArraySwitch?: () => void;
  handelIsLoading: () => void;
};

const EmblaCarousel: FC<PropType> = ({ slides, options, handArraySwitch, handelIsLoading }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [AutoScroll({ playOnInit: true })]);
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
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((item, i) => (
            <div key={`${i}`} className="embla__slide">
              <div className="embla__slide__number">
                <Link
                  prefetch={true}
                  href={item.href ?? "/"}
                  target={item.isExternal ? "_self" : "_blank"}
                  className="object-cover w-full h-full"
                >
                  {item.media.data?.attributes?.url && (
                    <img
                      src={item.media.data?.attributes?.url}
                      alt="our client logo"
                      className="object-contain w-full h-full"
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
