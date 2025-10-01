#!/usr/bin/env node

/**
 * Batch script to pre-generate static maps for existing beaches
 * This script fetches all beaches from your API and generates cached maps
 *
 * Usage:
 * node scripts/batch-generate-maps.js [options]
 *
 * Options:
 * --api-url: Base URL for your API (default: from environment)
 * --batch-size: Number of beaches to process in parallel (default: 5)
 * --delay: Delay between batches in milliseconds (default: 1000)
 * --dry-run: Show what would be processed without actually generating maps
 */

const { getOrGenerateMap } = require('../src/lib/s3Utils');
const fetch = require('node-fetch');

// Configuration
const config = {
  apiUrl: process.env.API_BASE_URL || 'https://your-api-domain.com',
  batchSize: parseInt(process.argv.find(arg => arg.startsWith('--batch-size='))?.split('=')[1]) || 5,
  delay: parseInt(process.argv.find(arg => arg.startsWith('--delay='))?.split('=')[1]) || 1000,
  dryRun: process.argv.includes('--dry-run'),
  googleApiKey: process.env.GOOGLE_MAPS_API_KEY
};

// Validate configuration
if (!config.googleApiKey) {
  console.error('❌ Error: GOOGLE_MAPS_API_KEY environment variable is required');
  process.exit(1);
}

if (!config.apiUrl || config.apiUrl === 'https://your-api-domain.com') {
  console.error('❌ Error: Please set API_BASE_URL environment variable or update the default in the script');
  process.exit(1);
}

/**
 * Fetch all beaches from the API
 * You'll need to adjust this based on your actual API endpoint
 */
async function fetchAllBeaches() {
  try {
    console.log('🔍 Fetching beaches from API...');

    // Adjust this endpoint based on your actual API structure
    const response = await fetch(`${config.apiUrl}/spots/all?include_coordinates=true`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Filter beaches that have coordinates
    const beachesWithCoords = data.filter(beach =>
      beach.latitude &&
      beach.longitude &&
      !isNaN(parseFloat(beach.latitude)) &&
      !isNaN(parseFloat(beach.longitude))
    );

    console.log(`✅ Found ${beachesWithCoords.length} beaches with coordinates`);
    return beachesWithCoords;

  } catch (error) {
    console.error('❌ Error fetching beaches:', error.message);
    throw error;
  }
}

/**
 * Process a batch of beaches
 */
async function processBatch(beaches, batchIndex) {
  console.log(`\n📦 Processing batch ${batchIndex + 1} (${beaches.length} beaches)...`);

  const results = await Promise.allSettled(
    beaches.map(async (beach, index) => {
      const globalIndex = batchIndex * config.batchSize + index + 1;

      try {
        if (config.dryRun) {
          console.log(`  ${globalIndex}. [DRY RUN] Would generate map for ${beach.name} (${beach.latitude}, ${beach.longitude})`);
          return { success: true, beach, cached: false };
        }

        console.log(`  ${globalIndex}. Generating map for ${beach.name}...`);

        const mapUrl = await getOrGenerateMap(
          parseFloat(beach.latitude),
          parseFloat(beach.longitude),
          config.googleApiKey,
          {
            size: '600x300',
            scale: 2,
            maptype: 'terrain'
          }
        );

        const cached = mapUrl.includes('amazonaws.com');
        console.log(`     ✅ ${cached ? 'Cached' : 'Generated'} map: ${beach.name}`);

        return { success: true, beach, cached, mapUrl };

      } catch (error) {
        console.error(`     ❌ Failed to generate map for ${beach.name}:`, error.message);
        return { success: false, beach, error: error.message };
      }
    })
  );

  return results;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🗺️  Static Maps Batch Generator');
  console.log('================================');
  console.log(`API URL: ${config.apiUrl}`);
  console.log(`Batch Size: ${config.batchSize}`);
  console.log(`Delay: ${config.delay}ms`);
  console.log(`Dry Run: ${config.dryRun ? 'Yes' : 'No'}`);
  console.log('');

  try {
    // Fetch all beaches
    const beaches = await fetchAllBeaches();

    if (beaches.length === 0) {
      console.log('ℹ️  No beaches found to process');
      return;
    }

    // Split into batches
    const batches = [];
    for (let i = 0; i < beaches.length; i += config.batchSize) {
      batches.push(beaches.slice(i, i + config.batchSize));
    }

    console.log(`📊 Processing ${beaches.length} beaches in ${batches.length} batches\n`);

    const allResults = [];
    let successCount = 0;
    let cachedCount = 0;
    let errorCount = 0;

    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const results = await processBatch(batch, i);

      // Collect results
      allResults.push(...results);

      // Update counters
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            successCount++;
            if (result.value.cached) {
              cachedCount++;
            }
          } else {
            errorCount++;
          }
        } else {
          errorCount++;
        }
      });

      // Add delay between batches (except for the last batch)
      if (i < batches.length - 1) {
        console.log(`⏳ Waiting ${config.delay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, config.delay));
      }
    }

    // Print summary
    console.log('\n📈 Summary');
    console.log('==========');
    console.log(`Total beaches: ${beaches.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Cached (already existed): ${cachedCount}`);
    console.log(`Newly generated: ${successCount - cachedCount}`);
    console.log(`Errors: ${errorCount}`);

    if (errorCount > 0) {
      console.log('\n❌ Failed beaches:');
      allResults
        .filter(result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success))
        .forEach(result => {
          const beach = result.status === 'fulfilled' ? result.value.beach : result.reason.beach;
          const error = result.status === 'fulfilled' ? result.value.error : result.reason.message;
          console.log(`  - ${beach.name}: ${error}`);
        });
    }

    console.log('\n✅ Batch processing complete!');

  } catch (error) {
    console.error('\n❌ Batch processing failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Batch processing interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Batch processing terminated');
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { main, config };
