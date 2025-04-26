import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'watermark.lovepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asd.mediacdn.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'laptrinhcuocsong.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdni.iconscout.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.dmca.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;