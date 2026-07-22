import React, { useState, useEffect, useRef } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Country {
    code: string;
    name: string;
    prefix: string;
    flag: string;
    placeholder: string;
    validation: RegExp;
    format: (value: string) => string;
}

const countries: Country[] = [
    {
        code: "ES",
        name: "España",
        prefix: "+34",
        flag: "https://flagcdn.com/es.svg",
        placeholder: "612 345 678",
        validation: /^[679]\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "FR",
        name: "Francia",
        prefix: "+33",
        flag: "https://flagcdn.com/fr.svg",
        placeholder: "1 23 45 67 89",
        validation: /^[1-9]\d{8}$/,
        format: (value: string) =>
            value.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5"),
    },
    {
        code: "DE",
        name: "Alemania",
        prefix: "+49",
        flag: "https://flagcdn.com/de.svg",
        placeholder: "30 12345678",
        validation: /^\d{10,11}$/,
        format: (value: string) => value.replace(/(\d{2,4})(\d{7,8})/, "$1 $2"),
    },
    {
        code: "IT",
        name: "Italia",
        prefix: "+39",
        flag: "https://flagcdn.com/it.svg",
        placeholder: "312 345 6789",
        validation: /^3\d{8,9}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"),
    },
    {
        code: "PT",
        name: "Portugal",
        prefix: "+351",
        flag: "https://flagcdn.com/pt.svg",
        placeholder: "912 345 678",
        validation: /^9[1236]\d{7}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "BE",
        name: "Bélgica",
        prefix: "+32",
        flag: "https://flagcdn.com/be.svg",
        placeholder: "470 12 34 56",
        validation: /^4\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4"),
    },
    {
        code: "NL",
        name: "Países Bajos",
        prefix: "+31",
        flag: "https://flagcdn.com/nl.svg",
        placeholder: "6 12345678",
        validation: /^6\d{8}$/,
        format: (value: string) => value.replace(/(\d{1})(\d{8})/, "$1 $2"),
    },
    {
        code: "AT",
        name: "Austria",
        prefix: "+43",
        flag: "https://flagcdn.com/at.svg",
        placeholder: "664 123456",
        validation: /^6\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{6})/, "$1 $2"),
    },
    {
        code: "SE",
        name: "Suecia",
        prefix: "+46",
        flag: "https://flagcdn.com/se.svg",
        placeholder: "70 123 45 67",
        validation: /^7[02-9]\d{7}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4"),
    },
    {
        code: "FI",
        name: "Finlandia",
        prefix: "+358",
        flag: "https://flagcdn.com/fi.svg",
        placeholder: "40 123 4567",
        validation: /^4\d{8}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3"),
    },
    {
        code: "DK",
        name: "Dinamarca",
        prefix: "+45",
        flag: "https://flagcdn.com/dk.svg",
        placeholder: "12 34 56 78",
        validation: /^\d{8}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4"),
    },
    {
        code: "IE",
        name: "Irlanda",
        prefix: "+353",
        flag: "https://flagcdn.com/ie.svg",
        placeholder: "85 123 4567",
        validation: /^8[3-9]\d{7}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3"),
    },
    {
        code: "PL",
        name: "Polonia",
        prefix: "+48",
        flag: "https://flagcdn.com/pl.svg",
        placeholder: "512 345 678",
        validation: /^[4-9]\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "CZ",
        name: "Chequia",
        prefix: "+420",
        flag: "https://flagcdn.com/cz.svg",
        placeholder: "601 234 567",
        validation: /^[67]\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "SK",
        name: "Eslovaquia",
        prefix: "+421",
        flag: "https://flagcdn.com/sk.svg",
        placeholder: "901 234 567",
        validation: /^9\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "HU",
        name: "Hungría",
        prefix: "+36",
        flag: "https://flagcdn.com/hu.svg",
        placeholder: "20 123 4567",
        validation: /^[237][0-9]\d{7}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3"),
    },
    {
        code: "RO",
        name: "Rumanía",
        prefix: "+40",
        flag: "https://flagcdn.com/ro.svg",
        placeholder: "712 345 678",
        validation: /^7\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "BG",
        name: "Bulgaria",
        prefix: "+359",
        flag: "https://flagcdn.com/bg.svg",
        placeholder: "87 123 4567",
        validation: /^8[7-9]\d{7}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3"),
    },
    {
        code: "HR",
        name: "Croacia",
        prefix: "+385",
        flag: "https://flagcdn.com/hr.svg",
        placeholder: "91 234 5678",
        validation: /^9[1-8]\d{7}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3"),
    },
    {
        code: "SI",
        name: "Eslovenia",
        prefix: "+386",
        flag: "https://flagcdn.com/si.svg",
        placeholder: "31 234 567",
        validation: /^[3-7]\d{7}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "LT",
        name: "Lituania",
        prefix: "+370",
        flag: "https://flagcdn.com/lt.svg",
        placeholder: "612 34567",
        validation: /^6\d{7}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{5})/, "$1 $2"),
    },
    {
        code: "LV",
        name: "Letonia",
        prefix: "+371",
        flag: "https://flagcdn.com/lv.svg",
        placeholder: "21 234 567",
        validation: /^2\d{7}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "EE",
        name: "Estonia",
        prefix: "+372",
        flag: "https://flagcdn.com/ee.svg",
        placeholder: "512 3456",
        validation: /^5\d{6,7}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{4})/, "$1 $2"),
    },
    {
        code: "LU",
        name: "Luxemburgo",
        prefix: "+352",
        flag: "https://flagcdn.com/lu.svg",
        placeholder: "621 123 456",
        validation: /^6\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
    },
    {
        code: "MT",
        name: "Malta",
        prefix: "+356",
        flag: "https://flagcdn.com/mt.svg",
        placeholder: "9912 3456",
        validation: /^[79]\d{7}$/,
        format: (value: string) => value.replace(/(\d{4})(\d{4})/, "$1 $2"),
    },
    {
        code: "CY",
        name: "Chipre",
        prefix: "+357",
        flag: "https://flagcdn.com/cy.svg",
        placeholder: "96 123456",
        validation: /^9[6-9]\d{6}$/,
        format: (value: string) => value.replace(/(\d{2})(\d{6})/, "$1 $2"),
    },
    {
        code: "EL",
        name: "Grecia",
        prefix: "+30",
        flag: "https://flagcdn.com/gr.svg",
        placeholder: "694 123 4567",
        validation: /^6[89]\d{8}$/,
        format: (value: string) => value.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"),
    },
];

