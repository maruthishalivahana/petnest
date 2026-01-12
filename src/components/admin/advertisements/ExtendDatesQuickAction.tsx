"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExtendDatesQuickAction() {
    const router = useRouter();

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Extend Ad Dates</CardTitle>
                            <CardDescription className="mt-1">
                                Bulk extend advertisement expiration dates
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    Quickly extend the expiration dates for all active advertisements in the system.
                    Choose from preset periods or enter a custom duration.
                </p>
                <Button
                    onClick={() => router.push('/admin/advertisements/extend-dates')}
                    className="w-full gap-2"
                    variant="default"
                >
                    Extend Dates
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
}
