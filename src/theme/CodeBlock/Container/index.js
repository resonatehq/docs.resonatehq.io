import React from "react";
import clsx from "clsx";
import {
  ThemeClassNames,
  useColorMode,
  usePrismTheme,
} from "@docusaurus/theme-common";
import { getPrismCssVariables } from "@docusaurus/theme-common/internal";
import styles from "./styles.module.css";

const { themes } = require("prism-react-renderer");
const fallbackPrismThemes = {
  light: themes.vsLight,
  dark: themes.vsDark,
};

export default function CodeBlockContainer({ as: As, ...props }) {
  let colorMode = "light";
  try {
    ({ colorMode } = useColorMode());
  } catch (error) {
    if (!(error instanceof Error) || !/ColorModeProvider/.test(error.message)) {
      throw error;
    }
    // Fallback during SSR or when the provider isn't available yet.
    if (
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "dark"
    ) {
      colorMode = "dark";
    }
  }

  let prismTheme;
  try {
    prismTheme = usePrismTheme();
  } catch (error) {
    if (error instanceof Error && /ColorModeProvider/.test(error.message)) {
      prismTheme = fallbackPrismThemes[colorMode === "dark" ? "dark" : "light"];
    } else {
      throw error;
    }
  }

  const prismCssVariables = getPrismCssVariables(prismTheme);
  return (
    <As
      key={colorMode}
      // Polymorphic components are hard to type, without `oneOf` generics
      {...props}
      style={prismCssVariables}
      className={clsx(
        props.className,
        styles.codeBlockContainer,
        ThemeClassNames.common.codeBlock
      )}
    />
  );
}
