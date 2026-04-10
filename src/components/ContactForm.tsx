import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { translations } from "@/i18n/index.ts";

interface Props {
    lang: string;
}

export function ContactForm({ lang }: Props) {
    const t = translations[lang as keyof typeof translations];
    const ct = t.contact;

    const schema = z.object({
        name: z.string().min(1, ct.nameRequired),
        email: z.string().min(1, ct.emailRequired).email(ct.emailInvalid),
        center: z.string().optional(),
        message: z.string().min(1, ct.messageRequired).min(10, ct.messageMinLength),
    });

    type FormData = z.infer<typeof schema>;

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        center: "",
        message: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = schema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof FormData, string>> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof FormData;
                if (!fieldErrors[field]) {
                    fieldErrors[field] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setStatus("submitting");
        try {
            const response = await fetch(import.meta.env.PUBLIC_FORMSPREE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", center: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="rounded bg-secondary p-6 text-center space-y-2">
                <p className="font-semibold text-lg">{ct.successTitle}</p>
                <p className="text-muted-foreground text-sm">{ct.successDescription}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2 max-w-xl mx-auto">
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
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
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
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="center">{ct.centerLabel}</Label>
                <Input
                    id="center"
                    name="center"
                    placeholder={ct.centerPlaceholder}
                    value={formData.center}
                    onChange={handleChange}
                />
            </div>

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
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>

            {status === "error" && (
                <p className="text-sm text-destructive">{ct.errorDescription}</p>
            )}

            <Button type="submit" className="w-full" disabled={status === "submitting"}>
                {status === "submitting" ? ct.submitting : ct.submit}
            </Button>
        </form>
    );
}
