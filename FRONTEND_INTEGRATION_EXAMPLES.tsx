// Example React/TypeScript Frontend Integration for Admin Dashboard

// ============= TYPE DEFINITIONS =============
interface SellerVerificationStats {
    pending: number;
    approved: number;
    rejected: number;
}

interface PetVerificationStats {
    pending: number;
    approved: number;
    rejected: number;
}

interface UserManagementStats {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    sellers: number;
}

interface Seller {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        profilePic?: string;
        createdAt: string;
    };
    brandName: string;
    logoUrl?: string;
    status: 'pending' | 'verified' | 'rejected';
    documents?: {
        idProof?: string;
        certificate?: string;
        shopImage?: string;
    };
    createdAt: string;
}

interface Pet {
    _id: string;
    name: string;
    sellerId: {
        _id: string;
        brandName: string;
        logoUrl?: string;
    };
    breedId: {
        _id: string;
        name: string;
    };
    breedName: string;
    gender: 'male' | 'female' | 'unknown';
    age?: string;
    price?: number;
    images?: string[];
    isVerified: boolean;
    status: string;
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    profilePic?: string;
    phoneNumber?: string;
    isBanned: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============= API SERVICE =============
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken'); // Or however you store the token
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const adminAPI = {
    // Seller Verification
    async getSellerVerificationStats(): Promise<SellerVerificationStats> {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/seller-verification-stats`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.data;
    },

    async getSellersByStatus(status: 'pending' | 'verified' | 'rejected'): Promise<Seller[]> {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/sellers/${status}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.data;
    },

    // Pet Verification
    async getPetVerificationStats(): Promise<PetVerificationStats> {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/pet-verification-stats`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.data;
    },

    async getPetsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Pet[]> {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/pets/${status}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.data;
    },

    // User Management
    async getUserManagementStats(): Promise<UserManagementStats> {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/user-management-stats`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.data;
    },

    async getFilteredUsers(params: {
        role?: 'buyer' | 'seller' | 'admin';
        status?: 'active' | 'banned';
        searchQuery?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const queryParams = new URLSearchParams();
        if (params.role) queryParams.append('role', params.role);
        if (params.status) queryParams.append('status', params.status);
        if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(
            `${API_BASE_URL}/admin/dashboard/users?${queryParams.toString()}`,
            { headers: getAuthHeaders() }
        );
        const data = await response.json();
        return {
            data: data.data,
            total: data.total,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages
        };
    },

    async getUserDetails(userId: string): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/users/${userId}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.data;
    },

    // User Actions
    async banUser(userId: string): Promise<void> {
        await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
    },

    async unbanUser(userId: string): Promise<void> {
        await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
    },

    async deleteUser(userId: string): Promise<void> {
        await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    }
};

// ============= REACT COMPONENT EXAMPLES =============

// 1. Seller Verification Page Component
export function SellerVerificationPage() {
    const [stats, setStats] = React.useState<SellerVerificationStats | null>(null);
    const [sellers, setSellers] = React.useState<Seller[]>([]);
    const [activeTab, setActiveTab] = React.useState<'pending' | 'verified' | 'rejected'>('pending');

    React.useEffect(() => {
        // Load stats
        adminAPI.getSellerVerificationStats().then(setStats);
    }, []);

    React.useEffect(() => {
        // Load sellers based on active tab
        adminAPI.getSellersByStatus(activeTab).then(setSellers);
    }, [activeTab]);

    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <h1>Seller Verification</h1>
            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Pending</h3>
                    <p>{stats.pending}</p>
                </div>
                <div className="stat-card">
                    <h3>Approved</h3>
                    <p>{stats.approved}</p>
                </div>
                <div className="stat-card">
                    <h3>Rejected</h3>
                    <p>{stats.rejected}</p>
                </div>
            </div>

            <div className="tabs">
                <button onClick={() => setActiveTab('pending')}>Pending</button>
                <button onClick={() => setActiveTab('verified')}>Verified</button>
                <button onClick={() => setActiveTab('rejected')}>Rejected</button>
            </div>

            <div className="seller-list">
                {sellers.map(seller => (
                    <div key={seller._id} className="seller-card">
                        <h3>{seller.brandName}</h3>
                        <p>{seller.userId.name} - {seller.userId.email}</p>
                        <p>Status: {seller.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 2. Pet Verification Page Component
export function PetVerificationPage() {
    const [stats, setStats] = React.useState<PetVerificationStats | null>(null);
    const [pets, setPets] = React.useState<Pet[]>([]);
    const [activeTab, setActiveTab] = React.useState<'pending' | 'approved' | 'rejected'>('pending');

    React.useEffect(() => {
        adminAPI.getPetVerificationStats().then(setStats);
    }, []);

    React.useEffect(() => {
        adminAPI.getPetsByStatus(activeTab).then(setPets);
    }, [activeTab]);

    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <h1>Pet Verification</h1>
            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Pending</h3>
                    <p>{stats.pending}</p>
                </div>
                <div className="stat-card">
                    <h3>Approved</h3>
                    <p>{stats.approved}</p>
                </div>
                <div className="stat-card">
                    <h3>Rejected</h3>
                    <p>{stats.rejected}</p>
                </div>
            </div>

            <div className="tabs">
                <button onClick={() => setActiveTab('pending')}>Pending</button>
                <button onClick={() => setActiveTab('approved')}>Approved</button>
                <button onClick={() => setActiveTab('rejected')}>Rejected</button>
            </div>

            <div className="pet-list">
                {pets.map(pet => (
                    <div key={pet._id} className="pet-card">
                        <h3>{pet.name}</h3>
                        <p>Breed: {pet.breedName}</p>
                        <p>Seller: {pet.sellerId.brandName}</p>
                        <p>Price: ₹{pet.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 3. User Management Page Component
export function UserManagementPage() {
    const [stats, setStats] = React.useState<UserManagementStats | null>(null);
    const [users, setUsers] = React.useState<User[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [roleFilter, setRoleFilter] = React.useState<'buyer' | 'seller' | 'admin' | ''>('');
    const [statusFilter, setStatusFilter] = React.useState<'active' | 'banned' | ''>('');
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);

    React.useEffect(() => {
        adminAPI.getUserManagementStats().then(setStats);
    }, []);

    React.useEffect(() => {
        const params: any = { page, limit: 10 };
        if (roleFilter) params.role = roleFilter;
        if (statusFilter) params.status = statusFilter;
        if (searchQuery) params.searchQuery = searchQuery;

        adminAPI.getFilteredUsers(params).then(result => {
            setUsers(result.data);
            setTotalPages(result.totalPages);
        });
    }, [searchQuery, roleFilter, statusFilter, page]);

    const handleBanUser = async (userId: string) => {
        await adminAPI.banUser(userId);
        // Refresh the list
        window.location.reload();
    };

    const handleUnbanUser = async (userId: string) => {
        await adminAPI.unbanUser(userId);
        window.location.reload();
    };

    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <h1>User Management</h1>
            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Active</h3>
                    <p>{stats.activeUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Banned</h3>
                    <p>{stats.bannedUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Sellers</h3>
                    <p>{stats.sellers}</p>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}>
                    <option value="">All Roles</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                </select>
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isBanned ? 'Banned' : 'Active'}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                {user.isBanned ? (
                                    <button onClick={() => handleUnbanUser(user._id)}>Unban</button>
                                ) : (
                                    <button onClick={() => handleBanUser(user._id)}>Ban</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}

// ============= CUSTOM HOOKS =============

export function useSellerVerificationStats() {
    const [stats, setStats] = React.useState<SellerVerificationStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        adminAPI.getSellerVerificationStats()
            .then(setStats)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading, error };
}

export function usePetVerificationStats() {
    const [stats, setStats] = React.useState<PetVerificationStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        adminAPI.getPetVerificationStats()
            .then(setStats)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading, error };
}

export function useUserManagementStats() {
    const [stats, setStats] = React.useState<UserManagementStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        adminAPI.getUserManagementStats()
            .then(setStats)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading, error };
}
