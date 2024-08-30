// next.config.mjs
export default {
  images: {
    domains: ['uat.apnatelelink.us'], // Use localhost during development
  },
  serverRuntimeConfig: {
    HOSTNAME: process.env.FRONTEND_URL || 'uat.apnatelelink.us',
    PORT: parseInt(process.env.PORT, 10) || 8000, // Parse to integer
  },
};
