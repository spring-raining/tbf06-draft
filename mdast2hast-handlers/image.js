'use strict'

var normalize = require('mdurl/encode')
var u = require('unist-builder')

module.exports = image

function image(h, node) {
  var props = { src: normalize(node.url), alt: node.alt }

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  const children = [h(node, 'img', props)];
  if (props.alt) {
    children.push(
      h(
        node,
        'figcaption',
        { className: ['fig'] },
        [u('text', props.alt)]
      )
    );
  }

  return h(node, 'figure', null, children);
}
