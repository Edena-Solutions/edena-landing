import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { Translation } from "@/i18n";

type FAQKey = keyof Translation["faqs"];

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
        <div className="w-full max-w-3xl mx-auto py-8">
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => {
                    return (
                        <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium cursor-pointer">
                                {t.faqs[faq.question as FAQKey]}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div
                                    className="prose prose-sm mt-2"
                                    dangerouslySetInnerHTML={{
                                        __html: t.faqs[faq.answer as FAQKey],
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
