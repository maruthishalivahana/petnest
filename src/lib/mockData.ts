// Mock data for admin dashboard

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'seller' | 'buyer';
    status: 'active' | 'banned';
    joinedDate: string;
    lastActive: string;
}

export interface SellerVerification {
    id: string;
    sellerName: string;
    email: string;
    businessName: string;
    phone: string;
    submittedOn: string;
    status: 'pending' | 'approved' | 'rejected';
    documents: string[];
}

export interface PetVerification {
    id: string;
    petName: string;
    species: string;
    breed: string;
    ownerName: string;
    ownerEmail: string;
    age: string;
    price: number;
    submittedOn: string;
    status: 'pending' | 'approved' | 'rejected';
    imageUrl: string;
}

export interface Advertisement {
    id: string;
    title: string;
    advertiser: string;
    email: string;
    createdDate: string;
    status: 'pending' | 'approved' | 'rejected';
    duration: string;
    budget: number;
    impressions: number;
}

export interface Species {
    id: string;
    name: string;
    breedCount: number;
    totalListing: number;
}

export interface Breed {
    id: string;
    name: string;
    speciesId: string;
    speciesName: string;
    totalListing: number;
}

export interface Report {
    id: string;
    reportType: 'user' | 'listing' | 'seller';
    reportedBy: string;
    reportedItem: string;
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
    createdDate: string;
}

export interface Activity {
    id: string;
    type: 'user_signup' | 'seller_verification' | 'pet_listing' | 'ad_request' | 'report';
    description: string;
    timestamp: string;
    status: 'success' | 'pending' | 'failed';
}

// Mock Users
export const mockUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'buyer',
        status: 'active',
        joinedDate: '2024-01-15',
        lastActive: '2024-12-28',
    },
    {
        id: '2',
        name: 'Sarah Smith',
        email: 'sarah.smith@example.com',
        role: 'seller',
        status: 'active',
        joinedDate: '2024-02-10',
        lastActive: '2024-12-29',
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        role: 'buyer',
        status: 'banned',
        joinedDate: '2024-03-20',
        lastActive: '2024-11-15',
    },
    {
        id: '4',
        name: 'Emily Brown',
        email: 'emily.brown@example.com',
        role: 'seller',
        status: 'active',
        joinedDate: '2024-04-05',
        lastActive: '2024-12-27',
    },
    {
        id: '5',
        name: 'David Wilson',
        email: 'david.w@example.com',
        role: 'admin',
        status: 'active',
        joinedDate: '2023-12-01',
        lastActive: '2024-12-29',
    },
    {
        id: '6',
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        role: 'buyer',
        status: 'active',
        joinedDate: '2024-05-12',
        lastActive: '2024-12-28',
    },
    {
        id: '7',
        name: 'Robert Taylor',
        email: 'rob.taylor@example.com',
        role: 'seller',
        status: 'active',
        joinedDate: '2024-06-18',
        lastActive: '2024-12-29',
    },
    {
        id: '8',
        name: 'Jennifer Martinez',
        email: 'jen.martinez@example.com',
        role: 'buyer',
        status: 'active',
        joinedDate: '2024-07-22',
        lastActive: '2024-12-26',
    },
];

// Mock Seller Verifications
export const mockSellerVerifications: SellerVerification[] = [
    {
        id: '1',
        sellerName: 'Alex Thompson',
        email: 'alex.t@petbreeder.com',
        businessName: 'Premium Paws Breeding',
        phone: '+1-555-0101',
        submittedOn: '2024-12-28',
        status: 'pending',
        documents: ['business_license.pdf', 'tax_id.pdf'],
    },
    {
        id: '2',
        sellerName: 'Maria Garcia',
        email: 'maria.g@dogsworld.com',
        businessName: 'Dogs World Kennel',
        phone: '+1-555-0102',
        submittedOn: '2024-12-27',
        status: 'pending',
        documents: ['license.pdf', 'certificate.pdf'],
    },
    {
        id: '3',
        sellerName: 'James Lee',
        email: 'james.lee@feline.com',
        businessName: 'Feline Friends',
        phone: '+1-555-0103',
        submittedOn: '2024-12-26',
        status: 'approved',
        documents: ['business_reg.pdf'],
    },
    {
        id: '4',
        sellerName: 'Patricia White',
        email: 'pat.white@exoticpets.com',
        businessName: 'Exotic Pets Paradise',
        phone: '+1-555-0104',
        submittedOn: '2024-12-25',
        status: 'rejected',
        documents: ['incomplete_docs.pdf'],
    },
    {
        id: '5',
        sellerName: 'Michael Chen',
        email: 'michael.c@aquaworld.com',
        businessName: 'Aqua World',
        phone: '+1-555-0105',
        submittedOn: '2024-12-24',
        status: 'pending',
        documents: ['business_license.pdf'],
    },
];

