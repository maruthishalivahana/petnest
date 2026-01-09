# 🎯 Advertisement Display System - Quick Start Guide

## 📋 What Was Created

I've built a complete advertisement display system for your PetNest application that shows dynamic ads from your backend on public (before-login) pages.

## 🎨 Components Overview

### 1. **Banner Carousel** - Full-width rotating ads
- Auto-rotating carousel with your backend ads
- Displays: Brand name, message, images
- Located: Homepage, any public page
- Falls back to default ads if none available

### 2. **Grid Display** - Detailed ad cards
- Shows all ad information including contact details
- Grid layout with hover effects
- Perfect for dedicated ads page

### 3. **Dedicated Ads Page** - `/advertisements`
- Full page showing all advertisements
- Includes banner + grid display
- Public access (no login required)

## 🚀 How to Use

### Option 1: Add Banner to Your Current Homepage

Replace your current `src/app/page.tsx` with:

```tsx
import AdBanner from "@/components/landing/AdBanner";
import ComingSoon from "@/components/landing/comingsoon";

export default function Home() {
  return (
    <>
      <AdBanner />
      <ComingSoon />
    </>
  );
}
```

### Option 2: View Dedicated Advertisements Page

Visit: `http://localhost:3000/advertisements`

This page already includes:
- Navigation bar with login/signup
- Banner carousel
- Grid of all advertisements
- Footer

### Option 3: Add to Coming Soon Page

Edit `src/components/landing/comingsoon.tsx` and add:

```tsx
import AdBanner from '@/components/landing/AdBanner';

// Inside your component, add this section
<section className="mb-12">
    <AdBanner />
</section>
```

## 📊 Data Flow

```
Your Backend API
       ↓
advertisementApi.ts (fetches data)
       ↓
AdBanner Component (displays in carousel)
       OR
AdvertisementDisplay Component (displays in grid)
```

## 🔧 Backend Requirements

Your backend should have an endpoint that returns approved ads:

**Endpoint:** `GET /v1/api/advertisements?isApproved=true&adSpot=homepageBanner`

**Response Format:**
```json
{
    "message": "Success",
    "data": [
        {
            "_id": "695bcc37051e6863e2c99f56",
            "brandName": "PetNest Foods",
            "contactEmail": "info@petnestfoods.com",
            "contactNumber": "+91 9876543210",
            "adSpot": "homepageBanner",
            "isApproved": true,
            "message": "Healthy food for happy pets!",
            "mediaUrl": "https://example.com/image.jpg",
            "createdAt": "2026-01-05T14:35:35.349Z",
            "updatedAt": "2026-01-05T14:35:35.349Z"
        }
    ]
}
```

## 📁 Files Created

```
src/
├── services/
│   └── advertisementApi.ts          # API calls for advertisements
├── components/
│   └── landing/
│       ├── AdBanner.tsx              # Updated carousel banner
│       └── AdvertisementDisplay.tsx  # New grid display component
└── app/
    └── (public-pages)/
        └── advertisements/
            └── page.tsx              # New dedicated ads page
```

## ✨ Features Included

### AdBanner (Carousel)
- ✅ Auto-rotation every 5 seconds
- ✅ Pause on hover
- ✅ Navigation arrows (desktop)
- ✅ Dot indicators
- ✅ Responsive design (mobile-friendly)
- ✅ Loading state with spinner
- ✅ Fallback ads if backend empty
- ✅ Smooth animations

### AdvertisementDisplay (Grid)
- ✅ Card-based layout
- ✅ Shows brand name, message
- ✅ Contact info (phone, email)
- ✅ Creation date
- ✅ Featured badge
- ✅ Click to view details
- ✅ Loading skeletons
- ✅ Empty state handling
- ✅ Hover effects

## 🎯 Quick Test

1. **Make sure your backend is running**
2. **Ensure environment variable is set:**
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:8080
   ```
3. **Visit one of these URLs:**
   - Homepage with banner: `http://localhost:3000`
   - Dedicated ads page: `http://localhost:3000/advertisements`

## 📱 Responsive Design

The components work on all screen sizes:
- **Mobile**: Single column, stacked layout
- **Tablet**: 2 columns in grid
- **Desktop**: 3 columns in grid
- **Banner**: Adjusts height and content size

## 🎨 Visual Preview

### Banner Carousel
```
┌─────────────────────────────────────────┐
│  [Featured Badge]                       │
│                                         │
│  PetNest Foods                          │
│  Healthy food for happy pets!          │
│                                         │
│  [Learn More Button →]                  │
│                                         │
│        ● ○ ○  (dots indicator)          │
└─────────────────────────────────────────┘
```

### Grid Display
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Image   │  │  Image   │  │  Image   │
│          │  │          │  │          │
├──────────┤  ├──────────┤  ├──────────┤
│ Brand    │  │ Brand    │  │ Brand    │
│ Message  │  │ Message  │  │ Message  │
│ 📞 Phone  │  │ 📞 Phone  │  │ 📞 Phone  │
│ ✉️ Email  │  │ ✉️ Email  │  │ ✉️ Email  │
│ 📅 Date   │  │ 📅 Date   │  │ 📅 Date   │
│ [Button] │  │ [Button] │  │ [Button] │
└──────────┘  └──────────┘  └──────────┘
```

## 🔄 How It Works

1. **Component loads** → Shows loading spinner
2. **Fetches ads** → Calls your backend API
3. **Transforms data** → Formats for display
4. **Displays ads** → Shows in carousel/grid
5. **If no ads** → Shows fallback/empty state

## 🛠️ Customization Examples

### Change Carousel Speed
```tsx
// In AdBanner.tsx, line ~65
Autoplay({
    delay: 3000, // 3 seconds instead of 5
    stopOnInteraction: true,
})
```

### Change Colors
```tsx
// Modify gradient colors in AdBanner.tsx
const gradients = [
    "from-blue-600/80 via-blue-500/60 to-transparent",
    "from-purple-600/80 via-purple-500/60 to-transparent",
    // Add your brand colors
];
```

### Filter by Ad Spot
```tsx
// Get only sidebar ads
import { fetchApprovedAdvertisements } from '@/services/advertisementApi';

const sidebarAds = await fetchApprovedAdvertisements('sidebarAd');
```

## 🐛 Troubleshooting

### "No advertisements showing"
- ✅ Check backend is running
- ✅ Verify environment variable `NEXT_PUBLIC_BASE_URL`
- ✅ Ensure ads have `isApproved: true`
- ✅ Check browser console for errors

### "Images not loading"
- ✅ Verify `mediaUrl` is valid
- ✅ Check CORS settings
- ✅ Test image URL directly in browser

### "TypeScript errors"
- ✅ Run `npm install` to ensure dependencies
- ✅ Restart TypeScript server in VSCode

## 📞 Next Steps

1. **Test the `/advertisements` page** - Visit it in your browser
2. **Add banner to homepage** - Update `page.tsx` as shown above
3. **Verify backend API** - Make sure it returns approved ads
4. **Customize styling** - Adjust colors, spacing to match your brand

## 💡 Pro Tips

- The banner automatically cycles through ads every 5 seconds
- Hover over the banner to pause auto-rotation
- The grid display shows up to 100 ads (or set your own limit)
- All components handle loading and error states gracefully
- Components are fully responsive and mobile-friendly

---

**Need help?** Check `ADVERTISEMENT_SYSTEM_DOCS.md` for detailed documentation.
