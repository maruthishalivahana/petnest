'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentPet, setLoading, setPetError, clearCurrentPet } from '@/store/slices/PetSlice';
import { getPetById } from '@/services/petApi';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility
import AdDetail from '@/components/landing/AdDetail';
import AdMobileSticky from '@/components/landing/AdMobileSticky';
import BuyerFooter from '@/components/landing/BuyerFooter';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Phone,
    Mail,
    ShieldCheck,
    Info,
    PawPrint,
    User,
    CheckCircle2,
    Share2,
    Ruler,
    Weight
} from 'lucide-react';

// --- Sub-Components (Ideally move these to separate files) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PetImageGallery = ({ images, petName, isVerified, petId, currentPet }: any) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const displayImages = images?.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80'];

    return (
        <div className="space-y-4">
            {/* Main Hero Image */}
            <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/50 bg-muted shadow-sm group">
                <Image
                    src={displayImages[selectedIndex]}
                    alt={petName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                    unoptimized
                />

                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {isVerified && (
                        <Badge className="bg-white/90 text-emerald-600 hover:bg-white backdrop-blur-md shadow-sm border-emerald-100 flex gap-1.5 px-3 py-1.5">
                            <ShieldCheck className="w-4 h-4 fill-emerald-100" />
                            <span className="font-semibold">Verified</span>
                        </Badge>
                    )}
                </div>

                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-md rounded-full p-1 shadow-sm hover:scale-105 transition-transform">
                        {/* Passing props correctly to your existing component */}
                        <WishlistButton petId={petId} pet={currentPet} />
                    </div>
                </div>
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {displayImages.map((img: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                                selectedIndex === idx
                                    ? "border-primary ring-2 ring-primary/20 opacity-100"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image src={img} alt={`View ${idx}`} fill className="object-cover" unoptimized />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PetHeaderInfo = ({ pet, formattedPrice, formatLocation }: any) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
                {/* Use breedId.species.category if available, otherwise fallback to category if it's not an ID, or just 'Pet' */}
                <Badge variant="secondary" className="text-primary bg-primary/10 hover:bg-primary/15 font-medium px-3">
                    {pet.breedId?.species?.category || (pet.category && !pet.category.match(/^[0-9a-fA-F]{24}$/) ? pet.category : 'Pet')}
                </Badge>
                {pet.breedName && (
                    <Badge variant="outline" className="text-muted-foreground">
                        {pet.breedName}
                    </Badge>
                )}
            </div>

            <div className="flex justify-between items-start gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    {pet.name}
                </h1>
                <div className="text-right">
                    <p className="text-3xl font-bold text-primary whitespace-nowrap">{formattedPrice}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{formatLocation}</span>
            </div>
        </div>
    </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PetAttributesGrid = ({ pet }: any) => {
    const items = [
        { icon: Calendar, label: "Age", value: pet.age },
        { icon: PawPrint, label: "Gender", value: pet.gender || "Unknown" },
        { icon: Weight, label: "Weight", value: pet.weight },
        { icon: Ruler, label: "Color", value: pet.color },
    ].filter(item => item.value);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                    <item.icon className="w-5 h-5 text-primary mb-2 opacity-80" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{item.label}</span>
                    <span className="text-sm font-semibold text-foreground mt-0.5">{item.value}</span>
                </div>
            ))}
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SellerInfoCard = ({ seller, petId }: any) => (
    <Card className="p-4 md:p-6 bg-card border-border/60 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground font-medium">Published by</p>
                <h3 className="text-lg font-bold truncate">{seller.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {seller.location}
                </div>
            </div>
            {/* Trust Indicator */}
            <div className="hidden sm:flex flex-col items-end">
                <Badge variant="outline" className="gap-1 border-emerald-200 text-emerald-700 bg-emerald-50">
                    <CheckCircle2 className="w-3 h-3" /> Trusted
                </Badge>
            </div>
        </div>

        <Separator className="my-4" />

        {/* WhatsApp Button - Primary CTA */}
        {seller.id && petId && (
            <div className="mb-3">
                <WhatsAppButton
                    sellerId={seller.id}
                    petId={petId}
                    size="lg"
                    fullWidth
                />
            </div>
        )}

        <div className="grid grid-cols-2 gap-3">
            <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = `tel:${seller.phone}`}
                disabled={!seller.phone}
            >
                <Phone className="w-4 h-4 mr-2" />
                Call
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = `mailto:${seller.email}`}
                disabled={!seller.email}
            >
                <Mail className="w-4 h-4 mr-2" />
                Email
            </Button>
        </div>
    </Card>
);

// --- Main Page Component ---

export default function PetDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const petId = params.petId as string;
    const { currentPet, loading, error } = useAppSelector((state) => state.pet);

    useEffect(() => {
        const fetchPetDetails = async () => {
            if (!petId) return;
            if (currentPet && currentPet._id === petId) return;

            dispatch(setLoading(true));
            const response = await getPetById(petId);

            if (response.success && response.data) {
                dispatch(setCurrentPet(response.data));
            } else {
                dispatch(setPetError(response.message));
            }
        };

        fetchPetDetails();
        return () => { dispatch(clearCurrentPet()); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [petId, dispatch]);

    if (loading) return <DetailSkeleton />;
    if (error) return <ErrorView error={error} onBack={() => router.back()} />;
    if (!currentPet) return <ErrorView error="Pet not found" onBack={() => router.back()} />;

    // Helper Logic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatAddress = (loc: any) => {
        if (!loc) return null;
        if (typeof loc === 'string') return loc;
        const parts = [loc.city, loc.state].filter(Boolean); // Shortened for UI clarity
        return parts.join(', ');
    };

    const formatLocation = formatAddress(currentPet.location) || 'Location not specified';

    // Seller Logic
    const getSellerInfo = () => {
        const seller = currentPet.sellerId;
        if (typeof seller === 'object' && seller !== null) {
            // Prioritize brandName if available, then userId.name
            const name = seller.brandName || seller.userId?.name || 'Unknown Seller';

            // Handle location which can be object or string
            const location = formatAddress(seller.location) || formatLocation;

            // Handle contact info
            const email = seller.userId?.email;
            const phone = seller.whatsappNumber || seller.userId?.phone;
            const id = seller._id;

            return { id, name, location, email, phone };
        }
        return {
            id: undefined,
            name: 'Unknown Seller',
            location: formatLocation,
            email: undefined,
            phone: undefined
        };
    };
    const sellerInfo = getSellerInfo();

    // Always use rupee symbol for Indian currency
    const formattedPrice = `₹${(currentPet.price || 0).toLocaleString()}`;

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-12">
            {/* Nav Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back to Search</span>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Gallery & Description (60% width on Desktop) */}
                    <div className="lg:col-span-7 space-y-8">
                        <PetImageGallery
                            images={currentPet.images}
                            petName={currentPet.name}
                            isVerified={currentPet.isVerified}
                            petId={currentPet._id}
                            currentPet={currentPet}
                        />

                        {/* Mobile Only Header (Shows below image on mobile, hidden on desktop) */}
                        <div className="block lg:hidden">
                            <PetHeaderInfo pet={currentPet} formattedPrice={formattedPrice} formatLocation={formatLocation} />
                            <Separator className="my-6" />
                            <PetAttributesGrid pet={currentPet} />
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                About {currentPet.name}
                            </h2>
                            <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                <p>{currentPet.description}</p>
                            </div>

                            {/* Personality Tags */}
                            {currentPet.personality && currentPet.personality.length > 0 && (
                                <div className="pt-4">
                                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Personality</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentPet.personality.map((trait: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="px-4 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground border border-border">
                                                {trait}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Advertisement Below Description */}
                        <AdDetail />

                        <Separator />

                        {/* Health Accordion / Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                Health & Medical
                            </h2>
                            <div className="bg-muted/20 rounded-xl p-4 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Vaccination Status</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        {currentPet.vaccinationInfo ? (
                                            <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vaccinated</>
                                        ) : "Not mentioned"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Health Condition</p>
                                    <p className="font-medium mt-1">{currentPet.healthStatus || "Healthy"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar (40% width on Desktop) */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-24 space-y-6">

                            {/* Desktop Only Header Info */}
                            <div className="hidden lg:block bg-card rounded-3xl p-6 shadow-sm border border-border/50">
                                <PetHeaderInfo pet={currentPet} formattedPrice={formattedPrice} formatLocation={formatLocation} />
                                <div className="mt-6">
                                    <PetAttributesGrid pet={currentPet} />
                                </div>
                            </div>

                            {/* Seller Card */}
                            <SellerInfoCard seller={sellerInfo} petId={currentPet._id} />

                            {/* Desktop Primary Action */}
                            <div className="hidden lg:block p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
                                <div className="text-center space-y-1">
                                    <p className="font-semibold text-lg text-primary">Interested in {currentPet.name}?</p>
                                    <p className="text-sm text-muted-foreground">Contact the seller to arrange a meeting.</p>
                                </div>
                                <Button size="lg" className="w-full text-lg h-14 shadow-lg shadow-primary/20 rounded-xl animate-in fade-in zoom-in duration-300">
                                    Adopt {currentPet.name}
                                </Button>
                            </div>

                            {/* Safety Notice */}
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl flex gap-3 items-start">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                    Always meet the pet and seller in a safe, public place. Never transfer money without seeing the pet first.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Mobile Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-50 lg:hidden safe-area-bottom">
                <div className="flex gap-3 max-w-md mx-auto">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 shrink-0 rounded-xl"
                        onClick={() => sellerInfo.phone && (window.location.href = `tel:${sellerInfo.phone}`)}
                    >
                        <Phone className="w-5 h-5" />
                    </Button>
                    <Button size="lg" className="flex-1 h-12 text-lg rounded-xl shadow-lg shadow-primary/20">
                        Adopt Now
                    </Button>
                </div>
            </div>

            {/* Mobile Sticky Advertisement */}
            <AdMobileSticky />

            {/* Main Footer */}
            <BuyerFooter />
        </div>
    );
}

// --- States ---

function DetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                    <Skeleton className="aspect-square rounded-3xl w-full" />
                    <div className="flex gap-3"><Skeleton className="h-20 w-20 rounded-xl" /><Skeleton className="h-20 w-20 rounded-xl" /></div>
                </div>
                <div className="lg:col-span-5 space-y-6">
                    <Skeleton className="h-40 w-full rounded-3xl" />
                    <Skeleton className="h-60 w-full rounded-3xl" />
                </div>
            </div>
        </div>
    );
}

function ErrorView({ error, onBack }: { error: string, onBack: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
                <div className="bg-destructive/10 text-destructive p-4 rounded-full inline-block">
                    <Info className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Something went wrong</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={onBack}>Go Back</Button>
            </div>
        </div>
    );
}