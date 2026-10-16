import {
    CalendarDays,
    ChevronDown,
    Globe,
    GripVertical,
    Hash,
    Lock,
    Mail,
    Phone,
    Plus,
    RefreshCw,
    Share2,
    Trash2,
    TrendingUp,
    Type,
    UserPlus,
    type LucideIcon,
} from "lucide-react";

import { CONTENT, GlassOrbs } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Chip, Line, Pop, countIn, easeInOut, easeOut, on, shortDate, span, typed } from "@/components/wizard/scene-kit";
import { Badge, DrawnCheck, KEY_FEATURE_SCENES, Ripple, Title } from "@/modules/home/KeyFeaturesScenes";
import { cn } from "@/lib/utils";
import type { ProductSceneLabels } from "./labels";

/*
 * The CRM page's scenes, drawn from `screenshots/crm/*` in the home's abstract style:
 *
 *   pipeline   (hero) the enquiries as a board by stage: one arrives, two move on, one is won
 *   requests   the list of enquiries: responsibles assigned, a stage moves on, a new one lands
 *   enquiry    a family fills in the school's public form on its phone; it lands as an enquiry
 *   editor     the form's editor: an option written, the field made required, the form saved
 *   stages     an enquiry's record, its pipeline filling to "won" (the home's CRM scene)
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: ProductSceneLabels;
    locale: string;
}

const W = CONTENT.w;
const SECTION = "block truncate text-[0.42em] font-semibold uppercase tracking-[0.12em] text-ink-2";

/** The six stages' tags, Nuevo to Ganado, as the CRM colours them. */
const STAGE_TONE = [
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
];

/** A stage's tag that changes in place: the old one leaves upward, the new one rises in. */
function StageTag({ stages, stage }: { stages: string[]; stage: number }) {
    return (
        <span className="relative inline-grid">
            {stages.map((name, index) => (
                <span
                    key={name}
                    className={cn(
                        "[grid-area:1/1] transition-[opacity,translate,filter] duration-500 ease-spring",
                        index === stage ? "translate-y-0 opacity-100 blur-0" : index < stage ? "-translate-y-[0.5em] opacity-0 blur-[3px]" : "translate-y-[0.5em] opacity-0 blur-[3px]",
                    )}
                >
                    <Badge className={STAGE_TONE[index]}>{name}</Badge>
                </span>
            ))}
        </span>
    );
}

interface Lead {
    name: string;
    initials: string;
    hue: number;
    origin: LucideIcon;
}

const LEADS: Record<string, Lead> = {
    marc: { name: "Marc Puig", initials: "MP", hue: 265, origin: Globe },
    eva: { name: "Eva Garrido", initials: "EG", hue: 330, origin: Globe },
    raquel: { name: "Raquel Santos", initials: "RS", hue: 175, origin: Phone },
    felipe: { name: "Felipe Ortiz", initials: "FO", hue: 30, origin: Mail },
    sara: { name: "Sara Peña", initials: "SP", hue: 300, origin: Share2 },
    rocio: { name: "Rocío Cano", initials: "RC", hue: 190, origin: Phone },
    natalia: { name: "Natalia Reyes", initials: "NR", hue: 345, origin: Share2 },
    jorge: { name: "Jorge Campos", initials: "JC", hue: 45, origin: CalendarDays },
    tomas: { name: "Tomás Cruz", initials: "TC", hue: 140, origin: CalendarDays },
    monica: { name: "Mónica Vidal", initials: "MV", hue: 220, origin: Mail },
    alvaro: { name: "Álvaro Rubio", initials: "ÁR", hue: 205, origin: Globe },
    hector: { name: "Héctor Aguilar", initials: "HA", hue: 10, origin: Globe },
    lucia: { name: "Lucía García", initials: "LG", hue: 25, origin: UserPlus },
    pablo: { name: "Pablo Serra", initials: "PS", hue: 160, origin: Mail },
    irene: { name: "Irene Molina", initials: "IM", hue: 285, origin: Globe },
    ines: { name: "Inés Vera", initials: "IV", hue: 55, origin: UserPlus },
    daniel: { name: "Daniel Navarro", initials: "DN", hue: 235, origin: Phone },
    hugo: { name: "Hugo Fernández", initials: "HF", hue: 120, origin: CalendarDays },
};

