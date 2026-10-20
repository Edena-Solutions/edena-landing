import type { ReactNode } from "react";
import { FileCheck, HandHeart, Megaphone, PartyPopper, Plus, Sparkles, Store, Users, type LucideIcon } from "lucide-react";

import { PhoneFrame, PhoneNotification } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Line, Pop, easeInOut, easeOut, fill, money, on, span, typed } from "@/components/wizard/scene-kit";
import { Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import {
    ActionButton,
    Caps,
    Caret,
    DUO,
    DUO_PANE_LEFT,
    DUO_PHONE_RIGHT,
    Fresh,
    Lights,
    ORBS,
    Pane,
    Pill,
    SOLO,
    SOLO_PHONE,
    SettlePill,
    between,
} from "./kit";
import type { ProductSceneLabels } from "./labels";

export type ParentAssociationLabels = ProductSceneLabels & { a: Translation["parentAssociationsScenes"] };

/*
 * The parents' association page's scenes (AMPA, AFA, PTA): the association's own members, fees and
 * notices, run by a committee of parents rather than by the school's office.
 *
 *   roster   (hero) the year's member families: one joins, fees come in, one is reminded
 *   pay      the membership fee on a family's app, paid in a tap; the association's news below
 *   fee      the fee set once, the year's bills generated from it and the SEPA remittance made ready
 *   notice   a circular written and sent to every member family; on a phone it arrives and is read
 *
 * The activities' scene is the extracurricular page's own (`browse`): on the app it is the same
 * screen. Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: ParentAssociationLabels;
    locale: string;
}

const W = CONTENT.w;
/** One fee per family, whatever its number of children. */
const FEE = 25;

/** The association's mark: a hand and a heart on the brand's greens, where the school's logo would be. */
function AssociationMark({ className }: { className?: string }) {
    return (
        <span
            className={cn("relative flex shrink-0 items-center justify-center overflow-hidden text-white", className)}
            style={{ background: "linear-gradient(145deg, #34d399, #0d9488)" }}
        >
            <span className="absolute -right-[18%] -top-[18%] aspect-square w-[60%] rounded-full bg-white/15" />
            <HandHeart className="relative size-[55%] drop-shadow-[0_0.08em_0.2em_rgb(0_0_0/0.18)]" strokeWidth={1.8} />
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* roster · the year's members, their fees coming in                                              */
/* ---------------------------------------------------------------------------------------------- */

type Status = "paid" | "debit" | "pending";

interface Member {
    name: string;
    /** Indexes into `grades`, so the class reads in the page's language. */
    kids: number[];
    initials: string;
    hue: number;
    status: Status;
    /** When its fee comes in, if it does during the scene. */
    paidAt?: number;
    /** When it is reminded of the fee it still owes. */
    remindAt?: number;
}

const ROSTER: Member[] = [
    { name: "García López", kids: [0, 1], initials: "GL", hue: 25, status: "debit", paidAt: 1900 },
    { name: "Puig Serra", kids: [2], initials: "PS", hue: 265, status: "debit", paidAt: 2300 },
    { name: "Etxeberria Goñi", kids: [3], initials: "EG", hue: 140, status: "pending", remindAt: 3700 },
    { name: "Fernández Ruiz", kids: [4, 5], initials: "FR", hue: 45, status: "pending", paidAt: 2700 },
    { name: "Castro Vidal", kids: [6], initials: "CV", hue: 205, status: "paid" },
];
const JOINER: Member = { name: "Ortega Molina", kids: [7], initials: "OM", hue: 330, status: "pending", paidAt: 3100 };
const JOIN = 1200;
/** The year so far: 84 member families, 58 of them paid before the scene opens. */
const BEFORE = { members: 84, paid: 58 };
const ROW_H = 2.02;
const COL = { name: 0.3, kids: 12.4, fee: 19.4 };

function MemberStatus({ member, t, labels }: { member: Member; t: number; labels: ParentAssociationLabels }) {
    const { a } = labels;
    if (member.status === "paid") return <Pill tone="green">{a.paid}</Pill>;
    if (member.remindAt !== undefined) return <SettlePill t={t} at={member.remindAt} from={a.pending} to={a.reminded} />;
    if (member.paidAt === undefined) return <Pill tone="yellow">{a.pending}</Pill>;
    return (
        <SettlePill
            t={t}
            at={member.paidAt}
            from={member.status === "debit" ? a.directDebit : a.pending}
            to={a.paid}
            fromTone={member.status === "debit" ? "blue" : "yellow"}
        />
    );
}

function RosterScene({ t, labels, locale }: Props) {
    const { a } = labels;
    const joined = on(t, JOIN);
    const rows = joined ? [JOINER, ...ROSTER] : ROSTER;
    const members = BEFORE.members + (joined ? 1 : 0);
    // Each fee eases into the totals as it lands, so the figures count rather than jump.
    const landed = [...ROSTER, JOINER].reduce((sum, member) => sum + (member.paidAt === undefined ? 0 : easeOut(span(t, member.paidAt, 700))), 0);
    const collected = (BEFORE.paid + landed) * FEE;
    const owed = members * FEE - collected;

    return (
        <>
            <Title
                aside={
                    <>
                        <Pop show={on(t, 200)} from="scale">
                            <span className="flex items-center rounded-full bg-fill-2 px-[0.65em] py-[0.25em]">
                                <span className="text-[0.46em] font-medium text-ink-2">{a.year}</span>
                            </span>
                        </Pop>
                        <Pop show={on(t, 280)} from="scale">
                            <span
                                className={cn(
                                    "flex h-[1.7em] items-center gap-[0.35em] rounded-full bg-ink px-[0.8em] text-canvas transition-[scale] duration-200",
                                    between(t, JOIN - 260, JOIN) && "scale-95",
                                )}
                            >
                                <Plus className="size-[0.62em]" />
                                <span className="whitespace-nowrap text-[0.5em] font-semibold">{a.newMember}</span>
                            </span>
                        </Pop>
                    </>
                }
            >
                {a.members}
            </Title>

            {/* The year in three figures. */}
            {[
                [a.stats[0], <span key={members} className="inline-block animate-[ds-pop_350ms_var(--ease-spring-bounce)]">{members}</span>, "bg-fill-2 text-ink"],
                [a.stats[1], money(locale, collected, 0), "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"],
                [a.stats[2], money(locale, owed, 0), "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300"],
            ].map(([label, value, tone], index) => (
                <At key={index} x={index * 10.2} y={2.5} w={9.8} h={3.7}>
                    <Pop show={on(t, 100 + index * 90)} from="up" className={cn("flex h-full flex-col justify-between rounded-[0.8em] p-[0.7em]", tone as string)}>
                        <span className="truncate text-[0.42em] font-semibold uppercase tracking-[0.1em]">{label}</span>
                        <span className="text-[1.15em] font-light leading-none tabular-nums tracking-[-0.03em]">{value}</span>
                    </Pop>
                </At>
            ))}

            <At x={0} y={6.5} w={W} h={0.8}>
                {[COL.name + 1.85, COL.kids, COL.fee].map((left, index) => (
                    <span key={index} className="absolute top-0" style={{ left: `${left}em` }}>
                        <Caps tone="text-ink-3">{a.columns[index]}</Caps>
                    </span>
                ))}
                <span className="absolute right-[0.3em] top-0">
                    <Caps tone="text-ink-3">{a.columns[3]}</Caps>
                </span>
            </At>

            {/* The families: the newcomer slides in on top and the rest make room for it. */}
            {rows.map((member, index) => {
                const isNew = member === JOINER;
                const lit = member.paidAt ?? member.remindAt;
                return (
                    <At key={member.name} x={0} y={7.2 + index * ROW_H} w={W} h={ROW_H} className="transition-[top] duration-700 ease-spring">
                        <Pop show={isNew ? joined : on(t, 250 + index * 80)} from={isNew ? "down" : "up"} className="relative flex h-full items-center border-b border-hairline">
                            {isNew && <Fresh t={t} at={JOIN} />}
                            {!isNew && lit !== undefined && <Fresh t={t} at={lit} className={member.remindAt !== undefined ? "bg-yellow-400/20" : undefined} />}
                            <span className="absolute top-1/2 flex -translate-y-1/2 items-center gap-[0.5em]" style={{ left: `${COL.name}em`, width: `${COL.kids - COL.name - 0.6}em` }}>
                                <Avatar initials={member.initials} hue={member.hue} size={1.35} />
                                <span className="truncate text-[0.5em] font-medium">{fill(a.familyName, { name: member.name })}</span>
                                {isNew && <Pill tone="violet" className="shrink-0">{a.newTag}</Pill>}
                            </span>
                            <span className="absolute top-1/2 flex -translate-y-1/2 gap-[0.3em]" style={{ left: `${COL.kids}em` }}>
                                {member.kids.map((kid) => (
                                    <Pill key={kid} tone="gray">{a.grades[kid]}</Pill>
                                ))}
                            </span>
                            <span className="absolute top-1/2 -translate-y-1/2" style={{ left: `${COL.fee}em` }}>
                                <span className="text-[0.5em] tabular-nums">{money(locale, FEE, 2)}</span>
                            </span>
                            <span className="absolute right-[0.3em] top-1/2 flex -translate-y-1/2">
                                <MemberStatus member={member} t={t} labels={labels} />
                            </span>
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* pay · the fee, from the family's app                                                           */
/* ---------------------------------------------------------------------------------------------- */

const PAY = { press: 1300, busy: 1500, done: 2000, receipt: 2300 };
/** What else the association has on the app, each with its own colour: the party, activities, the shop. */
const NEWS: { icon: LucideIcon; from: string; to: string }[] = [
    { icon: PartyPopper, from: "#f9a8d4", to: "#ec4899" },
    { icon: Sparkles, from: "#fdba74", to: "#f97316" },
    { icon: Store, from: "#c4b5fd", to: "#7c3aed" },
];

function PayScene({ t, labels, locale }: Props) {
    const { a } = labels;
    const due = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(new Date(2026, 9, 30));

    return (
        <>
            <Lights orbs={ORBS.warm} />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={0}>
                    <div className="flex h-full flex-col gap-[0.55em] px-[0.6em] pt-[0.3em]">
                        <span className="truncate text-[0.46em] font-bold uppercase tracking-[0.1em]">{a.association}</span>

                        {/* The fee, and the button that pays it. */}
                        <Pop show={on(t, 150)} from="up" className="flex flex-col gap-[0.5em] rounded-[0.8em] bg-surface/80 p-[0.6em] ring-1 ring-hairline">
                            <span className="flex items-center gap-[0.5em]">
                                <AssociationMark className="size-[2.2em] rounded-[0.55em]" />
                                <span className="flex min-w-0 flex-col gap-[0.25em]">
                                    <span className="truncate text-[0.52em] font-semibold">{a.fee}</span>
                                    <span className="truncate text-[0.38em] text-ink-3">{a.year}</span>
                                </span>
                            </span>
                            <span className="text-[0.95em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, FEE, 2)}</span>
                            <span className="text-[0.4em] text-ink-3">{fill(a.dueBy, { date: due })}</span>
                            <ActionButton t={t} press={PAY.press} busy={PAY.busy} done={PAY.done} label={a.pay} doneLabel={a.paid} />
                        </Pop>

                        <Pop show={on(t, PAY.receipt)} from="up" className="relative flex items-center gap-[0.45em] rounded-[0.6em] bg-fill/70 px-[0.55em] py-[0.45em]">
                            <Fresh t={t} at={PAY.receipt} className="rounded-[0.6em]" />
                            <FileCheck className="size-[0.62em] shrink-0 text-green-600 dark:text-green-400" />
                            <span className="truncate text-[0.4em] text-ink-2">{a.receiptReady}</span>
                        </Pop>

                        {/* The association's other news. */}
                        <span className="mt-[0.2em]">
                            <Caps tone="text-ink-3">{a.fromAssociation}</Caps>
                        </span>
                        {NEWS.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Pop key={index} show={on(t, 400 + index * 120)} from="up" className="flex items-center gap-[0.5em] rounded-[0.7em] bg-surface/80 p-[0.45em] ring-1 ring-hairline">
                                    <span className="flex size-[1.7em] shrink-0 items-center justify-center rounded-[0.5em] text-white" style={{ background: `linear-gradient(145deg, ${item.from}, ${item.to})` }}>
                                        <Icon className="size-[0.8em]" strokeWidth={1.9} />
                                    </span>
                                    <span className="flex min-w-0 flex-col gap-[0.2em]">
                                        <span className="truncate text-[0.46em] font-semibold">{a.items[index]}</span>
                                        <span className="truncate text-[0.36em] text-ink-3">{a.itemMeta[index]}</span>
                                    </span>
                                </Pop>
                            );
                        })}
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* fee · set once, the year's bills from it                                                       */
/* ---------------------------------------------------------------------------------------------- */

const SETUP = { fields: 300, press: 1500, busy: 1700, done: 2200, bills: 2300, ready: 3900 };
const BILLS = [...ROSTER.slice(0, 4), JOINER];
const FAMILIES = BEFORE.members + 1;

function FeeScene({ t, labels, locale }: Props) {
    const { a } = labels;
    const chargeDay = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(new Date(2026, 9, 1));
    const generated = Math.round(FAMILIES * easeInOut(span(t, SETUP.bills, 1400)));
    const card = "flex flex-col gap-[0.6em] rounded-[0.9em] p-[0.8em] ds-glass-inner";
    const fields: [string, ReactNode][] = [
        [a.amount, <span key="amount" className="text-[0.56em] font-semibold tabular-nums">{money(locale, FEE, 2)}</span>],
        [a.frequency, <Pill key="frequency" tone="green" className="w-fit">{a.yearly}</Pill>],
        [a.method, <span key="method" className="text-[0.5em] font-medium">{a.sepa}</span>],
        [a.chargeDay, <span key="day" className="text-[0.5em] font-medium">{chargeDay}</span>],
    ];

    return (
        <>
            <Title
                aside={
                    <Pop show={on(t, 200)} from="scale">
                        <span className="flex items-center rounded-full bg-fill-2 px-[0.65em] py-[0.25em]">
                            <span className="text-[0.46em] font-medium text-ink-2">{a.year}</span>
                        </span>
                    </Pop>
                }
            >
                {a.fee}
            </Title>

            {/* The fee, set once. */}
            <At x={0} y={2.5} w={13.4}>
                <Pop show={on(t, 150)} from="up" className={card}>
                    <Caps>{a.setup}</Caps>
                    {fields.map(([label, value], index) => (
                        <Pop key={index} show={on(t, SETUP.fields + index * 150)} className="flex flex-col gap-[0.35em] border-b border-hairline pb-[0.55em]">
                            <Caps tone="text-ink-3">{label}</Caps>
                            {value}
                        </Pop>
                    ))}
                    <ActionButton t={t} press={SETUP.press} busy={SETUP.busy} done={SETUP.done} label={a.generate} doneLabel={a.generated} />
                </Pop>
            </At>

            {/* The year's bills, one per member family. */}
            <At x={14} y={2.5} w={W - 14}>
                <Pop show={on(t, 250)} from="up" className={card}>
                    <span className="flex items-baseline justify-between gap-[0.5em]">
                        <Caps>{a.receipts}</Caps>
                        <span className="text-[0.52em] font-semibold tabular-nums">
                            {generated}/{FAMILIES}
                        </span>
                    </span>
                    <span className="h-[0.32em] overflow-hidden rounded-full bg-fill-2">
                        <span
                            className={cn("block h-full origin-left rounded-full transition-colors duration-500", generated === FAMILIES ? "bg-green-500" : "bg-ink/70")}
                            style={{ transform: `scaleX(${generated / FAMILIES})` }}
                        />
                    </span>
                    <span className="flex flex-col">
                        {BILLS.map((member, index) => (
                            <Pop key={member.name} show={on(t, SETUP.bills + index * 200)} from="up" className="flex h-[2.05em] items-center gap-[0.45em] border-b border-hairline px-[0.2em]">
                                <Avatar initials={member.initials} hue={member.hue} size={1.2} />
                                <span className="flex-1 truncate text-[0.46em] font-medium">{fill(a.familyName, { name: member.name })}</span>
                                <span className="text-[0.46em] tabular-nums">{money(locale, FEE, 2)}</span>
                                <Pill tone="blue">SEPA</Pill>
                            </Pop>
                        ))}
                    </span>
                    <Pop show={on(t, SETUP.ready - 600)} from="up" className="flex">
                        <SettlePill t={t} at={SETUP.ready} from={a.preparing} to={a.remittanceReady} fromTone="gray" />
                    </Pop>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* notice · a circular from the committee, sent and read                                          */
/* ---------------------------------------------------------------------------------------------- */

const NOTICE = { type: 400, press: 1700, busy: 1900, done: 2300, arrive: 2450, read: 2600, confirm: 3400, confirmed: 3800 };
/** How many of the families have read it when the scene ends. */
const READERS = 71;
/** The new post's height on the phone: the older one below slides down by it. */
const POST_H = 8.4;

function NoticeScene({ t, labels }: Props) {
    const { a } = labels;
    const subject = typed(a.subject, t, NOTICE.type, 45);
    const sent = on(t, NOTICE.done);
    const arrived = on(t, NOTICE.arrive + 200);
    const read = Math.round(READERS * easeOut(span(t, NOTICE.read, 1800)));

    return (
        <>
            <Lights orbs={ORBS.sky} />

            {/* The committee writes the circular and sends it to every member family. */}
            <Pane box={DUO_PANE_LEFT} clear="right">
                <span className="flex items-center gap-[0.45em]">
                    <Megaphone className="size-[0.68em] text-ink-2" />
                    <span className="truncate text-[0.62em] font-semibold tracking-[-0.01em]">{a.newNotice}</span>
                </span>
                <Pop show={on(t, 150)} from="up" className="flex items-center gap-[0.5em] border-b border-hairline pb-[0.6em]">
                    <span className="shrink-0">
                        <Caps tone="text-ink-3">{a.to}</Caps>
                    </span>
                    <span className="flex min-w-0 items-center gap-[0.3em] rounded-full bg-fill-2 px-[0.55em] py-[0.22em]">
                        <Users className="size-[0.5em] shrink-0 text-ink-2" />
                        <span className="truncate text-[0.42em] font-medium">{a.allMembers}</span>
                        <span className="text-[0.38em] tabular-nums text-ink-3">{FAMILIES}</span>
                    </span>
                </Pop>
                <Pop show={on(t, 250)} from="up" className="flex flex-col gap-[0.35em]">
                    <Caps tone="text-ink-3">{a.subjectLabel}</Caps>
                    <span className="h-[1.1em] truncate text-[0.6em] font-semibold">
                        {subject.text}
                        <Caret show={subject.typing} />
                    </span>
                </Pop>
                <Pop show={on(t, 350)} from="up" className="flex flex-col gap-[0.5em] rounded-[0.7em] bg-fill/60 p-[0.65em]">
                    <Line w={13.5} className="h-[0.26em]" />
                    <Line w={12} className="h-[0.26em]" />
                    <Line w={8.5} className="h-[0.26em]" />
                </Pop>
                <span className="w-[6.6em]">
                    <ActionButton t={t} press={NOTICE.press} busy={NOTICE.busy} done={NOTICE.done} label={a.send} doneLabel={a.sent} />
                </span>
                <Pop show={sent} from="up" className="flex flex-col gap-[0.5em] rounded-[0.7em] p-[0.65em] ds-glass-inner">
                    <span className="flex items-baseline justify-between gap-[0.5em]">
                        <Caps>{a.readBy}</Caps>
                        <span className="text-[0.52em] font-semibold tabular-nums">
                            {read}/{FAMILIES}
                        </span>
                    </span>
                    <span className="h-[0.32em] overflow-hidden rounded-full bg-fill-2">
                        <span className="block h-full origin-left rounded-full bg-green-500" style={{ transform: `scaleX(${read / FAMILIES})` }} />
                    </span>
                </Pop>
            </Pane>

            {/* A family's phone: the notification, then the circular on the association's wall. */}
            <At {...DUO_PHONE_RIGHT}>
                <Pop show={on(t, 80)} from="up" className="size-full">
                    <PhoneFrame
                        x={0}
                        y={0}
                        w={DUO_PHONE_RIGHT.w}
                        h={DUO_PHONE_RIGHT.h}
                        tab={3}
                        overlay={
                            <Pop show={between(t, NOTICE.arrive, NOTICE.confirm - 300)} from="down">
                                <PhoneNotification title={a.association} body={a.subject} />
                            </Pop>
                        }
                    >
                        <div className="flex h-full flex-col gap-[0.5em] px-[0.55em] pt-[0.3em]">
                            <span className="truncate text-[0.44em] font-bold uppercase tracking-[0.1em]">{a.association}</span>
                            <span className="relative block flex-1">
                                <span className="absolute inset-x-0 top-0">
                                    <Pop show={arrived} from="down" className="relative flex flex-col gap-[0.45em] rounded-[0.8em] bg-surface/80 p-[0.55em] ring-1 ring-hairline" style={{ height: `${POST_H - 0.5}em` }}>
                                        <Fresh t={t} at={NOTICE.arrive + 200} className="rounded-[0.8em]" />
                                        <span className="flex items-center gap-[0.4em]">
                                            <AssociationMark className="size-[1.35em] rounded-full" />
                                            <span className="flex-1 truncate text-[0.4em] font-semibold">{a.association}</span>
                                            <span className="text-[0.34em] text-ink-3">{a.now}</span>
                                        </span>
                                        <span className="truncate text-[0.5em] font-semibold">{a.subject}</span>
                                        <span className="line-clamp-3 text-[0.38em] leading-snug text-ink-2">{a.noticeBody}</span>
                                        <span className="mt-auto">
                                            <ActionButton t={t} press={NOTICE.confirm} done={NOTICE.confirmed} label={a.confirmRead} doneLabel={a.read} className="h-[1.6em]" />
                                        </span>
                                    </Pop>
                                </span>
                                {/* The older post, pushed down as the new one arrives. */}
                                <span className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: arrived ? `${POST_H}em` : "0em" }}>
                                    <Pop show={on(t, 150)} from="up" className="flex flex-col gap-[0.45em] rounded-[0.8em] bg-surface/80 p-[0.55em] ring-1 ring-hairline">
                                        <span className="flex items-center gap-[0.4em]">
                                            <AssociationMark className="size-[1.35em] rounded-full" />
                                            <span className="flex-1 truncate text-[0.4em] font-semibold">{a.association}</span>
                                        </span>
                                        <span className="truncate text-[0.48em] font-semibold">{a.olderPost}</span>
                                        <span className="truncate text-[0.36em] text-ink-3">{a.olderPostMeta}</span>
                                        <Line w={8.5} className="h-[0.24em]" />
                                    </Pop>
                                </span>
                            </span>
                        </div>
                    </PhoneFrame>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    roster: { Scene: RosterScene, duration: 4600 },
    pay: { Scene: PayScene, duration: 3400, ...SOLO },
    fee: { Scene: FeeScene, duration: 4600 },
    notice: { Scene: NoticeScene, duration: 4400, ...DUO },
} satisfies Record<string, SceneSpec<ParentAssociationLabels>>;

export type ParentAssociationSceneKey = keyof typeof SCENES;

export default function ParentAssociationScenes({
    scene,
    labels,
    locale,
    max,
}: {
    scene: ParentAssociationSceneKey;
    labels: ParentAssociationLabels;
    locale: string;
    max?: number;
}) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
