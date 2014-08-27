let parseXML = require('xml2js').parseString;
let parsePath = require('parse-svg-path');
let suspend = require('suspend');
let fs = require('fs');

export function convertSVGToJSON (path, callback, list = '、。，！？；：（）《》「」『』') {
  list = list.split('');

  function parseFont (obj) {
    obj = obj.svg.defs[0].font[0];
    let font = {};
    font.attrs = obj['$'];
    font.fontface = obj['font-face'][0]['$'];
    font.glyphs = parseGlyphs(obj.glyph);
    return JSON.stringify(font);
  }

  let isInList = code => list.indexOf(code) != -1;

  function parseGlyphs (glyphs) {
    let result = {};
    glyphs.forEach(glyph => {
      let { unicode, d:path } = glyph['$'];
      if (!isInList(unicode))
        return;

      path = parsePath(path);
      path = path.reduce((sum, now) => sum += '|' + now.join(' '), '').slice(1);
      result[unicode] = path;
    });
    return result;
  }

  suspend.run(function* () {
    let svg = yield fs.readFile(path, { encoding: 'utf8' }, suspend.resume());
    let xml = yield parseXML(svg, suspend.resume());
    let json = parseFont(xml, list);
    callback(null, json);
  }, err => err ? callback(err) : null);
}
