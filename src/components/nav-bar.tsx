"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mainLinks = [
  { href: "/overview", label: "Oversigt", icon: "◉" },
  { href: "/spending", label: "Forbrug", icon: "○" },
  { href: "/transfers", label: "Overførsler", icon: "⇄" },
  { href: "/setup", label: "Opsætning", icon: "⚙" },
];

const allLinks = [
  { href: "/overview", label: "Oversigt", icon: "◉" },
  { href: "/spending", label: "Forbrug", icon: "○" },
  { href: "/transfers", label: "Overførsler", icon: "⇄" },
  { href: "/confirm", label: "Bekræft", icon: "▸" },
  { href: "/income", label: "Indkomst", icon: "↓" },
  { href: "/tiers", label: "Udgifter", icon: "◫" },
  { href: "/savings", label: "Opsparing", icon: "◎" },
  { href: "/investments", label: "Investering", icon: "◆" },
  { href: "/settings", label: "Indstillinger", icon: "⚙" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 border-r border-border bg-card flex-col py-6 px-3 z-50">
        <p className="text-sm font-semibold px-3 mb-6 tracking-tight">
          Salary Cascade
        </p>
        <nav className="flex flex-col gap-1">
          {allLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span className="text-xs w-4 text-center">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-md">
        <div className="flex justify-around py-2">
          {mainLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}