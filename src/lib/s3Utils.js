import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'zentacle-static-maps';
const CACHE_PREFIX = 'static-maps/';

/**
 * Generate a cache key for a static map based on coordinates and parameters
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {string} size - Map size (default: '600x300')
 * @param {number} scale - Map scale (default: 2)
 * @param {string} maptype - Map type (default: 'terrain')
 * @returns {string} Cache key for S3 storage
 */
export function generateCacheKey(latitude, longitude, size = '600x300', scale = 2, maptype = 'terrain') {
  // Round coordinates to 6 decimal places for consistent caching
  const lat = parseFloat(latitude).toFixed(6);
  const lng = parseFloat(longitude).toFixed(6);

  return `${CACHE_PREFIX}${lat}_${lng}_${size}_scale${scale}_${maptype}.png`;
}

/**
 * Check if a static map exists in S3 cache
 * @param {string} cacheKey - The cache key to check
 * @returns {Promise<boolean>} True if the map exists in cache
 */
export async function checkMapExists(cacheKey) {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: cacheKey,
    }));
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * Upload a static map image to S3
 * @param {string} cacheKey - The cache key for storage
 * @param {Buffer} imageBuffer - The image data as a buffer
 * @param {string} contentType - MIME type of the image
 * @returns {Promise<string>} The S3 URL of the uploaded image
 */
export async function uploadMapToS3(cacheKey, imageBuffer, contentType = 'image/png') {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: cacheKey,
    Body: imageBuffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // Cache for 1 year
    Metadata: {
      'generated-at': new Date().toISOString(),
      'source': 'google-static-maps-api'
    }
  });

  await s3Client.send(command);

  // Return the public URL
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${cacheKey}`;
}

/**
 * Get a signed URL for a cached static map
 * @param {string} cacheKey - The cache key
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 * @returns {Promise<string>} Signed URL for the cached map
 */
export async function getCachedMapUrl(cacheKey, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: cacheKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate Google Static Maps API URL
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {string} size - Map size (default: '600x300')
 * @param {number} scale - Map scale (default: 2)
 * @param {string} maptype - Map type (default: 'terrain')
 * @param {string} apiKey - Google Maps API key
 * @returns {string} Google Static Maps API URL
 */
export function generateGoogleMapsUrl(latitude, longitude, size = '600x300', scale = 2, maptype = 'terrain', apiKey) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const params = new URLSearchParams({
    size,
    scale: scale.toString(),
    maptype,
    key: apiKey,
    style: 'feature:poi|visibility:off',
    markers: `color:blue|label:1|${latitude},${longitude}`
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Fetch image from Google Static Maps API
 * @param {string} url - Google Static Maps API URL
 * @returns {Promise<Buffer>} Image data as buffer
 */
export async function fetchMapFromGoogle(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch map from Google: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Get or generate a static map with caching
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {string} googleApiKey - Google Maps API key
 * @param {Object} options - Additional options for map generation
 * @returns {Promise<string>} URL of the cached or generated map
 */
export async function getOrGenerateMap(latitude, longitude, googleApiKey, options = {}) {
  const {
    size = '600x300',
    scale = 2,
    maptype = 'terrain'
  } = options;

  const cacheKey = generateCacheKey(latitude, longitude, size, scale, maptype);

  // Check if map exists in cache
  const exists = await checkMapExists(cacheKey);

  if (exists) {
    // Return cached map URL
    return await getCachedMapUrl(cacheKey);
  }

  // Generate new map from Google API
  const googleUrl = generateGoogleMapsUrl(latitude, longitude, size, scale, maptype, googleApiKey);
  const imageBuffer = await fetchMapFromGoogle(googleUrl);

  // Upload to S3 and return URL
  return await uploadMapToS3(cacheKey, imageBuffer);
}
