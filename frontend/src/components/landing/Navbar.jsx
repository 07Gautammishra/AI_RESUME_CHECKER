import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import AILogo from "@/components/layout/AILogo";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Dashboard", href: "#dashboard-preview" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 925) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-3 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none"
    >
      <div
        className={cn(
          "max-w-[1240px] mx-auto rounded-2xl [@media(min-width:926px)]:rounded-full border transition-all duration-300 pointer-events-auto",
          scrolled
            ? "bg-[var(--surface)]/85 border-[var(--border)] backdrop-blur-xl shadow-card"
            : "bg-[var(--surface)]/95 border-transparent backdrop-blur-md"
        )}
      >
        <div className="flex items-center justify-between gap-3 px-3.5 sm:px-5 py-2.5">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center shrink-0">
              <AILogo />
            </div>
            <span className="font-display text-sm sm:text-[15px] font-semibold tracking-tight text-[var(--ink)] hidden min-[380px]:inline">
              Resume Roaster
            </span>
          </Link>

          {/* Center: Navigation Links (Visible > 925px) */}
          <nav className="hidden [@media(min-width:926px)]:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggle}
              className="h-9 w-9 rounded-full flex items-center justify-center text-[var(--ink)] hover:bg-[var(--surface-2)] border border-[var(--border)] transition-colors shrink-0"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <motion.div
                key={theme}
                initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {theme === "light" ? (
                  <Moon size={16} className="text-[var(--ink)]" />
                ) : (
                  <Sun size={16} className="text-[var(--ink)]" />
                )}
              </motion.div>
            </motion.button>

            {/* Sign In Link */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-full text-[13px] font-medium text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
            >
              Sign in
            </Link>

            {/* Get Started Button */}
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-1.5 h-9 px-3.5 sm:px-4 rounded-full bg-[var(--ink)] text-[var(--bg)] text-xs sm:text-[13px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
            >
              <span>Get started</span>
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform shrink-0"
              />
            </Link>

            {/* Mobile Drawer Trigger (Visible <= 925px) */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="[@media(min-width:926px)]:hidden h-9 w-9 rounded-full flex items-center justify-center text-[var(--ink)] hover:bg-[var(--surface-2)] shrink-0 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Visible <= 925px) */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="[@media(min-width:926px)]:hidden border-t border-[var(--border)] px-4 py-3 space-y-1 overflow-hidden"
            >
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  {l.label}
                </a>
              ))}

              <div className="pt-2 mt-2 border-t border-[var(--border)]/60 sm:hidden">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
