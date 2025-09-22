import * as LucideIcons from "lucide-react";

interface IconProps {
    name: string;
    size?: number;
    className?: string;
}

export default function Icon({ name, size = 20, className }: IconProps) {
    const IconComponent = (LucideIcons as any)[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in Lucide icons`);
        return null;
    }

    return <IconComponent size={size} className={className} />;
}
