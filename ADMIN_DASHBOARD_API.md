# Admin Dashboard API Documentation

This document describes the new admin dashboard endpoints implemented to support the frontend UI shown in the screenshots.

## Base URL
All admin routes are prefixed with `/api/admin` (adjust based on your route setup)

## Authentication
All endpoints require:
- Valid JWT token in Authorization header: `Bearer <token>`
- User role must be `admin`

---

## 1. Seller Verification Section

### Get Seller Verification Statistics
**Endpoint:** `GET /dashboard/seller-verification-stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "pending": 0,
    "approved": 0,
    "rejected": 0
  }
}
```

### Get Sellers by Status
**Endpoint:** `GET /dashboard/sellers/:status`

**Parameters:**
- `status` (path): `pending` | `verified` | `rejected`

**Response:**
```json
{
  "success": true,
  "count": 0,
  "data": [
    {
      "_id": "seller_id",
      "userId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePic": "url",
        "createdAt": "2025-01-01T00:00:00.000Z"
      },
      "brandName": "Pet Paradise",
      "logoUrl": "url",
      "status": "pending",
      "documents": {
        "idProof": "url",
        "certificate": "url",
        "shopImage": "url"
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 2. Pet Verification Section

### Get Pet Verification Statistics
**Endpoint:** `GET /dashboard/pet-verification-stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "pending": 0,
    "approved": 0,
    "rejected": 0
  }
}
```

### Get Pets by Verification Status
**Endpoint:** `GET /dashboard/pets/:status`

**Parameters:**
- `status` (path): `pending` | `approved` | `rejected`

**Response:**
```json
{
  "success": true,
  "count": 0,
  "data": [
    {
      "_id": "pet_id",
      "name": "Max",
      "sellerId": {
        "_id": "seller_id",
        "brandName": "Pet Paradise",
        "logoUrl": "url"
      },
      "breedId": {
        "_id": "breed_id",
        "name": "Golden Retriever"
      },
      "breedName": "Golden Retriever",
      "gender": "male",
      "age": "2 months",
      "price": 50000,
      "images": ["url1", "url2"],
      "isVerified": false,
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 3. User Management Section

### Get User Management Statistics
**Endpoint:** `GET /dashboard/user-management-stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 0,
    "activeUsers": 0,
    "bannedUsers": 0,
    "sellers": 0
  }
}
```

### Get Filtered Users (with Search & Pagination)
**Endpoint:** `GET /dashboard/users`

**Query Parameters:**
- `role` (optional): `buyer` | `seller` | `admin`
- `status` (optional): `active` | `banned`
- `searchQuery` (optional): Search by name or email
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```
GET /dashboard/users?role=seller&status=active&searchQuery=john&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "seller",
      "profilePic": "url",
      "phoneNumber": "+1234567890",
      "isBanned": false,
      "isVerified": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Get User Details
**Endpoint:** `GET /dashboard/users/:userId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seller",
    "profilePic": "url",
    "phoneNumber": "+1234567890",
    "isBanned": false,
    "isVerified": true,
    "sellerInfo": {
      "_id": "seller_id",
      "brandName": "Pet Paradise",
      "logoUrl": "url",
      "status": "verified"
    },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## 4. Existing User Actions (Already Available)

### Ban User
**Endpoint:** `PATCH /users/:userId/ban`

### Unban User
**Endpoint:** `PATCH /users/:userId/unban`

### Delete User
**Endpoint:** `DELETE /users/:userId`

---

## Frontend Integration Guide

### 1. Seller Verification Page
```javascript
// Fetch stats
const response = await fetch('/api/admin/dashboard/seller-verification-stats', {
  headers: { Authorization: `Bearer ${token}` }
});
const { data } = await response.json();
// Display: data.pending, data.approved, data.rejected

// Fetch sellers by status
const sellersRes = await fetch('/api/admin/dashboard/sellers/pending', {
  headers: { Authorization: `Bearer ${token}` }
});
const { data: sellers } = await sellersRes.json();
```

### 2. Pet Verification Page
```javascript
// Fetch stats
const response = await fetch('/api/admin/dashboard/pet-verification-stats', {
  headers: { Authorization: `Bearer ${token}` }
});
const { data } = await response.json();

// Fetch pending pets
const petsRes = await fetch('/api/admin/dashboard/pets/pending', {
  headers: { Authorization: `Bearer ${token}` }
});
const { data: pets } = await petsRes.json();
```

### 3. User Management Page
```javascript
// Fetch stats
const statsRes = await fetch('/api/admin/dashboard/user-management-stats', {
  headers: { Authorization: `Bearer ${token}` }
});
const { data: stats } = await statsRes.json();

// Fetch filtered users with search
const usersRes = await fetch(
  `/api/admin/dashboard/users?searchQuery=${search}&role=${role}&status=${status}&page=${page}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const { data: users, total, totalPages } = await usersRes.json();
```

### 4. Species & Breeds Page
The existing routes already support this:
- `GET /admin/species` - Get all species
- `POST /admin/species` - Add species
- `DELETE /admin/species/:id` - Delete species
- `GET /admin/breeds` - Get all breeds
- `POST /admin/breeds` - Add breed
- `DELETE /admin/breeds/:id` - Delete breed

---

## Files Created/Modified

### New Files in `src/modules/user/`:
1. **admin.types.ts** - TypeScript types for admin operations
2. **admin.repo.ts** - Database queries for admin dashboard
3. **admin.service.ts** - Business logic for admin operations
4. **admin.controller.ts** - Request handlers for admin endpoints

### Modified Files:
1. **src/modules/user/index.ts** - Added exports for admin modules
2. **src/routes/admin.routes.ts** - Added new dashboard routes

---

## Security Notes

1. All endpoints are protected by `verifyToken` middleware
2. All endpoints require `admin` role via `requireRole(['admin'])` middleware
3. Sensitive user data (password, OTP) is excluded from responses
4. User queries support safe filtering with MongoDB operators

---

## Testing the Endpoints

You can test these endpoints using tools like Postman or curl:

```bash
# Get seller verification stats
curl -X GET http://localhost:3000/api/admin/dashboard/seller-verification-stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get pending sellers
curl -X GET http://localhost:3000/api/admin/dashboard/sellers/pending \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search users
curl -X GET "http://localhost:3000/api/admin/dashboard/users?searchQuery=john&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

- All statistics are calculated in real-time from the database
- Pagination is implemented for user listing to handle large datasets
- Search is case-insensitive and searches both name and email fields
- The seller info is automatically included for users with `seller` role
