module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@screens': './src/screens',
          '@screens/*': './src/screens/*',
          '@assets': './src/assets',
          '@assets/*': './src/assets/*',
          '@utils': './src/utils',
          '@utils/*': './src/utils/*',
          '@components': './src/components',
          '@components/*': './src/components/*',
          '@types': './src/types',
          '@types/*': './src/types/*',
          '@firebase': './src/firebase',
          '@firebase/*': './src/firebase/*',
          '@config': './src/config',
          '@config/*': './src/config/*',
          '@context': './src/context',
          '@context/*': './src/context/*',
          '@api': './src/api',
          '@api/*': './src/api/*',
          '@hooks': './src/hooks',
          '@hooks/*': './src/hooks/*',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: './src/.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
