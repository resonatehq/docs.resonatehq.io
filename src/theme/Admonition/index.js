import React from "react";
import clsx from "clsx";
import {
  ThemeClassNames,
  processAdmonitionProps,
} from "@docusaurus/theme-common";
import Translate from "@docusaurus/Translate";
import styles from "./styles.module.css";

// Icons

function InfoIcon(props) {
  return (
    <svg viewBox="0 0 14 16" {...props}>
      <path
        fillRule="evenodd"
        d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"
      />
    </svg>
  );
}

function NoteIcon(props) {
  return (
    <svg viewBox="0 0 14 16" {...props}>
      <path
        fillRule="evenodd"
        d="M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01z"
      />
    </svg>
  );
}

function TipIcon(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <path
        clip-rule="evenodd"
        d="m502.568 179.096c-8.902 8.857-22.169 10.673-32.892 5.514l-110.908 146.02 3.115 3.093c11.236 11.177 11.229 29.301-.015 40.484-10.624 10.567-27.472 11.142-38.778 1.752l-.081.104-1.85-1.838-183.111-182.11-1.848-1.835.103-.082c-9.441-11.242-8.863-27.998 1.762-38.561 11.245-11.187 29.47-11.193 40.708-.021l3.112 3.098 146.824-110.294c-5.19-10.661-3.358-23.854 5.545-32.713 10.616-10.557 27.447-11.14 38.751-1.772l.106-.08 1.849 1.835 127.623 126.925 1.85 1.835-.083.106c9.422 11.244 8.835 27.981-1.782 38.54zm-266.5 132.598-231.37 196.983-3.698-3.676 198.077-230.1z"
        fill-rule="evenodd"
      ></path>
    </svg>
  );
}

function DangerIcon(props) {
  return (
    <svg viewBox="0 0 12 16" {...props}>
      <path
        fillRule="evenodd"
        d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"
      />
    </svg>
  );
}

function WarningIcon(props) {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path
        fillRule="evenodd"
        d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"
      />
    </svg>
  );
}

function DifferentiatorIcon(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <path d="m175.384 174.084h156.431c3.301 0 5.901-2.601 5.901-5.901v-162.332c0-3.301-2.6-5.901-5.901-5.901h-324.664c-3.301 0-5.901 2.601-5.901 5.901v324.963c0 3.301 2.601 5.901 5.901 5.901h162.332c3.301 0 5.901-2.601 5.901-5.901zm329.465 1.4h-162.332c-3.301 0-5.901 2.601-5.901 5.901v156.431h-156.531c-3.301 0-5.901 2.601-5.901 5.901v162.332c0 3.301 2.601 5.901 5.901 5.901h324.963c3.301 0 5.901-2.601 5.901-5.901v-324.664c-.199-3.2-2.8-5.901-6.1-5.901z" />
    </svg>
  );
}

// Config

const AdmonitionConfigs = {
  note: {
    className: "secondary",
    icon: NoteIcon,
    label: (
      <Translate id="theme.admonition.note" description="Note admonition label">
        note
      </Translate>
    ),
  },
  tip: {
    className: "success",
    icon: TipIcon,
    label: (
      <Translate id="theme.admonition.tip" description="Tip admonition label">
        tip
      </Translate>
    ),
  },
  info: {
    className: "info",
    icon: InfoIcon,
    label: (
      <Translate id="theme.admonition.info" description="Info admonition label">
        info
      </Translate>
    ),
  },
  danger: {
    className: "danger",
    icon: DangerIcon,
    label: (
      <Translate
        id="theme.admonition.danger"
        description="Danger admonition label"
      >
        danger
      </Translate>
    ),
  },
  warning: {
    className: "warning",
    icon: WarningIcon,
    label: (
      <Translate
        id="theme.admonition.warning"
        description="Warning admonition label"
      >
        warning
      </Translate>
    ),
  },
  differentiator: {
    className: "differentiator",
    icon: DifferentiatorIcon,
    label: (
      <Translate
        id="theme.admonition.differentiator"
        description="Differentiator admonition label"
      >
        differentiator
      </Translate>
    ),
  },
};

// Aliases

const aliases = {
  secondary: "note",
  important: "info",
  success: "tip",
  caution: "warning",
};

// Main Admonition

export default function Admonition(unprocessedProps) {
  const props = processAdmonitionProps(unprocessedProps);
  const type = aliases[props.type] ?? props.type;

  const config = AdmonitionConfigs[type];

  if (!config) {
    console.warn(`Unknown admonition type: ${type}. Defaulting to info.`);
    return Admonition({ ...props, type: "info" });
  }

  const Icon = config.icon;

  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        "alert",
        `alert--${config.className}`,
        styles.admonition
      )}
    >
      <div className={styles.admonitionHeading}>
        <span className={styles.admonitionIcon}>
          <Icon />
        </span>
        {props.title || config.label}
      </div>
      <div className={styles.admonitionContent}>{props.children}</div>
    </div>
  );
}
