import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Artboard } from "./scene-kit";

/*
 * The pane every product animation on the home page plays on: frosted glass (`.ds-glass`) over a few
 * still lights in the brand's greens, and nothing else — no window, no sidebar, just the animation.
 * The key features keep the pane on screen while their scenes change inside it; the hero draws the
 * same pane.
 *
 * Drawn on a 33 × 23.6 em board. Scenes are written in the content box's own coordinates
 * (`CONTENT.w` × `CONTENT.h`), inside `<SceneContent>`.
 */

export const STAGE = { cols: 33, rows: 23.6 };
export const GLASS = { x: 0.5, y: 0.5, w: 32, h: 22.6 };
export const CONTENT = { x: 1.4, y: 1.5, w: 30.2, h: 20.6 };

export interface Orb {
    x: number;
    y: number;
    size: number;
    color: string;
}

/** Lights behind the pane, in board em: the brand's lime, green and teal. */
const ORBS: Orb[] = [
    { x: -3, y: -3, size: 13, color: "#a3e635" },
    { x: 21, y: 11, size: 15, color: "#14b8a6" },
    { x: 6, y: 13, size: 11, color: "#22c55e" },
];

/**
 * The board a glass scene sits on. On a phone it keeps 26rem and the stage crops its sides, so the
 * animation stays legible rather than shrinking whole.
 *
 * `crop`: the pane stands larger than the stage lets it, centred under the controls, and the stage's
 * foot cuts it — the way a product rises from the bottom of a card. Only the foot: on a phone too
 * the pane fits the stage's width. The stage's height says how much is cut (`CROP_STAGE` keeps it
 * at about an eighth of the pane).
 */
export function SceneBoard({ children, crop = false }: { children: ReactNode; crop?: boolean }) {
    if (!crop) {
        return (
            <Artboard cols={STAGE.cols} rows={STAGE.rows} focus={0.5} minRem={26}>
                {children}
            </Artboard>
        );
    }
    return (
        <div className="absolute inset-0 [container-type:inline-size]">
            <div
                className="absolute left-1/2 top-12 w-[calc(100cqw-1.5rem)] -translate-x-1/2 [container-type:inline-size] sm:top-[max(6.4cqw,3rem)] sm:w-[92cqw]"
            >
                <div
                    aria-hidden
                    className="relative select-none text-ink"
                    style={{ fontSize: `calc(100cqw / ${STAGE.cols})`, aspectRatio: `${STAGE.cols} / ${STAGE.rows}` }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * The stage for `<SceneBoard crop>`, so that its foot falls about seven eighths down the pane. Its
 * height follows its width, as the board's does: on a phone the stage is the viewport less its
 * 1rem gutters, and the board 0.75rem inside that.
 */
export const CROP_STAGE = "h-[calc(3rem+0.6*(100vw-3.5rem))] self-start sm:h-auto sm:aspect-[1.58] lg:h-auto";

export function GlassOrbs({ orbs = ORBS, className }: { orbs?: Orb[]; className?: string }) {
    return (
        <div className={cn("ds-glass-orbs", className)} aria-hidden>
            {orbs.map((orb, index) => (
                <span
                    key={orb.color}
                    style={
                        {
                            left: `${orb.x}em`,
                            top: `${orb.y}em`,
                            width: `${orb.size}em`,
                            height: `${orb.size}em`,
                            background: orb.color,
                            "--orb": index,
                        } as CSSProperties
                    }
                />
            ))}
        </div>
    );
}

/** The pane itself, with its lights behind it (`orbs={false}` when a shared set already lights it). */
export function GlassPane({ className, orbs }: { className?: string; orbs?: Orb[] | false }) {
    return (
        <>
            {orbs !== false && <GlassOrbs orbs={orbs} />}
            <div
                className={cn("ds-glass absolute", className)}
                style={{ left: `${GLASS.x}em`, top: `${GLASS.y}em`, width: `${GLASS.w}em`, height: `${GLASS.h}em` }}
            />
        </>
    );
}

/** The content box on the pane: a scene's elements are placed inside it, clipped to it. */
export function SceneContent({ children }: { children: ReactNode }) {
    return (
        <div
            className="absolute overflow-hidden"
            style={{ left: `${CONTENT.x}em`, top: `${CONTENT.y}em`, width: `${CONTENT.w}em`, height: `${CONTENT.h}em` }}
        >
            {children}
        </div>
    );
}
