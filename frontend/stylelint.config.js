/* eslint-disable @typescript-eslint/no-var-requires */

const rootNodeModulesPath = require('path').resolve(
  __dirname,
  '..',
  'node_modules'
);

const getAbsolutePath = (name) => `${rootNodeModulesPath}/${name}`;

const extendsNames = [
  'stylelint-config-standard',
  'stylelint-config-sass-guidelines',
  'stylelint-config-recess-order',
];

const extendsPaths = extendsNames.map(getAbsolutePath);

module.exports = {
  extends: extendsPaths,
  plugins: [],
  rules: {
    'order/properties-alphabetical-order': null, // conflicts with recess-order
    'max-nesting-depth': null, // nesting is not a bad thing
    'selector-max-id': null, // too intrusive
  },
};
