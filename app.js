const Bundle = require('bono');
const Manager = require('node-norm');
const NormBundle = require('bono-norm/bundle');

class App extends Bundle {
  constructor ({ connections }) {
    super();

    let manager = this.manager = new Manager({ connections });

    this.use(require('bono-norm')({ manager }));
    this.use(require('bono/middlewares/json')());

    this.bundle('/user', new NormBundle({ schema: 'user' }));
    this.bundle('/role', new NormBundle({ schema: 'role' }));

    this.get('/', this.index.bind(this));
  }

  index () {
    const { name, version } = require('./package.json');

    return { name, version };
  }
}

module.exports = App;
