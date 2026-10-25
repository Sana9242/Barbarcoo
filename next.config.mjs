/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    // If an external backend is explicitly provided, proxy to it; otherwise handle with Next.js App Router API routes
    if (process.env.API_URL) {
      const apiUrl = process.env.API_URL.replace(/\/$/, "");
      return [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