/** "Marc Puig" → "Marc P.": what fits on a card. */
const shortName = (name: string) => {
    const [first, last] = name.split(" ");
    return last ? `${first} ${last[0]}.` : first;
};

/* ---------------------------------------------------------------------------------------------- */
/* pipeline · the board by stage                                                                  */
/* ---------------------------------------------------------------------------------------------- */

const COLUMN = { w: 4.74, gap: 0.35, top: 3.85 };
const columnX = (column: number) => column * (COLUMN.w + COLUMN.gap);
const cardY = (index: number) => 4.25 + index * 2.85;
const BOARD: string[][] = [
    ["eva", "raquel", "pablo"],
    ["felipe", "sara", "irene"],
    ["rocio", "natalia", "jorge", "ines"],
    ["tomas", "monica", "daniel"],
    ["alvaro", "hector"],
    ["lucia", "hugo"],
];
/** What happens on the board: a new enquiry, then two moving on — the first one won. */
const MOVES = [
    { at: 1300, id: "marc", to: 0 },
    { at: 2300, id: "alvaro", to: 5 },
    { at: 3300, id: "tomas", to: 4 },
];
const LIFT = 750;
const NEW_AT = MOVES[0].at;
const WON_AT = MOVES[1].at + 600;

function boardAt(t: number) {
    const columns = BOARD.map((column) => [...column]);
    for (const move of MOVES) {
        if (t < move.at) continue;
        for (const column of columns) {
            const index = column.indexOf(move.id);
            if (index >= 0) column.splice(index, 1);
        }
        columns[move.to].unshift(move.id);
    }
    return columns;
}

