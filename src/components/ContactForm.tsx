import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { z } from "zod";
import {
    AlertCircle,
    Baby,
    Check,
    ChevronDown,
    GraduationCap,
    Handshake,
    Mail,
    Network,
    School,
    Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import type { Translation } from "@/i18n";
import { WHATSAPP_NUMBERS } from "@/constants/contact";
import { WhatsAppLogo } from "@/components/WhatsAppLogo";

/*
 * The contact form, in the home's design. On a wide screen, who is writing is five profiles as a
 * radio group of app-icon rows, beside the form. On a phone that list is a single field at the
 * top of the form — it opens into the same five choices — and email and WhatsApp follow. Every
 * field is a soft well that lights green while in use (`.ds-form`), and a drawn tick once sent.
 *
 * What it asks and what it sends are unchanged: the same validation, the same Formspree payload.
 */

interface Props {
    /** The form's words in the page's language, passed in so the browser is not sent every language. */
    copy: Translation["contact"];
    formspreeUrl: string;
}

type Profile = "school" | "nursery" | "group" | "academy" | "partner";

const PROFILES: Profile[] = ["school", "nursery", "group", "academy", "partner"];

const profileIcons = {
    school: School,
    nursery: Baby,
    group: Network,
    academy: GraduationCap,
    partner: Handshake,
} as const;

const profileTones: Record<Profile, string> = {
    school: "bg-sys-blue",
    nursery: "bg-sys-orange",
    group: "bg-sys-indigo",
    academy: "bg-sys-green",
    partner: "bg-sys-pink",
};

const stageKeys = ["infantil", "primaria", "eso", "bachillerato", "fp"] as const;

const CONTACT_EMAIL = "hola@edena.es";

/** A label, its control and the line that says what is wrong with it. */
function Field({
    id,
    label,
    error,
    className,
    children,
}: {
    id?: string;
    label: string;
    error?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <label htmlFor={id} className="type-footnote font-medium text-ink-2">
                {label}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1.5 type-footnote text-red-600 dark:text-red-400">
                    <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                    {error}
                </p>
            )}
        </div>
    );
}

/**
 * The profile, on a phone: one field, the same well as the other inputs. It opens into the five
 * choices underneath — a select, not five rows before the form. The menu stays in the flow so the
 * tile, which clips, does not cut it off.
 */
function ProfileSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: Profile;
    options: { key: Profile; name: string; description: string }[];
    onChange: (next: Profile) => void;
}) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const current = options.find((option) => option.key === value) ?? options[0];
    const CurrentIcon = profileIcons[current.key];

    useEffect(() => {
        if (!open) return;
        const onPointer = (event: PointerEvent) => {
            if (!root.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKey = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("pointerdown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={root} className="flex flex-col gap-2 lg:hidden">
            <span id="profile-label" className="type-footnote font-medium text-ink-2">
                {label.replace(/:\s*$/, "")}
            </span>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby="profile-label"
                onClick={() => setOpen((was) => !was)}
                className={cn(
                    "flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-[0.875rem] bg-surface px-3 py-2 text-left transition-[box-shadow] duration-200 focus-visible:outline-none",
                    open
                        ? "shadow-[inset_0_0_0_1.5px_var(--ds-brand),0_0_0_4px_var(--ds-brand-soft)]"
                        : "shadow-[inset_0_0_0_1px_var(--ds-hairline)]",
                )}
            >
                <span className={cn("ds-app-icon size-9 shrink-0", profileTones[current.key])}>
                    <CurrentIcon className="size-[1.125rem]" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <span className="truncate type-callout font-semibold text-ink">{current.name}</span>
                    <span className="truncate type-footnote text-ink-2">{current.description}</span>
                </span>
                <ChevronDown
                    aria-hidden
                    className={cn(
                        "size-4 shrink-0 text-ink-3 transition-transform duration-200",
                        open && "rotate-180",
                    )}
                />
            </button>
            {open && (
                <div
                    role="listbox"
                    aria-labelledby="profile-label"
                    className="flex flex-col gap-0.5 rounded-[1.1rem] bg-surface p-1.5 ring-1 ring-hairline"
                >
                    {options.map((option) => {
                        const Icon = profileIcons[option.key];
                        const selected = option.key === value;
                        return (
                            <button
                                key={option.key}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                onClick={() => {
                                    onChange(option.key);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-[0.85rem] px-2.5 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-focus)]",
                                    selected ? "bg-fill-2" : "hover:bg-fill-2",
                                )}
                            >
                                <span
                                    className={cn("ds-app-icon size-9 shrink-0", profileTones[option.key])}
                                >
                                    <Icon className="size-[1.125rem]" />
                                </span>
                                <span className="flex min-w-0 flex-1 flex-col overflow-hidden">
                                    <span className="truncate type-callout font-semibold text-ink">
                                        {option.name}
                                    </span>
                                    <span className="truncate type-footnote text-ink-2">
                                        {option.description}
                                    </span>
                                </span>
                                <span
                                    aria-hidden
                                    className={cn(
                                        "flex size-5 shrink-0 items-center justify-center rounded-full",
                                        selected
                                            ? "bg-ink text-canvas"
                                            : "ring-[1.5px] ring-hairline-strong",
                                    )}
                                >
                                    {selected && <Check className="size-3" strokeWidth={3} />}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function ContactForm({ copy: ct, formspreeUrl }: Props) {

    const schema = z.object({
        name: z.string().min(1, ct.nameRequired),
        email: z.string().min(1, ct.emailRequired).email(ct.emailInvalid),
        message: z.string().min(1, ct.messageRequired).min(10, ct.messageMinLength),
    });

    const initialData = {
        name: "",
        email: "",
        phone: "",
        website: "",
        centerName: "",
        students: "",
        children: "",
        classrooms: "",
        centers: "",
        teachingType: "",
        message: "",
    };

    const [profile, setProfile] = useState<Profile>("school");
    const [formData, setFormData] = useState(initialData);
    const [stages, setStages] = useState<string[]>([]);
    const [phoneValid, setPhoneValid] = useState(true);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof initialData, string>>>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const radios = useRef<(HTMLButtonElement | null)[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof initialData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const toggleStage = (stage: string) => {
        setStages((prev) =>
            prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage],
        );
    };

    const handleProfileChange = (next: Profile) => {
        if (next === profile) return;
        setProfile(next);
        setErrors({});
    };

    /** Arrow keys move through the profiles, as a radio group does. */
    const handleRadioKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const step =
            event.key === "ArrowDown" || event.key === "ArrowRight"
                ? 1
                : event.key === "ArrowUp" || event.key === "ArrowLeft"
                  ? -1
                  : 0;
        if (!step) return;
        event.preventDefault();
        const next = (index + step + PROFILES.length) % PROFILES.length;
        handleProfileChange(PROFILES[next]);
        radios.current[next]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (profile === "partner" && !phoneValid) return;

        const result = schema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof typeof initialData, string>> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof typeof initialData;
                if (!fieldErrors[field]) {
                    fieldErrors[field] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        const payload: Record<string, string> = {
            profile: ct.profiles[profile],
            name: formData.name,
            email: formData.email,
            centerName: formData.centerName,
            message: formData.message,
        };

        if (profile === "school") {
            payload.students = formData.students;
            payload.stages = stages
                .map((s) => ct.profileFields.school.stages[s as (typeof stageKeys)[number]])
                .join(", ");
        } else if (profile === "nursery") {
            payload.children = formData.children;
            payload.classrooms = formData.classrooms;
        } else if (profile === "group") {
            payload.centers = formData.centers;
            payload.students = formData.students;
        } else if (profile === "academy") {
            payload.students = formData.students;
            payload.teachingType = formData.teachingType;
        } else if (profile === "partner") {
            payload.phone = formData.phone;
            payload.website = formData.website;
        }

        setStatus("submitting");
        try {
            const response = await fetch(formspreeUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setStatus("success");
                setFormData(initialData);
                setStages([]);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const pf = ct.profileFields;
    const SelectedProfileIcon = profileIcons[profile];

    const isFormValid =
        schema.safeParse(formData).success &&
        (profile !== "partner" ||
            (phoneValid && formData.centerName.trim() !== "" && formData.website.trim() !== ""));

    const centerField = (label: string, className?: string) => (
        <Field id="centerName" label={label} error={errors.centerName} className={className}>
            <Input
                id="centerName"
                name="centerName"
                value={formData.centerName}
                onChange={handleChange}
                aria-invalid={!!errors.centerName}
            />
        </Field>
    );
    const numberField = (
        name: "students" | "children" | "classrooms" | "centers",
        label: string,
    ) => (
        <Field id={name} label={label}>
            <Input
                id={name}
                name={name}
                type="number"
                min="1"
                inputMode="numeric"
                value={formData[name]}
                onChange={handleChange}
            />
        </Field>
    );

    return (
        <div className="ds-form grid min-w-0 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Who is writing, and the other ways in. On a phone the profile is a field in the
                form, so this tile is only the other ways in, and it follows the form. */}
            <aside className="ds-tile order-2 flex min-w-0 flex-col gap-6 p-5 sm:p-8 lg:order-1">
                <div className="hidden flex-col gap-1 px-1 lg:flex">
                    <h2 className="type-title-3 text-ink">{ct.infoTitle}</h2>
                    <p className="type-footnote text-ink-2">{ct.infoSubtitle}</p>
                </div>

                <div
                    className="hidden flex-col gap-1.5 lg:flex"
                    role="radiogroup"
                    aria-label={ct.infoSubtitle}
                >
                    {PROFILES.map((key, index) => {
                        const Icon = profileIcons[key];
                        const selected = profile === key;
                        return (
                            <button
                                key={key}
                                ref={(el) => {
                                    radios.current[index] = el;
                                }}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => handleProfileChange(key)}
                                onKeyDown={(event) => handleRadioKey(event, index)}
                                className={cn(
                                    "cursor-pointer flex items-center gap-3.5 rounded-[1.1rem] p-3 text-left transition-[background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-focus)]",
                                    selected
                                        ? "bg-surface elev-2 ring-1 ring-hairline"
                                        : "hover:bg-fill-2",
                                )}
                            >
                                <span className={cn("ds-app-icon size-10", profileTones[key])}>
                                    <Icon className="size-5" />
                                </span>
                                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <span className="type-callout font-semibold text-ink">
                                        {ct.profiles[key]}
                                    </span>
                                    <span className="type-footnote text-ink-2">
                                        {ct.profileDescriptions[key]}
                                    </span>
                                </span>
                                <span
                                    aria-hidden
                                    className={cn(
                                        "flex size-5 shrink-0 items-center justify-center rounded-full transition-[background-color,box-shadow] duration-300",
                                        selected
                                            ? "bg-ink text-canvas"
                                            : "ring-[1.5px] ring-hairline-strong",
                                    )}
                                >
                                    {selected && <Check className="size-3" strokeWidth={3} />}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-1 border-hairline pt-0 lg:mt-auto lg:border-t lg:pt-5">
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="flex items-center gap-3.5 rounded-[1.1rem] p-3 transition-colors duration-300 hover:bg-fill-2"
                    >
                        <span className="ds-app-icon size-10 bg-sys-blue">
                            <Mail className="size-5" />
                        </span>
                        <span className="flex flex-col gap-0.5">
                            <span className="type-footnote text-ink-2">{ct.emailContactLabel}</span>
                            <span className="type-callout font-semibold text-ink">
                                {CONTACT_EMAIL}
                            </span>
                        </span>
                    </a>
                    <div className="flex items-start gap-3.5 p-3">
                        <span className="ds-app-icon size-10 bg-[#25d366]">
                            <WhatsAppLogo className="size-5 text-white" />
                        </span>
                        <span className="flex flex-col gap-0.5">
                            <span className="type-footnote text-ink-2">WhatsApp</span>
                            {WHATSAPP_NUMBERS.map((number) => (
                                <a
                                    key={number.url}
                                    href={number.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="type-callout font-semibold text-ink transition-colors hover:text-brand-ink"
                                >
                                    {number.display}
                                </a>
                            ))}
                        </span>
                    </div>
                </div>
            </aside>

            {/* The form for that profile. */}
            <div className="ds-tile order-1 min-w-0 p-5 sm:p-10 lg:order-2">
                {status === "success" ? (
                    <div
                        className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-4 text-center sm:min-h-[28rem]"
                        role="status"
                    >
                        <span className="contact-sent flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                            <svg viewBox="0 0 24 24" className="size-8" fill="none" aria-hidden>
                                <path
                                    d="M6 12.5l4 4L18 8.5"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    pathLength={1}
                                />
                            </svg>
                        </span>
                        <p className="type-title-2 text-ink">{ct.successTitle}</p>
                        <p className="max-w-sm type-callout text-ink-2">{ct.successDescription}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                        <ProfileSelect
                            label={ct.infoSubtitle}
                            value={profile}
                            options={PROFILES.map((key) => ({
                                key,
                                name: ct.profiles[key],
                                description: ct.profileDescriptions[key],
                            }))}
                            onChange={handleProfileChange}
                        />
                        <div
                            key={`head-${profile}`}
                            className="hidden items-center gap-3.5 animate-ds-scene-fade-in lg:flex"
                        >
                            <span className={cn("ds-app-icon size-12", profileTones[profile])}>
                                <SelectedProfileIcon className="size-6" />
                            </span>
                            <span className="flex flex-col gap-0.5">
                                <span className="type-title-3 text-ink">
                                    {ct.profiles[profile]}
                                </span>
                                <span className="type-footnote text-ink-2">
                                    {ct.profileDescriptions[profile]}
                                </span>
                            </span>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field id="name" label={ct.nameLabel} error={errors.name}>
                                <Input
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                                    placeholder={ct.namePlaceholder}
                                    value={formData.name}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.name}
                                />
                            </Field>
                            <Field id="email" label={ct.emailLabel} error={errors.email}>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder={ct.emailPlaceholder}
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.email}
                                />
                            </Field>
                        </div>

                        {/* The profile's own fields: they slide in whenever the profile changes. */}
                        <div
                            key={`fields-${profile}`}
                            className="grid gap-5 animate-ds-scene-fade-in"
                        >
                            {profile === "school" && (
                                <>
                                    <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                                        {centerField(pf.school.centerLabel)}
                                        {numberField("students", pf.school.studentsLabel)}
                                    </div>
                                    <fieldset className="flex flex-col gap-2">
                                        <legend className="mb-2 type-footnote font-medium text-ink-2">
                                            {pf.school.stagesLabel}
                                        </legend>
                                        <div className="flex flex-wrap gap-2">
                                            {stageKeys.map((stage) => {
                                                const on = stages.includes(stage);
                                                return (
                                                    <button
                                                        key={stage}
                                                        type="button"
                                                        aria-pressed={on}
                                                        onClick={() => toggleStage(stage)}
                                                        className={cn(
                                                            "cursor-pointer flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.9375rem] font-medium transition-[background-color,color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-focus)]",
                                                            on
                                                                ? "bg-ink text-canvas"
                                                                : "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--ds-hairline)] hover:shadow-[inset_0_0_0_1px_var(--ds-hairline-strong)]",
                                                        )}
                                                    >
                                                        {on && (
                                                            <Check
                                                                className="size-3.5"
                                                                strokeWidth={3}
                                                            />
                                                        )}
                                                        {pf.school.stages[stage]}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </fieldset>
                                </>
                            )}

                            {profile === "nursery" && (
                                <>
                                    {centerField(pf.nursery.centerLabel)}
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        {numberField("children", pf.nursery.childrenLabel)}
                                        {numberField("classrooms", pf.nursery.classroomsLabel)}
                                    </div>
                                </>
                            )}

                            {profile === "group" && (
                                <>
                                    {centerField(pf.group.centerLabel)}
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        {numberField("centers", pf.group.centersLabel)}
                                        {numberField("students", pf.group.studentsLabel)}
                                    </div>
                                </>
                            )}

                            {profile === "academy" && (
                                <>
                                    <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                                        {centerField(pf.academy.centerLabel)}
                                        {numberField("students", pf.academy.studentsLabel)}
                                    </div>
                                    <Field id="teachingType" label={pf.academy.typeLabel}>
                                        <Input
                                            id="teachingType"
                                            name="teachingType"
                                            placeholder={pf.academy.typePlaceholder}
                                            value={formData.teachingType}
                                            onChange={handleChange}
                                        />
                                    </Field>
                                </>
                            )}

                            {profile === "partner" && (
                                <>
                                    {centerField(pf.partner.centerLabel)}
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Field id="phone" label={ct.phoneLabel}>
                                            <PhoneInput
                                                name="phone"
                                                value={formData.phone}
                                                onChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        phone: value,
                                                    }))
                                                }
                                                onValidationChange={setPhoneValid}
                                                invalidMessage={(country) =>
                                                    ct.phoneInvalid.replace("{country}", country)
                                                }
                                            />
                                        </Field>
                                        <Field id="website" label={pf.partner.websiteLabel}>
                                            <Input
                                                id="website"
                                                name="website"
                                                type="url"
                                                placeholder={ct.websitePlaceholder}
                                                value={formData.website}
                                                onChange={handleChange}
                                            />
                                        </Field>
                                    </div>
                                </>
                            )}
                        </div>

                        <Field id="message" label={ct.messageLabel} error={errors.message}>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder={ct.messagePlaceholder}
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                aria-invalid={!!errors.message}
                            />
                        </Field>

                        {status === "error" && (
                            <p
                                className="flex items-center gap-2 rounded-[0.9rem] bg-red-50 px-4 py-3 type-callout text-red-700 dark:bg-red-500/15 dark:text-red-300"
                                role="alert"
                            >
                                <AlertCircle className="size-4 shrink-0" aria-hidden />
                                {ct.errorDescription}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="ds-btn ds-btn--primary ds-btn--lg mt-1 w-full disabled:pointer-events-none disabled:opacity-35"
                            disabled={status === "submitting" || !isFormValid}
                        >
                            {status === "submitting" ? (
                                <svg viewBox="0 0 24 24" className="animate-spin" aria-hidden>
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray="40 60"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ) : (
                                <Send aria-hidden />
                            )}
                            {status === "submitting" ? ct.submitting : ct.submit}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
