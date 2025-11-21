import React from "react";
import clsx from "clsx";
import { ThemeClassNames, usePrismTheme } from "@docusaurus/theme-common";
import { getPrismCssVariables } from "@docusaurus/theme-common/internal";
import styles from "./styles.module.css";

const { themes } = require("prism-react-renderer");
const fallbackPrismTheme = themes.vsDark;

export default function CodeBlockContainer({ as: As, ...props }) {
  let prismTheme;
  try {
    prismTheme = usePrismTheme();
  } catch (error) {
    if (error instanceof Error && /ColorModeProvider/.test(error.message)) {
      prismTheme = fallbackPrismTheme;
    } else {
      throw error;
    }
  }

  const prismCssVariables = getPrismCssVariables(prismTheme);
  return (
    <As
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
