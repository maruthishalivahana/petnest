"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExtendDatesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (days: number) => void;
    loading?: boolean;
}

// Predefined extension periods
const EXTENSION_PRESETS = [
    { label: "1 Week", value: 7 },
    { label: "2 Weeks", value: 14 },
    { label: "1 Month", value: 30 },
    { label: "2 Months", value: 60 },
    { label: "3 Months", value: 90 },
    { label: "6 Months", value: 180 },
    { label: "1 Year", value: 365 },
    { label: "Custom", value: 0 },
];

export default function ExtendDatesDialog({
    open,
    onOpenChange,
    onConfirm,
    loading = false,
}: ExtendDatesDialogProps) {
    const [selectedPreset, setSelectedPreset] = useState<string>("30");
    const [customDays, setCustomDays] = useState<string>("");
    const [error, setError] = useState<string>("");

    const isCustom = selectedPreset === "0";
    const daysToExtend = isCustom ? parseInt(customDays) || 0 : parseInt(selectedPreset);

    const handleConfirm = () => {
        // Validation
        if (daysToExtend <= 0) {
            setError("Please enter a valid number of days (greater than 0)");
            return;
        }

        if (daysToExtend > 3650) {
            setError("Extension period cannot exceed 10 years (3650 days)");
            return;
        }

        setError("");
        onConfirm(daysToExtend);
    };

    const handlePresetChange = (value: string) => {
        setSelectedPreset(value);
        setError("");
    };

    const handleCustomDaysChange = (value: string) => {
        // Only allow numbers
        const numericValue = value.replace(/\D/g, "");
        setCustomDays(numericValue);
        setError("");
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!loading) {
            onOpenChange(newOpen);
            // Reset state when closing
            if (!newOpen) {
                setSelectedPreset("30");
                setCustomDays("");
                setError("");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Extend Advertisement Dates
                    </DialogTitle>
                    <DialogDescription>
                        Extend the expiration dates for all active advertisements in the system.
                        This will add the specified number of days to each ad&apos;s end date.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Info Alert */}
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            This action will affect <strong>all active advertisements</strong> in the
                            system. Use carefully.
                        </AlertDescription>
                    </Alert>

                    {/* Extension Period Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="extension-period">Extension Period</Label>
                        <Select value={selectedPreset} onValueChange={handlePresetChange}>
                            <SelectTrigger id="extension-period">
                                <SelectValue placeholder="Select extension period" />
                            </SelectTrigger>
                            <SelectContent>
                                {EXTENSION_PRESETS.map((preset) => (
                                    <SelectItem key={preset.value} value={preset.value.toString()}>
                                        {preset.label}
                                        {preset.value > 0 && ` (${preset.value} days)`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Custom Days Input */}
                    {isCustom && (
                        <div className="space-y-2">
                            <Label htmlFor="custom-days">Number of Days</Label>
                            <Input
                                id="custom-days"
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter number of days"
                                value={customDays}
                                onChange={(e) => handleCustomDaysChange(e.target.value)}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Maximum: 3650 days (10 years)
                            </p>
                        </div>
                    )}

                    {/* Summary */}
                    {daysToExtend > 0 && (
                        <div className="rounded-lg bg-muted p-4">
                            <div className="flex items-start gap-2">
                                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Extension Summary</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        All advertisements will be extended by{" "}
                                        <strong className="text-foreground">{daysToExtend} days</strong>
                                        {daysToExtend >= 30 && (
                                            <span> ({Math.round(daysToExtend / 30)} months)</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={loading || daysToExtend <= 0}>
                        {loading ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Extending...
                            </>
                        ) : (
                            <>
                                <Calendar className="mr-2 h-4 w-4" />
                                Extend Dates
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
