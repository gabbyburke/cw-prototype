/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  env: {
    CORE_CASE_MGMT_API_URL: process.env.CORE_CASE_MGMT_API_URL,
    REFERRAL_INTAKE_API_URL: process.env.REFERRAL_INTAKE_API_URL,
  },
}

module.exports = nextConfig
