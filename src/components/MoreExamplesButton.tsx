import React from "react";
import Link from "@docusaurus/Link";

type Props = {
  href: string;
  children?: React.ReactNode;
};

export default function MoreExamplesButton({href, children}: Props) {
  return (
    <Link className="moreExamplesButton" to={href}>
      {children ?? "More examples"}
    </Link>
  );
}
