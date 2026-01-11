# Fix: Advertisement Request Form - requestedPlacement Field Missing

## Issue
The ad request form is returning a 400 error because the `requestedPlacement` field is not being sent in the request body.

## Error
```json
{
    "success": false,
    "message": "Validation error",
    "errors": [
        {
            "field": "requestedPlacement",
            "message": "Invalid input: expected string, received undefined"
        }
    ]
}
```

## Solution

### 1. Update Form Field Name
Ensure your form's "Advertisement Placement" dropdown is mapped to the key `requestedPlacement`:

```typescript
// In your form state/values
const [formData, setFormData] = useState({
  brandName: '',
  contactEmail: '',
  contactNumber: '',
  requestedPlacement: '', // ← This must be named exactly like this
  message: '',
  mediaUrl: ''
});
```

### 2. Dropdown Value Mapping
Map the dropdown options to backend-compatible values:

```typescript
const placementOptions = [
  { label: 'Homepage Banner (Premium)', value: 'home_top_banner' },
  { label: 'Sidebar Advertisement', value: 'home_sidebar' },
  { label: 'Footer Advertisement', value: 'footer' },
  { label: 'Blog Feature Spot', value: 'blog_feature' }
];
```

### 3. API Request Payload
Your submission should send this exact structure:

```typescript
const submitAdRequest = async () => {
  const payload = {
    brandName: formData.brandName,
    contactEmail: formData.contactEmail,
    contactNumber: formData.contactNumber,
    requestedPlacement: formData.requestedPlacement, // ← Must be included
    message: formData.message,
    mediaUrl: formData.mediaUrl
  };

  const response = await fetch('http://localhost:8080/v1/api/ads/ad-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};
```

### 4. Quick Fix Checklist
- [ ] Form field is named `requestedPlacement` (not `placement` or `advertisementPlacement`)
- [ ] Dropdown value is being captured correctly
- [ ] Field is included in the request payload
- [ ] Value is a string (one of: `home_top_banner`, `home_sidebar`, `footer`, `blog_feature`)

### Required Fields
- `brandName` ✅
- `contactEmail` ✅
- `requestedPlacement` ❌ (Currently missing)

### Optional Fields
- `contactNumber`
- `message`
- `mediaUrl`

That's it! Once `requestedPlacement` is included with a valid string value, the form will submit successfully.
