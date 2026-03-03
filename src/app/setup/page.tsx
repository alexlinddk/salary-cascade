import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const setupLinks = [
    { href: "/income", label: "Indkomst", description: "Dine indkomstkilder", icon: "↓" },
    { href: "/tiers", label: "Udgifter", description: "Tiers og faste udgifter", icon: "◫" },
    { href: "/savings", label: "Opsparing", description: "Opsparingsmål og fremgang", icon: "◎" },
    { href: "/investments", label: "Investering", description: "Investeringsallokeringer", icon: "◆" },
    { href: "/confirm", label: "Bekræft indkomst", description: "Kør kaskaden for denne måned", icon: "▸" },
    { href: "/settings", label: "Indstillinger", description: "Tema og backup", icon: "⚙" },
];

export default function SetupPage() {
    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Opsætning</h1>
            <p className="text-muted-foreground text-sm mb-8">
                Administrer din kaskade.
            </p>

            <div>
                {setupLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Card className="hover:bg-accent/50 transition-colors mb-2">
                            <CardContent className="flex items-center space-x-3">
                                <span className="text-lg w-6 text-center">{link.icon}</span>
                                <div>
                                    <p className="font-medium text-sm">{link.label}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {link.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}