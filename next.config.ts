import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // This is the correct way to fix the 'async_hooks' error in Next.js for client-side builds.
      // It replaces the server-only context manager with a browser-compatible one.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@opentelemetry\/context-async-hooks/,
          '@opentelemetry/context-zone-per-rpc'
        )
      );
    }
    
    // Fallback for other node-specific modules if needed, though the plugin above is more targeted.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      async_hooks: false,
    };
    
    return config;
  },
};

export default nextConfig;
