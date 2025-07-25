import { FileText, Smartphone, FolderOpen, Users, UserCheck, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import GSAPSection from "@/components/ui/gsap-section";
import type { Translation } from "@/i18n";

interface Props {
    t: Translation;
    lang: string;
}

export default function Features({ t, lang }: Props) {
    const features = [
        {
            icon: <FileText size={20} />,
            title: t.features.digitalRecords.title,
            description: t.features.digitalRecords.tagline,
            navigateTo: `/${lang}/students`,
        },
        {
            icon: <Smartphone size={20} />,
            title: t.features.mobileApp.title,
            description: t.features.mobileApp.tagline,
            navigateTo: `/${lang}/app`,
        },
        {
            icon: <FolderOpen size={20} />,
            title: t.features.documentManagement.title,
            description: t.features.documentManagement.tagline,
            navigateTo: `/${lang}/dashboard`,
        },
        {
            icon: <Users size={20} />,
            title: t.features.familyPortal.title,
            description: t.features.familyPortal.tagline,
            navigateTo: `/${lang}/guardians`,
        },
        {
            icon: <UserCheck size={20} />,
            title: t.features.staffManagement.title,
            description: t.features.staffManagement.tagline,
            navigateTo: `/${lang}/dashboard`,
        },
        {
            icon: <Calendar size={20} />,
            title: t.features.calendarIntegration.title,
            description: t.features.calendarIntegration.tagline,
            navigateTo: `/${lang}/dashboard`,
        },
    ];

    return (
        <GSAPSection className="flex flex-col gap-16 items-center">
            <div className="flex flex-col gap-3 text-center px-4 max-w-xl">
                <h2 className="text-3xl font-bold">{t.features.title}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">{t.features.description}</p>
            </div>
            <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="rounded flex flex-col p-6 bg-gray-50 cursor-pointer"
                        onClick={() => (window.location.href = feature.navigateTo)}
                    >
                        <CardHeader className="p-0 flex flex-col">
                            <div className="flex mb-4 text-primary w-fit p-4 rounded bg-white">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </GSAPSection>
    );
}
