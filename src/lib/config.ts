// Get the API URL (external API like dummyjson.com)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com';

// Get the app URL (base URL for internal API calls)
function getAppUrl() {
  // If explicitly set
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Netlify deployment URL (URL is set by Netlify)
  if (process.env.URL) {
    return process.env.URL;
  }
  // Netlify deployment URL (alternative)
  if (process.env.NETLIFY_URL) {
    return process.env.NETLIFY_URL;
  }
  // Fallback to localhost for development
  return 'http://localhost:3000';
}

export const APP_URL = getAppUrl();
