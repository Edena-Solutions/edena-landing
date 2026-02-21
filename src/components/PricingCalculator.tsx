import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const BASE_PRICE_PER_CHILD = 1.215;
const MIN_MONTHLY = 44;
const ANNUAL_DISCOUNT = 0.15;
const MIN_CHILDREN = 35;
const VOLUME_THRESHOLD = 200;
const PACK_PER_CHILD = 2.115;
const ONLINE_STORE_FLAT_MONTHLY = 10;

const MODULES = [
  { key: "billing" as const, pricePerChild: 0.2, icon: "Receipt" },
  { key: "extracurricular" as const, pricePerChild: 0.1, icon: "Palette" },
  { key: "communicationPro" as const, pricePerChild: 0.1, icon: "MessageCircle" },
  { key: "automation" as const, pricePerChild: 0.25, icon: "Zap" },
  { key: "onlineStore" as const, pricePerChild: 0, icon: "ShoppingBag", flatMonthly: 10 as const },
  { key: "cloud" as const, pricePerChild: 0.25, icon: "Cloud" },
] as const;

export type CalculatorTranslations = {
  title: string;
  subtitle: string;
  childrenLabel: string;
  childrenHint: string;
  billingToggle: string;
  billingDescription: string;
  billingHint: string;
  extracurricularToggle: string;
  extracurricularDescription: string;
  extracurricularHint: string;
  communicationProToggle: string;
  communicationProDescription: string;
  communicationProHint: string;
  automationToggle: string;
  automationDescription: string;
  automationHint: string;
  onlineStoreToggle: string;
  onlineStoreDescription: string;
  onlineStoreHint: string;
  cloudToggle: string;
  cloudDescription: string;
  cloudHint: string;
  packCompleteMessage: string;
  packCompleteDescription: string;
  monthly: string;
  annual: string;
  annualDiscount: string;
  annualSavings: string;
  totalMonthly: string;
  perChild: string;
  totalAnnual: string;
  volumeBadge: string;
  cta: string;
};

