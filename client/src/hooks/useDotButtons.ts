import { useCallback, useEffect, useState } from "react"
import type { EmblaCarouselType } from "embla-carousel"

/**
 * useDotButtons
 * -------------
 * Custom hook for managing Embla pagination dots.
 *
 * Responsibilities:
 * - Tracks the currently selected slide.
 * - Exposes `scrollSnaps` for rendering dot count.
 * - Provides `onDotButtonClick` to jump to a given slide.
 * - Resets autoplay via the optional callback.
 *
 * Notes:
 * This hook wraps Embla’s event API (`select`, `reInit`) and keeps local state
 * in sync with Embla.
 *
 * Params:
 * - `emblaApi` — EmblaCarouselType instance.
 * - `onClick` — optional callback executed on dot click.
 */

export const useDotButtons = (
  emblaApi: EmblaCarouselType | undefined,
  onClick?: (api: EmblaCarouselType) => void
) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
      onClick?.(emblaApi)
    },
    [emblaApi, onClick]
  )

  const onInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList())
  }, [])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on("select", onSelect).on("reInit", onInit)
  }, [emblaApi, onInit, onSelect])

  return { selectedIndex, scrollSnaps, onDotButtonClick }
}