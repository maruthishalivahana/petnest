'use client';

/**
 * EXAMPLE: How to use WishlistButton in different scenarios
 * This file demonstrates various use cases for the WishlistButton component
 */

import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Sample pet data
const samplePet = {
    _id: '123456',
    name: 'Golden Retriever Puppy',
    breedName: 'Golden Retriever',
    age: '3 months',
    price: 35000,
    location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    images: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24'],
    isVerified: true,
    currency: 'INR',
};

export default function WishlistExamplesPage() {
    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-12">

                <div>
                    <h1 className="text-4xl font-bold mb-2">Wishlist Button Examples</h1>
                    <p className="text-muted-foreground">
                        Different ways to integrate the WishlistButton component
                    </p>
                </div>

                {/* Example 1: Icon Only (Default) */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Icon Only (Default)</h2>
                    <p className="text-muted-foreground mb-4">
                        Perfect for overlaying on images or tight spaces
                    </p>
                    <div className="flex gap-4 items-center">
                        <WishlistButton petId={samplePet._id} pet={samplePet} />
                        <code className="text-sm bg-muted px-3 py-1 rounded">
                            {`<WishlistButton petId={pet._id} pet={pet} />`}
                        </code>
                    </div>
                </section>

                {/* Example 2: With Text */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Button with Text</h2>
                    <p className="text-muted-foreground mb-4">
                        Great for prominent call-to-action buttons
                    </p>
                    <div className="flex flex-col gap-4">
                        <WishlistButton
                            petId={samplePet._id}
                            pet={samplePet}
                            variant="default"
                            showText={true}
                        />
                        <code className="text-sm bg-muted px-3 py-2 rounded">
                            {`<WishlistButton petId={pet._id} pet={pet} variant="default" showText={true} />`}
                        </code>
                    </div>
                </section>

                {/* Example 3: Custom Styled */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Custom Styled</h2>
                    <p className="text-muted-foreground mb-4">
                        Customize size, colors, and appearance
                    </p>
                    <div className="flex gap-4 items-center flex-wrap">
                        {/* Large */}
                        <WishlistButton
                            petId={samplePet._id}
                            className="h-14 w-14"
                            iconClassName="w-7 h-7"
                        />

                        {/* Small */}
                        <WishlistButton
                            petId={samplePet._id}
                            className="h-8 w-8"
                            iconClassName="w-4 h-4"
                        />

                        {/* Colored */}
                        <WishlistButton
                            petId={samplePet._id}
                            className="h-10 w-10 bg-red-50 hover:bg-red-100"
                            iconClassName="w-5 h-5"
                        />
                    </div>
                    <code className="text-sm bg-muted px-3 py-2 rounded block mt-4">
                        {`<WishlistButton className="h-14 w-14" iconClassName="w-7 h-7" />`}
                    </code>
                </section>

                {/* Example 4: In a Product Card */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Inside Product Card</h2>
                    <p className="text-muted-foreground mb-4">
                        Real-world example in a pet listing card
                    </p>

                    <Card className="max-w-sm overflow-hidden">
                        <div className="relative aspect-[4/3]">
                            <Image
                                src={samplePet.images[0]}
                                alt={samplePet.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />

                            {/* Badge */}
                            {samplePet.isVerified && (
                                <Badge className="absolute top-3 left-3">Verified</Badge>
                            )}

                            {/* Wishlist Button */}
                            <div className="absolute top-3 right-3">
                                <WishlistButton petId={samplePet._id} pet={samplePet} />
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-xl">{samplePet.name}</h3>
                            <p className="text-muted-foreground">{samplePet.breedName}</p>
                            <p className="text-2xl font-bold text-primary mt-2">
                                ₹{samplePet.price.toLocaleString()}
                            </p>
                        </div>
                    </Card>

                    <pre className="text-xs bg-muted px-4 py-3 rounded mt-4 overflow-x-auto">
                        {`<div className="relative">
  <Image src={pet.images[0]} ... />
  
  <div className="absolute top-3 right-3">
    <WishlistButton petId={pet._id} pet={pet} />
  </div>
</div>`}
                    </pre>
                </section>

                {/* Example 5: Grid Layout */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Multiple Items in Grid</h2>
                    <p className="text-muted-foreground mb-4">
                        How it looks with multiple pet cards
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="relative aspect-video bg-muted">
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        Pet Image {i}
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <WishlistButton petId={`pet-${i}`} />
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-semibold">Pet Name {i}</h4>
                                    <p className="text-sm text-muted-foreground">Breed Type</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Example 6: List View */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">6. In List View</h2>
                    <p className="text-muted-foreground mb-4">
                        Horizontal layout with text variant
                    </p>

                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold">Pet Name {i}</h4>
                                        <p className="text-sm text-muted-foreground">Breed • Age • Location</p>
                                    </div>
                                    <WishlistButton
                                        petId={`pet-list-${i}`}
                                        variant="default"
                                        showText={true}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Redux Integration Example */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Redux Integration</h2>
                    <p className="text-muted-foreground mb-4">
                        How to access wishlist state in your components
                    </p>

                    <pre className="text-sm bg-muted px-4 py-3 rounded overflow-x-auto">
                        {`import { useAppSelector } from '@/store/hooks';

function MyComponent() {
  // Get all wishlist items
  const items = useAppSelector(state => state.wishlist.items);
  
  // Get wishlist IDs for quick lookup
  const ids = useAppSelector(state => state.wishlist.wishlistedIds);
  
  // Check if specific pet is wishlisted
  const isWishlisted = ids.has(petId);
  
  return (
    <div>
      <p>Wishlist: {items.length} items</p>
      {isWishlisted && <Badge>❤️ Wishlisted</Badge>}
    </div>
  );
}`}
                    </pre>
                </section>

                {/* API Usage Example */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">8. Direct API Usage</h2>
                    <p className="text-muted-foreground mb-4">
                        Using the API service directly (without component)
                    </p>

                    <pre className="text-sm bg-muted px-4 py-3 rounded overflow-x-auto">
                        {`import { addToWishlist, getWishlistItems } from '@/services/wishlistApi';

async function handleCustomAction() {
  try {
    // Add to wishlist
    const result = await addToWishlist(petId);
    console.log(result.message);
    
    // Fetch all items
    const items = await getWishlistItems();
    console.log('Total:', items.length);
    
  } catch (error) {
    console.error(error.message);
  }
}`}
                    </pre>
                </section>

                {/* Navigation Example */}
                <section className="border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-4">Navigation to Wishlist Page</h2>
                    <p className="text-muted-foreground mb-4">
                        Add this link to your navigation menu
                    </p>

                    <a
                        href="/wishlist"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        ❤️ View My Wishlist
                    </a>

                    <pre className="text-sm bg-muted px-4 py-3 rounded mt-4">
                        {`<Link href="/wishlist">
  <Button>
    <Heart className="w-4 h-4 mr-2" />
    My Wishlist
  </Button>
</Link>`}
                    </pre>
                </section>

            </div>
        </div>
    );
}
