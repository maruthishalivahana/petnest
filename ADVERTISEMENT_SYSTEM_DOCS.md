# Advertisement System Documentation

## Overview
This advertisement system allows you to display dynamic advertisements from your backend on public pages (before-login screens). It includes a carousel banner for the homepage and a detailed grid view for a dedicated advertisements page.

## Files Created

### 1. **Advertisement Service** (`src/services/advertisementApi.ts`)
Handles all API calls related to advertisements:
- `fetchApprovedAdvertisements()` - Fetches all approved ads
- `fetchHomepageBanners()` - Fetches homepage banner ads
- `submitAdvertisementRequest()` - Submit new ad request

### 2. **AdBanner Component** (`src/components/landing/AdBanner.tsx`)
Updated carousel component that:
- Fetches approved homepage banners from backend
- Displays them in an auto-rotating carousel
- Falls back to default ads if none available
- Shows loading state while fetching

### 3. **AdvertisementDisplay Component** (`src/components/landing/AdvertisementDisplay.tsx`)
Grid display showing detailed ad information:
- Brand name and message
- Contact information (email, phone)
- Advertisement image
- Creation date
- Call-to-action button

### 4. **Advertisements Page** (`src/app/(public-pages)/advertisements/page.tsx`)
Public page displaying all advertisements with navigation

## Backend API Expected Format

Your backend should return data in this format:

```typescript
{
    "message": "Advertisement request submitted successfully",
    "data": {
        "_id": "695bcc37051e6863e2c99f56",
        "brandName": "PetNest Foods",
        "contactEmail": "info@petnestfoods.com",
        "contactNumber": "+91 9876543210",
        "adSpot": "homepageBanner",
        "isApproved": true,
        "message": "Healthy food for happy pets!",
        "mediaUrl": "https://example.com/image.jpg",
        "createdAt": "2026-01-05T14:35:35.349Z",
        "updatedAt": "2026-01-05T14:35:35.349Z",
        "__v": 0
    }
}
```

## Usage Examples

### 1. Homepage Banner (Already Integrated)
The `AdBanner` component is already used in your home page. To add it to any page:

```tsx
import AdBanner from '@/components/landing/AdBanner';

export default function Page() {
    return (
        <div>
            <AdBanner />
            {/* Other content */}
        </div>
    );
}
```

### 2. Detailed Advertisement Grid
Add the advertisement grid to any page:

```tsx
import AdvertisementDisplay from '@/components/landing/AdvertisementDisplay';

export default function Page() {
    return (
        <div>
            <AdvertisementDisplay />
        </div>
    );
}
```

### 3. Dedicated Advertisements Page
Access the full advertisements page at:
```
http://localhost:3000/advertisements
```

## Environment Variables Required

Make sure you have this environment variable set in your `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

## Backend API Endpoints Needed

Your backend should implement these endpoints:

1. **Get Approved Advertisements**
   ```
   GET /v1/api/advertisements?isApproved=true&adSpot=homepageBanner
   ```
   Returns: Array of approved advertisements

2. **Submit Advertisement Request** (optional - for sellers)
   ```
   POST /v1/api/ads/request/advertisement
   ```
   Body:
   ```json
   {
       "brandName": "string",
       "contactEmail": "string",
       "contactNumber": "string",
       "adSpot": "string",
       "message": "string",
       "mediaUrl": "string"
   }
   ```

## Features

### AdBanner Features:
- ✅ Auto-rotating carousel (5 second intervals)
- ✅ Pause on hover
- ✅ Navigation arrows (desktop)
- ✅ Dot indicators
- ✅ Responsive design
- ✅ Loading state
- ✅ Fallback to default ads
- ✅ Smooth animations
- ✅ Image optimization

### AdvertisementDisplay Features:
- ✅ Grid layout (responsive)
- ✅ Contact information display
- ✅ Creation date
- ✅ Featured badge
- ✅ Click to view details
- ✅ Loading skeletons
- ✅ Empty state handling
- ✅ Hover effects

## Customization

### Change Carousel Autoplay Speed
In `AdBanner.tsx`, modify the `delay` value:
```tsx
Autoplay({
    delay: 5000, // Change to desired milliseconds
    stopOnInteraction: true,
})
```

### Change Gradient Colors
In `AdBanner.tsx`, modify the `gradients` array:
```tsx
const gradients = [
    "from-orange-600/80 via-orange-500/60 to-transparent",
    "from-blue-600/80 via-blue-500/60 to-transparent",
    // Add your custom gradients
];
```

### Modify Grid Layout
In `AdvertisementDisplay.tsx`, change the grid columns:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Change lg:grid-cols-3 to desired column count */}
</div>
```

## Integration with Existing Pages

### Add to Coming Soon Page
Edit `src\components\landing\comingsoon.tsx`:
```tsx
import AdBanner from '@/components/landing/AdBanner';

// Add anywhere in your component
<section>
    <AdBanner />
</section>
```

### Add to Main Landing Page
Edit `src\app\page.tsx`:
```tsx
import AdBanner from '@/components/landing/AdBanner';
import AdvertisementDisplay from '@/components/landing/AdvertisementDisplay';

export default function Home() {
    return (
        <div>
            <AdBanner />
            <AdvertisementDisplay />
        </div>
    );
}
```

## Troubleshooting

### Ads Not Showing
1. Check if backend is returning `isApproved: true`
2. Verify `NEXT_PUBLIC_BASE_URL` environment variable
3. Check browser console for errors
4. Verify backend endpoint is accessible

### Images Not Loading
1. Ensure `mediaUrl` is a valid image URL
2. Check CORS settings on image host
3. Add domain to Next.js image config if using external images:
   ```js
   // next.config.ts
   images: {
       domains: ['your-image-domain.com'],
   }
   ```

### TypeScript Errors
Run:
```bash
npm run type-check
```

## Testing

Test the components:
```bash
# Navigate to advertisements page
http://localhost:3000/advertisements

# Check home page with banner
http://localhost:3000/home
```

## Future Enhancements
- [ ] Add ad click tracking
- [ ] Add ad impression analytics
- [ ] Add animation preferences
- [ ] Add video ad support
- [ ] Add ad scheduling
- [ ] Add geographic targeting
- [ ] Add A/B testing support

## Support
For issues or questions, check:
- Backend API documentation
- Next.js documentation
- Component source code comments
