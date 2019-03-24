const refractor = require('refractor');
const visit = require('unist-util-visit');

module.exports = () => tree => {
  visit(tree, 'code', node => {
    let { lang, data, value } = node;
    if (!lang || !refractor.registered(lang)) {
      return;
    }

    if (!data) {
      data = {};
      node.data = data;
    }
    if (!data.hProperties) {
      data.hProperties = {};
    }
    data.hChildren = refractor.highlight(value, lang);
    data.hProperties.className = [
      ...(data.hProperties.className || []),
      `language-${lang}`,
    ];
  });
};
