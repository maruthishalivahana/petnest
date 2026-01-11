/**
 * Advertisement Types
 * Shared type definitions for the advertisement system
 */

export type AdSpotType = 'homepageBanner' | 'sidebar' | 'footer' | 'blogFeature';

// Placement types for new ad system
export type PlacementType =
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

export type DeviceType = 'mobile' | 'desktop' | 'both';

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

// New Ad Listing structure from /v1/api/ads/ads
export interface AdListing {
    _id: string;
    title: string;
    subtitle?: string;
    tagline?: string;
    brandName: string;
    imageUrl: string;
    ctaText: string;
    redirectUrl: string;
    placement: PlacementType;
    device: DeviceType;
    targetPages: string[];
    startDate: string;
    endDate: string;
    impressions: number;
    clicks: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Admin specific advertisement interface
export interface AdminAdvertisement extends Advertisement {
    status?: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
}

export interface AdvertisementResponse {
    message: string;
    data: Advertisement[];
}

export interface SingleAdvertisementResponse {
    message: string;
    data: Advertisement;
}

export interface AdvertisementRequestData {
    brandName: string;
    contactEmail: string;
    contactNumber: string;
    requestedPlacement: string;
    message: string;
    mediaUrl: string;
}

export interface AdvertisementFilters {
    adSpot?: AdSpotType;
    isApproved?: boolean;
    limit?: number;
    skip?: number;
}

export interface AdDisplayProps {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    badge: string;
    button: string;
    link: string;
    gradient: string;
}

/**
 * Props for AdBanner component
 */
export interface AdBannerProps {
    autoplayDelay?: number;
    showNavigation?: boolean;
    showDots?: boolean;
    className?: string;
}

/**
 * Props for AdvertisementDisplay component
 */
export interface AdvertisementDisplayProps {
    maxAds?: number;
    columns?: 1 | 2 | 3 | 4;
    showContactInfo?: boolean;
    className?: string;
}

/**
 * Props for AdSidebar component
 */
export interface AdSidebarProps {
    adSpot?: AdSpotType;
    maxAds?: number;
    className?: string;
    showTitle?: boolean;
}

/**
 * Advertisement API Error Response
 */
export interface AdvertisementError {
    message: string;
    error?: string;
    statusCode?: number;
}

/**
 * Create Ad DTO (for POST /admin/ads)
 */
export interface CreateAdDTO {
    title: string;
    description?: string;
    imageUrl: string;
    targetUrl: string;
    ctaText?: string;
    placement: PlacementType;
    device: DeviceType;
    targetPages?: string[];
    startDate: string;
    endDate: string;
    isActive?: boolean;
}

/**
 * Update Ad DTO (for PATCH /admin/ads/:id)
 */
export interface UpdateAdDTO {
    title?: string;
    description?: string;
    imageUrl?: string;
    targetUrl?: string;
    ctaText?: string;
    placement?: PlacementType;
    device?: DeviceType;
    targetPages?: string[];
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

/**
 * Ad Request (for advertisement requests from businesses)
 * Matches the actual database structure
 */
export interface AdRequest {
    _id: string;
    brandName: string;
    contactEmail: string;
    contactNumber: string;
    requestedPlacement: string;
    message: string;
    mediaUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

/**
 * Update Ad Request Status DTO
 */
export interface UpdateAdRequestStatusDTO {
    status: 'approved' | 'rejected';
    rejectionReason?: string;
}

/**
 * API Response for GET /ads (public)
 */
export interface GetActiveAdsResponse {
    success: boolean;
    data: AdListing[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * API Response for GET /admin/ad-requests
 */
export interface GetAdRequestsResponse {
    success: boolean;
    data: AdRequest[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Feed Item (for GET /feed)
 */
export interface FeedItem {
    type: 'pet' | 'ad';
    data: any; // Pet or AdListing
}

/**
 * Feed Response
 */
export interface FeedResponse {
    success: boolean;
    data: FeedItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Generic API Success Response
 */
export interface ApiSuccessResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}
