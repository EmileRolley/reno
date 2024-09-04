import createMDX from '@next/mdx'
import { withContentlayer } from 'next-contentlayer2'
import mdxOptions from './mdxOptions.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* not sure if needed
		experimental: {
		serverComponentsExternalPackages: ['publicodes'],
		*/
  compiler: {
    styledComponents: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /(\.ya?ml$)|\.publicodes/,
      use: 'yaml-loader',
    })
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      },
    })
    return config
  },
  async rewrites() {
    return [{ source: '/feed.xml', destination: '/_next/static/feed.xml' }]
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/guide',
        destination: '/guide.html',
        permanent: false,
      },
    ]
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
      },
    ],
  },
}

const withMDX = createMDX({ options: mdxOptions })

const finalConfig = withContentlayer(withMDX(nextConfig))
export default finalConfig
