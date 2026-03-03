"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Settings,
  CircleCheck,
  TrendingUp,
  Layers,
  Target,
  LineChart,
} from "lucide-react";

const mainLinks = [
  { href: "/overview", label: "Oversigt", icon: LayoutDashboard },
  { href: "/spending", label: "Forbrug", icon: Wallet },
  { href: "/transfers", label: "Overførsler", icon: ArrowLeftRight },
  { href: "/setup", label: "Opsætning", icon: Settings },
];

const allLinks = [
  { href: "/overview", label: "Oversigt", icon: LayoutDashboard },
  { href: "/spending", label: "Forbrug", icon: Wallet },
  { href: "/transfers", label: "Overførsler", icon: ArrowLeftRight },
  { href: "/confirm", label: "Bekræft", icon: CircleCheck },
  { href: "/income", label: "Indkomst", icon: TrendingUp },
  { href: "/tiers", label: "Udgifter", icon: Layers },
  { href: "/savings", label: "Opsparing", icon: Target },
  { href: "/investments", label: "Investering", icon: LineChart },
  { href: "/settings", label: "Indstillinger", icon: Settings },
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
            const Icon = link.icon;
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
                <Icon size={16} />
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
            const Icon = link.icon;
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
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}