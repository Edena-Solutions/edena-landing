import { ChevronRight, Clock, Landmark, Monitor, Network, Plus, Presentation, Projector, Table2, Users } from "lucide-react";

import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Pop, capitalize, easeOut, money, monthName, on, span } from "@/components/wizard/scene-kit";
import { KEY_FEATURE_SCENES, Title } from "@/modules/home/KeyFeaturesScenes";
import { STUDENT_DURATION, StudentScene } from "@/modules/home/StudentScene";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Caps, Fresh, Photo, Pill, SettlePill } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type StudentsLabels = ProductSceneLabels & { st: Translation["studentsScenes"] };

/*
 * The students page's scenes, drawn from `screenshots/students/*` and `shared/organization.png`:
 *
 *   record      (hero) a student's record: her month fills in, a note is written, today lands
 *   billing     her billing tab: the month's invoice drawn up on its own, then paid by direct debit
 *   grades      her grades written in and her report card sent (the home's scene)
 *   structure   the school's structure, level by level, each course with its groups and places
 *   classroom   a classroom: its teachers, its pupils, its equipment
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: StudentsLabels;
    locale: string;
}

const W = CONTENT.w;

function RecordScene({ t, labels, locale }: Props) {
    return <StudentScene t={t} ui={labels.ui} locale={locale} />;
}

/* ---------------------------------------------------------------------------------------------- */
/* billing · her invoices                                                                         */
/* ---------------------------------------------------------------------------------------------- */

const MONTHS = [5, 4, 3, 2, 1];
const NEW_AT = 1300;
const PAID_AT = 2700;

