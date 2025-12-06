// /**
//  * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
//  * for Docker builds.
//  */
// import "./src/env.js";

// /** @type {import("next").NextConfig} */
// const config = {};

// export default config;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  images: {
    domains: [
      "res.cloudinary.com",
      // add other image hosts you use
    ],
  },
  // experimental: {
  //   appDir: true
  // }
};

module.exports = nextConfig;
