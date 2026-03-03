import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
    TrendingUp,
    Layers,
    Target,
    LineChart,
    CircleCheck,
    Settings,
} from "lucide-react";

const setupLinks = [
    { href: "/income", label: "Indkomst", description: "Dine indkomstkilder", icon: TrendingUp },
    { href: "/tiers", label: "Udgifter", description: "Tiers og faste udgifter", icon: Layers },
    { href: "/savings", label: "Opsparing", description: "Opsparingsmål og fremgang", icon: Target },
    { href: "/investments", label: "Investering", description: "Investeringsallokeringer", icon: LineChart },
    { href: "/confirm", label: "Bekræft indkomst", description: "Kør kaskaden for denne måned", icon: CircleCheck },
    { href: "/settings", label: "Indstillinger", description: "Tema og backup", icon: Settings },
];

export default function SetupPage() {
    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Opsætning</h1>
            <p className="text-muted-foreground text-sm mb-8">
                Administrer din kaskade.
            </p>

            <div className="space-y-2">
                {setupLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href}>
                            <Card className="hover:bg-accent/50 transition-colors mb-2">
                                <CardContent className="flex items-center space-x-4">
                                    <Icon size={20} className="text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">{link.label}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {link.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}