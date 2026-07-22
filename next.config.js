/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Rooney -> Roni rebrand: preserve the old article URL.
      {
        source:
          "/resources/blog/inside-rooney-ai-clinical-grade-coaching-at-scale",
        destination:
          "/resources/blog/inside-roni-ai-clinical-grade-coaching-at-scale",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
