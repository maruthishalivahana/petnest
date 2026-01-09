/**
 * Ad Tracking Utility for PetNest Advertisement System
 * Handles impression and click tracking with proper debouncing and error handling
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

class AdTracker {
    private trackedImpressions: Set<string>;
    private observers: Map<string, IntersectionObserver>;

    constructor() {
        this.trackedImpressions = new Set();
        this.observers = new Map();
    }

    /**
     * Track ad impression when it becomes visible
     * Fires when ad is 50% visible for at least 1 second
     */
    trackImpression(adId: string, element: HTMLElement) {
        // Skip if already tracked
        if (this.trackedImpressions.has(adId)) {
            return;
        }

        // Create intersection observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.5
                    ) {
                        // Wait 1 second before tracking
                        setTimeout(() => {
                            this.fireImpression(adId);
                        }, 1000);
                        // Disconnect after tracking
                        observer.disconnect();
                        this.observers.delete(adId);
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        // Observe the element
        observer.observe(element);
        this.observers.set(adId, observer);
    }

    /**
     * Fire impression tracking request
     */
    private async fireImpression(adId: string) {
        if (this.trackedImpressions.has(adId)) {
            return;
        }

        try {
            await fetch(`${BASE_URL}/v1/api/advertisements/${adId}/impression`, {
                method: 'POST',
                keepalive: true, // Important for tracking when page unloads
            });
            this.trackedImpressions.add(adId);
        } catch (error) {
            // Fail silently - don't break user experience
            console.debug('Failed to track impression:', error);
        }
    }

    /**
     * Track ad click and redirect
     * Waits max 500ms for tracking request before redirecting
     */
    async trackClick(adId: string, redirectUrl: string) {
        try {
            // Race between tracking request and 500ms timeout
            await Promise.race([
                fetch(`${BASE_URL}/v1/api/advertisements/${adId}/click`, {
                    method: 'POST',
                    keepalive: true,
                }),
                new Promise((resolve) => setTimeout(resolve, 500)),
            ]);
        } catch (error) {
            // Fail silently
            console.debug('Failed to track click:', error);
        } finally {
            // Always redirect, even if tracking fails
            window.open(redirectUrl, '_blank');
        }
    }

    /**
     * Clean up all observers
     */
    cleanup() {
        this.observers.forEach((observer) => observer.disconnect());
        this.observers.clear();
    }

    /**
     * Reset tracked impressions (useful for page navigation)
     */
    reset() {
        this.trackedImpressions.clear();
        this.cleanup();
    }
}

// Export singleton instance
export const adTracker = new AdTracker();

// Export class for testing or multiple instances
export default AdTracker;
