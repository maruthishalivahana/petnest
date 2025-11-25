"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge"; // Assuming you have this, or use div
import { X, SlidersHorizontal, Check } from "lucide-react";

// Configuration
const categories = ["Dog", "Cat", "Bird", "Others"];
const genders = ["Male", "Female"];
const ages = ["0-3 Months", "3-6 Months", "6-12 Months", "1+ Year"];

export default function FiltersPanel() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Local state for temporary filter selections
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        searchParams.get("category")
    );
    const [selectedGender, setSelectedGender] = useState<string | null>(
        searchParams.get("gender")
    );
    const [selectedAge, setSelectedAge] = useState<string | null>(
        searchParams.get("age")
    );
    const [price, setPrice] = useState([
        Number(searchParams.get("minPrice")) || 1000,
        Number(searchParams.get("maxPrice")) || 50000,
    ]);
    const [open, setOpen] = useState(false);
    const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(true);

    // Sync local state with URL when URL changes externally
    useEffect(() => {
        setSelectedCategory(searchParams.get("category"));
        setSelectedGender(searchParams.get("gender"));
        setSelectedAge(searchParams.get("age"));
        setPrice([
            Number(searchParams.get("minPrice")) || 1000,
            Number(searchParams.get("maxPrice")) || 50000,
        ]);
    }, [searchParams]);

    // Apply all selected filters to URL
    const applyFilters = () => {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedGender) params.set("gender", selectedGender);
        if (selectedAge) params.set("age", selectedAge);
        if (price[0] !== 1000) params.set("minPrice", String(price[0]));
        if (price[1] !== 50000) params.set("maxPrice", String(price[1]));
        router.push(`${pathname}?${params.toString()}`);
        setOpen(false); // Close mobile drawer after applying
        setIsDesktopFilterOpen(false); // Hide desktop filters after applying
    };

    const handleToggle = (filterType: "category" | "gender" | "age", value: string) => {
        switch (filterType) {
            case "category":
                setSelectedCategory(selectedCategory === value ? null : value);
                break;
            case "gender":
                setSelectedGender(selectedGender === value ? null : value);
                break;
            case "age":
                setSelectedAge(selectedAge === value ? null : value);
                break;
        }
    };

    const clearAll = () => {
        // Clear local state
        setSelectedCategory(null);
        setSelectedGender(null);
        setSelectedAge(null);
        setPrice([1000, 50000]);
        // Clear URL
        router.push(pathname);
        // Close filters section
        setOpen(false);
        setIsDesktopFilterOpen(false);
    };

    // --- Reusable UI Components ---

    const FilterSectionHeader = ({ title }: { title: string }) => (
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            {title}
        </h4>
    );

    const SelectableChip = ({
        label,
        isSelected,
        onClick,
    }: {
        label: string;
        isSelected: boolean;
        onClick: () => void;
    }) => (
        <button
            onClick={onClick}
            className={`
                group relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full border
                ${isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                }
            `}
        >
            {isSelected && <Check className="w-3.5 h-3.5" />}
            {label}
        </button>
    );

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Top Row: Categories & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Category - Spans larger area */}
                <div className="md:col-span-7 lg:col-span-8">
                    <FilterSectionHeader title="Category" />
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <SelectableChip
                                key={cat}
                                label={cat}
                                isSelected={selectedCategory === cat}
                                onClick={() => handleToggle("category", cat)}
                            />
                        ))}
                    </div>
                </div>

                {/* Gender */}
                <div className="md:col-span-5 lg:col-span-4">
                    <FilterSectionHeader title="Gender" />
                    <div className="flex flex-wrap gap-2">
                        {genders.map((g) => (
                            <SelectableChip
                                key={g}
                                label={g}
                                isSelected={selectedGender === g}
                                onClick={() => handleToggle("gender", g)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-gray-100 hidden md:block" />

            {/* Bottom Row: Age & Price */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Age */}
                <div className="md:col-span-7 lg:col-span-8">
                    <FilterSectionHeader title="Age Group" />
                    <div className="flex flex-wrap gap-2">
                        {ages.map((age) => (
                            <SelectableChip
                                key={age}
                                label={age}
                                isSelected={selectedAge === age}
                                onClick={() => handleToggle("age", age)}
                            />
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="md:col-span-5 lg:col-span-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <FilterSectionHeader title="Price Range" />
                        <span className="text-xs font-medium text-muted-foreground bg-white px-2 py-1 rounded-md border shadow-sm">
                            ₹{price[0].toLocaleString()} - ₹{price[1].toLocaleString()}
                        </span>
                    </div>
                    <Slider
                        value={price}
                        max={50000}
                        min={1000}
                        step={1000}
                        onValueChange={setPrice}
                        className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>₹1k</span>
                        <span>₹50k+</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Calculate active filters count for the badge
    const activeFiltersCount = [
        searchParams.get("category"),
        searchParams.get("gender"),
        searchParams.get("age"),
        searchParams.get("minPrice") ? "price" : null
    ].filter(Boolean).length;

    return (
        <section className="w-full space-y-4">
            {/* Desktop View */}
            <div className="hidden md:block">
                {/* Toggle Button - Always visible */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDesktopFilterOpen(!isDesktopFilterOpen)}
                    className="w-[200px] mb-3 rounded-xl h-11 border-border bg-card hover:bg-muted transition-all flex items-center justify-between gap-2"
                >
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="font-semibold">
                            {isDesktopFilterOpen ? 'Hide Filters' : 'Show Filters'}
                        </span>
                        {activeFiltersCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {isDesktopFilterOpen ? '▼' : '▶'}
                    </span>
                </Button>

                {/* Collapsible Filter Panel */}
                {isDesktopFilterOpen && (
                    <div className="bg-white rounded-[1.5rem] border shadow-sm p-6 lg:p-8 relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <SlidersHorizontal className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                            </div>
                            {activeFiltersCount > 0 && (

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAll}


                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-3 rounded-full text-xs"
                                >
                                    <X className="w-3 h-3 mr-1.5" />
                                    Clear all
                                </Button>
                            )}
                        </div>

                        <FilterContent />

                        {/* Apply Filters Button */}
                        <div className="mt-6 flex gap-3">
                            <Button
                                onClick={applyFilters}
                                className=" w-[200px] flex-1 rounded-xl h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile View Trigger */}
            <div className="md:hidden">
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-full h-12 border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:border-primary/30 transition-all"
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filter Results
                            {activeFiltersCount > 0 && (
                                <Badge className="ml-2 bg-primary text-white hover:bg-primary h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="rounded-t-[2rem]">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8 mt-4" />
                        <DrawerHeader className="text-left px-6 pt-0">
                            <div className="flex items-center justify-between">
                                <DrawerTitle className="text-2xl font-bold">Filters</DrawerTitle>
                                {activeFiltersCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAll}
                                        className="text-destructive h-auto p-0 hover:bg-transparent"
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                            <DrawerDescription>
                                Refine your search to find the perfect pet.
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="px-6 pb-24 overflow-y-auto max-h-[70vh]">
                            <FilterContent />
                        </div>

                        {/* Sticky Mobile Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t mt-auto">
                            <Button
                                className="w-full rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/20"
                                onClick={applyFilters}
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </section>
    );
}