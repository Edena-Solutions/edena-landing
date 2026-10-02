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
                buttonVariants({ variant: "default" }),
                // z-40 keeps it under the header (and its mobile menu) and the cookie banner.
                "group fixed z-40 h-11 gap-0 font-medium",
                "bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))]",
                "bg-primary hover:bg-primary/90 shadow-[0_14px_48px_rgba(0,0,0,0.14)] dark:shadow-[0_14px_48px_rgba(0,0,0,0.55)]",
                className,
            )}
        >
            <WhatsAppLogo className="size-5 text-[#25D366]" />
            {/* Always shown on mobile. From lg the copy collapses to an icon-only square and slides
                out on hover/focus; animating the grid track from 0fr to 1fr follows the text's
                real width, which a max-width transition cannot. */}
            <span
                className={cn(
                    "grid transition-[grid-template-columns,opacity] duration-300 ease-out motion-reduce:transition-none",
                    "lg:grid-cols-[0fr] lg:opacity-0",
                    "lg:group-hover:grid-cols-[1fr] lg:group-hover:opacity-100",
                    "lg:group-focus-visible:grid-cols-[1fr] lg:group-focus-visible:opacity-100",
                )}
            >
                <span className="overflow-hidden whitespace-nowrap">
                    <span className="pl-2 pr-1">{labels.cta}</span>
                </span>
            </span>
        </a>
    );
}
