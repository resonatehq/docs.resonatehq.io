import { Github } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Documentation", href: "/docs" },
    { label: "Get Started", href: "/docs/get-started" },
    { label: "Pricing", href: "https://www.resonatehq.io/pricing" },
    { label: "Examples", href: "/docs/get-started/examples" },
  ],
  community: [
    { label: "Discord", href: "https://resonatehq.io/discord" },
    { label: "GitHub", href: "https://github.com/resonatehq" },
    { label: "Journal", href: "https://journal.resonatehq.io" },
    { label: "RSVP", href: "https://resonatehq.io/rsvp" },
  ],
  company: [
    { label: "Home", href: "https://www.resonatehq.io" },
    { label: "Privacy Policy", href: "https://www.resonatehq.io/privacy-policy" },
    { label: "Terms", href: "https://www.resonatehq.io/terms-and-conditions" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 mt-16">
      <div className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="22"
                viewBox="0 0 432 472"
                className="text-white"
                aria-hidden="true"
              >
                <g fill="#080A0E" stroke="currentColor">
                  <path
                    strokeWidth="30"
                    d="M218.632,60C107.088,60,15.374,138.248,15.374,236.252C15.374,292.38,39.0338,336.722,75.978,366.934C112.825,397.067,162.68,413,215.11,413C266.913,413,316.754,397.512,353.75,367.861C390.854,338.124,414.845,294.27,414.845,238.237C414.845,140.526,330.503,60,218.632,60Z"
                  />
                  <ellipse cx="109" cy="236" fill="currentColor" rx="50" ry="55" />
                  <ellipse cx="321" cy="234" fill="currentColor" rx="50" ry="55" />
                  <rect width="8" height="16" x="204" y="282" fill="currentColor" rx="4" transform="rotate(25 204 282)" />
                  <rect width="8" height="16" x="217" y="285" fill="currentColor" rx="4" transform="rotate(-25 217 285)" />
                </g>
              </svg>
              <span className="font-display text-lg font-semibold text-white">resonate</span>
            </div>
            <p className="font-serif text-sm text-muted">
              Durable execution. Dead simple.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted hover:text-primary transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted hover:text-primary transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-primary/10 flex items-center justify-between">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} ResonateHQ, Inc.
          </p>
          <a
            href="https://github.com/resonatehq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-primary transition"
          >
            <Github size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
