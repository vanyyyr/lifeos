// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    XIAOMI_API_KEY: process.env.XIAOMI_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/telegram/:path*',
        destination: 'https://api.telegram.org/:path*',
      },
    ];
  },
};

module.exports = nextConfig;