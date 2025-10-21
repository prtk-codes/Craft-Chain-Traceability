// ...existing code...
/**
 * Format large numbers with commas
 */
export function formatNumber(num) {
  if (num === null || num === undefined || num === '') return '';
  const parts = String(num).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 50) {
  if (text === null || text === undefined) return '';
  const str = String(text);
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Format timestamp to relative time
 * Accepts timestamps in seconds or milliseconds
 */
export function timeAgo(timestamp) {
  if (!timestamp && timestamp !== 0) return 'just now';
  // normalize to seconds
  const tsSeconds = Number(timestamp) > 1e12 ? Math.floor(Number(timestamp) / 1000) : Math.floor(Number(timestamp));
  if (Number.isNaN(tsSeconds)) return 'just now';

  const seconds = Math.max(0, Math.floor(Date.now() / 1000) - tsSeconds);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return 'just now';
}

/**
 * Copy text to clipboard (with fallback)
 */
export async function copyToClipboard(text) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(String(text));
      return true;
    }
    // Fallback for older browsers / environments
    const textarea = document.createElement('textarea');
    textarea.value = String(text);
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Format IPFS URL for display / access via gateway
 * Converts ipfs://... to https://ipfs.io/ipfs/...
 */
export function formatIpfsUrl(url) {
  if (!url) return '';
  const str = String(url).trim();
  if (str.startsWith('ipfs://')) {
    const path = str.replace(/^ipfs:\/\//, '').replace(/^ipfs\//, '');
    return `https://ipfs.io/ipfs/${path}`;
  }
  return str;
}

/**
 * Check if string is valid Ethereum address
 */
export function isValidAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Generate random color for avatar (deterministic from address)
 */
export function generateColor(address) {
  const colors = [
    '#16F98A', '#0BD97D', '#134338', '#1a5e4f',
    '#00d4aa', '#00a896', '#028090', '#05668d'
  ];
  if (!address || typeof address !== 'string') {
    return colors[0];
  }
  const sanitized = address.toLowerCase().startsWith('0x') ? address.slice(2).toLowerCase() : address.toLowerCase();
  const hex = sanitized.replace(/[^a-f0-9]/g, '');
  const slice = hex.slice(0, 6) || '0';
  const index = (parseInt(slice, 16) || 0) % colors.length;
  return colors[index];
}
// ...existing code...