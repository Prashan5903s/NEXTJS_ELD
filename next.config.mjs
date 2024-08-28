// next.config.mjs

const nextConfig = {
    images: {
<<<<<<< HEAD
      domains: ['uat.apnatelelink.us'], // Use localhost during development
    },
    serverRuntimeConfig: {
      HOSTNAME: process.env.FRONTEND_URL || 'uat.apnatelelink.us',
=======
      domains: ['127.0.0.1'], // Use localhost during development
    },
    serverRuntimeConfig: {
      HOSTNAME: process.env.FRONTEND_URL || '127.0.0.1',
>>>>>>> origin/main
      PORT: parseInt(process.env.PORT, 10) || 8000, // Parse to integer
    },
  };

  export default nextConfig;
