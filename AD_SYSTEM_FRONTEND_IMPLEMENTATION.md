# Advertisement System - Frontend Implementation Guide

## Overview
This guide provides comprehensive instructions for implementing the advertisement management system in the frontend. The system allows admins to manage ad campaigns and displays ads to users across various placements on the platform.

---

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Features to Implement](#features-to-implement)
3. [Admin Dashboard](#admin-dashboard)
4. [Public Ad Display](#public-ad-display)
5. [State Management](#state-management)
6. [UI/UX Guidelines](#uiux-guidelines)
7. [Error Handling](#error-handling)

---

## API Endpoints

### Base URL
```
/api/v1
```

### Public Endpoints (No Authentication Required)

#### 1. Get Active Ads
```http
GET /ads
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "ad123",
      "title": "Summer Sale",
      "description": "Get 20% off on all pets",
      "imageUrl": "https://example.com/ad.jpg",
      "targetUrl": "https://example.com/sale",
      "placement": "hero_banner",
      "device": "both",
      "isActive": true,
      "startDate": "2026-01-01T00:00:00.000Z",
      "endDate": "2026-01-31T23:59:59.000Z",
      "impressions": 1500,
      "clicks": 45,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
}
```

#### 2. Track Ad Impression
```http
POST /ads/:id/impression
```
**When to call:** When an ad becomes visible in the viewport (use Intersection Observer)

**Response:**
```json
{
  "success": true,
  "message": "Impression tracked"
}
```

#### 3. Track Ad Click
```http
POST /ads/:id/click
```
**When to call:** When user clicks on an ad

**Response:**
```json
{
  "success": true,
  "message": "Click tracked"
}
```

#### 4. Get Feed with Inline Ads
```http
GET /feed?page=1&limit=20&userId=user123
```
**Description:** Returns pet listings with ads interspersed

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "pet",
      "data": { /* pet object */ }
    },
    {
      "type": "ad",
      "data": { /* ad object */ }
    },
    {
      "type": "pet",
      "data": { /* pet object */ }
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Admin Endpoints (Require Authentication + Admin Role)

#### 1. Get All Ad Requests
```http
GET /admin/ad-requests?status=pending&page=1&limit=10
```
**Query Parameters:**
- `status`: 'pending' | 'approved' | 'rejected' (optional)
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "req123",
      "businessName": "Pet Store Inc",
      "contactEmail": "contact@petstore.com",
      "contactPhone": "+1234567890",
      "adTitle": "New Year Sale",
      "adDescription": "Get 30% off",
      "preferredPlacement": "hero_banner",
      "budget": 1000,
      "duration": 30,
      "status": "pending",
      "submittedAt": "2026-01-05T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### 2. Update Ad Request Status
```http
PATCH /admin/ad-requests/:id/status
```
**Body:**
```json
{
  "status": "approved",
  "rejectionReason": "Optional reason for rejection"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ad request approved successfully",
  "data": { /* updated ad request */ }
}
```

#### 3. Create Ad
```http
POST /admin/ads
```
**Body:**
```json
{
  "title": "Summer Sale",
  "description": "Get 20% off on all pets",
  "imageUrl": "https://example.com/ad.jpg",
  "targetUrl": "https://example.com/sale",
  "placement": "hero_banner",
  "device": "both",
  "startDate": "2026-01-10T00:00:00.000Z",
  "endDate": "2026-02-10T23:59:59.000Z",
  "isActive": true
}
```

**Placement Options:**
- `hero_banner` - Large banner at top of homepage
- `sidebar` - Sidebar ad on various pages
- `pet_feed_inline` - Inline ads in pet feed
- `footer` - Footer banner ad

**Device Options:**
- `desktop` - Desktop only
- `mobile` - Mobile only
- `both` - All devices

**Response:**
```json
{
  "success": true,
  "message": "Ad created successfully",
  "data": { /* created ad object */ }
}
```

#### 4. Get All Ads (Admin)
```http
GET /admin/ads?placement=hero_banner&device=both&isActive=true&page=1&limit=10
```
**Query Parameters:**
- `placement`: 'hero_banner' | 'sidebar' | 'pet_feed_inline' | 'footer' (optional)
- `device`: 'desktop' | 'mobile' | 'both' (optional)
- `isActive`: 'true' | 'false' (optional) - Filter by active/inactive status
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [ /* array of ad objects */ ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### 5. Get Ad By ID
```http
GET /admin/ads/:id
```

#### 6. Update Ad
```http
PATCH /admin/ads/:id
```
**Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "imageUrl": "https://example.com/new-ad.jpg",
  "targetUrl": "https://example.com/new-sale",
  "placement": "sidebar",
  "device": "mobile",
  "startDate": "2026-01-15T00:00:00.000Z",
  "endDate": "2026-02-15T23:59:59.000Z"
}
```

#### 7. Toggle Ad Status
```http
PATCH /admin/ads/:id/toggle
```
**Description:** Toggles ad between active and inactive. When toggled:
- Active → Inactive: Ad stops displaying on public pages
- Inactive → Active: Ad starts displaying on public pages

**Response:**
```json
{
  "success": true,
  "message": "Ad deactivated successfully",
  "data": {
    "_id": "ad123",
    "isActive": false,
    /* ...other ad fields */
  }
}
```

**Frontend Action Required:** After toggle, refetch the current filtered list to update the UI.

#### 8. Delete Ad
```http
DELETE /admin/ads/:id
```
**Response:**
```json
{
  "success": true,
  "message": "Ad deleted successfully"
}
```

---

## Features to Implement

### 1. Admin Dashboard - Advertisement Listings Page

#### Page Structure
```
Advertisement Listings
Active advertisement campaigns and placements

[Search by title...] [All Placements ▼] [All Status ▼] [All Devices ▼] [+ New Ad]

┌─────────────────────────────────────────────────────────────────┐
│                       No advertisements yet                      │
│   Create your first ad to start displaying to buyers            │
│                    across the platform                           │
│                                                                  │
│                    [+ Create Advertisement]                      │
└─────────────────────────────────────────────────────────────────┘
```

#### Filters Implementation

**1. Search by Title**
- Debounced search input (300ms delay)
- Filter ads client-side or server-side based on title

**2. Placement Filter**
- Options: All Placements, Hero Banner, Sidebar, Pet Feed Inline, Footer
- Update query parameter: `?placement=hero_banner`

**3. Status Filter** ⭐ IMPORTANT
- Options: 
  - **All Status** - No `isActive` parameter (shows all ads)
  - **Active** - `?isActive=true` (shows only active ads)
  - **Inactive** - `?isActive=false` (shows only inactive ads)

**4. Device Filter**
- Options: All Devices, Desktop, Mobile, Both
- Update query parameter: `?device=desktop`

#### Ad Cards/Table View

**Display Format:**
```
┌──────────────────────────────────────────────────────────────────┐
│ 📷 [Image]  Summer Sale                              [Toggle] [✏️] [🗑️] │
│             Placement: Hero Banner | Device: Both                 │
│             Status: Active | Impressions: 1,500 | Clicks: 45     │
│             Period: Jan 1, 2026 - Jan 31, 2026                   │
│             CTR: 3.0%                                             │
└──────────────────────────────────────────────────────────────────┘
```

**Fields to Display:**
- Thumbnail image
- Title
- Placement type
- Device target
- Status badge (Active: green, Inactive: gray)
- Impressions count
- Clicks count
- CTR (Click-Through Rate): `(clicks / impressions * 100).toFixed(2)%`
- Date range
- Action buttons: Toggle, Edit, Delete

#### Toggle Behavior ⭐ CRITICAL

```typescript
const handleToggle = async (adId: string) => {
  try {
    // Show loading state for this specific ad
    setLoadingAdId(adId);
    
    // Call toggle API
    const response = await fetch(`/api/v1/admin/ads/${adId}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success toast
      toast.success(result.message); // "Ad activated successfully" or "Ad deactivated successfully"
      
      // IMPORTANT: Refetch the ads list with current filters
      // This ensures the toggled ad disappears from filtered view if needed
      await refetchAds();
      
      // Alternative: If using optimistic updates, manually filter out
      // the ad if it no longer matches the current filter
      if (currentStatusFilter === 'active' && !result.data.isActive) {
        // Remove from list since it's now inactive but we're viewing active ads
        setAds(ads.filter(ad => ad._id !== adId));
      } else if (currentStatusFilter === 'inactive' && result.data.isActive) {
        // Remove from list since it's now active but we're viewing inactive ads
        setAds(ads.filter(ad => ad._id !== adId));
      }
    }
  } catch (error) {
    toast.error('Failed to toggle ad status');
  } finally {
    setLoadingAdId(null);
  }
};
```

**Key Points:**
1. When viewing "Active" ads and you toggle an active ad OFF:
   - Ad becomes inactive (`isActive: false`)
   - Ad should disappear from the current view
   - Ad will appear in "Inactive" view

2. When viewing "Inactive" ads and you toggle an inactive ad ON:
   - Ad becomes active (`isActive: true`)
   - Ad should disappear from the current view
   - Ad will appear in "Active" view

3. When viewing "All Status":
   - Toggle just updates the status badge
   - Ad remains in the list

#### Create/Edit Ad Form

**Form Fields:**
1. **Title*** (required)
   - Text input, max 100 characters
   - Validation: Required

2. **Description*** (required)
   - Textarea, max 500 characters
   - Validation: Required

3. **Image URL*** (required)
   - Text input for URL or file upload component
   - Validation: Required, valid URL format
   - Preview the image below the input

4. **Target URL*** (required)
   - Text input
   - Validation: Required, valid URL format
   - Where users will be redirected when clicking the ad

5. **Placement*** (required)
   - Select dropdown
   - Options: Hero Banner, Sidebar, Pet Feed Inline, Footer

6. **Device*** (required)
   - Radio buttons or Select
   - Options: Desktop, Mobile, Both
   - Default: Both

7. **Start Date*** (required)
   - Date picker
   - Validation: Cannot be in the past

8. **End Date*** (required)
   - Date picker
   - Validation: Must be after start date

9. **Active Status**
   - Toggle switch
   - Default: true
   - Label: "Activate this ad immediately"

**Form Validation:**
```typescript
const adSchema = {
  title: { required: true, maxLength: 100 },
  description: { required: true, maxLength: 500 },
  imageUrl: { required: true, pattern: /^https?:\/\/.+/ },
  targetUrl: { required: true, pattern: /^https?:\/\/.+/ },
  placement: { required: true },
  device: { required: true },
  startDate: { required: true },
  endDate: { 
    required: true,
    validate: (value, formValues) => new Date(value) > new Date(formValues.startDate)
  },
  isActive: { default: true }
};
```

### 2. Public Ad Display Components

#### Hero Banner Ad Component
```tsx
<HeroBannerAd>
  - Fetch ads with placement='hero_banner'
  - Display large banner at top of homepage
  - Auto-rotate if multiple ads (5-10 seconds per ad)
  - Track impression when visible
  - Track click when clicked
  - Open targetUrl in new tab
</HeroBannerAd>
```

**Implementation:**
```typescript
// Fetch hero banner ads
const { data: heroAds } = useQuery(
  ['hero-banner-ads'],
  () => fetchAdsByPlacement('hero_banner')
);

// Track impression using Intersection Observer
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !impressionTracked) {
          trackImpression(currentAd._id);
          setImpressionTracked(true);
        }
      });
    },
    { threshold: 0.5 } // Ad must be 50% visible
  );

  if (adRef.current) {
    observer.observe(adRef.current);
  }

  return () => observer.disconnect();
}, [currentAd]);

// Handle click
const handleAdClick = async (ad) => {
  await trackClick(ad._id);
  window.open(ad.targetUrl, '_blank');
};
```

#### Sidebar Ad Component
```tsx
<SidebarAd>
  - Fetch ads with placement='sidebar'
  - Display in sidebar
  - Sticky positioning (optional)
  - Track impression/click
</SidebarAd>
```

#### Inline Feed Ads
```tsx
<PetFeedWithAds>
  - Use /feed endpoint which returns mixed pets and ads
  - Render pet cards normally
  - Render ad cards for ad items
  - Track impression for each ad when visible
  - Track click on ad interaction
</PetFeedWithAds>
```

**Feed Item Rendering:**
```typescript
{feedItems.map((item, index) => (
  item.type === 'pet' ? (
    <PetCard key={item.data._id} pet={item.data} />
  ) : (
    <AdCard 
      key={item.data._id} 
      ad={item.data}
      onImpression={() => trackImpression(item.data._id)}
      onClick={() => handleAdClick(item.data)}
    />
  )
))}
```

#### Footer Banner Ad
```tsx
<FooterBannerAd>
  - Fetch ads with placement='footer'
  - Display at bottom of pages
  - Can be sticky or static
  - Track impression/click
</FooterBannerAd>
```

---

## State Management

### Recommended Structure (React Query + Zustand/Redux)

```typescript
// API functions (api/ads.ts)
export const adsApi = {
  // Public
  getActiveAds: () => api.get('/ads'),
  trackImpression: (adId: string) => api.post(`/ads/${adId}/impression`),
  trackClick: (adId: string) => api.post(`/ads/${adId}/click`),
  getFeed: (params) => api.get('/feed', { params }),
  
  // Admin
  getAllAds: (params) => api.get('/admin/ads', { params }),
  getAdById: (id: string) => api.get(`/admin/ads/${id}`),
  createAd: (data) => api.post('/admin/ads', data),
  updateAd: (id: string, data) => api.patch(`/admin/ads/${id}`, data),
  deleteAd: (id: string) => api.delete(`/admin/ads/${id}`),
  toggleAdStatus: (id: string) => api.patch(`/admin/ads/${id}/toggle`),
  
  // Ad Requests
  getAllAdRequests: (params) => api.get('/admin/ad-requests', { params }),
  updateAdRequestStatus: (id: string, data) => api.patch(`/admin/ad-requests/${id}/status`, data)
};

// React Query hooks (hooks/useAds.ts)
export const useAds = (filters: AdFilters) => {
  return useQuery(
    ['ads', filters],
    () => adsApi.getAllAds(filters),
    {
      keepPreviousData: true, // Keep old data while fetching new
      staleTime: 30000 // Consider data fresh for 30 seconds
    }
  );
};

export const useToggleAd = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (adId: string) => adsApi.toggleAdStatus(adId),
    {
      onSuccess: () => {
        // Invalidate and refetch ads list
        queryClient.invalidateQueries(['ads']);
      }
    }
  );
};

export const useDeleteAd = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (adId: string) => adsApi.deleteAd(adId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ads']);
      }
    }
  );
};

export const useCreateAd = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: CreateAdDTO) => adsApi.createAd(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ads']);
      }
    }
  );
};
```

### Filter State Management

```typescript
// Store for ad filters (Zustand example)
interface AdFiltersStore {
  search: string;
  placement: string | null;
  device: string | null;
  isActive: boolean | null; // null = all, true = active, false = inactive
  page: number;
  limit: number;
  setSearch: (search: string) => void;
  setPlacement: (placement: string | null) => void;
  setDevice: (device: string | null) => void;
  setIsActive: (isActive: boolean | null) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const useAdFilters = create<AdFiltersStore>((set) => ({
  search: '',
  placement: null,
  device: null,
  isActive: null,
  page: 1,
  limit: 10,
  setSearch: (search) => set({ search, page: 1 }),
  setPlacement: (placement) => set({ placement, page: 1 }),
  setDevice: (device) => set({ device, page: 1 }),
  setIsActive: (isActive) => set({ isActive, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({
    search: '',
    placement: null,
    device: null,
    isActive: null,
    page: 1
  })
}));
```

---

## UI/UX Guidelines

### Design Principles
1. **Clean & Professional**: Ad management should feel enterprise-grade
2. **Fast Feedback**: Show loading states, success/error messages immediately
3. **Consistent**: Match the existing design system of your application
4. **Accessible**: Use proper ARIA labels, keyboard navigation

### Color Scheme
```css
/* Status Colors */
--color-active: #10b981; /* green */
--color-inactive: #6b7280; /* gray */
--color-expired: #ef4444; /* red */
--color-scheduled: #f59e0b; /* amber */

/* Ad Card Border */
--color-ad-border: #e5e7eb;
--color-ad-hover: #f3f4f6;
```

### Status Badges
```tsx
<Badge variant={ad.isActive ? 'success' : 'secondary'}>
  {ad.isActive ? 'Active' : 'Inactive'}
</Badge>
```

### Empty States
- Show friendly empty state when no ads exist
- Include clear CTA button to create first ad
- Use illustration or icon
- Provide helpful description

### Loading States
- Skeleton loaders for initial load
- Spinner for pagination/filter changes
- Inline loader for toggle button during action
- Optimistic updates where appropriate

### Responsive Design
- Mobile: Stack filters vertically, use bottom sheet for forms
- Tablet: 2-column ad grid
- Desktop: 3-column ad grid or table view
- Ensure ad preview images are responsive

---

## Error Handling

### API Error Responses
```typescript
interface ApiError {
  success: false;
  message: string;
}

// Handle errors consistently
const handleApiError = (error: any) => {
  if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else if (error.message) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
};
```

### Common Errors to Handle
1. **401 Unauthorized**: Redirect to login
2. **403 Forbidden**: Show "Access denied" message
3. **404 Not Found**: "Ad not found" message
4. **400 Bad Request**: Show validation errors from backend
5. **500 Server Error**: "Something went wrong, please try again"

### Form Validation Errors
```typescript
// Display field-specific errors
{errors.title && (
  <span className="text-red-500 text-sm">{errors.title.message}</span>
)}

// Common validations
- Title: Required, max 100 chars
- Description: Required, max 500 chars
- URLs: Valid URL format
- Dates: End date must be after start date
- Image: Valid image URL or uploaded file
```

---

## Performance Optimization

### 1. Image Optimization
- Use lazy loading for ad images
- Serve responsive images (different sizes for mobile/desktop)
- Use CDN for ad images
- Implement image caching

### 2. API Optimization
- Implement pagination (don't fetch all ads at once)
- Use debouncing for search (300ms delay)
- Cache frequently accessed data (React Query)
- Implement optimistic updates for better UX

### 3. Impression/Click Tracking
- Batch impression tracking (send multiple impressions together)
- Use `navigator.sendBeacon()` for tracking on page unload
- Don't track duplicate impressions for same ad in same session

```typescript
// Track impression only once per session
const trackedImpressions = new Set<string>();

const trackImpressionOnce = async (adId: string) => {
  if (!trackedImpressions.has(adId)) {
    await adsApi.trackImpression(adId);
    trackedImpressions.add(adId);
  }
};
```

---

## Testing Checklist

### Admin Dashboard
- [ ] Create new ad with all required fields
- [ ] Upload/set ad image
- [ ] Update existing ad
- [ ] Delete ad with confirmation
- [ ] Toggle ad status (active ↔ inactive)
- [ ] Filter by placement
- [ ] Filter by device
- [ ] Filter by status (active/inactive/all)
- [ ] Search ads by title
- [ ] Pagination works correctly
- [ ] View ad details/analytics
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Verify toggled ad disappears from filtered view

### Public Display
- [ ] Hero banner displays correctly
- [ ] Sidebar ads display correctly
- [ ] Inline feed ads appear in feed
- [ ] Footer ads display correctly
- [ ] Impression tracking works
- [ ] Click tracking works
- [ ] Ads open in new tab
- [ ] Only active ads are shown
- [ ] Expired ads don't display
- [ ] Responsive on all devices

### Edge Cases
- [ ] No ads available (empty state)
- [ ] Network error handling
- [ ] Unauthorized access handling
- [ ] Invalid ad data handling
- [ ] Expired token handling
- [ ] Multiple concurrent toggles
- [ ] Rapid filter changes

---

## Example Component Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdsList.tsx
│   │   ├── AdCard.tsx
│   │   ├── AdFilters.tsx
│   │   ├── CreateAdForm.tsx
│   │   ├── EditAdForm.tsx
│   │   └── AdRequestsList.tsx
│   └── public/
│       ├── HeroBannerAd.tsx
│       ├── SidebarAd.tsx
│       ├── InlineFeedAd.tsx
│       └── FooterBannerAd.tsx
├── hooks/
│   ├── useAds.ts
│   ├── useAdRequests.ts
│   └── useAdTracking.ts
├── api/
│   └── ads.ts
├── types/
│   └── ad.types.ts
└── pages/
    ├── admin/
    │   ├── ads/
    │   │   ├── index.tsx (list)
    │   │   ├── create.tsx
    │   │   └── [id]/edit.tsx
    │   └── ad-requests/
    │       └── index.tsx
    └── (public pages with ad components)
```

---

## Sample Code Snippets

### Toggle Implementation (Complete)

```typescript
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adsApi } from '@/api/ads';
import { toast } from 'react-hot-toast';

const AdCard = ({ ad, currentFilter }) => {
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const toggleMutation = useMutation(
    (adId: string) => adsApi.toggleAdStatus(adId),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        // Refetch ads to update the list
        queryClient.invalidateQueries(['ads']);
      },
      onError: () => {
        toast.error('Failed to toggle ad status');
      },
      onSettled: () => {
        setIsTogglingId(null);
      }
    }
  );
  
  const handleToggle = (adId: string) => {
    setIsTogglingId(adId);
    toggleMutation.mutate(adId);
  };
  
  return (
    <div className="ad-card">
      <img src={ad.imageUrl} alt={ad.title} />
      <h3>{ad.title}</h3>
      <p>{ad.description}</p>
      
      <div className="status-badge">
        <Badge variant={ad.isActive ? 'success' : 'secondary'}>
          {ad.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      
      <button
        onClick={() => handleToggle(ad._id)}
        disabled={isTogglingId === ad._id}
        className="toggle-btn"
      >
        {isTogglingId === ad._id ? (
          <Spinner size="sm" />
        ) : (
          <Switch checked={ad.isActive} />
        )}
      </button>
    </div>
  );
};
```

### Filter Implementation

```typescript
const AdsList = () => {
  const [filters, setFilters] = useState({
    search: '',
    placement: null,
    device: null,
    isActive: null, // null = all, true = active, false = inactive
    page: 1,
    limit: 10
  });
  
  const { data, isLoading } = useAds(filters);
  
  const handleStatusFilterChange = (value: string) => {
    setFilters({
      ...filters,
      isActive: value === 'all' ? null : value === 'active' ? true : false,
      page: 1
    });
  };
  
  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
        />
        
        <select
          value={filters.placement || 'all'}
          onChange={(e) => setFilters({ 
            ...filters, 
            placement: e.target.value === 'all' ? null : e.target.value,
            page: 1
          })}
        >
          <option value="all">All Placements</option>
          <option value="hero_banner">Hero Banner</option>
          <option value="sidebar">Sidebar</option>
          <option value="pet_feed_inline">Pet Feed Inline</option>
          <option value="footer">Footer</option>
        </select>
        
        <select
          value={
            filters.isActive === null ? 'all' : 
            filters.isActive ? 'active' : 'inactive'
          }
          onChange={(e) => handleStatusFilterChange(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        
        <select
          value={filters.device || 'all'}
          onChange={(e) => setFilters({ 
            ...filters, 
            device: e.target.value === 'all' ? null : e.target.value,
            page: 1
          })}
        >
          <option value="all">All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="both">Both</option>
        </select>
      </div>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : data?.data.length === 0 ? (
        <EmptyState />
      ) : (
        <AdGrid ads={data?.data} currentFilter={filters.isActive} />
      )}
    </div>
  );
};
```

---

## Security Considerations

1. **Authentication**: All admin endpoints require valid JWT token
2. **Authorization**: Verify user has admin role
3. **Input Sanitization**: Sanitize all user inputs on frontend
4. **XSS Prevention**: Escape HTML in ad content
5. **CORS**: Ensure proper CORS configuration for tracking endpoints
6. **Rate Limiting**: Implement rate limiting for impression/click tracking

---

## Analytics & Reporting (Future Enhancement)

Consider implementing:
- Ad performance dashboard
- CTR trends over time
- Conversion tracking
- A/B testing for different ad creatives
- Revenue per ad
- ROI calculation

---

## Support & Troubleshooting

### Common Issues

**Issue**: Toggled ad doesn't disappear from view
**Solution**: Ensure you're calling `refetchAds()` or invalidating React Query cache after toggle

**Issue**: Impressions tracking multiple times for same ad
**Solution**: Implement session-based tracking to prevent duplicates

**Issue**: Ads not displaying on public pages
**Solution**: Check `isActive` status, verify dates are current, and device targeting is correct

**Issue**: 401 Unauthorized errors
**Solution**: Token expired, implement token refresh or redirect to login

---

## Deployment Notes

1. **Environment Variables**: Set API base URL
2. **Image CDN**: Configure CDN for ad images
3. **Analytics**: Integrate with your analytics platform
4. **Monitoring**: Set up error tracking (Sentry, LogRocket)
5. **Performance**: Monitor API response times and optimize

---

## API Request Examples (cURL)

### Create Ad
```bash
curl -X POST http://localhost:5000/api/v1/admin/ads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Sale",
    "description": "Get 20% off on all pets",
    "imageUrl": "https://example.com/ad.jpg",
    "targetUrl": "https://example.com/sale",
    "placement": "hero_banner",
    "device": "both",
    "startDate": "2026-01-10T00:00:00.000Z",
    "endDate": "2026-02-10T23:59:59.000Z",
    "isActive": true
  }'
```

### Toggle Ad
```bash
curl -X PATCH http://localhost:5000/api/v1/admin/ads/AD_ID/toggle \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Active Ads (Public)
```bash
curl -X GET http://localhost:5000/api/v1/ads
```

### Get Ads with Filters (Admin)
```bash
curl -X GET "http://localhost:5000/api/v1/admin/ads?isActive=true&placement=hero_banner&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Questions or Issues?

If you encounter any issues or have questions about the API:
1. Check the backend logs
2. Verify authentication token
3. Confirm request body matches schema
4. Check API response status codes and error messages

---

**Happy Coding! 🚀**
