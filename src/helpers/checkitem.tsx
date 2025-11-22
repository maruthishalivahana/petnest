import { Check, X } from "lucide-react";

export function CheckItem({ label, valid }: { label: string; valid: boolean }) {
    return (
        <li className="flex items-center gap-2">
            {valid ? (
                <Check className="h-3.5 w-3.5 text-[#424c23] flex-shrink-0" />
            ) : (
                <X className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
            )}
            <span className="text-xs text-foreground/80">{label}</span>
        </li>
    );
}
