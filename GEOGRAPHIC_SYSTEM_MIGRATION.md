# Geographic Node System Migration Guide

This document outlines the migration from the old rigid 4-level geographic hierarchy to the new flexible tree-based geographic node system.

## Overview

The new system replaces the fixed hierarchy (Country → Area One → Area Two → Locality) with a flexible tree structure where each geographic node can have any number of children at any level.

### Prefix Strategy

To enable parallel testing and gradual migration, the new system uses a different URL prefix (`/geo/`) than the legacy system (`/loc/`). This allows both systems to run simultaneously without conflicts.

- **Legacy URLs**: `/loc/us/_/ca/san-diego` (old rigid hierarchy)
- **New URLs**: `/geo/us/ca/san-diego` (new flexible hierarchy)

Once testing is complete and the new system is validated, the URLs can be migrated to use the `/loc/` prefix by updating the route files and utility functions.

## Key Changes

### 1. URL Structure

**Old URLs:**
- Locations: `/loc/us/_/ca/san-diego`
- Spots: `/Beach/123/la-jolla-cove`

**New URLs:**
- Locations: `/geo/us/ca/san-diego`
- Spots: `/geo/us/ca/san-diego/la-jolla-cove-123`

### 2. New Route Structure

The new system uses Next.js catch-all routes:

```typescript
// New route files
src/pages/geo/[...geographicPath]/index.tsx
src/pages/geo/[...geographicPath]/shop/index.tsx
```

**Route Parameters:**
- `geographicPath`: Array of geographic segments (e.g., `['us', 'ca', 'san-diego']`)

### 3. API Endpoints

**New Geographic Endpoints:**
```typescript
// Get geographic area with spots
GET /api/loc/us/ca/san-diego

// Get specific spot within geographic context
GET /api/loc/us/ca/san-diego/123

// Get child areas
GET /api/loc/us/ca/san-diego/children

// Get shops in geographic area
GET /api/shop/loc/us/ca/san-diego
```

**Response Structure:**
```typescript
// Geographic area response
{
  area: {
    id: number,
    name: string,
    short_name: string,
    url: string,
    admin_level: number,
    parent: { /* parent node data */ },
    num_spots: number,
    num_shops: number
  },
  spots: Spot[],
  total_spots: number
}
```

### 4. New Components and Utilities

#### Geographic Utils (`src/lib/geographicUtils.ts`)
- `resolveGeographicPath()`: Fetches area data for a geographic path
- `resolveSpotFromPath()`: Checks if a path segment is a spot URL
- `generateBreadcrumbs()`: Creates breadcrumbs from path segments
- `fetchChildAreas()`: Gets child areas for navigation
- `buildGeographicUrl()`: Builds URLs for geographic areas

#### URL Migration (`src/lib/urlMigration.ts`)
- `migrateLocationUrl()`: Converts old URLs to new format
- `needsMigration()`: Checks if a URL needs migration
- `createRedirectComponent()`: Creates redirects for old URLs

### 5. Updated Components

#### Breadcrumbs Component
Now supports both legacy and new geographic breadcrumb systems:

```typescript
// New geographic breadcrumbs
<Breadcrumbs
  breadcrumbs={[
    { name: 'United States', url: '/geo/us', level: 0 },
    { name: 'California', url: '/geo/us/ca', level: 1 },
    { name: 'San Diego', url: '/geo/us/ca/san-diego', level: 2 }
  ]}
  area={area}
/>

// Legacy breadcrumbs (still supported)
<Breadcrumbs
  country={country}
  area_one={area_one}
  area_two={area_two}
  locality={locality}
/>
```

#### LocationCard Component
Updated to support optional index prop for numbered listings.

#### BuddyCarousel Component
Updated to support optional loc prop.

### 6. Search Updates

The TypeAheadDropdown now includes geographic context in search results:

```typescript
// Updated API call includes geographic data
fetch(`${rootDomain}/search/typeahead?query=${query}&include_geographic=true`)
```

## Migration Strategy

### Phase 1: Parallel Implementation
- New routes work alongside existing routes
- Old URLs continue to work with redirects
- Search results include both old and new URL formats

### Phase 2: Gradual Migration
- Update internal links to use new URLs
- Update search results to prioritize new URLs
- Update sitemaps to include new URL structure

### Phase 3: Legacy Cleanup
- Remove old route files
- Update all remaining references
- Clean up migration utilities

### Phase 4: URL Prefix Migration (Optional)
Once the new system is fully validated and stable:
- Update route files from `/geo/` to `/loc/` prefix
- Update utility functions to use `/loc/` prefix
- Update breadcrumb generation
- Update all internal links and references
- Update sitemaps and canonical URLs

## Implementation Notes

### Data Fetching
The new system uses more flexible data fetching:

```typescript
// Old approach
const res = await fetch(`${rootDomain}/spots/get?sort=top&area_one=${area_one}&country=${country}&area_two=${area_two}&locality=${locality}&limit=none`);

// New approach
const res = await fetch(`${rootDomain}/loc/${path}?sort=top&limit=none`);
```

### Error Handling
The new system includes better error handling for invalid paths:

```typescript
if (!res.ok) {
  // Check if this might be a spot URL
  const spotMatch = lastSegment.match(/^(.+)-(\d+)$/);
  if (spotMatch) {
    // Handle spot URL
  }
  return { notFound: true };
}
```

### SEO Considerations
- New URLs are more SEO-friendly
- Breadcrumbs include proper schema markup
- Canonical URLs point to new format
- 301 redirects preserve SEO value

## Testing

### URL Migration Testing
Test the migration utilities with various URL patterns:

```typescript
// Test cases
migrateLocationUrl('/loc/us/_/ca/san-diego') // → '/geo/us/ca/san-diego'
migrateLocationUrl('/loc/us/ca/san-diego/shop') // → '/geo/us/ca/san-diego/shop'
migrateLocationUrl('/loc/us/ca') // → '/geo/us/ca'
```

### API Testing
Test the new API endpoints with various geographic paths:

```typescript
// Test geographic area fetching
const data = await resolveGeographicPath(['us', 'ca', 'san-diego']);

// Test spot resolution
const spotData = await resolveSpotFromPath(['us', 'ca', 'san-diego', 'la-jolla-cove-123']);
```

## Rollback Plan

If issues arise, the system can be rolled back by:

1. Reverting to old route files
2. Removing new geographic utilities
3. Updating components to use old interfaces
4. Restoring old API endpoints

## Future Enhancements

1. **Geographic Context in Search**: Include geographic hierarchy in search results
2. **Smart Breadcrumbs**: Fetch actual geographic names instead of using path segments
3. **Geographic Analytics**: Track usage patterns by geographic hierarchy
4. **Internationalization**: Support for different geographic naming conventions
5. **Geographic Recommendations**: Suggest related areas based on geographic proximity