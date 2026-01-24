import { Card, CardHeader, CardContent } from "@/components/ui/card";
import GSAPSection from "@/components/ui/gsap-section";
import Icon from "@/components/ui/icon";
import type { Translation } from "@/i18n";

interface Props {
    t: Translation;
    features: {
        icon: string;
        title: string;
        description: string;
        navigateTo: string;
    }[];
    title?: string;
    description?: string;
}

export default function Features({ t, features, title, description }: Props) {
    return (
        <GSAPSection className="flex flex-col gap-16 items-center">
            <div className="flex flex-col gap-4 text-center px-4 max-w-2xl">
                <h2 className="text-xl font-bold">{title || t.features.title}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {description || t.features.description}
                </p>
            </div>
            <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="rounded flex flex-col p-6 bg-gray-50 cursor-pointer"
                        onClick={() => (window.location.href = feature.navigateTo)}
                    >
                        <CardHeader className="p-0 flex flex-col">
                            <div className="flex mb-4 text-primary w-fit p-4 rounded bg-white">
                                <Icon name={feature.icon} size={20} />
                            </div>
                            <h3 className="uppercase tracking-widest text-[10px] font-semibold">{feature.title}</h3>
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
