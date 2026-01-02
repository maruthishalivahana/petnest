"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllUsers, banUserThunk, unbanUserThunk, deleteUserThunk } from '@/store/slices/adminUsersSlice';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    MoreVertical,
    Ban,
    CheckCircle,
    Trash2,
    Filter,
    Users as UsersIcon,
    Loader2
} from 'lucide-react';

function UserManagementContent() {
    const dispatch = useAppDispatch();
    const { users, loading } = useAppSelector((state) => state.adminUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        // Only fetch if we don't have data and not already loading
        if (users.length === 0 && !loading) {
            dispatch(fetchAllUsers());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Memoize filtered users to prevent recalculation on every render
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = filterRole === 'all' || user.role === filterRole;
            const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, filterRole, filterStatus]);

    // Memoize stats calculation
    const stats = useMemo(() => [
        { label: 'Total Users', value: users.length, color: 'text-blue-600' },
        { label: 'Active', value: users.filter(u => u.status === 'active').length, color: 'text-green-600' },
        { label: 'Banned', value: users.filter(u => u.status === 'banned').length, color: 'text-red-600' },
        { label: 'Sellers', value: users.filter(u => u.role === 'seller').length, color: 'text-purple-600' },
    ], [users]);

    const handleBanUser = async (userId: string) => {
        await dispatch(banUserThunk(userId));
    };

    const handleUnbanUser = async (userId: string) => {
        await dispatch(unbanUserThunk(userId));
    };

    const handleDeleteUser = async (userId: string) => {
        await dispatch(deleteUserThunk(userId));
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
            case 'seller':
                return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'buyer':
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'banned':
                return 'bg-red-100 text-red-700 hover:bg-red-100';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                                <UsersIcon className={`w-8 h-8 ${stat.color} opacity-20`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="w-4 h-4" />
                                        Role: {filterRole === 'all' ? 'All' : filterRole}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setFilterRole('all')}>
                                        All Roles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterRole('admin')}>
                                        Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterRole('seller')}>
                                        Seller
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterRole('buyer')}>
                                        Buyer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="w-4 h-4" />
                                        Status: {filterStatus === 'all' ? 'All' : filterStatus}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                        All Status
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                                        Active
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('banned')}>
                                        Banned
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Active</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge className={getStatusBadgeColor(user.status)}>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {user.lastActive ? new Date(user.lastActive).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {user.status === 'active' ? (
                                                        <DropdownMenuItem
                                                            onClick={() => handleBanUser(user.id)}
                                                            className="text-orange-600"
                                                        >
                                                            <Ban className="w-4 h-4 mr-2" />
                                                            Ban User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() => handleUnbanUser(user.id)}
                                                            className="text-green-600"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Unban User
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No users found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function UserManagementPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <UserManagementContent />
        </ProtectedRoute>
    );
}
