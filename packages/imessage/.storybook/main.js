module.exports = {
  stories: ["../stories/**/*.stories.js"],
  addons: [
    "@storybook/addon-actions/register",
    "@storybook/addon-links/register",
    {
      name: "@storybook/addon-docs",
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
      },
    },
  ],
};
