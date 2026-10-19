import appleSmall from "@/assets/img/logos/apple-small.png";
import googleSmall from "@/assets/img/logos/google-small.png";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/constants/app-stores";
import type { AppStoreLabels } from "@/i18n/nav-copy";
import { cn } from "@/lib/utils";

const iconClass = "size-10 object-cover overflow-hidden";

interface Props {
    /** The buttons' words in the page's language (see `appStoreLabels`). */
    labels: AppStoreLabels;
    className?: string;
    quiet?: boolean;
}

export default function DownloadAppIcons({ labels, className, quiet }: Props) {

    return (
        <div className={cn(className)}>
            <p
                className={
                    quiet
                        ? "type-caption mb-3 text-ink-3"
                        : "uppercase tracking-widest text-[10px] mb-4 text-muted-foreground"
                }
            >
                {labels.downloadTheApp}
            </p>
            <div className="flex items-center gap-10">
                <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                >
                    <img src={appleSmall.src} alt={labels.appStoreBadge} className={iconClass} />
                </a>
                <a
                    href={GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                >
                    <img
                        src={googleSmall.src}
                        alt={labels.googlePlayBadge}
                        className={iconClass}
                    />
                </a>
            </div>
        </div>
    );
}
