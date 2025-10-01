# Static Maps Caching System

This document describes the automated system for caching Google Static Maps API images in AWS S3 to reduce costs and improve performance.

## Overview

The system automatically:
- Generates static maps server-side using Google Maps API
- Caches images in AWS S3 with intelligent naming
- Serves cached images to reduce API costs
- Provides fallback to direct Google Maps URLs

## Architecture

```
Frontend (BeachInfo) → API Endpoint → S3 Utils → AWS S3
                    ↓
              Google Maps API (if not cached)
```

## Components

### 1. S3 Utilities (`src/lib/s3Utils.js`)
- Handles S3 operations (upload, download, check existence)
- Generates cache keys based on coordinates and parameters
- Manages Google Maps API integration
- Provides caching logic

### 2. API Endpoint (`src/pages/api/static-map.js`)
- RESTful endpoint for map generation
- Validates input parameters
- Returns cached or newly generated map URLs
- Handles errors gracefully

### 3. Updated BeachInfo Component
- Fetches maps from cache via API endpoint
- Falls back to direct Google Maps URLs if caching fails
- Maintains backward compatibility

### 4. Batch Processing Script (`scripts/batch-generate-maps.js`)
- Pre-generates maps for existing beaches
- Handles rate limiting and retries
- Provides progress tracking and error reporting

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=zentacle-static-maps

# API Configuration (for batch processing)
API_BASE_URL=https://your-api-domain.com
```

### 3. AWS S3 Setup

1. Create an S3 bucket for storing static maps
2. Configure bucket permissions for your AWS credentials
3. Set up lifecycle policies to manage storage costs (optional)

### 4. Deploy and Test

1. Deploy the updated application
2. Test the API endpoint: `GET /api/static-map?lat=40.7128&lng=-74.0060`
3. Verify S3 bucket receives uploaded images

## Usage

### API Endpoint

```javascript
// Generate or retrieve cached map
const response = await fetch('/api/static-map?lat=40.7128&lng=-74.0060&size=600x300&scale=2&maptype=terrain');
const data = await response.json();
console.log(data.url); // S3 URL or Google Maps URL
```

### Batch Processing

```bash
# Dry run to see what would be processed
node scripts/batch-generate-maps.js --dry-run

# Process all beaches with custom batch size
node scripts/batch-generate-maps.js --batch-size=10 --delay=2000

# Process with custom API URL
API_BASE_URL=https://your-api.com node scripts/batch-generate-maps.js
```

## Cost Optimization

### Google Maps API Costs
- **Before**: Every page load generates a new API request
- **After**: API requests only for new/uncached locations
- **Savings**: 90%+ reduction in API calls for popular locations

### S3 Storage Costs
- Images are stored with 1-year cache headers
- Lifecycle policies can be configured for cost management
- Typical storage cost: ~$0.023/GB/month

### Bandwidth Savings
- Cached images served from S3 (faster)
- Reduced Google Maps API bandwidth usage
- CDN integration possible for further optimization

## Monitoring and Maintenance

### Cache Hit Rate
Monitor the `cached` field in API responses to track cache effectiveness.

### Error Handling
- API endpoint provides detailed error messages
- Fallback to direct Google Maps URLs ensures reliability
- Batch processing includes retry logic

### Cache Management
- Images are cached for 1 year by default
- S3 lifecycle policies can automate cleanup
- Manual cache invalidation available through S3 console

## Troubleshooting

### Common Issues

1. **AWS Credentials Not Found**
   - Verify environment variables are set correctly
   - Check AWS credentials have S3 permissions

2. **Google Maps API Errors**
   - Verify API key is valid and has Static Maps API enabled
   - Check API quota and billing

3. **S3 Upload Failures**
   - Verify bucket name and region are correct
   - Check S3 bucket permissions

4. **Batch Processing Errors**
   - Verify API_BASE_URL points to correct endpoint
   - Check that beaches API returns expected format

### Debug Mode

Set `NODE_ENV=development` for detailed error messages in API responses.

## Performance Considerations

### Caching Strategy
- Images cached based on coordinates (rounded to 6 decimal places)
- Same parameters (size, scale, maptype) share cache entries
- Cache keys include all parameters for uniqueness

### Rate Limiting
- Batch processing includes delays between requests
- Google Maps API has rate limits (check your quota)
- S3 operations are generally not rate-limited

### Storage Optimization
- Images stored as PNG with optimal compression
- Cache headers set for 1-year browser caching
- Consider WebP format for further optimization

## Future Enhancements

1. **CDN Integration**: Use CloudFront for global distribution
2. **Image Optimization**: Implement WebP conversion
3. **Analytics**: Track cache hit rates and popular locations
4. **Automated Cleanup**: Lifecycle policies for old images
5. **Multiple Formats**: Support different map types and sizes
