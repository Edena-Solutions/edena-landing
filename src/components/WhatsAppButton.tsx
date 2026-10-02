import { buttonVariants } from "@/components/ui/button";
import { WhatsAppLogo } from "@/components/WhatsAppLogo";
import { WHATSAPP_CHAT } from "@/constants/contact";
import { cn } from "@/lib/utils";

/** Floating "Let's talk" link to WhatsApp. Plain anchor, so it renders without hydration. */
export function WhatsAppButton({
    labels,
    className,
}: {
    labels: { cta: string; label: string };
    className?: string;
}) {
    return (
        <a
            href={WHATSAPP_CHAT.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.label}
            className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                // z-40 keeps it under the header (and its mobile menu) and the cookie banner.
                "fixed z-40 h-11 font-medium",
                "bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))]",
                "bg-card hover:bg-accent shadow-[0_14px_48px_rgba(0,0,0,0.14)] dark:shadow-[0_14px_48px_rgba(0,0,0,0.55)]",
                className,
            )}
        >
            <WhatsAppLogo className="size-5 text-[#25D366]" />
            {labels.cta}
        </a>
    );
}
