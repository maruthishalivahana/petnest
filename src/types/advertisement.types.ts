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
    adSpot: string;
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
