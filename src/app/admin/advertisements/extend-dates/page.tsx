"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, ArrowLeft, Info, AlertCircle } from "lucide-react";
import { extendAdDates } from "@/services/admin/adminAdvertisementService";

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

export default function ExtendAdDatesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedPreset, setSelectedPreset] = useState<string>("30");
    const [customDays, setCustomDays] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<{ message: string; count: number } | null>(null);

    const isCustom = selectedPreset === "0";
    const daysToExtend = isCustom ? parseInt(customDays) || 0 : parseInt(selectedPreset);

    const handleExtendDates = async () => {
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
        setSuccess(null);
        setLoading(true);

        try {
            const result = await extendAdDates(daysToExtend);
            setSuccess({
                message: result.message,
                count: result.updatedCount,
            });
            toast({
                title: "Success",
                description: result.message || `Extended ${result.updatedCount} advertisement(s) by ${daysToExtend} days`,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to extend advertisement dates";
            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePresetChange = (value: string) => {
        setSelectedPreset(value);
        setError("");
        setSuccess(null);
    };

    const handleCustomDaysChange = (value: string) => {
        // Only allow numbers
        const numericValue = value.replace(/\D/g, "");
        setCustomDays(numericValue);
        setError("");
        setSuccess(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Extend Advertisement Dates</h1>
                    <p className="text-muted-foreground">
                        Extend the expiration dates for all active advertisements
                    </p>
                </div>
            </div>

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Extension Configuration
                        </CardTitle>
                        <CardDescription>
                            Select the number of days to extend all active advertisements in the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Info Alert */}
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                This action will affect <strong>all active advertisements</strong> in the
                                system. The end date of each ad will be extended by the specified number of days.
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
                        {daysToExtend > 0 && !success && (
                            <div className="rounded-lg bg-muted p-4">
                                <div className="flex items-start gap-2">
                                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">Extension Summary</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            All advertisements will be extended by{" "}
                                            <strong className="text-foreground">{daysToExtend} days</strong>
                                            {daysToExtend >= 30 && (
                                                <span>
                                                    {" "}
                                                    (approximately {Math.round(daysToExtend / 30)} months)
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Display */}
                        {success && (
                            <Alert className="border-green-500 bg-green-50">
                                <Info className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    <strong>Success!</strong> {success.message}
                                    <br />
                                    <span className="text-sm">
                                        {success.count} advertisement(s) were updated.
                                    </span>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Error Display */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleExtendDates}
                                disabled={loading || daysToExtend <= 0}
                                className="flex-1"
                            >
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
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Information */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-lg">How It Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex gap-2">
                            <span className="font-bold text-primary">1.</span>
                            <p>
                                Select a preset extension period or enter a custom number of days.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold text-primary">2.</span>
                            <p>
                                Click &quot;Extend Dates&quot; to apply the extension to all active advertisements.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold text-primary">3.</span>
                            <p>
                                Each advertisement&apos;s end date will be increased by the specified number of days.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold text-primary">4.</span>
                            <p>
                                Only active advertisements are affected. Expired or inactive ads remain unchanged.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
