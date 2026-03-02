"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/overview", label: "Oversigt" },
    { href: "/tiers", label: "Udgifter" },
    { href: "/savings", label: "Opsparing" },
    { href: "/investments", label: "Investering" },
    { href: "/confirm", label: "Bekræft" },
    { href: "/transfers", label: "Overførsler" },
    { href: "/spending", label: "Forbrug" },
    { href: "/settings", label: "Indstillinger" },
];

export function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center gap-1 overflow-x-auto py-3">
                    {links.map((link) => {
                        const isActive =
                            pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${isActive
                                        ? "bg-foreground text-background font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}