var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
}, {
  blockBinding: true
});

require('./main');
