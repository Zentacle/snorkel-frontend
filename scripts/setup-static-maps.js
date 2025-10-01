#!/usr/bin/env node

/**
 * Setup script for static maps caching system
 * This script helps configure the environment and test the system
 */

const fs = require('fs');
const path = require('path');

console.log('🗺️  Static Maps Caching Setup');
console.log('==============================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');

  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env.local from .env.example');
    console.log('⚠️  Please update the values in .env.local with your actual credentials\n');
  } else {
    console.log('❌ .env.example not found. Please create .env.local manually with the required environment variables.');
  }
} else {
  console.log('✅ .env.local already exists');
}

// Check for required environment variables
console.log('🔍 Checking environment configuration...');

const requiredVars = [
  'GOOGLE_MAPS_API_KEY',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'S3_BUCKET_NAME'
];

const missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\nPlease set these variables in your .env.local file');
} else {
  console.log('✅ All required environment variables are set');
}

// Test API endpoint if running in development
if (process.env.NODE_ENV === 'development') {
  console.log('\n🧪 Testing API endpoint...');

  const testEndpoint = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/static-map?lat=40.7128&lng=-74.0060');

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API endpoint is working');
        console.log(`   Map URL: ${data.url}`);
        console.log(`   Cached: ${data.cached ? 'Yes' : 'No'}`);
      } else {
        console.log('❌ API endpoint returned error:', response.status);
      }
    } catch (error) {
      console.log('⚠️  Could not test API endpoint (server may not be running)');
      console.log('   Start your development server with: npm run dev');
    }
  };

  testEndpoint();
}

console.log('\n📋 Next Steps:');
console.log('1. Update .env.local with your actual credentials');
console.log('2. Create an S3 bucket for storing static maps');
console.log('3. Start your development server: npm run dev');
console.log('4. Test the API endpoint: GET /api/static-map?lat=40.7128&lng=-74.0060');
console.log('5. Run batch processing: node scripts/batch-generate-maps.js --dry-run');
console.log('\n📖 For detailed instructions, see STATIC_MAPS_CACHING.md');
