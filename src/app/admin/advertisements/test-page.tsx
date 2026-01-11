'use client';

/**
 * Advertisement API Test Page
 * Tests all advertisement APIs to ensure they work properly
 */

import { useState } from 'react';
import {
    getAdvertisementsWithFilters,
    toggleAdStatus,
    createAd,
    updateAd,
    getAdById,
    deleteAdvertisement,
    duplicateAdvertisement,
    getAllAdRequests,
    updateAdRequestStatus
} from '@/services/admin/adminAdvertisementService';
import {
    getActiveAds,
    trackAdImpression,
    trackAdClick,
    getFeedWithAds,
    submitAdvertisementRequest
} from '@/services/advertisementApi';
import type { AdListing } from '@/types/advertisement.types';

export default function AdvertisementAPITestPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const runTest = async (testName: string, testFn: () => Promise<any>) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log(`\n🧪 Running test: ${testName}`);
            const data = await testFn();
            console.log(`✅ Success:`, data);
            setResult(data);
        } catch (err: any) {
            console.error(`❌ Error:`, err);
            setError(err.message || 'Test failed');
        } finally {
            setLoading(false);
        }
    };

    // Test Functions
    const tests = {
        // Admin Tests
        getAllAds: () => runTest('Get All Ads', async () => {
            return await getAdvertisementsWithFilters();
        }),

        getFilteredAds: () => runTest('Get All Ads (No Filters)', async () => {
            return await getAdvertisementsWithFilters();
        }),

        searchAds: () => runTest('Get All Ads', async () => {
            return await getAdvertisementsWithFilters();
        }),

        getAdById: () => runTest('Get Ad by ID', async () => {
            // Replace with actual ad ID from your database
            const testAdId = prompt('Enter Ad ID to fetch:');
            if (!testAdId) throw new Error('No Ad ID provided');
            return await getAdById(testAdId);
        }),

        toggleAd: () => runTest('Toggle Ad Status', async () => {
            const testAdId = prompt('Enter Ad ID to toggle:');
            if (!testAdId) throw new Error('No Ad ID provided');
            return await toggleAdStatus(testAdId);
        }),

        createAd: () => runTest('Create Ad', async () => {
            // Create test ad
            return await createAd({
                title: 'Test Ad - ' + new Date().toISOString(),
                imageUrl: 'https://via.placeholder.com/728x90',
                placement: 'home_top_banner',
                device: 'both',
                ctaText: 'Click Me',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                isActive: true,
                targetPages: ['/home'],
                redirectUrl: 'https://example.com'
            } as any);
        }),

        updateAd: () => runTest('Update Ad', async () => {
            const testAdId = prompt('Enter Ad ID to update:');
            if (!testAdId) throw new Error('No Ad ID provided');
            return await updateAd(testAdId, {
                title: 'Updated Title - ' + new Date().toISOString(),
                ctaText: 'Updated CTA'
            });
        }),

        duplicateAd: () => runTest('Duplicate Ad', async () => {
            const testAdId = prompt('Enter Ad ID to duplicate:');
            if (!testAdId) throw new Error('No Ad ID provided');
            return await duplicateAdvertisement(testAdId);
        }),

        deleteAd: () => runTest('Delete Ad', async () => {
            const testAdId = prompt('Enter Ad ID to delete:');
            if (!testAdId) throw new Error('No Ad ID provided');
            if (!confirm('Are you sure you want to delete this ad?')) {
                throw new Error('Deletion cancelled');
            }
            return await deleteAdvertisement(testAdId);
        }),

        getAllAdRequests: () => runTest('Get All Ad Requests', async () => {
            return await getAllAdRequests();
        }),

        approveAdRequest: () => runTest('Approve Ad Request', async () => {
            const requestId = prompt('Enter Ad Request ID to approve:');
            if (!requestId) throw new Error('No Request ID provided');
            return await updateAdRequestStatus(requestId, {
                status: 'approved'
            });
        }),

        // Public Tests
        getPublicAds: () => runTest('Get Public Active Ads', async () => {
            return await getActiveAds();
        }),

        trackImpression: () => runTest('Track Ad Impression', async () => {
            const testAdId = prompt('Enter Ad ID to track impression:');
            if (!testAdId) throw new Error('No Ad ID provided');
            return await trackAdImpression(testAdId);
        }),

        trackClick: () => runTest('Track Ad Click', async () => {
            const testAdId = prompt('Enter Ad ID to track click:');
            if (!testAdId) throw new Error('No Ad ID provided');
            return await trackAdClick(testAdId);
        }),

        getFeed: () => runTest('Get Feed with Ads', async () => {
            return await getFeedWithAds();
        }),

        submitAdRequest: () => runTest('Submit Ad Request', async () => {
            return await submitAdvertisementRequest({
                brandName: 'Test Brand - ' + new Date().toISOString(),
                contactEmail: 'test@example.com',
                contactNumber: '+1234567890',
                requestedPlacement: 'home_top_banner',
                message: 'This is a test ad request',
                mediaUrl: 'https://via.placeholder.com/728x90'
            });
        })
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Advertisement API Test Suite</h1>
                <p className="text-gray-600 mb-8">Test all advertisement endpoints to verify implementation</p>

                {/* Admin API Tests */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">🔒 Admin APIs (Protected)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <button onClick={tests.getAllAds} className="btn-test">Get All Ads</button>
                        <button onClick={tests.getFilteredAds} className="btn-test">Get Filtered Ads</button>
                        <button onClick={tests.searchAds} className="btn-test">Search Ads</button>
                        <button onClick={tests.getAdById} className="btn-test">Get Ad by ID</button>
                        <button onClick={tests.toggleAd} className="btn-test">Toggle Ad</button>
                        <button onClick={tests.createAd} className="btn-test">Create Ad</button>
                        <button onClick={tests.updateAd} className="btn-test">Update Ad</button>
                        <button onClick={tests.duplicateAd} className="btn-test">Duplicate Ad</button>
                        <button onClick={tests.deleteAd} className="btn-test bg-red-500 hover:bg-red-600">Delete Ad</button>
                        <button onClick={tests.getAllAdRequests} className="btn-test">Get Ad Requests</button>
                        <button onClick={tests.approveAdRequest} className="btn-test">Approve Request</button>
                    </div>
                </div>

                {/* Public API Tests */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">🌐 Public APIs (No Auth)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <button onClick={tests.getPublicAds} className="btn-test">Get Active Ads</button>
                        <button onClick={tests.trackImpression} className="btn-test">Track Impression</button>
                        <button onClick={tests.trackClick} className="btn-test">Track Click</button>
                        <button onClick={tests.getFeed} className="btn-test">Get Feed</button>
                        <button onClick={tests.submitAdRequest} className="btn-test">Submit Ad Request</button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-700">⏳ Running test...</p>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <h3 className="text-red-700 font-semibold mb-2">❌ Error</h3>
                        <pre className="text-red-600 text-sm overflow-auto">{error}</pre>
                    </div>
                )}

                {/* Result Display */}
                {result && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-green-700 font-semibold mb-2">✅ Success</h3>
                        <pre className="bg-white p-4 rounded text-sm overflow-auto max-h-96 border">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <h3 className="text-yellow-800 font-semibold mb-2">📝 Instructions</h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Make sure you are logged in as an admin to test protected endpoints</li>
                        <li>• Check browser console for detailed logs</li>
                        <li>• Some tests require Ad ID - get one from "Get All Ads" first</li>
                        <li>• Open Network tab to see actual API requests</li>
                        <li>• Create an ad before testing update/toggle/delete operations</li>
                    </ul>
                </div>
            </div>

            <style jsx>{`
        .btn-test {
          @apply px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                 transition-colors text-sm font-medium shadow-sm;
        }
      `}</style>
        </div>
    );
}
