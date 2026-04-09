import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { Translation } from "@/i18n";

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
}

export default function FAQAccordion({ faqs, t }: FAQAccordionProps) {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => {
                    return (
                        <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium cursor-pointer">
                                {getFaqString(t.faqs, faq.question)}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div
                                    className="prose prose-sm mt-2"
                                    dangerouslySetInnerHTML={{
                                        __html: getFaqString(t.faqs, faq.answer),
                                    }}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
