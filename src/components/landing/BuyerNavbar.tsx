
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, Heart, User, PawPrint, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSearchQuery } from '@/store/slices/PetSlice';

export function BuyerNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const searchQuery = useAppSelector((state) => state.pet.searchQuery);

    const navigateToWishlist = () => {
        router.push('/wishlist');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Navigate to home page with search query
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        } else {
            params.delete('search');
        }
        router.push(`/home?${params.toString()}`);
    };


    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
            <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
                {/* Main Navbar Row */}
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo - Responsive sizing */}
                    <button className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <PawPrint className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="text-primary font-semibold text-sm sm:text-base">PetNest</span>
                    </button>

                    {/* Search Bar - Hidden on mobile only */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md mx-4 hidden md:block">
                        <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground pointer-events-none" />
                        <Input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for pets by breed, location..."
                            className="pl-9 lg:pl-12 pr-4 h-10 lg:h-12 w-full rounded-full text-sm lg:text-base"
                        />
                    </form>

                    {/* Desktop/Tablet Actions - Hidden on mobile only */}
                    <div className="hidden md:flex items-center gap-3 xl:gap-4 flex-shrink-0">
                        <Button
                            onClick={navigateToWishlist}
                            variant="ghost"
                            className="gap-2 h-10"
                        >
                            <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                            <span className="hidden xl:inline">Wishlist</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full gap-2 h-10"
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden xl:inline">Profile</span>
                        </Button>
                        {isAuthenticated && (
                            <LogoutButton
                                variant="destructive"
                                className="rounded-full h-10 w-10"
                            />
                        )}
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 md:hidden flex-shrink-0">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Toggle search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar - Expandable */}
                {showMobileSearch && (
                    <div className="py-3 md:hidden">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <Input
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search for pets..."
                                className="pl-9 pr-4 h-10 w-full rounded-full text-sm"
                                autoFocus
                            />
                        </form>
                    </div>
                )}

                {/* Mobile Menu - Improved spacing and touch targets */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-3 sm:py-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 px-2 sm:px-4">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-full gap-2 justify-center h-11 sm:h-12 text-sm sm:text-base"
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </Button>
                                <Button
                                    onClick={navigateToWishlist}
                                    variant="outline"
                                    className="w-full rounded-full gap-2 justify-center h-11 sm:h-12 text-sm sm:text-base"
                                >
                                    <Heart className="w-4 h-4" />
                                    Wishlist
                                </Button>
                                {isAuthenticated && (
                                    <LogoutButton
                                        variant="destructive"
                                        className="w-full rounded-full h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