// Mock Pet Verifications
export const mockPetVerifications: PetVerification[] = [
    {
        id: '1',
        petName: 'Golden Boy',
        species: 'Dog',
        breed: 'Golden Retriever',
        ownerName: 'Sarah Smith',
        ownerEmail: 'sarah.smith@example.com',
        age: '2 years',
        price: 1500,
        submittedOn: '2024-12-28',
        status: 'pending',
        imageUrl: '/placeholder-dog.jpg',
    },
    {
        id: '2',
        petName: 'Fluffy',
        species: 'Cat',
        breed: 'Persian',
        ownerName: 'Emily Brown',
        ownerEmail: 'emily.brown@example.com',
        age: '1 year',
        price: 800,
        submittedOn: '2024-12-27',
        status: 'pending',
        imageUrl: '/placeholder-cat.jpg',
    },
    {
        id: '3',
        petName: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        ownerName: 'Robert Taylor',
        ownerEmail: 'rob.taylor@example.com',
        age: '3 years',
        price: 2000,
        submittedOn: '2024-12-26',
        status: 'approved',
        imageUrl: '/placeholder-dog2.jpg',
    },
    {
        id: '4',
        petName: 'Bella',
        species: 'Dog',
        breed: 'Labrador',
        ownerName: 'Lisa Anderson',
        ownerEmail: 'lisa.a@example.com',
        age: '1.5 years',
        price: 1200,
        submittedOn: '2024-12-25',
        status: 'rejected',
        imageUrl: '/placeholder-dog3.jpg',
    },
    {
        id: '5',
        petName: 'Whiskers',
        species: 'Cat',
        breed: 'Siamese',
        ownerName: 'Michael Chen',
        ownerEmail: 'michael.c@aquaworld.com',
        age: '2 years',
        price: 600,
        submittedOn: '2024-12-24',
        status: 'pending',
        imageUrl: '/placeholder-cat2.jpg',
    },
];

// Mock Advertisements
export const mockAdvertisements: Advertisement[] = [
    {
        id: '1',
        title: 'Premium Dog Food - Holiday Sale',
        advertiser: 'PetFoods Inc.',
        email: 'ads@petfoods.com',
        createdDate: '2024-12-28',
        status: 'pending',
        duration: '30 days',
        budget: 500,
        impressions: 0,
    },
    {
        id: '2',
        title: 'Veterinary Clinic Grand Opening',
        advertiser: 'City Vet Clinic',
        email: 'marketing@cityvet.com',
        createdDate: '2024-12-27',
        status: 'pending',
        duration: '14 days',
        budget: 300,
        impressions: 0,
    },
    {
        id: '3',
        title: 'Pet Grooming Services',
        advertiser: 'Pampered Paws',
        email: 'info@pamperedpaws.com',
        createdDate: '2024-12-20',
        status: 'approved',
        duration: '30 days',
        budget: 400,
        impressions: 12500,
    },
    {
        id: '4',
        title: 'Cat Toys Clearance Sale',
        advertiser: 'Pet Toys World',
        email: 'sales@pettoysworld.com',
        createdDate: '2024-12-15',
        status: 'approved',
        duration: '60 days',
        budget: 800,
        impressions: 25000,
    },
    {
        id: '5',
        title: 'Dog Training Classes',
        advertiser: 'K9 Academy',
        email: 'info@k9academy.com',
        createdDate: '2024-12-10',
        status: 'rejected',
        duration: '30 days',
        budget: 350,
        impressions: 0,
    },
];

// Mock Species
export const mockSpecies: Species[] = [
    { id: '1', name: 'Dog', breedCount: 145, totalListing: 3245 },
    { id: '2', name: 'Cat', breedCount: 78, totalListing: 2156 },
    { id: '3', name: 'Bird', breedCount: 56, totalListing: 789 },
    { id: '4', name: 'Fish', breedCount: 234, totalListing: 1567 },
    { id: '5', name: 'Rabbit', breedCount: 32, totalListing: 456 },
    { id: '6', name: 'Hamster', breedCount: 18, totalListing: 234 },
    { id: '7', name: 'Guinea Pig', breedCount: 12, totalListing: 178 },
    { id: '8', name: 'Reptile', breedCount: 89, totalListing: 567 },
];

