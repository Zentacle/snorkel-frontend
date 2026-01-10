import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { buildGeographicUrl, generateBreadcrumbs } from 'src/lib/geographicUtils';

const GeoTestPage = () => {
  // Test some example geographic paths
  const testPaths = [
    ['us'],
    ['us', 'ca'],
    ['us', 'ca', 'san-diego'],
    ['us', 'ca', 'san-diego', 'la-jolla'],
    ['us', 'fl', 'miami'],
    ['us', 'hi', 'oahu'],
  ];

  const testBreadcrumbs = generateBreadcrumbs(['us', 'ca', 'san-diego']);

  return (
    <>
      <Head>
        <title>Geographic System Test | Zentacle</title>
        <meta name="description" content="Test page for the new geographic system" />
      </Head>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Geographic System Test</h1>
        <p>This page tests the new geographic routing system with the /geo/ prefix.</p>

        <h2>Test URLs</h2>
        <p>Click the links below to test the new geographic routes:</p>

        <ul>
          {testPaths.map((path, index) => (
            <li key={index}>
              <Link href={buildGeographicUrl(path)}>
                <a>{buildGeographicUrl(path)}</a>
              </Link>
              <br />
              <small>Path: {path.join(' → ')}</small>
            </li>
          ))}
        </ul>

        <h2>Shop URLs</h2>
        <ul>
          {testPaths.map((path, index) => (
            <li key={index}>
              <Link href={buildGeographicUrl(path, true)}>
                <a>{buildGeographicUrl(path, true)}</a>
              </Link>
              <br />
              <small>Shops in: {path.join(' → ')}</small>
            </li>
          ))}
        </ul>

        <h2>Breadcrumb Test</h2>
        <p>Generated breadcrumbs for /geo/us/ca/san-diego:</p>
        <ul>
          {testBreadcrumbs.map((crumb, index) => (
            <li key={index}>
              <Link href={crumb.url}>
                <a>{crumb.name}</a>
              </Link>
              <small> (Level: {crumb.level})</small>
            </li>
          ))}
        </ul>

        <h2>Legacy vs New URLs</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Legacy URL</th>
              <th>New URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/loc/us/_/ca/san-diego</code></td>
              <td><code>/geo/us/ca/san-diego</code></td>
            </tr>
            <tr>
              <td><code>/loc/us/ca/san-diego/shop</code></td>
              <td><code>/geo/us/ca/san-diego/shop</code></td>
            </tr>
            <tr>
              <td><code>/loc/us/ca</code></td>
              <td><code>/geo/us/ca</code></td>
            </tr>
          </tbody>
        </table>

        <h2>API Endpoints</h2>
        <p>The new system expects these backend endpoints:</p>
        <ul>
          <li><code>GET /api/loc/us/ca/san-diego</code> - Geographic area with spots</li>
          <li><code>GET /api/loc/us/ca/san-diego/children</code> - Child areas</li>
          <li><code>GET /api/shop/loc/us/ca/san-diego</code> - Shops in area</li>
        </ul>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Testing Notes</h3>
          <ul>
            <li>All new routes use the <code>/geo/</code> prefix to avoid conflicts</li>
            <li>Legacy <code>/loc/</code> routes continue to work</li>
            <li>Both systems can run in parallel during testing</li>
            <li>Once validated, URLs can be migrated to use <code>/loc/</code> prefix</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default GeoTestPage;