import { getOrGenerateMap } from '../../../lib/s3Utils';

/**
 * API endpoint for generating and caching static maps
 * GET /api/static-map?lat=latitude&lng=longitude&size=600x300&scale=2&maptype=terrain
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lat, lng, size, scale, maptype } = req.query;

    // Validate required parameters
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat and lng are required'
      });
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates: lat and lng must be valid numbers'
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: 'Invalid coordinates: lat must be between -90 and 90, lng between -180 and 180'
      });
    }

    // Get Google Maps API key from environment
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) {
      return res.status(500).json({
        error: 'Google Maps API key not configured'
      });
    }

    // Set default values for optional parameters
    const mapSize = size || '600x300';
    const mapScale = scale ? parseInt(scale) : 2;
    const mapType = maptype || 'terrain';

    // Validate size format (should be like "600x300")
    if (!/^\d+x\d+$/.test(mapSize)) {
      return res.status(400).json({
        error: 'Invalid size format: must be in format "WIDTHxHEIGHT" (e.g., "600x300")'
      });
    }

    // Validate scale (should be 1 or 2)
    if (mapScale !== 1 && mapScale !== 2) {
      return res.status(400).json({
        error: 'Invalid scale: must be 1 or 2'
      });
    }

    // Validate map type
    const validMapTypes = ['roadmap', 'satellite', 'hybrid', 'terrain'];
    if (!validMapTypes.includes(mapType)) {
      return res.status(400).json({
        error: `Invalid map type: must be one of ${validMapTypes.join(', ')}`
      });
    }

    // Generate or retrieve cached map
    const mapUrl = await getOrGenerateMap(latitude, longitude, googleApiKey, {
      size: mapSize,
      scale: mapScale,
      maptype: mapType
    });

    // Return the map URL
    res.status(200).json({
      success: true,
      url: mapUrl,
      coordinates: {
        latitude,
        longitude
      },
      parameters: {
        size: mapSize,
        scale: mapScale,
        maptype: mapType
      },
      cached: mapUrl.includes('amazonaws.com') // Indicates if it's from S3 cache
    });

  } catch (error) {
    console.error('Error generating static map:', error);

    // Return appropriate error response
    if (error.message.includes('Failed to fetch map from Google')) {
      return res.status(502).json({
        error: 'Failed to generate map from Google Maps API',
        details: error.message
      });
    }

    if (error.message.includes('AWS') || error.message.includes('S3')) {
      return res.status(503).json({
        error: 'Failed to cache map in S3',
        details: error.message
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
