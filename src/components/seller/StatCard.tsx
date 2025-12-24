'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
    className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, description, className }: StatCardProps) {
    return (
        <Card className={cn('p-6', className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                    {trend && (
                        <p className="text-xs text-slate-500">
                            <span className={cn('font-medium', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                            {' '}vs last month
                        </p>
                    )}
                    {description && (
                        <p className="text-xs text-slate-500">{description}</p>
                    )}
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
        </Card>
    );
}
