import * as React from "react";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PricingCalculator } from "@/components/PricingCalculator";
import type { Translation } from "@/i18n";

const ANNUAL_DISCOUNT = 0.15;

const MIN_CHILDREN = 35;
const MIN_MONTHLY = 44;

const PLAN_PRICES: Record<string, { pricePerChild: number; flatMonthly?: number }> = {
  esencial: { pricePerChild: 1.22 },
  gestionPro: { pricePerChild: 1.52 },
  completo: { pricePerChild: 2.12, flatMonthly: 10 },
};

function getFromPriceNumeric(pricePerChild: number, flatMonthly: number, minMonthly: number, minChildren: number): number {
  const raw = Math.round((pricePerChild * minChildren + flatMonthly) * 100) / 100;
  return Math.max(minMonthly, raw);
}

function formatPrice(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPricePerChild(value: number, planId: string, locale: string): string {
  const formatted = formatPrice(value, locale);
  if (planId === "completo") {
    return locale === "es" ? `${formatted}/niño + 10€/mes` : `${formatted}/child + €10/month`;
  }
  return locale === "es" ? `${formatted} por niño` : `${formatted} per child`;
}

interface PricingTabsProps {
  t: Translation;
  lang: string;
}

export function PricingTabs({ t, lang }: PricingTabsProps) {
  const [value, setValue] = React.useState("calculator");
  const [plansAnnual, setPlansAnnual] = React.useState(false);
  const demoUrl = `/${lang}/demo`;
  const calcT = t.pricing?.calculator;
  const monthlyLabel = calcT?.monthly ?? (lang === "es" ? "Mensual" : "Monthly");
  const annualLabel = calcT?.annual ?? (lang === "es" ? "Anual" : "Annual");
  const annualDiscountLabel = calcT?.annualDiscount ?? "-15%";
  const r = t.pricing?.recommended ?? {
    esencial: { name: "Esencial", description: "", pricePerChild: "", from: "", features: [] as string[] },
    gestionPro: { name: "Gestión Pro", description: "", pricePerChild: "", from: "", features: [] as string[] },
    completo: { name: "Completo", description: "", pricePerChild: "", from: "", features: [] as string[] },
    cta: "",
    orCalculate: "",
  };

  const planItems = [
    { id: "esencial" as const, isPopular: false },
    { id: "gestionPro" as const, isPopular: true },
    { id: "completo" as const, isPopular: false },
  ];

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full flex justify-center flex-col items-center gap-10">
      <TabsList className="gap-2 justify-center flex-wrap">
        <TabsTrigger value="calculator" className="text-[10px] tracking-widest uppercase">
          {t.pricing.viewCalculator}
        </TabsTrigger>
        <TabsTrigger value="plans" className="text-[10px] tracking-widest uppercase">
          {t.pricing.viewPlans}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="plans" className="w-full data-[state=inactive]:hidden sm:px-20" forceMount>
        <div className="flex flex-col items-center gap-6 mb-8 -mr-10 sm:-mr-12">
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-widest text-[10px]">{monthlyLabel}</span>
            <Switch checked={plansAnnual} onCheckedChange={setPlansAnnual} />
            <div className="flex items-center gap-1">
              <span className="uppercase tracking-widest text-[10px]">{annualLabel}</span>
              <Badge variant="secondary" className={`text-xs ${plansAnnual ? "" : "invisible"}`} aria-hidden={!plansAnnual}>
                {annualDiscountLabel}
              </Badge>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 px-0 gap-4 mx-auto">
          {planItems.map((plan) => {
            const data = r[plan.id];
            const features = data.features ?? [];
            const prices = PLAN_PRICES[plan.id];
            const fromNumeric = prices
              ? getFromPriceNumeric(
                  prices.pricePerChild,
                  prices.flatMonthly ?? 0,
                  MIN_MONTHLY,
                  MIN_CHILDREN
                )
              : null;
            const monthlyFrom = fromNumeric ?? 0;
            const annualFrom = fromNumeric != null ? Math.round(fromNumeric * (1 - ANNUAL_DISCOUNT) * 100) / 100 : 0;
            const monthlyFromStr = fromNumeric != null ? formatPrice(monthlyFrom, lang) : "";
            const annualFromStr = fromNumeric != null ? formatPrice(annualFrom, lang) : "";
            const monthlyFromLabel = fromNumeric != null ? (lang === "es" ? `Desde ${monthlyFromStr} por mes` : `From ${monthlyFromStr}/month`) : null;
            const annualFromLabel = fromNumeric != null ? (lang === "es" ? `Desde ${annualFromStr} por mes` : `From ${annualFromStr}/month`) : null;
            const singleFromLabel = fromNumeric != null ? (plansAnnual ? annualFromLabel : monthlyFromLabel) : data.from;
            const monthlyPricePerChildLabel = prices
              ? formatPricePerChild(prices.pricePerChild, plan.id, lang)
              : data.pricePerChild;
            const annualPricePerChildValue = prices
              ? Math.round(prices.pricePerChild * (1 - ANNUAL_DISCOUNT) * 100) / 100
              : 0;
            const annualPricePerChildLabel = prices
              ? formatPricePerChild(annualPricePerChildValue, plan.id, lang)
              : data.pricePerChild;
            return (
              <Card key={plan.id} className="rounded bg-card flex flex-col relative h-fit">
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 rounded-bl rounded-tr-sm text-sm font-medium">
                    {t.pricing.mostPopular}
                  </div>
                )}
                <CardHeader>
                  <Badge className="text-sm px-3 py-1">{data.name}</Badge>
                  <CardTitle className="text-xl font-bold mt-2">
                    {plansAnnual && prices ? (
                      <span>{annualPricePerChildLabel}</span>
                    ) : (
                      monthlyPricePerChildLabel
                    )}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground pb-4 text-[10px] tracking-widest uppercase">
                    {plansAnnual && monthlyFromLabel && annualFromLabel ? (
                      <>
                        <span className="line-through">{monthlyFromLabel}</span>{" "}
                        <span>{annualFromLabel}</span>
                      </>
                    ) : (
                      singleFromLabel
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {features.map((label) => (
                      <div key={label} className="flex gap-2">
                        <Check className="size-3 mt-1" />
                        <span className="text-[14px] hyphens-auto">{label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="text-center mt-6">
          <button
            type="button"
            onClick={() => setValue("calculator")}
            className="text-sm font-medium text-primary hover:underline underline-offset-4 bg-transparent p-0 border-0 cursor-pointer"
          >
            {r.orCalculate}
          </button>
        </p>
      </TabsContent>
      <TabsContent value="calculator" className="sm:px-20 data-[state=inactive]:hidden" id="calculator" forceMount>
        <PricingCalculator
          t={t.pricing.calculator}
          demoUrl={demoUrl}
          locale={lang}
        />
      </TabsContent>
    </Tabs>
  );
}
