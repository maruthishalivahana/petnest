import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ListingsLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Search and Filters Skeleton */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </Card>

            {/* Status Filters Skeleton */}
            <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-24" />
                ))}
            </div>

            {/* Listings Table/Cards Skeleton */}
            <Card>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-lg" />
                                <Skeleton className="h-5 w-32 flex-1" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-slate-200">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <Skeleton className="h-20 w-20 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-6 w-28 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
