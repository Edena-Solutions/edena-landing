import { Users, Calendar, Wallet, MessageSquare, Check, FileText } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import GSAPSection from "@/components/ui/gsap-section";
import type { Translation } from "@/i18n";

interface Props {
    t: Translation;
}

export default function Features({ t }: Props) {
    const features = [
        {
            icon: <Users size={20} />,
            title: t.features.studentManagement.title,
            description: t.features.studentManagement.tagline,
        },
        {
            icon: <Calendar size={20} />,
            title: t.features.classScheduling.title,
            description: t.features.classScheduling.tagline,
        },
        {
            icon: <Wallet size={20} />,
            title: t.features.financeManagement.title,
            description: t.features.financeManagement.tagline,
        },
        {
            icon: <MessageSquare size={20} />,
            title: t.features.parentCommunication.title,
            description: t.features.parentCommunication.tagline,
        },
        {
            icon: <Check size={20} />,
            title: t.features.studentAttendance.title,
            description: t.features.studentAttendance.tagline,
        },
        {
            icon: <FileText size={20} />,
            title: t.features.invoices.title,
            description: t.features.invoices.tagline,
        },
    ];

    return (
        <GSAPSection className="flex flex-col gap-16 items-center">
            <div className="flex flex-col gap-3 text-center px-4">
                <h2 className="text-3xl font-bold">{t.features.title}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">{t.features.description}</p>
            </div>
            <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
                {features.map((feature, index) => (
                    <Card key={index} className="rounded flex flex-col p-6 bg-gray-50">
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
