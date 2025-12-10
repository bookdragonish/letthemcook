import styles from "./EmblaCarousel.module.css";

type DotProps = React.ComponentPropsWithoutRef<"button"> & {
  index: number; // hvilken slide knappen tilhører
  selected?: boolean; // om den er aktiv
  totalSlides?: number; // valgfritt for bedre kontekst
};

export const DotButton: React.FC<DotProps> = ({
  index,
  selected = false,
  totalSlides,
  ...rest
}) => (
  <button
    className={`${styles.dot} ${selected ? styles.dot_active : ""}`}
    type="button"
    aria-label={
      totalSlides
        ? `Go to slide ${index + 1} of ${totalSlides}`
        : `Go to slide ${index + 1}`
    }
    aria-current={selected ? "true" : undefined}
    aria-pressed={selected}
    {...rest}
  />
);
