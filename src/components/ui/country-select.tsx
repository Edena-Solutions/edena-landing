import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface Country {
    code: string;
    name: string;
}

export const countries: Country[] = [
    { code: "AD", name: "Andorra" },
    { code: "AE", name: "Emiratos Árabes Unidos" },
    { code: "AF", name: "Afganistán" },
    { code: "AG", name: "Antigua y Barbuda" },
    { code: "AI", name: "Anguila" },
    { code: "AL", name: "Albania" },
    { code: "AM", name: "Armenia" },
    { code: "AO", name: "Angola" },
    { code: "AR", name: "Argentina" },
    { code: "AS", name: "Samoa Americana" },
    { code: "AT", name: "Austria" },
    { code: "AU", name: "Australia" },
    { code: "AW", name: "Aruba" },
    { code: "AZ", name: "Azerbaiyán" },
    { code: "BA", name: "Bosnia y Herzegovina" },
    { code: "BB", name: "Barbados" },
    { code: "BD", name: "Bangladesh" },
    { code: "BE", name: "Bélgica" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BG", name: "Bulgaria" },
    { code: "BH", name: "Baréin" },
    { code: "BI", name: "Burundi" },
    { code: "BJ", name: "Benín" },
    { code: "BM", name: "Bermudas" },
    { code: "BN", name: "Brunéi" },
    { code: "BO", name: "Bolivia" },
    { code: "BR", name: "Brasil" },
    { code: "BS", name: "Bahamas" },
    { code: "BT", name: "Bután" },
    { code: "BW", name: "Botsuana" },
    { code: "BY", name: "Bielorrusia" },
    { code: "BZ", name: "Belice" },
    { code: "CA", name: "Canadá" },
    { code: "CD", name: "República Democrática del Congo" },
    { code: "CF", name: "República Centroafricana" },
    { code: "CG", name: "República del Congo" },
    { code: "CH", name: "Suiza" },
    { code: "CI", name: "Costa de Marfil" },
    { code: "CK", name: "Islas Cook" },
    { code: "CL", name: "Chile" },
    { code: "CM", name: "Camerún" },
    { code: "CN", name: "China" },
    { code: "CO", name: "Colombia" },
    { code: "CR", name: "Costa Rica" },
    { code: "CU", name: "Cuba" },
    { code: "CV", name: "Cabo Verde" },
    { code: "CW", name: "Curazao" },
    { code: "CY", name: "Chipre" },
    { code: "CZ", name: "Chequia" },
    { code: "DE", name: "Alemania" },
    { code: "DJ", name: "Yibuti" },
    { code: "DK", name: "Dinamarca" },
    { code: "DM", name: "Dominica" },
    { code: "DO", name: "República Dominicana" },
    { code: "DZ", name: "Argelia" },
    { code: "EC", name: "Ecuador" },
    { code: "EE", name: "Estonia" },
    { code: "EG", name: "Egipto" },
    { code: "ER", name: "Eritrea" },
    { code: "ES", name: "España" },
    { code: "ET", name: "Etiopía" },
    { code: "FI", name: "Finlandia" },
    { code: "FJ", name: "Fiyi" },
    { code: "FK", name: "Islas Malvinas" },
    { code: "FM", name: "Micronesia" },
    { code: "FO", name: "Islas Feroe" },
    { code: "FR", name: "Francia" },
    { code: "GA", name: "Gabón" },
    { code: "GB", name: "Reino Unido" },
    { code: "GD", name: "Granada" },
    { code: "GE", name: "Georgia" },
    { code: "GG", name: "Guernsey" },
    { code: "GH", name: "Ghana" },
    { code: "GI", name: "Gibraltar" },
    { code: "GL", name: "Groenlandia" },
    { code: "GM", name: "Gambia" },
    { code: "GN", name: "Guinea" },
    { code: "GQ", name: "Guinea Ecuatorial" },
    { code: "GR", name: "Grecia" },
    { code: "GT", name: "Guatemala" },
    { code: "GU", name: "Guam" },
    { code: "GW", name: "Guinea-Bisáu" },
    { code: "GY", name: "Guyana" },
    { code: "HK", name: "Hong Kong" },
    { code: "HN", name: "Honduras" },
    { code: "HR", name: "Croacia" },
    { code: "HT", name: "Haití" },
    { code: "HU", name: "Hungría" },
    { code: "ID", name: "Indonesia" },
    { code: "IE", name: "Irlanda" },
    { code: "IL", name: "Israel" },
    { code: "IM", name: "Isla de Man" },
    { code: "IN", name: "India" },
    { code: "IQ", name: "Irak" },
    { code: "IR", name: "Irán" },
    { code: "IS", name: "Islandia" },
    { code: "IT", name: "Italia" },
    { code: "JE", name: "Jersey" },
    { code: "JM", name: "Jamaica" },
    { code: "JO", name: "Jordania" },
    { code: "JP", name: "Japón" },
    { code: "KE", name: "Kenia" },
    { code: "KG", name: "Kirguistán" },
    { code: "KH", name: "Camboya" },
    { code: "KI", name: "Kiribati" },
    { code: "KM", name: "Comoras" },
    { code: "KP", name: "Corea del Norte" },
    { code: "KR", name: "Corea del Sur" },
    { code: "KW", name: "Kuwait" },
    { code: "KY", name: "Islas Caimán" },
    { code: "KZ", name: "Kazajistán" },
    { code: "LA", name: "Laos" },
    { code: "LB", name: "Líbano" },
    { code: "LC", name: "Santa Lucía" },
    { code: "LI", name: "Liechtenstein" },
    { code: "LK", name: "Sri Lanka" },
    { code: "LR", name: "Liberia" },
    { code: "LS", name: "Lesoto" },
    { code: "LT", name: "Lituania" },
    { code: "LU", name: "Luxemburgo" },
    { code: "LV", name: "Letonia" },
    { code: "LY", name: "Libia" },
    { code: "MA", name: "Marruecos" },
    { code: "MC", name: "Mónaco" },
    { code: "MD", name: "Moldavia" },
    { code: "ME", name: "Montenegro" },
    { code: "MG", name: "Madagascar" },
    { code: "MH", name: "Islas Marshall" },
    { code: "MK", name: "Macedonia del Norte" },
    { code: "ML", name: "Mali" },
    { code: "MM", name: "Myanmar" },
    { code: "MN", name: "Mongolia" },
    { code: "MO", name: "Macao" },
    { code: "MR", name: "Mauritania" },
    { code: "MS", name: "Montserrat" },
    { code: "MT", name: "Malta" },
    { code: "MU", name: "Mauricio" },
    { code: "MV", name: "Maldivas" },
    { code: "MW", name: "Malaui" },
    { code: "MX", name: "México" },
    { code: "MY", name: "Malasia" },
    { code: "MZ", name: "Mozambique" },
    { code: "NA", name: "Namibia" },
    { code: "NC", name: "Nueva Caledonia" },
    { code: "NE", name: "Níger" },
    { code: "NG", name: "Nigeria" },
    { code: "NI", name: "Nicaragua" },
    { code: "NL", name: "Países Bajos" },
    { code: "NO", name: "Noruega" },
    { code: "NP", name: "Nepal" },
    { code: "NR", name: "Nauru" },
    { code: "NZ", name: "Nueva Zelanda" },
    { code: "OM", name: "Omán" },
    { code: "PA", name: "Panamá" },
    { code: "PE", name: "Perú" },
    { code: "PF", name: "Polinesia Francesa" },
    { code: "PG", name: "Papúa Nueva Guinea" },
    { code: "PH", name: "Filipinas" },
    { code: "PK", name: "Pakistán" },
    { code: "PL", name: "Polonia" },
    { code: "PR", name: "Puerto Rico" },
    { code: "PS", name: "Palestina" },
    { code: "PT", name: "Portugal" },
    { code: "PW", name: "Palaos" },
    { code: "PY", name: "Paraguay" },
    { code: "QA", name: "Catar" },
    { code: "RO", name: "Rumania" },
    { code: "RS", name: "Serbia" },
    { code: "RU", name: "Rusia" },
    { code: "RW", name: "Ruanda" },
    { code: "SA", name: "Arabia Saudí" },
    { code: "SB", name: "Islas Salomón" },
    { code: "SC", name: "Seychelles" },
    { code: "SD", name: "Sudán" },
    { code: "SE", name: "Suecia" },
    { code: "SG", name: "Singapur" },
    { code: "SI", name: "Eslovenia" },
    { code: "SK", name: "Eslovaquia" },
    { code: "SL", name: "Sierra Leona" },
    { code: "SM", name: "San Marino" },
    { code: "SN", name: "Senegal" },
    { code: "SO", name: "Somalia" },
    { code: "SR", name: "Surinam" },
    { code: "SS", name: "Sudán del Sur" },
    { code: "SV", name: "El Salvador" },
    { code: "SX", name: "Sint Maarten" },
    { code: "SY", name: "Siria" },
    { code: "SZ", name: "Esuatini" },
    { code: "TD", name: "Chad" },
    { code: "TG", name: "Togo" },
    { code: "TH", name: "Tailandia" },
    { code: "TJ", name: "Tayikistán" },
    { code: "TL", name: "Timor Oriental" },
    { code: "TM", name: "Turkmenistán" },
    { code: "TN", name: "Túnez" },
    { code: "TO", name: "Tonga" },
    { code: "TR", name: "Turquía" },
    { code: "TT", name: "Trinidad y Tobago" },
    { code: "TV", name: "Tuvalu" },
    { code: "TW", name: "Taiwán" },
    { code: "TZ", name: "Tanzania" },
    { code: "UA", name: "Ucrania" },
    { code: "UG", name: "Uganda" },
    { code: "US", name: "Estados Unidos" },
    { code: "UY", name: "Uruguay" },
    { code: "UZ", name: "Uzbekistán" },
    { code: "VE", name: "Venezuela" },
    { code: "VN", name: "Vietnam" },
    { code: "VU", name: "Vanuatu" },
    { code: "WS", name: "Samoa" },
    { code: "YE", name: "Yemen" },
    { code: "ZA", name: "Sudáfrica" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabue" },
];

const getFlagUrl = (countryCode: string): string => {
    return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
};

interface CountrySelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
}

export const CountrySelect = React.forwardRef<HTMLButtonElement, CountrySelectProps>(
    (
        {
            value,
            onValueChange,
            placeholder = "Seleccionar país",
            searchPlaceholder = "Buscar país",
            emptyMessage = "No se encontró ningún país.",
            disabled,
            className,
        },
        ref,
    ) => {
        const [open, setOpen] = React.useState(false);

        const selectedCountry = React.useMemo(
            () => countries.find((country) => country.code === value),
            [value],
        );

        const handleSelect = React.useCallback(
            (countryCode: string) => {
                onValueChange?.(countryCode === value ? "" : countryCode);
                setOpen(false);
            },
            [value, onValueChange],
        );

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="secondary"
                        role="combobox"
                        aria-expanded={open}
                        aria-label={placeholder}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between font-normal",
                            !selectedCountry && "text-muted-foreground",
                            className,
                        )}
                    >
                        <div className="flex items-center gap-2">
                            {selectedCountry ? (
                                <>
                                    <img
                                        src={getFlagUrl(selectedCountry.code)}
                                        alt={selectedCountry.name}
                                        className="w-5 h-4 rounded-xs object-cover"
                                        loading="lazy"
                                    />
                                    <span className="truncate">{selectedCountry.name}</span>
                                </>
                            ) : (
                                <span>{placeholder}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {countries.map((country) => (
                                    <CommandItem
                                        key={country.code}
                                        value={`${country.code} ${country.name}`}
                                        onSelect={() => handleSelect(country.code)}
                                    >
                                        <div className="flex items-center gap-2 flex-1 cursor-pointer">
                                            <img
                                                src={getFlagUrl(country.code)}
                                                alt={country.name}
                                                className="w-5 h-4 rounded-xs object-cover"
                                                loading="lazy"
                                            />
                                            <span className="flex-1">{country.name}</span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-2 h-4 w-4 shrink-0",
                                                value === country.code
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    },
);

CountrySelect.displayName = "CountrySelect";
