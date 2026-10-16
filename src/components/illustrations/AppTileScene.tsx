import { Bell, ImageIcon, MessageCircle, type LucideIcon } from "lucide-react";

import { PhoneFrame, PhoneHome } from "@/components/wizard/app-frame";
import { GlassOrbs } from "@/components/wizard/glass-stage";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";

/*
 * The families' app rising from the foot of its tile, open on its home as the app opens (the
 * coloured tiles by section, from `screenshots/app/app_hero.png`), with the three things the tile
 * promises arriving as notifications: secure photos, alerts on the phone, messages.
 *
 * Rendered once on the server; the phone is taller than the artboard so the tile cuts it at the foot.
 */

interface Props {
    ui: Translation["homeScenes"];
    notifications: { securePhotos: string; pushAlerts: string; communication: string };
}

export default function AppTileScene({ ui, notifications }: Props) {
    const banners: { icon: LucideIcon; tone: string; label: string; x: number; y: number; delay: string }[] = [
        { icon: ImageIcon, tone: "bg-sys-pink", label: notifications.securePhotos, x: 0.4, y: 3.8, delay: "0s" },
        { icon: Bell, tone: "bg-sys-orange", label: notifications.pushAlerts, x: 15.2, y: 8.4, delay: "-3s" },
        { icon: MessageCircle, tone: "bg-sys-blue", label: notifications.communication, x: 1.2, y: 12.6, delay: "-6s" },
    ];

    return (
        <>
            {/* The lights the glass phone refracts. */}
            <GlassOrbs
                orbs={[
                    { x: 6, y: 3, size: 11, color: "#a3e635" },
                    { x: 14, y: 9, size: 12, color: "#14b8a6" },
                    { x: 8.5, y: 13, size: 9, color: "#22c55e" },
                ]}
            />
            <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: "1.6em", width: "14em", height: "29em", fontSize: "1em" }}
            >
                <div className="absolute inset-0" style={{ fontSize: "1.28em" }}>
                    <PhoneFrame x={0} y={0} w={11} h={22.5}>
                        <PhoneHome welcome={ui.welcomeBack} sections={ui.appSections} tiles={ui.appTiles} screenWidth={11} />
                    </PhoneFrame>
                </div>
            </div>
            {banners.map((banner, index) => {
                const Icon = banner.icon;
                return (
                    <div key={banner.label} className="absolute" style={{ left: `${banner.x}em`, top: `${banner.y}em`, width: "12em" }}>
                        <div data-reveal="scale" style={{ ["--reveal-i" as string]: index + 1 }}>
                            <div
                                className="flex animate-ds-float items-center gap-[0.6em] rounded-[1.1em] p-[0.6em] material-thick elev-3 ring-1 ring-hairline"
                                style={{ animationDelay: banner.delay }}
                            >
                                <span className={cn("ds-app-icon size-[2em]", banner.tone)}>
                                    <Icon className="size-[1em]" />
                                </span>
                                <span className="flex min-w-0 flex-col gap-[0.35em]">
                                    <span className="truncate font-semibold leading-none" style={{ fontSize: "0.66em" }}>
                                        {banner.label}
                                    </span>
                                    <span className="ds-bar w-[6em] opacity-70" />
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
