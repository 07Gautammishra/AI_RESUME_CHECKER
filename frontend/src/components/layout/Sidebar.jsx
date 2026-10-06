import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  BarChart3,
  Layers,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AILogo from "./AILogo";

const NAV = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { to: "/resumes", icon: FileText, label: "Resumes" },
  { to: "/insights", icon: BarChart3, label: "Insights" },
  { to: "/versions", icon: Layers, label: "Versions" },
  { to: "/history", icon: History, label: "History" },
];

const ROW_BASE =
  "relative flex items-center h-11 w-11 rounded-2xl overflow-hidden " +
  "group-hover/sidebar:w-[200px] " +
  "transition-[width,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

const LABEL_BASE =
  "text-sm font-medium whitespace-nowrap pr-4 " +
  "opacity-0 -translate-x-1 " +
  "transition-[opacity,transform] duration-200 ease-out " +
  "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100";

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} title={label} className="block">
      {({ isActive }) => (
        <div
          className={cn(
            ROW_BASE,
            isActive
              ? "bg-[var(--ink)] text-[var(--bg)] shadow-card"
              : "text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
          )}
        >
          <span className="h-11 w-11 flex items-center justify-center shrink-0">
            <Icon size={18} strokeWidth={2} />
          </span>
          <span className={LABEL_BASE}>{label}</span>
        </div>
      )}
    </NavLink>
  );
}

function ActionRow({ icon: Icon, label, onClick, to }) {
  const inner = (isActive) => (
    <div
      className={cn(
        ROW_BASE,
        isActive
          ? "bg-[var(--ink)] text-[var(--bg)] shadow-card"
          : "text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
      )}
    >
      <span className="h-11 w-11 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </span>
      <span className={LABEL_BASE}>{label}</span>
    </div>
  );

  if (to) {
    return (
      <NavLink to={to} title={label} className="block">
        {({ isActive }) => inner(isActive)}
      </NavLink>
    );
  }

  return (
    <button onClick={onClick} title={label} className="block">
      {inner(false)}
    </button>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const displayName = user?.name || "Account";
  const displayEmail = user?.email || "";

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible above 850px) */}
      <aside
        className={cn(
          "group/sidebar hidden [@media(min-width:851px)]:flex shrink-0 h-[calc(100vh-32px)] sticky top-4 ml-4",
          "flex-col items-center justify-between py-5 rounded-3xl",
          "bg-[var(--surface)] border border-[var(--border)] shadow-card overflow-hidden",
          "w-[88px] hover:w-[248px]",
          "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        )}
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <div
            className={cn(
              "flex items-center h-14 w-14 group-hover/sidebar:w-[200px]",
              "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            )}
          >
            <div className="h-12 w-12 flex items-center justify-center shrink-0">
              <AILogo />
            </div>
            <span
              className={cn(
                "ml-2 font-display text-base font-semibold text-[var(--ink)] whitespace-nowrap",
                "opacity-0 -translate-x-1",
                "transition-[opacity,transform] duration-200 ease-out",
                "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100"
              )}
            >
              Roaster
            </span>
          </div>

          <nav className="flex flex-col items-center gap-1.5">
            {NAV.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <ActionRow icon={Settings} label="Settings" to="/settings" />
          <ActionRow icon={LogOut} label="Log out" onClick={logout} />

          <div
            className={cn(
              "flex items-center h-12 mt-1 w-10 group-hover/sidebar:w-[200px] overflow-hidden",
              "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            )}
          >
            <div className="h-10 w-10 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] font-semibold flex items-center justify-center text-sm ring-2 ring-[var(--surface)] shrink-0">
              {user?.name?.[0]?.toUpperCase() || "R"}
            </div>
            <div
              className={cn(
                "ml-3 min-w-0 flex-1",
                "opacity-0 -translate-x-1",
                "transition-[opacity,transform] duration-200 ease-out",
                "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100"
              )}
            >
              <div className="text-sm font-semibold text-[var(--ink)] truncate">
                {displayName}
              </div>
              {displayEmail && (
                <div className="text-[11px] text-[var(--ink-muted)] truncate">
                  {displayEmail}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE / TABLET BOTTOM BAR (Visible <= 850px) */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex [@media(min-width:851px)]:hidden items-center justify-around",
          "h-16 [@media(max-width:425px)]:h-14 px-2 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] shadow-lg"
        )}
      >
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[var(--ink)] font-semibold"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "p-1.5 [@media(max-width:425px)]:p-2 rounded-xl transition-all flex items-center justify-center",
                    isActive && "bg-[var(--ink)] text-[var(--bg)] shadow-sm"
                  )}
                >
                  <Icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className="w-[18px] h-[18px] [@media(max-width:425px)]:w-[22px] [@media(max-width:425px)]:h-[22px]"
                  />
                </div>
                <span className="mt-0.5 truncate max-w-[56px] text-center [@media(max-width:425px)]:hidden">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* Settings Route */}
        <NavLink
          to="/settings"
          title="Settings"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-[10px] font-medium transition-colors",
              isActive
                ? "text-[var(--ink)] font-semibold"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  "p-1.5 [@media(max-width:425px)]:p-2 rounded-xl transition-all flex items-center justify-center",
                  isActive && "bg-[var(--ink)] text-[var(--bg)] shadow-sm"
                )}
              >
                <Settings
                  strokeWidth={isActive ? 2.5 : 2}
                  className="w-[18px] h-[18px] [@media(max-width:425px)]:w-[22px] [@media(max-width:425px)]:h-[22px]"
                />
              </div>
              <span className="mt-0.5 truncate max-w-[56px] text-center [@media(max-width:425px)]:hidden">
                Settings
              </span>
            </>
          )}
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Log out"
          className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-[10px] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <div className="p-1.5 [@media(max-width:425px)]:p-2 rounded-xl flex items-center justify-center">
            <LogOut className="w-[18px] h-[18px] [@media(max-width:425px)]:w-[22px] [@media(max-width:425px)]:h-[22px]" />
          </div>
          <span className="mt-0.5 truncate max-w-[56px] text-center [@media(max-width:425px)]:hidden">
            Log out
          </span>
        </button>
      </nav>
    </>
  );
}