interface PricingCalculatorProps {
  t: CalculatorTranslations;
  demoUrl: string;
  locale?: string;
  className?: string;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatPrice(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(round2(value));
}

const MODULE_LABELS: Record<string, { titleKey: keyof CalculatorTranslations; descriptionKey: keyof CalculatorTranslations; hintKey: keyof CalculatorTranslations; extraKey?: keyof CalculatorTranslations }> = {
  billing: { titleKey: "billingToggle", descriptionKey: "billingDescription", hintKey: "billingHint" },
  extracurricular: { titleKey: "extracurricularToggle", descriptionKey: "extracurricularDescription", hintKey: "extracurricularHint" },
  communicationPro: { titleKey: "communicationProToggle", descriptionKey: "communicationProDescription", hintKey: "communicationProHint" },
  automation: { titleKey: "automationToggle", descriptionKey: "automationDescription", hintKey: "automationHint" },
  onlineStore: { titleKey: "onlineStoreToggle", descriptionKey: "onlineStoreDescription", hintKey: "onlineStoreHint" },
  cloud: { titleKey: "cloudToggle", descriptionKey: "cloudDescription", hintKey: "cloudHint" },
};

export function PricingCalculator({ t, demoUrl, locale = "es", className }: PricingCalculatorProps) {
  const [children, setChildren] = React.useState(MIN_CHILDREN);
  const [modules, setModules] = React.useState<Record<string, boolean>>({
    billing: false,
    extracurricular: false,
    communicationPro: false,
    automation: false,
    onlineStore: false,
    cloud: false,
  });
  const [isAnnual, setIsAnnual] = React.useState(false);

  const effectiveChildren = Math.max(MIN_CHILDREN, Math.round(Number(children)) || MIN_CHILDREN);
  const allModulesSelected = MODULES.every((m) => modules[m.key]);

  const pricePerChild = React.useMemo(() => {
    if (allModulesSelected) return round2(PACK_PER_CHILD);
    let total = BASE_PRICE_PER_CHILD;
    MODULES.forEach((m) => {
      if (modules[m.key]) total += m.pricePerChild;
    });
    return round2(total);
  }, [modules, allModulesSelected]);

  const onlineStoreFlat = modules.onlineStore ? ONLINE_STORE_FLAT_MONTHLY : 0;
  const rawMonthly = round2(pricePerChild * effectiveChildren + onlineStoreFlat);
  const monthlyTotal = round2(Math.max(MIN_MONTHLY, rawMonthly));
  const discountMultiplier = isAnnual ? 1 - ANNUAL_DISCOUNT : 1;
  const displayMonthly = round2(monthlyTotal * discountMultiplier);
  const annualTotal = round2(displayMonthly * 12);
  const annualSavings = isAnnual ? round2(monthlyTotal * ANNUAL_DISCOUNT * 12) : 0;
  const showVolumeBadge = effectiveChildren > VOLUME_THRESHOLD;

  const setModuleChecked = (key: string, checked: boolean) => {
    setModules((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[1fr_380px]", className)}>
      <div className="order-2 lg:order-1 space-y-6">
        <Card className="rounded">
          <CardHeader className="pb-4">
            <CardTitle className="text-xs uppercase tracking-widest">{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {MODULES.map((module) => {
                const labels = MODULE_LABELS[module.key];
                const title = t[labels.titleKey];
                const description = t[labels.descriptionKey];
                const hint = t[labels.hintKey];
                const extra = labels.extraKey ? t[labels.extraKey] : null;
                const checked = modules[module.key];
                return (
                  <div
                    key={module.key}
                    className={`group cursor-pointer relative w-full overflow-hidden rounded-[0.3em] bg-background p-[2px] transition-all duration-300 ease-in-out hover-gradient-primary hover:bg-gradient-to-r`}
                    onClick={() => setModuleChecked(module.key, !checked)}
                >
                  <div className="group-hover:animate-spin-slow invisible absolute -top-40 -bottom-40 left-10 right-10 bg-gradient-to-r from-transparent via-white/90 to-transparent group-hover:visible" />
                  <Card
                    key={module.key}
                    role="button"
                    tabIndex={0}
                    className="relative rounded flex flex-col p-6 bg-background justify-between h-full"
                    
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setModuleChecked(module.key, !checked);
                      }
                    }}
                    >
                    <div>
                      <CardHeader className="p-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div className="flex text-primary w-fit p-4 rounded bg-card">
                            <Icon name={module.icon} size={20} />
                          </div>
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => setModuleChecked(module.key, value === true)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            aria-label={title}
                          />
                        </div>
                        <h3 className="uppercase tracking-widest text-[10px] font-semibold">{title}</h3>
                      </CardHeader>
                      <CardContent className="px-0">
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                      </CardContent>
                    </div>
                    <CardFooter className="p-0 flex flex-col gap-1 items-start">
                      {extra && (
                        <p className="text-xs text-muted-foreground">{extra}</p>
                      )}
                      <p className="text-sm text-muted-foreground font-medium">{hint}</p>
                    </CardFooter>
                  </Card>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start flex flex-col gap-4">
        <Card className="rounded">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-xs uppercase tracking-widest mb-0">{t.totalMonthly}</CardTitle>
            <CardDescription className="sr-only">
              {t.perChild}, {t.totalAnnual}
            </CardDescription>
            <div className="flex items-center gap-2">
                <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
                <span className="uppercase tracking-widest text-[10px]">{t.annual}</span>
                <Badge variant="secondary" className="text-xs">
                  {t.annualDiscount}
                </Badge>
              </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="children" className="text-[10px] uppercase tracking-widest leading-none">
                {t.childrenLabel}
              </label>
              <Input
                id="children"
                type="number"
                min={MIN_CHILDREN}
                value={children}
                onChange={(e) => setChildren(Number(e.target.value) || MIN_CHILDREN)}
              />
              <p className="text-xs text-muted-foreground">{t.childrenHint}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-bold tabular-nums transition-all duration-300 ease-out"
                data-value={displayMonthly}
              >
                {formatPrice(displayMonthly, locale)}
              </span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <p className="text-[10px] tracking-widest uppercase">
              {t.perChild}:{" "}
              {isAnnual ? (
                <>
                  <span className="line-through">{formatPrice(pricePerChild, locale)}</span>{" "}
                  {formatPrice(round2(pricePerChild * (1 - ANNUAL_DISCOUNT)), locale)}
                </>
              ) : (
                formatPrice(pricePerChild, locale)
              )}
            </p>
            {isAnnual && (
              <div className="space-y-1 pt-4">
                <p className="text-[10px] uppercase tracking-widest">
                  {t.totalAnnual}: {formatPrice(annualTotal, locale)}
                </p>
                <p className="text-[10px] uppercase tracking-widest">
                  {t.annualSavings}: {formatPrice(annualSavings, locale)}
                </p>
              </div>
            )}
            {showVolumeBadge && (
              <Badge variant="secondary" className="w-full justify-center py-1.5">
                {t.volumeBadge}
              </Badge>
            )}
            <Button asChild className="w-full" size="lg">
              <a href={demoUrl}>{t.cta}</a>
            </Button>
          </CardContent>
        </Card>
        {allModulesSelected && (
          <div
            className="rounded-lg bg-gradient-primary p-4 text-sm text-primary animate-in fade-in slide-in-from-top-2 duration-300"
            role="status"
          >
            <p className="font-medium">{t.packCompleteMessage}</p>
            <p className="mt-1">{t.packCompleteDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
