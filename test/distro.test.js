var distros = require('../app/distros');

var options = [];
for (var i in distros) {
  options.push(distros[i].option);
}