// Mock Breeds
export const mockBreeds: Breed[] = [
    { id: '1', name: 'Golden Retriever', speciesId: '1', speciesName: 'Dog', totalListing: 234 },
    { id: '2', name: 'Labrador', speciesId: '1', speciesName: 'Dog', totalListing: 345 },
    { id: '3', name: 'German Shepherd', speciesId: '1', speciesName: 'Dog', totalListing: 289 },
    { id: '4', name: 'Bulldog', speciesId: '1', speciesName: 'Dog', totalListing: 156 },
    { id: '5', name: 'Persian', speciesId: '2', speciesName: 'Cat', totalListing: 412 },
    { id: '6', name: 'Siamese', speciesId: '2', speciesName: 'Cat', totalListing: 298 },
    { id: '7', name: 'Maine Coon', speciesId: '2', speciesName: 'Cat', totalListing: 187 },
    { id: '8', name: 'British Shorthair', speciesId: '2', speciesName: 'Cat', totalListing: 223 },
    { id: '9', name: 'Parakeet', speciesId: '3', speciesName: 'Bird', totalListing: 145 },
    { id: '10', name: 'Cockatiel', speciesId: '3', speciesName: 'Bird', totalListing: 98 },
];

// Mock Reports
export const mockReports: Report[] = [
    {
        id: '1',
        reportType: 'listing',
        reportedBy: 'john.doe@example.com',
        reportedItem: 'Pet Listing #4532',
        reason: 'Suspicious pricing - too low',
        status: 'pending',
        createdDate: '2024-12-28',
    },
    {
        id: '2',
        reportType: 'seller',
        reportedBy: 'lisa.a@example.com',
        reportedItem: 'Seller: Quick Pets LLC',
        reason: 'Fake documents provided',
        status: 'pending',
        createdDate: '2024-12-27',
    },
    {
        id: '3',
        reportType: 'user',
        reportedBy: 'sarah.smith@example.com',
        reportedItem: 'User: spam_account_123',
        reason: 'Spam messages to multiple sellers',
        status: 'resolved',
        createdDate: '2024-12-26',
    },
];

// Mock Recent Activity
export const mockRecentActivity: Activity[] = [
    {
        id: '1',
        type: 'user_signup',
        description: 'New user registered: Jennifer Martinez',
        timestamp: '2024-12-29T10:30:00',
        status: 'success',
    },
    {
        id: '2',
        type: 'seller_verification',
        description: 'Seller verification submitted: Alex Thompson',
        timestamp: '2024-12-29T09:15:00',
        status: 'pending',
    },
    {
        id: '3',
        type: 'pet_listing',
        description: 'New pet listing: Golden Boy (Golden Retriever)',
        timestamp: '2024-12-29T08:45:00',
        status: 'pending',
    },
    {
        id: '4',
        type: 'ad_request',
        description: 'Advertisement request: Premium Dog Food Sale',
        timestamp: '2024-12-28T16:20:00',
        status: 'pending',
    },
    {
        id: '5',
        type: 'report',
        description: 'New report filed: Suspicious pricing on listing',
        timestamp: '2024-12-28T14:10:00',
        status: 'pending',
    },
    {
        id: '6',
        type: 'user_signup',
        description: 'New user registered: Robert Taylor',
        timestamp: '2024-12-28T11:30:00',
        status: 'success',
    },
    {
        id: '7',
        type: 'pet_listing',
        description: 'Pet listing approved: Max (German Shepherd)',
        timestamp: '2024-12-27T15:45:00',
        status: 'success',
    },
    {
        id: '8',
        type: 'seller_verification',
        description: 'Seller verification approved: James Lee',
        timestamp: '2024-12-27T13:20:00',
        status: 'success',
    },
];

// Dashboard Statistics
export const mockDashboardStats = {
    totalUsers: 1234,
    activeSellers: 456,
    pendingSellerRequests: 12,
    pendingAds: 5,
    verifiedPets: 789,
    pendingPetVerifications: 8,
    activeListings: 3245,
    totalReports: 23,
};
