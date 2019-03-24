'use strict';

const all = require('mdast-util-to-hast/lib/all');

module.exports = handler;

function handler(h, node) {
  return node.identifiers
    .map(ident => /^(\w+):(\S+)$/.exec(ident))
    .filter(match => match)
    .map(match =>
      h(
        node,
        'a',
        {
          href: `#${match[2]}`,
          className: 'crossref',
          'data-ref': match[1],
        },
        []
      )
    );
}
