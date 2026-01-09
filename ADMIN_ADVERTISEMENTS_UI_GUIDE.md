# Admin Advertisement Management UI - Implementation Guide

## 📋 Overview

Complete Admin Advertisement Management system with tab-based interface for managing advertisement requests, approvals, and active campaigns.

## 🎯 Features Implemented

### ✅ Tab-Based Navigation
- **All Ads** - View all advertisements
- **Pending Requests** - Review and approve/reject new submissions  
- **Approved** - Manage approved advertisements
- **Listings** - Active advertisement campaigns

### ✅ Advertisement Table
- Displays: Brand Name, Ad Spot, Status, Message, Created Date
- Actions dropdown for each ad
- Loading skeletons
- Empty state handling
- Responsive design

### ✅ Actions Available
- **View Details** - Opens detailed dialog with all advertisement information
- **Approve** - Approve pending advertisements (with confirmation)
- **Reject** - Reject pending advertisements (with confirmation)
- **Toggle Status** - Activate/deactivate approved ads
- **Delete** - Remove advertisements (with confirmation)

### ✅ Optimistic UI Updates
- Immediate UI feedback for approve/reject/delete actions
- Automatic table refresh after status changes
- Toast notifications for all actions

## 📁 File Structure

```
src/
├── app/
│   └── admin/
│       └── advertisements/
│           └── page.tsx                    # Main page with tabs
├── components/
│   ├── admin/
│   │   └── advertisements/
│   │       ├── AdvertisementsTable.tsx     # Reusable table component
│   │       ├── AdDetailsDialog.tsx         # Details dialog
│   │       └── ConfirmDialog.tsx           # Confirmation dialog
│   └── ui/
│       ├── toast.tsx                       # Toast component
│       └── toaster.tsx                     # Toast provider
├── services/
│   └── admin/
│       └── adminAdvertisementService.ts    # API service layer
├── types/
│   └── advertisement.types.ts              # TypeScript definitions
└── hooks/
    └── use-toast.ts                        # Toast hook
```

## 🔌 API Endpoints Used

### GET Endpoints
```typescript
GET /v1/api/admin/advertisements          // All advertisements
GET /v1/api/admin/advertisements/requests // Pending requests
GET /v1/api/admin/advertisements/approved // Approved ads
GET /v1/api/admin/advertisements/listings // Active listings
GET /v1/api/admin/advertisements/:adId    // Single advertisement
```

### PATCH Endpoints
```typescript
PATCH /v1/api/admin/ad/request/:adId/approved  // Approve ad
PATCH /v1/api/admin/ad/request/:adId/rejected  // Reject ad
PATCH /v1/api/admin/advertisements/:adId/status // Toggle status
```

### DELETE Endpoints
```typescript
DELETE /v1/api/admin/advertisements/:adId // Delete advertisement
```

## 🎨 UI Components Used

### shadcn/ui Components
- `Tabs` - Tab navigation
- `Table` - Data table
- `Dialog` - Advertisement details
- `AlertDialog` - Confirmation dialogs
- `Badge` - Status and ad spot indicators
- `Button` - Actions and triggers
- `DropdownMenu` - Actions menu
- `Skeleton` - Loading states
- `Card` - Content containers
- `Toast` - Notifications

## 💻 Component Details

### 1. AdminAdvertisementsPage (Main Page)
**Location:** `src/app/admin/advertisements/page.tsx`

```tsx
- Manages tab state
- Renders four tab panels
- Each tab contains AdvertisementsTable with different type
```

### 2. AdvertisementsTable (Reusable Table)
**Location:** `src/components/admin/advertisements/AdvertisementsTable.tsx`

**Props:**
```typescript
interface AdvertisementsTableProps {
    type: "all" | "pending" | "approved" | "listings";
}
```

**Features:**
- Fetches data based on type
- Handles all CRUD operations
- Optimistic UI updates
- Error handling with toasts
- Loading states
- Empty states

### 3. AdDetailsDialog (Details View)
**Location:** `src/components/admin/advertisements/AdDetailsDialog.tsx`

**Props:**
```typescript
interface AdDetailsDialogProps {
    ad: Advertisement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
```

**Displays:**
- Brand information
- Advertisement message
- Contact details (email, phone)
- Media preview with external link
- Timeline (created/updated dates)
- Status badges

### 4. ConfirmDialog (Confirmation)
**Location:** `src/components/admin/advertisements/ConfirmDialog.tsx`

**Props:**
```typescript
interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
}
```

## 🎭 Status Badge Colors

```typescript
- Pending: Gray (secondary)
- Approved: Green
```