interface PhoneInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    name?: string;
    onValidationChange?: (isValid: boolean) => void;
    disabled?: boolean;
    className?: string;
    showValidation?: boolean;
    invalidMessage?: (countryName: string) => string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        {
            value = "",
            onChange,
            onBlur,
            name,
            onValidationChange,
            disabled,
            className,
            showValidation = true,
            invalidMessage = (countryName: string) =>
                `Número de teléfono inválido para ${countryName}`,
        },
        ref
    ) => {
        const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
        const [phoneNumber, setPhoneNumber] = useState("");
        const [isValid, setIsValid] = useState(true);
        const onValidationChangeRef = useRef(onValidationChange);
        const lastValidRef = useRef<boolean | null>(null);

        useEffect(() => {
            onValidationChangeRef.current = onValidationChange;
        }, [onValidationChange]);

        useEffect(() => {
            if (value) {
                const country = countries.find((c) => value.startsWith(c.prefix));
                if (country) {
                    setSelectedCountry(country);
                    setPhoneNumber(value.slice(country.prefix.length).trim());
                } else {
                    setPhoneNumber(value);
                }
            } else {
                setPhoneNumber("");
            }
        }, [value]);

        useEffect(() => {
            const cleanPhone = phoneNumber.replace(/\s/g, "");
            const valid = cleanPhone === "" || selectedCountry.validation.test(cleanPhone);
            setIsValid(valid);

            if (lastValidRef.current !== valid) {
                lastValidRef.current = valid;
                onValidationChangeRef.current?.(valid);
            }
        }, [phoneNumber, selectedCountry]);

        const handleCountryChange = (countryCode: string) => {
            const country = countries.find((c) => c.code === countryCode);
            if (country) {
                setSelectedCountry(country);
                const cleanPhone = phoneNumber.replace(/\s/g, "");
                const formattedPhone = cleanPhone ? country.format(cleanPhone) : "";
                setPhoneNumber(formattedPhone);

                const fullNumber = formattedPhone
                    ? `${country.prefix} ${formattedPhone}`
                    : country.prefix;
                onChange?.(fullNumber);
            }
        };

        const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let phone = e.target.value;

            phone = phone.replace(/[^\d\s]/g, "");

            const cleanPhone = phone.replace(/\s/g, "");
            if (cleanPhone) {
                phone = selectedCountry.format(cleanPhone);
            }

            setPhoneNumber(phone);
            const fullNumber = phone
                ? `${selectedCountry.prefix} ${phone}`
                : selectedCountry.prefix;
            onChange?.(fullNumber);
        };

        return (
            <div className={cn("flex flex-col", className)}>
                <div className="flex">
                    <Select
                        value={selectedCountry.code}
                        onValueChange={handleCountryChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className="w-[120px] rounded-r-none border-r-0">
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={selectedCountry.flag}
                                        alt={selectedCountry.name}
                                        className="w-5 h-4 rounded-xs object-cover"
                                    />
                                    <span className="text-sm">{selectedCountry.prefix}</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={country.flag}
                                            alt={country.name}
                                            className="w-5 h-4 rounded-xs object-cover"
                                        />
                                        <span className="text-sm">{country.prefix}</span>
                                        <span className="text-sm text-gray-600">
                                            {country.name}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        ref={ref}
                        type="tel"
                        name={name}
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        onBlur={onBlur}
                        placeholder={selectedCountry.placeholder}
                        disabled={disabled}
                        className={cn(
                            "rounded-l-none",
                            showValidation &&
                                !isValid &&
                                phoneNumber &&
                                "border-red-500 focus:ring-red-500"
                        )}
                    />
                </div>
                {showValidation && !isValid && phoneNumber && (
                    <span className="text-sm text-red-600 mt-1">
                        {invalidMessage(selectedCountry.name)}
                    </span>
                )}
            </div>
        );
    }
);

PhoneInput.displayName = "PhoneInput";
