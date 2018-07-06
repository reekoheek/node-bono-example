const debug = require('debug')('bono-example:migrations:initial');

module.exports = {
  up () {
    debug('Upgrading ...');
  },

  down () {
    debug('Downgrading ...');
  },
};