function PipelineScene({ t, labels }: Props) {
    const { ui, p } = labels;
    const columns = boardAt(t);
    const pressed = t >= NEW_AT - 300 && t < NEW_AT - 80;
    const won = on(t, WON_AT);

    return (
        <>
            <Title
                aside={
                    <>
                        <Pop show={on(t, 4100)} from="scale">
                            <Chip icon={TrendingUp} className="bg-brand-soft text-brand-ink">
                                {countIn(labels.crmStat, easeOut(span(t, 4100, 900)))}
                            </Chip>
                        </Pop>
                        <Pop show={on(t, 300)} from="scale">
                            <span
                                className={cn(
                                    "flex h-[1.7em] items-center gap-[0.35em] rounded-full bg-ink px-[0.8em] text-canvas transition-[scale,box-shadow] duration-300",
                                    pressed && "scale-95 shadow-[0_0_0_0.3em_rgb(34_197_94/0.3)]",
                                )}
                            >
                                <Plus className="size-[0.62em]" />
                                <span className="whitespace-nowrap text-[0.5em] font-semibold">{p.newRequest}</span>
                            </span>
                        </Pop>
                    </>
                }
            >
                {p.pipeline}
            </Title>

            {ui.stages.map((stage, column) => (
                <div key={stage}>
                    <At x={columnX(column)} y={2.6} w={COLUMN.w}>
                        <Pop show={on(t, 100 + column * 60)} className="flex min-w-0 items-center gap-[0.3em] px-[0.1em]">
                            <span className={cn("size-[0.38em] shrink-0 rounded-full", STAGE_TONE[column].split(" ")[0])} />
                            <span className="truncate text-[0.35em] font-semibold uppercase tracking-[0.05em] text-ink-2">{stage}</span>
                            <span className="ml-auto text-[0.36em] font-semibold tabular-nums text-ink-3">{columns[column].length}</span>
                        </Pop>
                    </At>
                    <At x={columnX(column)} y={COLUMN.top} w={COLUMN.w} h={20.6 - COLUMN.top}>
                        <Pop
                            show={on(t, 100 + column * 60)}
                            from="blur"
                            className={cn(
                                "h-full rounded-[0.7em] bg-fill/70 transition-shadow duration-700",
                                column === 5 && won && "shadow-[inset_0_0_0_0.08em_rgb(34_197_94/0.45)]",
                            )}
                        />
                    </At>
                </div>
            ))}

            {columns.flatMap((column, c) =>
                column.map((id, index) => {
                    const lead = LEADS[id];
                    const move = MOVES.find((entry) => entry.id === id);
                    const lifted = move !== undefined && id !== "marc" && t >= move.at && t < move.at + LIFT;
                    const isWon = id === "alvaro" && won;
                    const Origin = lead.origin;
                    return (
                        <At
                            key={id}
                            x={columnX(c) + 0.25}
                            y={cardY(index)}
                            w={COLUMN.w - 0.5}
                            h={2.55}
                            className={cn("transition-[left,top] duration-700 ease-spring", lifted && "z-20")}
                        >
                            <Pop
                                show={id === "marc" ? on(t, NEW_AT) : on(t, 350 + (c * 3 + index) * 45)}
                                from={id === "marc" ? "down" : "blur"}
                                className={cn(
                                    "relative flex h-full flex-col justify-center gap-[0.4em] overflow-hidden rounded-[0.55em] bg-surface px-[0.45em] ring-1 ring-hairline transition-[scale,box-shadow] duration-500",
                                    lifted ? "scale-[1.07] elev-4" : "elev-1",
                                    isWon && "ring-green-500/50",
                                )}
                            >
                                <span className="flex min-w-0 items-center gap-[0.35em]">
                                    <Avatar initials={lead.initials} hue={lead.hue} size={1.05} />
                                    <span className="truncate text-[0.42em] font-semibold">{shortName(lead.name)}</span>
                                </span>
                                <span className="flex items-center gap-[0.3em] text-ink-3">
                                    <Origin className="size-[0.5em] shrink-0" />
                                    <Line w={1.8} className="h-[0.22em]" />
                                    {isWon && (
                                        <span className="ml-auto size-[0.75em] text-green-600 dark:text-green-400">
                                            <DrawnCheck p={span(t, WON_AT, 450)} className="size-full" />
                                        </span>
                                    )}
                                </span>
                                {id === "marc" && (
                                    <span
                                        className="pointer-events-none absolute inset-0 rounded-[0.55em] bg-brand/20"
                                        style={{ opacity: 1 - easeOut(span(t, NEW_AT + 300, 1400)) }}
                                    />
                                )}
                                {isWon && (
                                    <span
                                        className="pointer-events-none absolute inset-0"
                                        style={{
                                            background: "linear-gradient(105deg, transparent 30%, rgb(34 197 94 / 0.3) 50%, transparent 70%)",
                                            transform: `translateX(${-100 + easeInOut(span(t, WON_AT, 900)) * 200}%)`,
                                        }}
                                    />
                                )}
                            </Pop>
                        </At>
                    );
                }),
            )}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* requests · the list                                                                            */
/* ---------------------------------------------------------------------------------------------- */

const ORIGIN_TONE: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
    teal: "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    pink: "bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300",
    green: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
};

const REQUESTS = [
    { id: "alvaro", stage: 4, tone: "blue" },
    { id: "rocio", stage: 2, tone: "teal" },
    { id: "felipe", stage: 1, tone: "blue" },
    { id: "tomas", stage: 3, tone: "amber" },
    { id: "natalia", stage: 2, tone: "pink" },
    { id: "lucia", stage: 1, tone: "green" },
    { id: "raquel", stage: 0, tone: "teal" },
];
/** Who takes which enquiry, and when. */
const ASSIGN: Record<string, { at: number; initials: string; hue: number }> = {
    alvaro: { at: 1500, initials: "MG", hue: 330 },
    tomas: { at: 1800, initials: "JP", hue: 200 },
    natalia: { at: 2100, initials: "AL", hue: 140 },
};
const MOVE_ON = { id: "rocio", at: 2800 };
const ARRIVE_AT = 3600;
const COLS = { stage: 0.6, name: 5.9, contact: 13.4, origin: 17.2, owner: 20.3 };
const COLUMNS = [
    { key: "stage", x: COLS.stage, w: 5 },
    { key: "name", x: COLS.name, w: 7.2 },
    { key: "contact", x: COLS.contact, w: 3.6 },
    { key: "origin", x: COLS.origin, w: 2.9 },
    { key: "owner", x: COLS.owner, w: 4 },
    { key: "date", x: 0, w: 5 },
];
const rowY = (index: number) => 5.45 + index * 2.05;

function RequestsScene({ t, labels, locale }: Props) {
    const { ui, p } = labels;
    const arrived = on(t, ARRIVE_AT);
    const rows = arrived ? [{ id: "eva", stage: 0, tone: "blue" }, ...REQUESTS] : REQUESTS;

    return (
        <>
            <Title
                aside={
                    <>
                        <Pop show={on(t, 200)} from="scale">
                            <span className="flex size-[1.55em] items-center justify-center rounded-[0.45em] ds-glass-inner">
                                <RefreshCw className="size-[0.68em] text-ink-2" />
                            </span>
                        </Pop>
                        <Pop show={on(t, 280)} from="scale">
                            <span className="flex h-[1.7em] items-center gap-[0.35em] rounded-full bg-ink px-[0.8em] text-canvas">
                                <Plus className="size-[0.62em]" />
                                <span className="whitespace-nowrap text-[0.5em] font-semibold">{p.newRequest}</span>
                            </span>
                        </Pop>
                    </>
                }
            >
                {p.requests}
            </Title>

            <At x={0} y={2.45} w={W} h={1.5}>
                <Pop show={on(t, 120)} from="blur" className="flex h-full items-center gap-[0.5em] rounded-full bg-fill px-[0.8em] text-ink-3">
                    <svg viewBox="0 0 24 24" className="size-[0.65em]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                    <Line w={7} className="h-[0.28em]" />
                </Pop>
            </At>

            <At x={0} y={4.4} w={W} h={0.8}>
                {COLUMNS.map((column, index) => (
                    <span
                        key={column.key}
                        className={cn("absolute top-0", column.key === "date" && "right-[0.6em] text-right")}
                        style={column.key === "date" ? { width: `${column.w}em` } : { left: `${column.x}em`, width: `${column.w}em` }}
                    >
                        <span className="block truncate text-[0.36em] font-semibold uppercase tracking-[0.12em] text-ink-3">{p.requestColumns[index]}</span>
                    </span>
                ))}
            </At>

            {rows.map((row, index) => {
                const lead = LEADS[row.id];
                const Origin = lead.origin;
                const owner = ASSIGN[row.id];
                const stage = row.id === MOVE_ON.id && on(t, MOVE_ON.at) ? row.stage + 1 : row.stage;
                const isNew = row.id === "eva";
                return (
                    <At key={row.id} x={0} y={rowY(index)} w={W} h={2.05} className="transition-[top] duration-700 ease-spring">
                        <Pop
                            show={isNew ? arrived : on(t, 300 + index * 70)}
                            from={isNew ? "down" : "blur"}
                            className="relative h-full border-b border-hairline"
                        >
                            {isNew && (
                                <span
                                    className="pointer-events-none absolute inset-0 rounded-[0.5em] bg-brand/15"
                                    style={{ opacity: 1 - easeOut(span(t, ARRIVE_AT + 400, 1600)) }}
                                />
                            )}
                            <span className="absolute top-1/2 -translate-y-1/2" style={{ left: `${COLS.stage}em` }}>
                                <StageTag stages={ui.stages} stage={stage} />
                            </span>
                            <span className="absolute top-1/2 w-[7em] -translate-y-1/2 truncate" style={{ left: `${COLS.name}em` }}>
                                <span className="text-[0.52em] font-medium">{lead.name}</span>
                            </span>
                            <span className="absolute top-1/2 flex -translate-y-1/2 gap-[0.3em]" style={{ left: `${COLS.contact}em` }}>
                                {[Mail, Phone].map((Icon, i) => (
                                    <span key={i} className="flex size-[1.2em] items-center justify-center rounded-[0.35em] bg-fill">
                                        <Icon className="size-[0.55em] text-ink-2" />
                                    </span>
                                ))}
                            </span>
                            <span
                                className={cn("absolute top-1/2 flex size-[1.2em] -translate-y-1/2 items-center justify-center rounded-[0.35em]", ORIGIN_TONE[row.tone])}
                                style={{ left: `${COLS.origin}em` }}
                            >
                                <Origin className="size-[0.6em]" />
                            </span>
                            <span className="absolute top-1/2 -translate-y-1/2" style={{ left: `${COLS.owner}em` }}>
                                {owner ? (
                                    <Pop show={on(t, owner.at)} from="scale" className="relative">
                                        <Avatar initials={owner.initials} hue={owner.hue} size={1.2} />
                                        <Ripple p={span(t, owner.at, 800)} className="text-brand" />
                                    </Pop>
                                ) : (
                                    <span className="text-[0.5em] text-ink-3">—</span>
                                )}
                            </span>
                            <span className="absolute right-[0.6em] top-1/2 -translate-y-1/2">
                                <span className="text-[0.48em] tabular-nums text-ink-2">{shortDate(locale, new Date(2026, 5, isNew ? 4 : 3))}</span>
                            </span>
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* enquiry · the public form, on a family's phone                                                 */
/* ---------------------------------------------------------------------------------------------- */

const PHONE = { x: 2.5, y: 1.2, w: 12.6, h: 25.5 };
const CARD = { x: 17.4, y: 8.6, w: 12.6 };
const FILL_AT = [500, 1150, 1450, 2350];
const OPEN = { at: 1450, pick: 1950, close: 2150 };
const PRESS_AT = 3050;
const SENT_AT = 3250;
const FLIGHT = { at: 3350, duration: 650 };
const LAND_AT = FLIGHT.at + FLIGHT.duration;

function EnquiryScene({ t, labels, locale }: Props) {
    const { ui, p } = labels;
    const name = typed("Lucía García", t, FILL_AT[0], 45);
    const age = typed("7", t, FILL_AT[1], 60);
    const email = typed("maria@correo.es", t, FILL_AT[3], 38);
    const open = t >= OPEN.at && t < OPEN.close;
    const picked = on(t, OPEN.close);
    const highlight = on(t, OPEN.pick) ? 1 : 0;
    const pressed = t >= PRESS_AT && t < SENT_AT;
    const sent = on(t, SENT_AT);
    const focus = name.typing ? 0 : age.typing ? 1 : open ? 2 : email.typing ? 3 : -1;
    const flight = easeInOut(span(t, FLIGHT.at, FLIGHT.duration));
    const from = { x: PHONE.x + PHONE.w / 2, y: 21.2 };
    const to = { x: CARD.x + 1.6, y: CARD.y + 2.4 };
    const dot = {
        x: from.x + (to.x - from.x) * flight,
        y: from.y + (to.y - from.y) * flight - Math.sin(Math.PI * flight) * 5,
    };

    const values = [name.text, age.text, picked ? p.formOptions[1] : "", email.text];

    return (
        <>
            <GlassOrbs
                orbs={[
                    { x: -2, y: 4, size: 14, color: "#a3e635" },
                    { x: 18, y: 2, size: 15, color: "#14b8a6" },
                    { x: 9, y: 15, size: 13, color: "#22c55e" },
                ]}
            />
            <At {...PHONE} className="ds-glass overflow-hidden" style={{ ["--glass-radius" as string]: "1.9em" }}>
                <div className="flex h-full flex-col gap-[0.75em] px-[0.9em] pt-[0.8em]">
                    <span className="mx-auto flex h-[1.15em] w-[72%] items-center justify-center gap-[0.35em] rounded-full bg-fill text-ink-3">
                        <Lock className="size-[0.48em]" />
                        <Line w={4.6} className="h-[0.24em]" />
                    </span>
                    <span className="mt-[0.3em] flex flex-col gap-[0.4em]">
                        <span className="text-[0.82em] font-semibold tracking-[-0.01em]">{p.formName}</span>
                        <Line w={7.5} className="h-[0.26em] opacity-70" />
                    </span>
                    {p.formFields.map((field, index) => (
                        <span key={field} className="relative flex flex-col gap-[0.35em]">
                            <span className="truncate text-[0.38em] font-semibold uppercase tracking-[0.1em] text-ink-2">
                                {field} <span className="text-red-500">*</span>
                            </span>
                            <span
                                className={cn(
                                    "flex h-[1.65em] items-center rounded-[0.5em] bg-surface/80 px-[0.55em] ring-1 ring-hairline transition-shadow duration-300",
                                    focus === index && "ring-[0.12em] ring-brand/60",
                                )}
                            >
                                <span className="truncate text-[0.52em]">
                                    {values[index]}
                                    {focus === index && index !== 2 && <span className="ml-[0.08em] inline-block h-[1em] w-[0.1em] translate-y-[0.15em] bg-brand" />}
                                </span>
                                {index === 2 && <ChevronDown className="ml-auto size-[0.6em] text-ink-3" />}
                            </span>
                            {index === 2 && (
                                <span
                                    className={cn(
                                        "absolute inset-x-0 top-[2.45em] z-30 flex flex-col rounded-[0.6em] p-[0.25em] material-thick elev-4 ring-1 ring-hairline transition-[opacity,translate,scale] duration-300 ease-spring",
                                        open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-[0.4em] scale-95 opacity-0",
                                    )}
                                >
                                    <span
                                        className="absolute inset-x-[0.25em] top-[0.25em] h-[1.35em] rounded-[0.4em] bg-brand/15 transition-transform duration-300 ease-spring"
                                        style={{ transform: `translateY(${highlight * 1.35}em)` }}
                                    />
                                    {p.formOptions.map((option) => (
                                        <span key={option} className="relative flex h-[1.35em] items-center px-[0.45em]">
                                            <span className="text-[0.5em]">{option}</span>
                                        </span>
                                    ))}
                                </span>
                            )}
                        </span>
                    ))}
                    <span
                        className={cn(
                            "relative mt-[0.4em] grid h-[1.9em] place-items-center rounded-full text-white transition-[background-color,scale] duration-500",
                            sent ? "bg-green-500" : "bg-ink text-canvas",
                            pressed && "scale-95",
                        )}
                    >
                        <span className={cn("[grid-area:1/1] text-[0.56em] font-semibold transition-opacity duration-300", sent && "opacity-0")}>{p.send}</span>
                        <span className={cn("[grid-area:1/1] flex items-center gap-[0.35em] transition-opacity duration-300", !sent && "opacity-0")}>
                            <span className="size-[0.85em]">
                                <DrawnCheck p={span(t, SENT_AT + 100, 450)} className="size-full" />
                            </span>
                            <span className="text-[0.52em] font-semibold">{p.sent}</span>
                        </span>
                    </span>
                </div>
            </At>

            {flight > 0 && flight < 1 && (
                <At x={dot.x} y={dot.y} className="pointer-events-none z-40">
                    <span className="absolute -left-[0.7em] -top-[0.7em] size-[1.4em] rounded-full bg-brand/35 blur-[0.3em]" />
                    <span className="absolute -left-[0.25em] -top-[0.25em] size-[0.5em] rounded-full bg-white shadow-[0_0_0.5em_rgb(34_197_94/0.9)]" />
                </At>
            )}

            <At x={CARD.x} y={CARD.y} w={CARD.w}>
                <Pop show={on(t, LAND_AT)} from="scale" className="relative flex flex-col gap-[0.8em] rounded-[1.1em] p-[1em] ds-glass">
                    <span className="flex items-center justify-between">
                        <span className={SECTION}>{p.newRequest}</span>
                        <StageTag stages={ui.stages} stage={0} />
                    </span>
                    <span className="flex items-center gap-[0.55em]">
                        <span className="relative">
                            <Avatar initials="LG" hue={25} size={2.1} />
                            <Ripple p={span(t, LAND_AT, 900)} className="text-brand" />
                        </span>
                        <span className="flex min-w-0 flex-col gap-[0.35em]">
                            <span className="truncate text-[0.7em] font-semibold">Lucía García</span>
                            <span className="flex items-center gap-[0.3em] text-ink-3">
                                <Globe className="size-[0.5em]" />
                                <span className="truncate text-[0.46em]">{p.formName}</span>
                            </span>
                        </span>
                    </span>
                    <span className="flex items-center justify-between border-t border-hairline pt-[0.6em]">
                        <span className="text-[0.46em] text-ink-2">{p.formOptions[1]}</span>
                        <span className="text-[0.46em] tabular-nums text-ink-3">{shortDate(locale, new Date(2026, 5, 4))}</span>
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* editor · a form's properties                                                                   */
/* ---------------------------------------------------------------------------------------------- */

const FIELD_ICONS: LucideIcon[] = [Type, Hash, ChevronDown, Mail];
const SELECTED = 2;
const OPTION_AT = 1100;
const REQUIRED_AT = 2700;
const SAVE_AT = 3500;
const PROPS_X = 16.7;
const FIELD_LABEL = "block truncate text-[0.38em] font-semibold uppercase tracking-[0.1em] text-ink-3";

function EditorScene({ t, labels }: Props) {
    const { ui, p } = labels;
    const required = on(t, REQUIRED_AT);
    const saving = t >= SAVE_AT && t < SAVE_AT + 220;
    const saved = on(t, SAVE_AT + 220);
    const last = typed(p.formOptions[3], t, OPTION_AT + 200, 60);

    return (
        <>
            <Title
                aside={
                    <Pop show={on(t, 300)} from="scale">
                        <span
                            className={cn(
                                "grid h-[1.7em] place-items-center rounded-full px-[0.9em] text-canvas transition-[scale,background-color] duration-500",
                                saved ? "bg-green-600" : "bg-ink",
                                saving && "scale-95",
                            )}
                        >
                            <span className={cn("[grid-area:1/1] whitespace-nowrap text-[0.5em] font-semibold transition-opacity duration-300", saved && "opacity-0")}>
                                {ui.saveForm}
                            </span>
                            <span className={cn("[grid-area:1/1] size-[0.9em] text-white transition-opacity duration-300", !saved && "opacity-0")}>
                                <DrawnCheck p={span(t, SAVE_AT + 300, 450)} className="size-full" />
                            </span>
                        </span>
                    </Pop>
                }
            >
                {p.formName}
            </Title>

            {/* The canvas: the form's fields, the one in hand ringed. */}
            <At x={0} y={2.45} w={15.2}>
                <span className={SECTION}>{p.canvas}</span>
            </At>
            <At x={0} y={3.35} w={15.2} h={17.25}>
                <Pop
                    show={on(t, 100)}
                    from="blur"
                    className="h-full rounded-[0.8em] bg-fill/70"
                    style={{ backgroundImage: "radial-gradient(circle, var(--ds-hairline-strong) 0.06em, transparent 0.07em)", backgroundSize: "0.9em 0.9em" }}
                />
            </At>
            {p.formFields.map((field, index) => {
                const Icon = FIELD_ICONS[index];
                const selected = index === SELECTED;
                const star = index !== SELECTED || required;
                return (
                    <At key={field} x={0.5} y={3.85 + index * 3.75} w={14.2} h={3.3}>
                        <Pop
                            show={on(t, 250 + index * 110)}
                            from="blur"
                            className={cn(
                                "relative flex h-full flex-col justify-center gap-[0.55em] rounded-[0.6em] bg-surface px-[0.7em] elev-1 ring-1 ring-hairline",
                                selected && "ring-[0.1em] ring-ink",
                                selected && saved && "ring-green-600",
                            )}
                        >
                            <span className="flex items-center gap-[0.35em] text-ink-2">
                                <GripVertical className="size-[0.55em] text-ink-3" />
                                <Icon className="size-[0.55em]" />
                                <span className="truncate text-[0.48em] font-semibold text-ink">{field}</span>
                                <span
                                    className={cn(
                                        "text-[0.55em] font-bold text-red-500 transition-[opacity,scale] duration-500 ease-spring-bounce",
                                        star ? "scale-100 opacity-100" : "scale-0 opacity-0",
                                    )}
                                >
                                    *
                                </span>
                            </span>
                            <span className="flex h-[1em] items-center rounded-[0.3em] bg-fill px-[0.4em]">
                                {selected && <ChevronDown className="ml-auto size-[0.5em] text-ink-3" />}
                            </span>
                        </Pop>
                    </At>
                );
            })}

            {/* The field's properties. */}
            <At x={15.9} y={2.45} w={W - 15.9} h={18.15}>
                <Pop show={on(t, 200)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={PROPS_X} y={3.1} w={12.8} className="flex flex-col gap-[0.75em]">
                <span className={SECTION}>{p.properties}</span>
                <span className="flex h-[1.25em] items-center justify-between">
                    <span className={FIELD_LABEL}>{p.type}</span>
                    <Pop show={on(t, 500)} from="scale">
                        <Chip>{ui.fieldTypes[4]}</Chip>
                    </Pop>
                </span>
                <span className="flex flex-col gap-[0.45em]">
                    <span className={FIELD_LABEL}>{p.label}</span>
                    <Pop show={on(t, 600)} className="flex h-[1.4em] items-center rounded-[0.45em] bg-fill px-[0.5em]">
                        <span className="truncate text-[0.5em]">{p.formFields[SELECTED]}</span>
                    </Pop>
                </span>
                <span className="flex flex-col gap-[0.3em]">
                    <span className={cn(FIELD_LABEL, "mb-[0.15em]")}>{p.options}</span>
                    {p.formOptions.map((option, index) => {
                        const isLast = index === 3;
                        return (
                            <Pop
                                key={option}
                                show={isLast ? on(t, OPTION_AT) : on(t, 700 + index * 90)}
                                from={isLast ? "down" : "up"}
                                className="flex h-[1.3em] items-center gap-[0.3em]"
                            >
                                <span
                                    className={cn(
                                        "flex h-full flex-1 items-center rounded-[0.45em] bg-fill px-[0.5em] transition-shadow duration-300",
                                        isLast && last.typing && "ring-[0.1em] ring-brand/60",
                                    )}
                                >
                                    <span className="truncate text-[0.5em]">
                                        {isLast ? last.text : option}
                                        {isLast && last.typing && <span className="ml-[0.08em] inline-block h-[1em] w-[0.1em] translate-y-[0.15em] bg-brand" />}
                                    </span>
                                </span>
                                {isLast && (
                                    <span className="flex size-[1.3em] shrink-0 items-center justify-center rounded-[0.45em] bg-fill">
                                        <Plus className="size-[0.55em] text-ink-2" />
                                    </span>
                                )}
                                <span className="flex size-[1.3em] shrink-0 items-center justify-center rounded-[0.45em] bg-red-50 dark:bg-red-500/15">
                                    <Trash2 className="size-[0.55em] text-red-500" />
                                </span>
                            </Pop>
                        );
                    })}
                </span>
                <span className="flex h-[1.2em] items-center justify-between">
                    <span className={FIELD_LABEL}>{p.required}</span>
                    <span className={cn("relative h-full w-[2.2em] rounded-full transition-colors duration-500", required ? "bg-ink" : "bg-fill-2")}>
                        <span
                            className="absolute left-[0.12em] top-[0.12em] size-[0.96em] rounded-full bg-white elev-1 transition-transform duration-500 ease-spring"
                            style={{ transform: `translateX(${required ? 1 : 0}em)` }}
                        />
                    </span>
                </span>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const { Scene: StagesScene, duration: STAGES_DURATION } = KEY_FEATURE_SCENES[3];

const SCENES = {
    pipeline: { Scene: PipelineScene, duration: 5000 },
    requests: { Scene: RequestsScene, duration: 4800 },
    enquiry: { Scene: EnquiryScene, duration: 4800, board: { cols: 32, rows: 26 }, k: 0.72 },
    editor: { Scene: EditorScene, duration: 4400 },
    stages: { Scene: StagesScene, duration: STAGES_DURATION },
} satisfies Record<string, SceneSpec<ProductSceneLabels>>;

export type CrmSceneKey = keyof typeof SCENES;

/** The CRM page's scenes, one island each: `scene` picks which. */
export default function CrmScenes({ scene, labels, locale, max }: { scene: CrmSceneKey; labels: ProductSceneLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
