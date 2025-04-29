/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'via.placeholder.com',
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
      {
        protocol: 'https',
        hostname: 'example.com', // Thêm example.com
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http', // Hoặc 'https' tùy API
        hostname: 'localhost', // Nếu API chạy trên localhost
        port: '5000', // Nếu API dùng port 5000
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;