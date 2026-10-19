import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";

type FAQRecord = Translation["faqs"];
type FAQStringValue = string;

function getFaqString(faqs: FAQRecord, key: string): FAQStringValue {
    const value = faqs[key as keyof FAQRecord];
    return typeof value === "string" ? value : key;
}

export interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    faqs: FAQItem[];
    t: Translation;
    className?: string;
    /** Raised panel rows (avern-landing `Faqs` / PanelRow pattern). */
    premium?: boolean;
}

function FaqList({ faqs, t, premium }: { faqs: FAQItem[]; t: Translation; premium: boolean }) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem
                    key={`item-${index}`}
                    value={`item-${index}`}
                    className={premium ? "border-0" : undefined}
                >
                    <AccordionTrigger
                        className={cn(
                            "cursor-pointer text-left hover:no-underline",
                            premium ? "hover:text-ink" : "hover:text-primary",
                        )}
                    >
                        <span className="text-pretty">{getFaqString(t.faqs, faq.question)}</span>
                    </AccordionTrigger>
                    <AccordionContent className={premium ? "pb-0" : undefined}>
                        <div
                            className={cn(premium ? "ds-faq-answer" : "prose prose-sm mt-2")}
                            dangerouslySetInnerHTML={{
                                __html: getFaqString(t.faqs, faq.answer),
                            }}
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export default function FAQAccordion({ faqs, t, className, premium }: FAQAccordionProps) {
    const panel = premium ?? Boolean(className?.includes("ds-faq"));

    if (panel) {
        return (
            <div className="mx-auto w-full max-w-3xl">
                <div className={cn("ds-faq ds-faq-panel w-full min-w-0", className)}>
                    <FaqList faqs={faqs} t={t} premium />
                </div>
            </div>
        );
    }

    return (
        <div className={cn("mx-auto w-full max-w-3xl", className)}>
            <FaqList faqs={faqs} t={t} premium={false} />
        </div>
    );
}
