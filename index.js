const path = require('path');
const getPixels = require('get-pixels');
const Charm = require('charm');

var local = path.join.bind(path, __dirname);

exports.draw = function(opts) {
  opts = opts || {};

  var charm = Charm();
  var offsetX = opts.x || 0;
  var offsetY = opts.y || 0;

  charm.pipe(process.stdout);

  var colors = {
    '207,70,82': 'red',
    '158,45,68': 'magenta',
    '246,194,70': 'yellow',
    '106,45,49': 'black'
  };

  if (opts.reset) {
    charm.reset();
  }

  if (process.platform === 'linux' && opts.rich) {
    colors = {
      // Light red
      '207,70,82': 88,
      // Dark red
      '158,45,68': 124,
      // Yellow
      '246,194,70': 220,
      // Brown
      '106,45,49': 52
    };
  }

  getPixels(local('./bocoup.gif'), function(err, result) {
    var width = result.shape[1];
    var rows = [];

    for (var i = 0; i < result.data.length; i += 20) {
      var row = Math.floor(i / (width * 4));

      rows[row] = rows[row] || [];

      if (row % 10 === 0) {
        rows[row].push([].slice.call(result.data, i, i + 3).join(','));
      }
    }

    // Remove empty rows.
    rows = rows.filter(function(row) {
      return row.length;
    });

    rows[rows.length - 1].pop();

    rows.forEach(function(row, y) {
      row.forEach(function(pixel, x) {
        charm.position((1 * x) + offsetX, y + offsetY);
        charm.background(colors[pixel] ? colors[pixel] : 'black').write(' ');
      });
    });
  });
};
