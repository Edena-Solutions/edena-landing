import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import gsap from "gsap";
import {
    School,
    Baby,
    Network,
    GraduationCap,
    Handshake,
    Mail,
    MapPin,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { translations } from "@/i18n/index.ts";
import { WHATSAPP_NUMBERS } from "@/constants/contact";

interface Props {
    lang: string;
    formspreeUrl: string;
}

type Profile = "school" | "nursery" | "group" | "academy" | "partner";

const profileIcons = {
    school: School,
    nursery: Baby,
    group: Network,
    academy: GraduationCap,
    partner: Handshake,
} as const;

/** Colors follow the module cards in PricingModules.tsx */
const profileIconColors: Record<Profile, string> = {
    school: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    nursery: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    group: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
    academy: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    partner: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
};

const stageKeys = ["infantil", "primaria", "eso", "bachillerato", "fp"] as const;

const CONTACT_EMAIL = "hola@edena.es";

function WhatsAppLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill="currentColor"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
            />
        </svg>
    );
}

export function ContactForm({ lang, formspreeUrl }: Props) {
    const t = translations[lang as keyof typeof translations];
    const ct = t.contact;

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
    const formRef = useRef<HTMLFormElement>(null);

    const prefersReducedMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** Animate the profile-dependent fields in whenever the profile changes */
    useEffect(() => {
        const form = formRef.current;
        if (!form || prefersReducedMotion()) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                "[data-profile-anim]",
                { autoAlpha: 0, y: 14 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.06,
                    ease: "power3.out",
                    clearProps: "all",
                },
            );
        }, form);
        return () => ctx.revert();
    }, [profile]);

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
        const targets = formRef.current?.querySelectorAll("[data-profile-anim]");
        if (!targets?.length || prefersReducedMotion()) {
            setProfile(next);
            setErrors({});
            return;
        }
        gsap.killTweensOf(targets);
        gsap.to(targets, {
            autoAlpha: 0,
            y: 6,
            duration: 0.15,
            stagger: 0.02,
            ease: "power2.in",
            onComplete: () => {
                setProfile(next);
                setErrors({});
            },
        });
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

    return (
        <div className="grid overflow-hidden rounded bg-card md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Left panel */}
            <div className="relative flex flex-col gap-6 p-6 md:pr-3">
                <div className="relative z-10 flex flex-col gap-1">
                    <h2 className="text-xs font-bold uppercase tracking-widest">{ct.infoTitle}</h2>
                    <p className="text-xs text-muted-foreground">{ct.infoSubtitle}</p>
                </div>

                <div
                    className="relative z-10 grid md:grid-cols-2 gap-2"
                    role="radiogroup"
                    aria-label={ct.infoSubtitle}
                >
                    {(Object.keys(profileIcons) as Profile[]).map((key) => {
                        const Icon = profileIcons[key];
                        const selected = profile === key;
                        return (
                            <div
                                key={key}
                                className={cn(
                                    "group cursor-pointer relative w-full overflow-hidden rounded-[0.3em] bg-background p-[2px] transition-all duration-300 ease-in-out hover-gradient-primary hover:bg-gradient-to-r",
                                    key === "partner" && "md:col-span-2",
                                )}
                                onClick={() => handleProfileChange(key)}
                            >
                                <div className="group-hover:animate-spin-slow invisible absolute -top-40 -bottom-40 left-10 right-10 bg-gradient-to-r from-transparent via-white/90 to-transparent group-hover:visible" />
                                <Card
                                    role="radio"
                                    aria-checked={selected}
                                    tabIndex={0}
                                    className="relative rounded flex flex-col gap-2 p-4 h-full bg-background"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleProfileChange(key);
                                        }
                                    }}
                                >
                                    {selected && (
                                        <span className="absolute top-4 right-4 flex size-3 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in fade-in zoom-in-75 duration-200">
                                            <Check className="size-2" />
                                        </span>
                                    )}
                                    <div className="flex gap-2">
                                        <div
                                            className={cn(
                                                "flex w-fit p-3 rounded h-fit",
                                                profileIconColors[key],
                                            )}
                                        >
                                            <Icon className="size-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="uppercase tracking-widest text-[10px] font-semibold">
                                                {ct.profiles[key]}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {ct.profileDescriptions[key]}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                </div>

                <div className="relative z-10 mt-auto flex flex-col gap-4 border-t border-primary/20 pt-6">
                    <div className="flex items-center gap-2">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded bg-background">
                            <Mail className="size-5" />
                        </span>
                        <div className="text-sm">
                            <p className="text-[10px] uppercase tracking-widest">
                                {ct.emailContactLabel}
                            </p>
                            <p className="text-muted-foreground">{CONTACT_EMAIL}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded bg-background">
                            <WhatsAppLogo className="size-5 text-foreground" />
                        </span>
                        <div className="text-sm">
                            <p className="text-[10px] uppercase tracking-widest">WhatsApp</p>
                            {WHATSAPP_NUMBERS.map((number) => (
                                <a
                                    key={number.url}
                                    href={number.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {number.display}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded bg-background">
                            <MapPin className="size-5" />
                        </span>
                        <div className="text-sm">
                            <p className="text-[10px] uppercase tracking-widest">
                                {ct.locationLabel}
                            </p>
                            <p className="text-muted-foreground">{ct.locationValue}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="p-6 md:pl-3">
                {status === "success" ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 rounded bg-secondary p-6 text-center">
                        <p className="text-lg font-semibold">{ct.successTitle}</p>
                        <p className="text-sm text-muted-foreground">{ct.successDescription}</p>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
                        <div className="flex gap-2" data-profile-anim>
                            <div
                                className={cn("flex w-fit p-3 rounded", profileIconColors[profile])}
                            >
                                <SelectedProfileIcon className="size-5" />
                            </div>
                            <div>
                                <h3 className="uppercase tracking-widest text-[10px] font-semibold">
                                    {ct.profiles[profile]}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {ct.profileDescriptions[profile]}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="name">{ct.nameLabel}</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder={ct.namePlaceholder}
                                value={formData.name}
                                onChange={handleChange}
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">{ct.emailLabel}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={ct.emailPlaceholder}
                                value={formData.email}
                                onChange={handleChange}
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Profile-specific fields */}
                        {profile === "school" && (
                            <>
                                <div
                                    className="grid gap-2 sm:grid-cols-[2fr_1fr]"
                                    data-profile-anim
                                >
                                    <div className="space-y-1.5">
                                        <Label htmlFor="centerName">{pf.school.centerLabel}</Label>
                                        <Input
                                            id="centerName"
                                            name="centerName"
                                            value={formData.centerName}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.centerName}
                                        />
                                        {errors.centerName && (
                                            <p className="text-xs text-destructive">
                                                {errors.centerName}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="students">{pf.school.studentsLabel}</Label>
                                        <Input
                                            id="students"
                                            name="students"
                                            type="number"
                                            min="1"
                                            value={formData.students}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5" data-profile-anim>
                                    <Label>{pf.school.stagesLabel}</Label>
                                    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                                        {stageKeys.map((stage) => (
                                            <label
                                                key={stage}
                                                className="flex cursor-pointer items-center gap-2 text-sm"
                                            >
                                                <Checkbox
                                                    checked={stages.includes(stage)}
                                                    onCheckedChange={() => toggleStage(stage)}
                                                />
                                                {pf.school.stages[stage]}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {profile === "nursery" && (
                            <>
                                <div className="space-y-1.5" data-profile-anim>
                                    <Label htmlFor="centerName">{pf.nursery.centerLabel}</Label>
                                    <Input
                                        id="centerName"
                                        name="centerName"
                                        value={formData.centerName}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.centerName}
                                    />
                                    {errors.centerName && (
                                        <p className="text-xs text-destructive">
                                            {errors.centerName}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2" data-profile-anim>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="children">{pf.nursery.childrenLabel}</Label>
                                        <Input
                                            id="children"
                                            name="children"
                                            type="number"
                                            min="1"
                                            value={formData.children}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="classrooms">
                                            {pf.nursery.classroomsLabel}
                                        </Label>
                                        <Input
                                            id="classrooms"
                                            name="classrooms"
                                            type="number"
                                            min="1"
                                            value={formData.classrooms}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {profile === "group" && (
                            <>
                                <div className="space-y-1.5" data-profile-anim>
                                    <Label htmlFor="centerName">{pf.group.centerLabel}</Label>
                                    <Input
                                        id="centerName"
                                        name="centerName"
                                        value={formData.centerName}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.centerName}
                                    />
                                    {errors.centerName && (
                                        <p className="text-xs text-destructive">
                                            {errors.centerName}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2" data-profile-anim>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="centers">{pf.group.centersLabel}</Label>
                                        <Input
                                            id="centers"
                                            name="centers"
                                            type="number"
                                            min="1"
                                            value={formData.centers}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="students">{pf.group.studentsLabel}</Label>
                                        <Input
                                            id="students"
                                            name="students"
                                            type="number"
                                            min="1"
                                            value={formData.students}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {profile === "academy" && (
                            <>
                                <div
                                    className="grid gap-2 sm:grid-cols-[2fr_1fr]"
                                    data-profile-anim
                                >
                                    <div className="space-y-1.5">
                                        <Label htmlFor="centerName">{pf.academy.centerLabel}</Label>
                                        <Input
                                            id="centerName"
                                            name="centerName"
                                            value={formData.centerName}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.centerName}
                                        />
                                        {errors.centerName && (
                                            <p className="text-xs text-destructive">
                                                {errors.centerName}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="students">{pf.academy.studentsLabel}</Label>
                                        <Input
                                            id="students"
                                            name="students"
                                            type="number"
                                            min="1"
                                            value={formData.students}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5" data-profile-anim>
                                    <Label htmlFor="teachingType">{pf.academy.typeLabel}</Label>
                                    <Input
                                        id="teachingType"
                                        name="teachingType"
                                        placeholder={pf.academy.typePlaceholder}
                                        value={formData.teachingType}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {profile === "partner" && (
                            <>
                                <div className="space-y-1.5" data-profile-anim>
                                    <Label htmlFor="centerName">{pf.partner.centerLabel}</Label>
                                    <Input
                                        id="centerName"
                                        name="centerName"
                                        value={formData.centerName}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.centerName}
                                    />
                                    {errors.centerName && (
                                        <p className="text-xs text-destructive">
                                            {errors.centerName}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5" data-profile-anim>
                                    <Label htmlFor="phone">{ct.phoneLabel}</Label>
                                    <PhoneInput
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(value) =>
                                            setFormData((prev) => ({ ...prev, phone: value }))
                                        }
                                        onValidationChange={setPhoneValid}
                                        invalidMessage={(country) =>
                                            ct.phoneInvalid.replace("{country}", country)
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5" data-profile-anim>
                                    <Label htmlFor="website">{pf.partner.websiteLabel}</Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        type="url"
                                        placeholder={ct.websitePlaceholder}
                                        value={formData.website}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="message">{ct.messageLabel}</Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder={ct.messagePlaceholder}
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                aria-invalid={!!errors.message}
                            />
                            {errors.message && (
                                <p className="text-xs text-destructive">{errors.message}</p>
                            )}
                        </div>

                        {status === "error" && (
                            <p className="text-sm text-destructive">{ct.errorDescription}</p>
                        )}

                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            disabled={status === "submitting" || !isFormValid}
                        >
                            {status === "submitting" ? ct.submitting : ct.submit}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
