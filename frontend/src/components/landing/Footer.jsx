import { Link } from "react-router-dom";
import AILogo from "@/components/layout/AILogo";


const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Dashboard", href: "#dashboard-preview" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Resume templates", href: "#" },
      { label: "ATS guide", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="px-3 sm:px-6 mt-28 sm:mt-18 pb-12"
      style={{ maxWidth: 1240, marginLeft: "auto", marginRight: "auto" }}
    >
      <div className="rounded-[28px] bg-[var(--surface)] border border-[var(--border)] shadow-card p-8 sm:p-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <AILogo />
              <span className="font-display text-[16px] font-semibold tracking-tight text-[var(--ink)]">
                Resume Roaster
              </span>
            </Link>
            <p className="text-[13px] text-[var(--ink-muted)] mt-4 max-w-xs leading-relaxed">
              AI-powered ATS scoring and resume rewrites — built for engineers who'd
              rather ship than polish.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--ink)] font-semibold mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[13px] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[var(--ink-muted)]">
          <div>© 2026 Resume Roaster. All rights reserved.</div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