## 📍 Ad Spot Badge Colors

```typescript
- homepageBanner: Blue
- sidebar: Purple
- footer: Orange
- blogFeature: Pink
```

## 🔄 Data Flow

```
1. User navigates to tab
   ↓
2. AdvertisementsTable fetches data from API
   ↓
3. Data displayed in table
   ↓
4. User clicks action (Approve/Reject/Delete)
   ↓
5. Confirmation dialog shown
   ↓
6. User confirms
   ↓
7. API call made
   ↓
8. Optimistic UI update (row removed/updated)
   ↓
9. Toast notification shown
```

## 🎯 Usage Examples

### Accessing the Page
Navigate to: `/admin/advertisements`

### Viewing Advertisement Details
1. Click on actions dropdown (three dots)
2. Click "View Details"
3. Dialog opens with complete information

### Approving Pending Advertisements
1. Go to "Pending Requests" tab
2. Click actions dropdown
3. Click "Approve"
4. Confirm in dialog
5. Advertisement approved and removed from pending list

### Rejecting Advertisements
1. Go to "Pending Requests" tab
2. Click actions dropdown
3. Click "Reject"
4. Confirm in dialog
5. Advertisement rejected and removed from list

### Toggling Active Status
1. Go to "Approved" or "Listings" tab
2. Click actions dropdown
3. Click "Toggle Status"
4. Confirm in dialog
5. Status updated

### Deleting Advertisements
1. Click actions dropdown on any ad
2. Click "Delete"
3. Confirm in dialog
4. Advertisement deleted and removed from list

## 🔍 TypeScript Types

### Advertisement Interface
```typescript
export interface Advertisement {
    _id: string;
    brandName: string;
    contactEmail: string;
    contactNumber: string;
    adSpot: AdSpotType;
    isApproved: boolean;
    message: string;
    mediaUrl: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export type AdSpotType = 'homepageBanner' | 'sidebar' | 'footer' | 'blogFeature';
```

## 🎨 Styling

- Uses Tailwind CSS for styling
- Responsive design (mobile, tablet, desktop)
- Consistent with shadcn/ui design system
- Dark mode compatible (if theme is set up)

## ⚡ Performance Optimizations

1. **Optimistic UI Updates** - Immediate feedback without waiting for API
2. **Loading Skeletons** - Better perceived performance
3. **Memoization** - React component optimization
4. **Conditional Rendering** - Only render what's needed
5. **Error Boundaries** - Graceful error handling

## 🐛 Error Handling

All errors are handled with toast notifications showing:
- Error title
- Error description from API or fallback message
- Red destructive variant for visibility

## 📱 Responsive Behavior

### Mobile (< 768px)
- Stacked tab buttons
- Simplified table (may need horizontal scroll)
- Full-width dialogs

### Tablet (768px - 1024px)
- Grid tab layout
- Optimized table columns
- Responsive dialogs

### Desktop (> 1024px)
- Inline tab buttons
- Full table display
- Large dialogs with max-width

## 🚀 Future Enhancements

Potential improvements:
- [ ] Bulk actions (approve/delete multiple)
- [ ] Advanced filtering (by date, ad spot, status)
- [ ] Search functionality
- [ ] Export to CSV
- [ ] Analytics dashboard
- [ ] Ad performance metrics
- [ ] Scheduling advertisements
- [ ] Preview advertisements before approval

## 🔐 Security Notes

- All API calls use JWT authentication (via axios interceptor)
- Admin role verification should be handled server-side
- XSS protection through React's built-in escaping
- CSRF protection via SameSite cookies

## 📝 Testing Checklist

- [ ] Navigate to all four tabs
- [ ] View advertisement details
- [ ] Approve pending advertisement
- [ ] Reject pending advertisement
- [ ] Toggle active status
- [ ] Delete advertisement
- [ ] Check loading states
- [ ] Check empty states
- [ ] Test error handling
- [ ] Test responsive design
- [ ] Verify toast notifications

## 🎓 Best Practices Followed

✅ Clean code architecture
✅ Separation of concerns (components, services, types)
✅ Reusable components
✅ TypeScript strict typing
✅ Error handling
✅ Loading states
✅ Optimistic UI
✅ Accessibility (ARIA labels, keyboard navigation)
✅ Responsive design
✅ Toast notifications for user feedback

## 🔗 Related Files

- Admin Layout: `src/app/admin/layout.tsx`
- API Client: `src/lib/apiClient.ts`
- Utils: `src/lib/utils.ts`

---

**Implementation Complete! ✅**

All features requested have been implemented with clean, maintainable code following Next.js App Router and shadcn/ui best practices.
