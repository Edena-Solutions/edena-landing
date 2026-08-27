import appleSmall from "@/assets/img/logos/apple-small.png";
import googleSmall from "@/assets/img/logos/google-small.png";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/constants/app-stores";
import { translations } from "@/i18n/index.ts";
import { cn } from "@/lib/utils";

const iconClass = "size-10 object-cover overflow-hidden";

interface Props {
    lang: string;
    className?: string;
}

export default function DownloadAppIcons({ lang, className }: Props) {
    const t = translations[lang as keyof typeof translations];

    return (
        <div className={cn(className)}>
            <p className="uppercase tracking-widest text-[10px] mb-4 text-muted-foreground">
                {t.downloadTheApp}
            </p>
            <div className="flex items-center gap-10">
                <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                >
                    <img src={appleSmall.src} alt={t.altText.appStoreBadge} className={iconClass} />
                </a>
                <a
                    href={GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                >
                    <img
                        src={googleSmall.src}
                        alt={t.altText.googlePlayBadge}
                        className={iconClass}
                    />
                </a>
            </div>
        </div>
    );
}
