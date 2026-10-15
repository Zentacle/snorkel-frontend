import { ShopPadiData } from 'models/Shop';

// Badge text from the PADI locator record. PADI marks 5 Star shops with the
// "fivestar" feature and says what kind of shop it is in centerTypes
// (retail, resort, cdc, freediver, tecrec).
export function getPadiBadge(padiData?: ShopPadiData | null): string {
  if (!padiData?.features?.includes('fivestar')) {
    return '';
  }
  const centerTypes = padiData.centerTypes || [];
  if (centerTypes.includes('cdc')) {
    return 'PADI 5 Star Career Development Center';
  }
  if (centerTypes.includes('resort') && !centerTypes.includes('retail')) {
    return 'PADI 5 Star Dive Resort';
  }
  return 'PADI 5 Star Dive Center';
}
