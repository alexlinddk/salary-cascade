import { ExportButton } from "../../components/export-button";
import { ThemeToggle } from "../../components/theme-toggle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Indstillinger
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Backup, tema og andre indstillinger.
      </p>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>
              Vælg mellem lys, mørk eller følg dit system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eksporter data</CardTitle>
            <CardDescription>
              Download alle dine data som en JSON-fil. Gem den et sikkert sted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExportButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}