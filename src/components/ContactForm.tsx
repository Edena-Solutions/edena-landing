import { useState } from "react";
import { z } from "zod";
import { School, Baby, Network, GraduationCap, Handshake, Mail, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountrySelect, countries } from "@/components/ui/country-select";
import { translations } from "@/i18n/index.ts";

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

/** Colors follow the module cards in PricingCalculator.tsx */
const profileIconColors: Record<Profile, string> = {
    school: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    nursery: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    group: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
    academy: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    partner: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
};

const stageKeys = ["infantil", "primaria", "eso", "bachillerato", "fp"] as const;

const CONTACT_EMAIL = "hola@edena.es";

export function ContactForm({ lang, formspreeUrl }: Props) {
    const t = translations[lang as keyof typeof translations];
    const ct = t.contact;

    const schema = z.object({
        name: z.string().min(1, ct.nameRequired),
        email: z.string().min(1, ct.emailRequired).email(ct.emailInvalid),
        country: z.string().min(1, ct.countryRequired),
        message: z.string().min(1, ct.messageRequired).min(10, ct.messageMinLength),
    });

    const initialData = {
        name: "",
        email: "",
        phone: "",
        country: "ES",
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
        setProfile(next);
        setErrors({});
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
            country: countries.find((c) => c.code === formData.country)?.name ?? formData.country,
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
            (phoneValid &&
                formData.centerName.trim() !== "" &&
                formData.website.trim() !== ""));

    return (
        <div className="grid overflow-hidden rounded bg-background md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
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
                                    className="relative rounded flex flex-col gap-2 p-4 h-full"
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
                        <span className="flex size-10 shrink-0 items-center justify-center rounded bg-secondary">
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
                        <span className="flex size-10 shrink-0 items-center justify-center rounded bg-secondary">
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
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="flex gap-2">
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

                        <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
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
                            <div className="space-y-1.5">
                                <Label>{ct.countryLabel}</Label>
                                <CountrySelect
                                    value={formData.country}
                                    onValueChange={(code) => {
                                        setFormData((prev) => ({ ...prev, country: code }));
                                        if (errors.country) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                country: undefined,
                                            }));
                                        }
                                    }}
                                    placeholder={ct.countryPlaceholder}
                                    searchPlaceholder={ct.searchPlaceholder}
                                    emptyMessage={ct.noOptions}
                                />
                                {errors.country && (
                                    <p className="text-xs text-destructive">{errors.country}</p>
                                )}
                            </div>
                        </div>

                        {/* Profile-specific fields */}
                        {profile === "school" && (
                            <>
                                <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
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
                                <div className="space-y-1.5">
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
                                <div className="space-y-1.5">
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
                                <div className="grid gap-2 sm:grid-cols-2">
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
                                <div className="space-y-1.5">
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
                                <div className="grid gap-2 sm:grid-cols-2">
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
                                <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
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
                                <div className="space-y-1.5">
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
                                <div className="space-y-1.5">
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
                                <div className="space-y-1.5">
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
                                <div className="space-y-1.5">
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
