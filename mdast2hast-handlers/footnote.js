'use strict';

const all = require('mdast-util-to-hast/lib/all');

module.exports = handler;

function handler(h, node) {
  return h(node, 'span', { className: ['footnote'] }, all(h, node));
}
