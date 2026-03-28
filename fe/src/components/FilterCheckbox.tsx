"use client";

import { Check } from "lucide-react";

interface FilterCheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    count?: number;
}

export default function FilterCheckbox({
    id,
    label,
    checked,
    onChange,
    count,
}: FilterCheckboxProps) {
    return (
        <label
            htmlFor={id}
            className="group flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl cursor-pointer hover:bg-accent/5 transition-colors duration-200 select-none"
        >
            {/* Custom Checkbox — 20x20 with visible focus ring */}
            <div className="relative flex items-center justify-center shrink-0">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer sr-only"
                    aria-label={label}
                />
                <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${checked
                            ? "bg-accent border-accent"
                            : "border-border-hover group-hover:border-accent/50"
                        } peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 peer-focus-visible:ring-offset-2`}
                >
                    {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
            </div>

            {/* Label */}
            <span
                className={`text-sm flex-1 transition-colors duration-200 ${checked ? "text-primary font-medium" : "text-muted group-hover:text-primary"
                    }`}
            >
                {label}
            </span>

            {/* Count badge */}
            {count !== undefined && (
                <span
                    className={`text-xs px-1.5 py-0.5 rounded-md transition-colors duration-200 ${checked
                            ? "bg-accent/10 text-accent font-medium"
                            : "bg-slate-100 text-muted"
                        }`}
                >
                    {count}
                </span>
            )}
        </label>
    );
}
