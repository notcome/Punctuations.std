function hTransform (path, advance) {
  // transform path data
  // for details about function 'dispatch', see SVG 1.1 spec
  // M (x y)+
  // L (x y)+
  // H (x)+
  // C (x1 y1 x2 y2 x y)+
  // S (x2 y2 x y)+
  // Q (x1 y1 x y)+
  // T (x y)+
  // A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
  function dispatch (command) {
    switch (command) {
      case 'M':
      case 'L':
      case 'H':
      case 'T':
        return [0];
      case 'S':
      case 'Q':
        return [0, 2];
      case 'C':
        return [0, 2, 4];
      case 'A':
        return [5];
      default:
        return [];
    }
  }

  path = path.split('|');
  var transformed = [];
  for (var i = 0; i < path.length; i ++) {
    var command = path[i].split(' ');
    var args = command.slice(1).map(function (str) { return parseInt(str); });
    command = command[0];

    var fields = dispatch(command);
    fields.forEach(function (field) {
      args[field] += advance;
    });
    transformed.push([command].concat(args).join(' '));
  }
  return transformed.join('');
}

function trimCluster (puncs, advance, trimInfo) {
  advance = parseInt(advance);
  var cluster = trimInfo.cluster;
  var trimList = trimInfo.trimList;
  var halfWidth = advance / 2;
  var overallAdv = cluster.length * advance;

  var overallPath = '';

  for (var i = 0, pos = 0; i < cluster.length; i ++) {
    var path = puncs[cluster[i]];
    if (!trimList[i]) {
      overallPath += hTransform(path, pos);
      pos += advance;
      continue;
    }
    overallAdv -= halfWidth;
    if (isClosing(cluster[i])) {
      overallPath += hTransform(path, pos);
      pos += halfWidth;
    }
    else {
      overallPath += hTransform(path, pos - halfWidth);
      pos += halfWidth;
    }
  }
  return {
    unicode: cluster,
    path: overallPath,
    advance: overallAdv
  };
}

function generateAttrStr (attrs) {
  function wrap (str) { return '"' + str + '"'; }
  var result = '';
  for (var key in attrs) {
    var value = attrs[key];
    result += key + '=' + wrap(value) + ' ';
  }
  return result;
}

function generateTag (tagname, attrs, isPair) {
  if (isPair)
    return '<' + tagname + ' ' + generateAttrStr(attrs) + '>';
  else
    return '<' + tagname + ' ' + generateAttrStr(attrs) + '/>';
}

function generateGlyph (glyph) {
  var escape = glyph.unicode.map(function (s) { return s.charCodeAt(0).toString(16); })
                            .reduce(function (s, c) { return s + '&#x' + c + ';'}, '');
  return generateTag('glyph', {
    unicode: escape,
    'horiz-adv-x': glyph.advance,
    d: glyph.path
  });
}

function generate (font, clusterList) {
  var advance = font.attrs['horiz-adv-x'];
  var puncs = font.glyphs;
  var transformed = clusterList.map(function (cluster) {
    return trimCluster(puncs, advance, cluster);
  });

  var fontTag = generateTag('font', font.attrs, true);
  var fontfaceTag = generateTag('font-face', font.fontface);
  var glyphTags = transformed.map(generateGlyph);

  return SVGFontPrefix +
          fontTag +
          fontfaceTag +
          glyphTags.join('') +
         SVGFontSuffix;  
}
