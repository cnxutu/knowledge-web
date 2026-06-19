/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"]
};

export default nextConfig;
