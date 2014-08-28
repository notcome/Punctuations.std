var SVGFontPrefix = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" ><svg xmlns="http://www.w3.org/2000/svg"><defs>';
var SVGFontSuffix = '</font></defs></svg>';

var list = '、。，！？；：（）《》「」『』'.split('');
var dots = '、。，！？；：'.split('');
var closing = '）》」』'.split('');
var opening = '（《「『'.split('');

function isXXX (list) {
  return function (char) {
    return list.indexOf(char) != -1;
  }
}

var isInList = isXXX(list);
var isOpening = isXXX(opening);
var isClosing = isXXX(closing);
var isDots = isXXX(dots);

var StylePrefix = '@font-face { font-family: "Test"; src: url(data:image/svg+xml;base64,';
var StyleSuffix = ') format("svg"); } #test { font-family: "Test" "Helvetica Neue" "Source Han Sans SC"; }';
