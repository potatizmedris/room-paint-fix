import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ArrowLeft, Receipt } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { QuoteOutput } from "@/lib/calculateQuote";

interface QuoteResultProps {
  quote: QuoteOutput;
  onBack: () => void;
  onComplete: () => void;
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${bold ? "font-semibold" : ""} ${highlight ? "text-primary" : ""}`}>
      <span className="text-sm">{label}</span>
      <span className="text-sm tabular-nums">{value}</span>
    </div>
  );
}

const fmt = (n: number) => n.toLocaleString("sv-SE") + " kr";
const fmtM2 = (n: number) => n.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " kr/m²";

export function QuoteResult({ quote, onBack, onComplete }: QuoteResultProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto animate-fade-in space-y-6">
          {/* Success header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
              <Receipt className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {t("quote.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("quote.subtitle")}
            </p>
          </div>

          {/* Price breakdown */}
          <Card>
            <CardContent className="pt-6 space-y-1">
              <Row label={t("quote.totalArea")} value={`${quote.totalAreaM2} m²`} />
              <Row label={t("quote.coats")} value={`${quote.coatsNumeric}`} />
              <Separator className="my-2" />
              <Row label={t("quote.laborBeforeROT")} value={fmt(quote.laborBeforeROT)} />
              {quote.rotDeduction > 0 && (
                <Row label={t("quote.rotDeduction")} value={`−${fmt(quote.rotDeduction)}`} highlight />
              )}
              <Row label={t("quote.laborAfterROT")} value={fmt(quote.laborAfterROT)} bold />
              <Separator className="my-2" />
              <Row label={t("quote.materialCost")} value={fmt(quote.materialCost)} />
              <Row label={t("quote.travelCost")} value={fmt(quote.travelCost)} />
              <Separator className="my-2" />
              <Row label={t("quote.totalBeforeROT")} value={fmt(quote.totalBeforeROT)} />
              <Row label={t("quote.totalAfterROT")} value={fmt(quote.totalAfterROT)} bold highlight />
              <Separator className="my-2" />
              <Row label={t("quote.pricePerM2Before")} value={fmtM2(quote.pricePerM2BeforeROT)} />
              <Row label={t("quote.pricePerM2After")} value={fmtM2(quote.pricePerM2AfterROT)} bold />
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">{t("quote.disclaimer")}</p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1 gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("quote.editInputs")}
            </Button>
            <Button onClick={onComplete} className="flex-1 gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {t("quote.done")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
