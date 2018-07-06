
const App = require('../app');
const test = require('supertest');
const assert = require('assert');

describe('/', () => {
  describe('GET /', () => {
    it('return application name and version', async () => {
      let app = new App({ connections: [ {} ] });
      let tester = test(app.callback());

      let { body: { name, version } } = await tester.get('/').expect(200);

      const pkg = require('../package.json');

      assert.equal(pkg.name, name);
      assert.equal(pkg.version, version);
    });
  });
});
