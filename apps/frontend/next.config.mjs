/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Match any API route
                destination: 'http://localhost:3001/api/:path*', // Proxy to the backend
            },
        ];
    },
};

export default nextConfig;