import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { DotButton } from "./EmblaDots";
import styles from "./EmblaCarousel.module.css";
import { slides } from "../../utils/carouselInfo";
import { useDotButtons } from "../../hooks/useDotButtons";

type CarouselProps = {
  options?: EmblaOptionsType;
};

/**
 * EmblaCarousel
 * -------------
 * A responsive image carousel built on the third-party Embla Carousel library.
 * Pagination styling is based on an external example from FreeFrontend.
 *
 * Notes:
 * - Uses `useEmblaCarousel` with the Autoplay plugin (12s interval).
 * - Pagination dots are controlled through the `useDotButtons` hook.
 * - Clicking a dot resets autoplay.
 * - Supports desktop/mobile images and optional slide overlays.
 *
 * AI GEN:
 * The overlay/description rendering logic (heading, logo, subtext, CTA button)
 * was generated with AI.
 *
 * Props:
 * - `options` — Embla configuration object.
 *  * @prop {EmblaOptionsType} [options]
 *   Optional Embla configuration object allowing the parent component to control
 *   carousel behavior (e.g., looping, alignment, speed).
 */
const EmblaCarousel: React.FC<CarouselProps> = ({ options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 12000, stopOnInteraction: false }),
  ]);

  const onDotClick = useCallback((api: EmblaCarouselType) => {
    api?.plugins()?.autoplay?.reset();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButtons(
    emblaApi,
    onDotClick
  );

  return (
    <section className={styles.embla}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured recipe images carousel"
    >

      {/* ✅ Dots */}
      <div className={styles.dotsWrapper}
        aria-label="Carousel slide selector"
      >

        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`${styles.dot} ${index === selectedIndex ? styles.dotSelected : ""}`}
            aria-label={`Go to slide ${index + 1} of ${scrollSnaps.length}`} index={index}
          />
        ))}
      </div>

      {/* ✅ Slides */}
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {slides.map((slide, index) => (
            <div className={styles.slide}
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
              aria-current={index === selectedIndex ? "true" : undefined}
              tabIndex={index === selectedIndex ? 0 : -1}
            >


              {/* Desktop image */}
              <img src={slide.desktop}
                className={styles.imgDesktop}
                loading="lazy"
                alt={
                  slide.overlay?.heading
                    ? `${slide.overlay.heading} — featured recipe image`
                    : `Recipe slide ${index + 1}`
                }
              />

              {/* Mobile image */}
              <img src={slide.mobile}
                className={styles.imgMobile}
                loading="lazy"
                alt={slide.overlay?.heading || `Slide ${index + 1}`}
              />

              {/* Overlay */}
              {slide.overlay && (
                <div className={styles.overlay}>
                  <h2>{slide.overlay.heading}</h2>

                  {slide.overlay.logo && (
                    <img
                      src={slide.overlay.logo}
                      alt="Let Them Cook Logo"
                      className={styles.logo}
                    />
                  )}

                  {slide.overlay.subtext && <p>{slide.overlay.subtext}</p>}
                  {slide.overlay.buttonText && (
                    <a href={slide.overlay.buttonLink || "#"}
                      aria-label={`Learn more about ${slide.overlay.heading}`}
                    >
                      <button className={styles.overlayBtn}>
                        {slide.overlay.buttonText}
                      </button>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
