export default {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'ie >= 9']
      }
    }],
    'babel-preset-react-app',
  ],
  plugins: [
    ['babel-plugin-transform-imports', {
      ramda: {
        preventFullImport: true,
        transform: 'ramda/src/${member}',
      },
    }],
  ],
};
