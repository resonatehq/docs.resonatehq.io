import React from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import styles from "./styles.module.css"; // Optional: for custom styles

const footerLinks = [
  {
    href: "https://journal.resonatehq.io",
    icon: "bx-pen",
    title: "journal",
    description: "Technical articles, announcements, and more",
  },
  {
    href: "https://docs.resonatehq.io",
    icon: "bx-code-block",
    title: "documentation",
    description: "How-to guides, references, and usage tutorials",
  },
  {
    href: "https://resonatehq.io/rsvp",
    icon: "bx-calendar-event",
    title: "rsvp",
    description: "RSVP for our next online event",
  },
  {
    href: "#",
    icon: "bx-chat",
    title: "echo",
    description: "Ask our AI assistant (Echo) a question",
    extraClass: "ask-echo",
  },
  {
    href: "https://resonatehq.io/discord",
    icon: "bxl-discord",
    title: "discord",
    description: "Get support and chat with our community",
  },
  {
    href: "https://github.com/resonatehq",
    icon: "bxl-github",
    title: "github",
    description: "View and contribute to the source code",
  },
  {
    href: "https://www.linkedin.com/company/resonatehqio",
    icon: "bxl-linkedin",
    title: "linkedin",
    description: "Follow us on LinkedIn",
  },
  {
    href: "https://twitter.com/resonatehqio",
    icon: "bxl-twitter",
    title: "twitter",
    description: "Follow our updates on Twitter/X",
  },
  {
    href: "https://www.youtube.com/@resonatehqio",
    icon: "bxl-youtube",
    title: "youtube",
    description: "Demos, webinars, and unplugged sessions",
  },
  {
    href: "https://resonatehq.io/privacy-policy",
    icon: "bx-info-circle",
    title: "privacy policy",
    description: "Your data rights and protections",
  },
  {
    href: "https://resonatehq.io/terms-and-conditions",
    icon: "bx-info-circle",
    title: "terms & conditions",
    description: "Our legal terms and expectations",
  },
];

export default function Footer() {
  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footerContainer}>
        <div className={styles.linkGrid}>
          {footerLinks.map(({ href, icon, title, description, extraClass }) => {
            const isExternal = href.startsWith("http");
            const LinkComponent = isExternal ? "a" : Link;

            return (
              <LinkComponent
                key={title}
                href={href}
                className={clsx(styles.linkBox, extraClass)}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <div className="flex flex-col justify-between h-full">
                  <div className={styles.linkTitle}>
                    <i className={`bx bx-sm ${icon}`}></i>
                    <span>{title}</span>
                  </div>
                  <p className={styles.linkDescription}>{description}</p>
                </div>
              </LinkComponent>
            );
          })}
        </div>

        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Resonate HQ, Inc.
        </p>
      </footer>
    </div>
  );
}
