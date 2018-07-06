const App = require('../../app');
const test = require('supertest');
const assert = require('assert');

describe('/user', () => {
  describe('GET /', () => {
    it('return all users', async () => {
      let data = {
        user: [
          { username: 'foo', password: 'secret1' },
          { username: 'bar', password: 'secret2' },
        ],
      };

      let app = new App({ connections: [ { data } ] });
      let tester = test(app.callback());

      let { body } = await tester.get('/user').expect(200);

      assert.equal(body.length, 2);
    });
  });

  describe('POST /', () => {
    it('add new user');
  });

  describe('GET /{id}', () => {
    it('get user by id');
  });

  describe('PUT /{id}', () => {
    it('update user by id');
  });

  describe('DELETE /{id}', () => {
    it('delete user by id');
  });
});
