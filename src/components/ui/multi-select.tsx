import { useState, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
    value: string;
    label: string;
    searchText?: string;
    content?: React.ReactNode;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
    showSelectAll?: boolean;
    selectAllLabel?: string;
}

export const MultiSelect = ({
    options,
    value,
    onValueChange,
    placeholder = "Seleccionar opciones",
    searchPlaceholder = "Buscar",
    emptyMessage = "No hay opciones disponibles",
    disabled = false,
    className,
    showSelectAll = false,
    selectAllLabel = "Seleccionar todo",
}: MultiSelectProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        const cleanSearch = search.toLowerCase().trim();
        return options.filter((option) => {
            const searchText = option.searchText || option.label || "";
            return searchText.toLowerCase().includes(cleanSearch);
        });
    }, [options, search]);

    const handleSelect = (selectedValue: string) => {
        if (disabled) return;
        if (value.includes(selectedValue)) {
            onValueChange(value.filter((v) => v !== selectedValue));
        } else {
            onValueChange([...value, selectedValue]);
        }
    };

    const handleRemove = (valueToRemove: string) => {
        if (disabled) return;
        onValueChange(value.filter((v) => v !== valueToRemove));
    };

    const selectedOptions = options.filter((option) => value.includes(option.value));

    const allOptionValues = useMemo(() => options.map((option) => option.value), [options]);
    const allSelected =
        allOptionValues.length > 0 &&
        allOptionValues.every((optionValue) => value.includes(optionValue));
    const someSelected = value.length > 0 && !allSelected;

    const handleSelectAll = () => {
        if (disabled) return;
        onValueChange(allSelected ? [] : allOptionValues);
    };

    return (
        <Popover open={open && !disabled} onOpenChange={disabled ? () => {} : setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between bg-secondary h-fit min-h-9 py-2.5",
                        value.length === 0 && "text-muted-foreground/80",
                        className,
                    )}
                >
                    <div className="flex flex-wrap gap-1 flex-1">
                        {value.length === 0
                            ? placeholder
                            : selectedOptions.map((option) => (
                                  <Badge
                                      key={option.value}
                                      className="flex items-center gap-1 pr-1.5"
                                  >
                                      {option.label}
                                      <button
                                          type="button"
                                          onClick={() => handleRemove(option.value)}
                                          className="ml-0.5 rounded cursor-pointer"
                                          aria-label={`Remove ${option.label}`}
                                      >
                                          <X className="h-2.5 w-2.5" />
                                      </button>
                                  </Badge>
                              ))}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {showSelectAll && options.length > 0 && (
                            <CommandItem
                                value="__select_all__"
                                onSelect={handleSelectAll}
                                className="cursor-pointer"
                            >
                                <Checkbox
                                    checked={someSelected ? "indeterminate" : allSelected}
                                    className="dark:border-gray-600"
                                />
                                {selectAllLabel}
                            </CommandItem>
                        )}
                        {filteredOptions.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => handleSelect(option.value)}
                                className="cursor-pointer"
                            >
                                <Checkbox
                                    checked={value.includes(option.value)}
                                    className="dark:border-gray-600"
                                />
                                {option.content || option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
