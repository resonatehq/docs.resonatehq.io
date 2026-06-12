interface ThemeImageProps {
  /** Asset shown on the light theme (public path). */
  light: string;
  /** Asset shown on the dark theme (public path). */
  dark: string;
  alt: string;
}

/**
 * Renders a light/dark pair of images and toggles between them with the
 * site's class-based dark mode (`.dark` ancestor). Both render into the DOM;
 * Tailwind's `dark:` variant hides the inactive one. No JS / hydration needed.
 * Inherits the `.docs-content img` border + sizing from globals.css.
 */
export default function ThemeImage({ light, dark, alt }: ThemeImageProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={light} alt={alt} className="block dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dark} alt={alt} className="hidden dark:block" />
    </>
  );
}
