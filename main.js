let express = require('express');
let app = express();
import { convertSVGToJSON } from './svg2json';

app.use('/static', express.static(__dirname + '/public'));

app.get('/puncs/:path', (req, res, next) => {
  let path = req.params.path;
  path = 'puncs/' + path + '.svg';
  convertSVGToJSON(path, (err, dat) => {
    if (err) {
      next(err);
      return;
    }
    res.send(dat);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000);

console.log('listening on port 3000');