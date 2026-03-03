import { ExportButton } from "../../components/export-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Indstillinger
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Backup og gendannelse af dine data.
      </p>

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
  );
}