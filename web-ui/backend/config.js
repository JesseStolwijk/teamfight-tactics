export const RIOT_API_KEY = process.env.RIOT_API_KEY;
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
  : "http://localhost:3000";
