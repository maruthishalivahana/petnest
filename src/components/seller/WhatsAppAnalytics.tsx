"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, TrendingUp, PawPrint, BarChart3 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface WhatsAppAnalyticsProps {
    totalClicks: number;
    petAnalytics?: Array<{
        petId: string;
        petName: string;
        whatsappClicks: number;
    }>;
}

export function WhatsAppAnalytics({ totalClicks = 0, petAnalytics = [] }: WhatsAppAnalyticsProps) {
    // Generate chart data
    const chartData = petAnalytics
        .sort((a, b) => b.whatsappClicks - a.whatsappClicks)
        .slice(0, 10) // Top 10 pets
        .map(pet => ({
            name: pet.petName.length > 15 ? pet.petName.substring(0, 15) + '...' : pet.petName,
            clicks: pet.whatsappClicks
        }));

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total WhatsApp Clicks
                        </CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{totalClicks}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All-time clicks across all pets
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Listed Pets
                        </CardTitle>
                        <PawPrint className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{petAnalytics.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active pet listings
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg. Clicks per Pet
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {petAnalytics.length > 0
                                ? (totalClicks / petAnalytics.length).toFixed(1)
                                : '0'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Average engagement rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            WhatsApp Clicks by Pet
                        </CardTitle>
                        <CardDescription>
                            Top performing pets based on WhatsApp engagement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                    <Bar dataKey="clicks" radius={[8, 8, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pet List */}
            <Card>
                <CardHeader>
                    <CardTitle>Pet Performance Details</CardTitle>
                    <CardDescription>
                        Individual WhatsApp engagement for each pet
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {petAnalytics.length > 0 ? (
                        <div className="space-y-4">
                            {petAnalytics
                                .sort((a, b) => b.whatsappClicks - a.whatsappClicks)
                                .map((pet) => (
                                    <div
                                        key={pet.petId}
                                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <PawPrint className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{pet.petName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Pet ID: {pet.petId.slice(-6)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-lg font-semibold text-green-600">
                                                {pet.whatsappClicks}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                clicks
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No WhatsApp engagement data yet</p>
                            <p className="text-sm mt-2">
                                Start getting clicks when buyers contact you
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
