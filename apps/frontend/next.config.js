/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "app");
    return config;
  },
};

module.exports = nextConfig;