function BillingScene({ t, labels, locale }: Props) {
    const { st, ui, p } = labels;
    const landed = on(t, NEW_AT);
    const rows = landed ? MONTHS : MONTHS.slice(1);
    const lines = [520, 161.5, -52];
    const total = lines.reduce((sum, value) => sum + value, 0);

    return (
        <>
            <Title aside={<Pill tone="green">{ui.active}</Pill>}>
                <span className="flex items-center gap-[0.5em]">
                    <Avatar initials="LG" hue={25} size={1.5} />
                    Lucía García López
                </span>
            </Title>
            <At x={0} y={2.45} w={W} h={1.55}>
                <span className="flex h-full w-fit items-center rounded-full bg-fill p-[0.15em]">
                    {ui.studentTabs.map((tab, index) => (
                        <span key={tab} className={cn("flex h-full items-center rounded-full px-[0.75em]", index === 2 ? "bg-surface text-ink elev-1" : "text-ink-3")}>
                            <span className="text-[0.44em] font-medium">{tab}</span>
                        </span>
                    ))}
                </span>
            </At>

            {/* Her invoices, newest on top: this month's arrives on its own. */}
            <At x={0} y={4.6} w={18.4} h={16}>
                <Pop show={on(t, 150)} from="up" className="flex h-full flex-col rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <Caps className="mb-[0.5em]">{st.invoices}</Caps>
                    <span className="relative block flex-1">
                        {rows.map((month, index) => {
                            const isNew = month === MONTHS[0];
                            return (
                                <span key={month} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${index * 2.3}em` }}>
                                    <Pop show={isNew ? landed : on(t, 250 + index * 80)} from={isNew ? "down" : "up"} className="relative flex h-[2.3em] items-center gap-[0.55em] border-b border-hairline px-[0.25em]">
                                        {isNew && <Fresh t={t} at={NEW_AT} />}
                                        <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                                            <span className="text-[0.5em] font-medium">{capitalize(monthName(locale, month))} 2026</span>
                                            <span className="truncate text-[0.38em] text-ink-3">{isNew ? st.generatedAuto : st.directDebit}</span>
                                        </span>
                                        <span className="text-[0.5em] font-medium tabular-nums">{money(locale, total, 2)}</span>
                                        <span className="flex w-[5em] justify-end">{isNew ? <SettlePill t={t} at={PAID_AT} from={ui.pending} to={p.paid} /> : <Pill tone="green">{p.paid}</Pill>}</span>
                                    </Pop>
                                </span>
                            );
                        })}
                    </span>
                </Pop>
            </At>

            {/* Her rate: what makes up each month. */}
            <At x={19} y={4.6} w={W - 19} h={16}>
                <Pop show={on(t, 300)} from="up" className="flex h-full flex-col gap-[0.55em] rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <Caps>{st.rate}</Caps>
                    {[p.invoiceLines[2], p.invoiceLines[0], st.siblingDiscount].map((line, index) => (
                        <Pop key={line} show={on(t, 500 + index * 120)} className="flex items-center justify-between border-b border-hairline pb-[0.35em]">
                            <span className="truncate text-[0.44em] text-ink-2">{line}</span>
                            <span className={cn("text-[0.46em] font-medium tabular-nums", lines[index] < 0 && "text-green-600 dark:text-green-400")}>
                                {lines[index] < 0 ? "−" : ""}
                                {money(locale, Math.abs(lines[index]), 2)}
                            </span>
                        </Pop>
                    ))}
                    <span className="flex items-center justify-between">
                        <span className="text-[0.48em] font-semibold">{p.total}</span>
                        <span className="text-[0.8em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, total * easeOut(span(t, 700, 1000)), 2)}</span>
                    </span>
                    <span className="mt-auto flex items-center gap-[0.45em] rounded-[0.55em] bg-fill/70 px-[0.55em] py-[0.45em]">
                        <Landmark className="size-[0.6em] text-ink-2" />
                        <span className="flex flex-col gap-[0.15em]">
                            <span className="text-[0.42em] font-medium">{st.directDebit}</span>
                            <span className="text-[0.36em] tabular-nums text-ink-3">ES21 •••• 4521</span>
                        </span>
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* structure · levels, courses, groups                                                            */
/* ---------------------------------------------------------------------------------------------- */

const LEVELS = [
    { courses: ["P-1", "P-2"], groups: [2, 2], seats: [28, 30], cap: 32 },
    { courses: ["I-3", "I-4", "I-5"], groups: [2, 2, 2], seats: [46, 44, 48], cap: 50 },
    { courses: ["1.º", "2.º", "3.º", "4.º"], groups: [2, 2, 2, 2], seats: [50, 48, 52, 49], cap: 56 },
];
const GROW = { at: 2900, level: 1, course: 1 };

function StructureScene({ t, labels }: Props) {
    const { st } = labels;
    const added = on(t, GROW.at);
    let row = 0;

    return (
        <>
            <Title
                aside={
                    <span className="flex h-[1.7em] items-center gap-[0.35em] rounded-full bg-ink px-[0.8em] text-canvas">
                        <Plus className="size-[0.62em]" />
                        <span className="whitespace-nowrap text-[0.5em] font-semibold">{st.newLevel}</span>
                    </span>
                }
            >
                {st.organization}
            </Title>
            {LEVELS.map((level, l) => {
                const y = 2.6 + row * 6;
                row += 1;
                return (
                    <div key={l}>
                        <At x={0} y={y} w={W} className="flex items-center gap-[0.45em]">
                            <Pop show={on(t, 200 + l * 500)} className="flex items-center gap-[0.45em]">
                                <Network className="size-[0.6em] text-ink-2" />
                                <span className="text-[0.52em] font-bold uppercase tracking-[0.08em]">{st.levels[l]}</span>
                                <span className="text-[0.36em] font-semibold uppercase tracking-[0.1em] text-ink-3">{st.level}</span>
                            </Pop>
                        </At>
                        {level.courses.map((course, c) => {
                            const grows = l === GROW.level && c === GROW.course && added;
                            const groups = level.groups[c] + (grows ? 1 : 0);
                            const seats = level.seats[c] + (grows ? 20 : 0);
                            const cap = level.cap + (grows ? 25 : 0);
                            return (
                                <At key={course} x={c * 7.6} y={y + 1.3} w={7.2} h={4}>
                                    <Pop show={on(t, 300 + l * 500 + c * 90)} from="up" className="relative flex h-full flex-col justify-between rounded-[0.7em] p-[0.6em] ds-glass-inner">
                                        {grows && <Fresh t={t} at={GROW.at} className="rounded-[0.7em]" />}
                                        <span className="flex flex-col gap-[0.15em]">
                                            <span className="text-[0.55em] font-semibold">{course}</span>
                                            <span className="text-[0.34em] font-semibold uppercase tracking-[0.1em] text-ink-3">{st.course}</span>
                                        </span>
                                        <span className="flex items-center gap-[0.45em]">
                                            <span className="flex items-center gap-[0.2em] text-ink-2">
                                                <Users className="size-[0.5em]" />
                                                <span key={groups} className="animate-[ds-pop_350ms_var(--ease-spring-bounce)] text-[0.44em] font-semibold tabular-nums">
                                                    {groups}
                                                </span>
                                            </span>
                                            <span className="h-[0.25em] flex-1 overflow-hidden rounded-full bg-fill-2">
                                                <span className="block h-full origin-left rounded-full bg-sky-500 transition-transform duration-700 ease-spring" style={{ transform: `scaleX(${(seats / cap) * easeOut(span(t, 600 + l * 500, 900))})` }} />
                                            </span>
                                            <span className="text-[0.36em] tabular-nums text-ink-3">
                                                {seats}/{cap}
                                            </span>
                                        </span>
                                    </Pop>
                                </At>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* classroom · its teachers, pupils, equipment                                                    */
/* ---------------------------------------------------------------------------------------------- */

const PUPILS = ["Adrián", "Lucas", "Juan", "Sofía", "María", "Lucía", "Inés", "Leo", "Marta", "Hugo", "Valentina", "Daniel"];
const EQUIPMENT = [Presentation, Projector, Table2, Monitor];

function ClassroomScene({ t, labels }: Props) {
    const { st } = labels;
    const seated = PUPILS.filter((_, index) => on(t, 700 + index * 140)).length;

    return (
        <>
            <At x={0} y={0} w={W} h={1.9} className="flex items-center gap-[0.35em] text-ink-3">
                {[st.courses, st.levels[1], "I-1", "I-1 A"].map((crumb, index) => (
                    <span key={crumb} className="flex items-center gap-[0.35em]">
                        {index > 0 && <ChevronRight className="size-[0.5em]" />}
                        <span className={cn(index === 3 ? "text-[0.8em] font-semibold tracking-[-0.01em] text-ink" : "text-[0.46em] font-medium")}>{crumb}</span>
                    </span>
                ))}
                <span className="ml-auto flex items-center gap-[0.3em] rounded-full bg-fill px-[0.65em] py-[0.25em] text-ink-2">
                    <Clock className="size-[0.55em]" />
                    <span className="text-[0.44em] font-medium">{st.schedule}</span>
                </span>
            </At>

            {/* Teachers. */}
            <At x={0} y={2.5} w={W} className="flex items-center gap-[0.5em]">
                <Caps className="mr-[0.3em]">{st.teachers}</Caps>
                {[
                    ["SG", "Sara García", 330],
                    ["JM", "Juan Martínez", 200],
                ].map(([initials, name, hue], index) => (
                    <Pop key={name} show={on(t, 200 + index * 120)} from="up" className="flex items-center gap-[0.4em] rounded-[0.6em] px-[0.5em] py-[0.35em] ds-glass-inner">
                        <Avatar initials={initials as string} hue={hue as number} size={1.3} />
                        <span className="text-[0.44em] font-semibold">{name}</span>
                    </Pop>
                ))}
            </At>

            {/* Pupils, seated one by one. */}
            <At x={0} y={4.6} w={21} className="flex items-center justify-between">
                <Caps>{st.students}</Caps>
                <span className="text-[0.44em] font-semibold tabular-nums text-ink-2">
                    {seated}/14
                </span>
            </At>
            {PUPILS.map((name, index) => (
                <At key={name} x={(index % 6) * 3.55} y={5.7 + Math.floor(index / 6) * 4.3} w={3.3} h={4}>
                    <Pop show={on(t, 700 + index * 140)} from="scale" className="relative size-full">
                        <Photo hue={(index * 41 + 20) % 360} className="size-full rounded-[0.5em]" />
                        <span className="absolute inset-x-[0.3em] bottom-[0.3em] flex h-[0.95em] items-center justify-center rounded-[0.25em] bg-white/90">
                            <span className="truncate text-[0.36em] font-medium text-neutral-900">{name}</span>
                        </span>
                    </Pop>
                </At>
            ))}

            {/* The room and its equipment. */}
            <At x={21.6} y={4.6} w={W - 21.6} h={16}>
                <Pop show={on(t, 400)} from="up" className="flex h-full flex-col gap-[0.55em] rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <Caps>{st.room}</Caps>
                    <span className="text-[0.62em] font-semibold">{st.roomName}</span>
                    <Caps tone="text-ink-3" className="mt-[0.3em]">
                        {st.equipment}
                    </Caps>
                    {st.equipmentItems.map((item, index) => {
                        const Icon = EQUIPMENT[index];
                        return (
                            <Pop key={item} show={on(t, 2600 + index * 180)} from="up" className="flex items-center gap-[0.4em] rounded-[0.5em] bg-fill/70 px-[0.45em] py-[0.35em]">
                                <Icon className="size-[0.55em] text-ink-2" />
                                <span className="truncate text-[0.42em]">{item}</span>
                            </Pop>
                        );
                    })}
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const { Scene: GradesScene, duration: GRADES_DURATION } = KEY_FEATURE_SCENES[2];

const SCENES = {
    record: { Scene: RecordScene, duration: STUDENT_DURATION },
    billing: { Scene: BillingScene, duration: 3800 },
    grades: { Scene: GradesScene, duration: GRADES_DURATION },
    structure: { Scene: StructureScene, duration: 3800 },
    classroom: { Scene: ClassroomScene, duration: 3800 },
} satisfies Record<string, SceneSpec<StudentsLabels>>;

export type StudentsSceneKey = keyof typeof SCENES;

export default function StudentsScenes({ scene, labels, locale, max }: { scene: StudentsSceneKey; labels: StudentsLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
