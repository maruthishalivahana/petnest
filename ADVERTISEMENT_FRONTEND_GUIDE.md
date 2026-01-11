# Advertisement Management Frontend Implementation Guide

## Overview
This guide provides complete frontend implementation for the Advertisement Listings page with filters, search, and toggle functionality.

## Backend API Endpoints

### GET All Ads (with filters)
```
GET /v1/api/ads/admin/ads
```

**Query Parameters:**
- `placement` (optional): Filter by placement (home_top_banner, home_sidebar, etc.)
- `device` (optional): Filter by device (mobile, desktop, both)
- `isActive` (optional): Filter by status (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title (needs backend enhancement - see below)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "ad123",
      "title": "maruthi photo",
      "imageUrl": "https://...",
      "placement": "home_top_banner",
      "device": "both",
      "startDate": "2026-01-10T00:00:00Z",
      "endDate": "2026-01-14T00:00:00Z",
      "isActive": true,
      "impressions": 0,
      "clicks": 0,
      "ctaText": "Learn More",
      "redirectUrl": "https://..."
    }
  ],
  "pagination": {
    "total": 4,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### PATCH Toggle Ad Status
```
PATCH /v1/api/ads/admin/ads/:id/toggle
```

**Response:**
```json
{
  "success": true,
  "message": "Ad activated successfully",
  "data": {
    "_id": "ad123",
    "isActive": true,
    ...
  }
}
```

---

## Frontend Implementation

### 1. Types & Interfaces

```typescript
// types/advertisement.types.ts

export type AdPlacement =
  | 'home_top_banner'
  | 'home_sidebar'
  | 'home_footer'
  | 'pet_feed_inline'
  | 'pet_mobile_sticky'
  | 'pet_detail_below_desc'
  | 'pet_detail_sidebar'
  | 'blog_mid_article'
  | 'blog_sidebar'
  | 'dashboard_header';

export type AdDevice = 'mobile' | 'desktop' | 'both';

export interface Advertisement {
  _id: string;
  title: string;
  imageUrl: string;
  ctaText: string;
  redirectUrl: string;
  placement: AdPlacement;
  device: AdDevice;
  targetPages: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdFilters {
  search: string;
  placement: AdPlacement | 'all';
  device: AdDevice | 'all';
  isActive: 'active' | 'inactive' | 'all';
}

export interface AdListResponse {
  success: boolean;
  data: Advertisement[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### 2. API Service

```typescript
// services/advertisement.service.ts

import axios from 'axios';
import { Advertisement, AdFilters, AdListResponse } from '@/types/advertisement.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1/api';

// Get auth token from localStorage or your auth store
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const advertisementService = {
  // Get all ads with filters
  getAllAds: async (
    filters: Partial<AdFilters>,
    page: number = 1,
    limit: number = 10
  ): Promise<AdListResponse> => {
    const params: any = { page, limit };

    // Map frontend filter values to backend values
    if (filters.placement && filters.placement !== 'all') {
      params.placement = filters.placement;
    }
    
    if (filters.device && filters.device !== 'all') {
      params.device = filters.device;
    }
    
    if (filters.isActive && filters.isActive !== 'all') {
      params.isActive = filters.isActive === 'active' ? 'true' : 'false';
    }

    // Note: Backend doesn't support search yet, will need enhancement
    // if (filters.search) {
    //   params.search = filters.search;
    // }

    const response = await api.get<AdListResponse>('/ads/admin/ads', { params });
    return response.data;
  },

  // Toggle ad status
  toggleAdStatus: async (adId: string): Promise<{ success: boolean; message: string; data: Advertisement }> => {
    const response = await api.patch(`/ads/admin/ads/${adId}/toggle`);
    return response.data;
  },

  // Delete ad
  deleteAd: async (adId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/ads/admin/ads/${adId}`);
    return response.data;
  },
};
```

### 3. Main Advertisement List Component

```typescript
// components/admin/AdvertisementList.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { advertisementService } from '@/services/advertisement.service';
import { Advertisement, AdFilters } from '@/types/advertisement.types';
import { toast } from 'react-hot-toast'; // or your toast library

export default function AdvertisementList() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState<AdFilters>({
    search: '',
    placement: 'all',
    device: 'all',
    isActive: 'all',
  });

  // Fetch ads based on filters
  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await advertisementService.getAllAds(filters, page, 10);
      
      // Client-side search filtering (until backend supports it)
      let filteredData = response.data;
      if (filters.search) {
        filteredData = response.data.filter((ad) =>
          ad.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setAds(filteredData);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error('Error fetching ads:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch advertisements');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Handle toggle
  const handleToggle = async (adId: string) => {
    try {
      const response = await advertisementService.toggleAdStatus(adId);
      toast.success(response.message);
      
      // Update local state
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad._id === adId ? { ...ad, isActive: response.data.isActive } : ad
        )
      );
    } catch (error: any) {
      console.error('Error toggling ad:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle advertisement');
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof AdFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      placement: 'all',
      device: 'all',
      isActive: 'all',
    });
    setPage(1);
  };

  // Calculate CTR
  const calculateCTR = (clicks: number, impressions: number): string => {
    if (impressions === 0) return '0.00%';
    return ((clicks / impressions) * 100).toFixed(2) + '%';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 bg-[#FFF8F0] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Advertisement Listings</h1>
        <p className="text-gray-600 mt-1">Active advertisement campaigns and placements</p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Placement Filter */}
        <select
          value={filters.placement}
          onChange={(e) => handleFilterChange('placement', e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="all">All Placements</option>
          <option value="home_top_banner">Home Top Banner</option>
          <option value="home_sidebar">Home Sidebar</option>
          <option value="home_footer">Home Footer</option>
          <option value="pet_feed_inline">Pet Feed Inline</option>
          <option value="pet_mobile_sticky">Pet Mobile Sticky</option>
          <option value="pet_detail_below_desc">Pet Detail Below Desc</option>
          <option value="pet_detail_sidebar">Pet Detail Sidebar</option>
          <option value="blog_mid_article">Blog Mid Article</option>
          <option value="blog_sidebar">Blog Sidebar</option>
          <option value="dashboard_header">Dashboard Header</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.isActive}
          onChange={(e) => handleFilterChange('isActive', e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Device Filter */}
        <select
          value={filters.device}
          onChange={(e) => handleFilterChange('device', e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="all">All Devices</option>
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
          <option value="both">Both</option>
        </select>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </button>

        {/* New Ad Button */}
        <button
          onClick={() => {/* Navigate to create ad page */}}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Ad
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FFF8F0] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title ↕</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Placement</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Device</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Campaign Dates</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Metrics ↕</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No advertisements found
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ad.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {ad.placement.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {ad.device.charAt(0).toUpperCase() + ad.device.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>Start: {formatDate(ad.startDate)}</div>
                      <div>End: {formatDate(ad.endDate)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>Views: {ad.impressions}</div>
                      <div>Clicks: {ad.clicks}</div>
                      <div>CTR: {calculateCTR(ad.clicks, ad.impressions)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(ad._id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          ad.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            ad.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-600 hover:text-gray-900">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {ads.length} of {total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4. Tailwind CSS Configuration (if not already set)

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFF8F0',
      },
    },
  },
  plugins: [],
}
```

---

## Backend Enhancement (Optional - Add Search Support)

To support search functionality on the backend, update the following:

### Update Validation Schema

```typescript
// src/validations/ad.validation.ts

export const GetAdsQuerySchema = z.object({
    search: z.string().optional(), // Add this line
    placement: z.enum([...]).optional(),
    device: z.enum(['mobile', 'desktop', 'both']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
});
```

### Update Repository

```typescript
// src/modules/ad/ad.repo.ts

async findAll(query: AdQuery): Promise<{ data: any[], total: number }> {
    const { placement, device, isActive, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (placement) filter.placement = placement;
    if (device) {
        filter.$or = [
            { device: device },
            { device: 'both' }
        ];
    }
    if (isActive !== undefined) filter.isActive = isActive;
    
    // Add search functionality
    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    const [data, total] = await Promise.all([
        Ad.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Ad.countDocuments(filter)
    ]);

    return { data, total };
}
```

### Update Types

```typescript
// src/modules/ad/ad.types.ts

export interface AdQuery {
    placement?: AdPlacement;
    device?: AdDevice;
    isActive?: boolean;
    search?: string; // Add this line
    page?: number;
    limit?: number;
}
```

---

## Usage Example

```typescript
// pages/admin/advertisements.tsx (Next.js)

import AdvertisementList from '@/components/admin/AdvertisementList';

export default function AdvertisementsPage() {
  return <AdvertisementList />;
}
```

---

## Key Features Implemented

✅ **Search** - Filter ads by title (client-side until backend enhanced)  
✅ **Placement Filter** - Filter by ad placement location  
✅ **Status Filter** - Filter by active/inactive status  
✅ **Device Filter** - Filter by device type  
✅ **Toggle Status** - Enable/disable ads with visual feedback  
✅ **Pagination** - Navigate through ad pages  
✅ **Metrics Display** - Show views, clicks, and CTR  
✅ **Date Formatting** - Display campaign dates  
✅ **Clear Filters** - Reset all filters at once  
✅ **Loading States** - Show loading indicator  
✅ **Error Handling** - Display error messages with toast  
✅ **Responsive Design** - Works on all screen sizes

## Notes

1. **Authentication**: Make sure to set up proper token management in your auth service
2. **Toast Library**: Install and configure react-hot-toast or your preferred notification library
3. **Search**: Currently implemented as client-side filtering. For better performance with large datasets, implement backend search
4. **Bulk Actions**: The checkboxes are placeholders - implement bulk operations as needed
5. **Actions Menu**: The three-dot menu is a placeholder - add edit/delete/duplicate actions

## Next Steps

- Implement Create/Edit Ad modal
- Add bulk operations (delete, activate, deactivate)
- Add export functionality (CSV/Excel)
- Add advanced analytics dashboard
- Implement ad scheduling calendar view
