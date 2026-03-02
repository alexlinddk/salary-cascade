import { ExportButton } from "../../components/export-button";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Indstillinger
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Backup og gendannelse af dine data.
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-medium mb-1">Eksporter data</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Download alle dine data som en JSON-fil. Gem den et sikkert sted.
          </p>
          <ExportButton />
        </div>
      </div>
    </div>
  );
}