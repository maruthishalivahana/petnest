import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Profile Completion Skeleton */}
            <Card className="p-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-80" />
                </div>
            </Card>

            {/* Verification Status Skeleton */}
            <Card className="p-6">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-9 w-32 mt-3" />
                    </div>
                </div>
            </Card>

            {/* Profile Form Skeleton */}
            <Card className="p-6">
                <div className="space-y-6">
                    <Skeleton className="h-6 w-48" />

                    {/* Logo Upload Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-32 w-32 rounded-lg" />
                    </div>

                    {/* Form Fields Skeleton */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}

                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </Card>

            {/* Documents Skeleton */}
            <Card className="p-6">
                <Skeleton className="h-6 w-56 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="p-4 border border-slate-200 rounded-lg space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
