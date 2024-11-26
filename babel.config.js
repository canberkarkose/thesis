// babel.config.js

module.exports = {
  presets: [
    '@babel/preset-env', // Transpile modern JavaScript features
    '@babel/preset-typescript', // Transpile TypeScript
    ['@babel/preset-react', { runtime: 'automatic' }], // Transpile JSX syntax
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs', // Transform ES modules to CommonJS
    [
      'babel-plugin-transform-vite-meta-env', // Transform 'import.meta.env'
      {
        replace: {
          VITE_SPOONACULAR_API_KEY: 'test-spoonacular-api-key',
          VITE_FIREBASE_API_KEY: 'test-firebase-api-key',
          VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
          VITE_FIREBASE_PROJECT_ID: 'test-project-id',
          VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
          VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-messaging-sender-id',
          VITE_FIREBASE_APP_ID: 'test-app-id',
          VITE_FIREBASE_MEASUREMENT_ID: 'test-measurement-id',
          VITE_X_RAPIDAPI_KEY: 'test-rapidapi-key',
          VITE_X_RAPIDAPI_HOST: 'test-rapidapi-host',
        },
      },
    ],
  ],
};
