const App = require('./index');
const http = require('http');
const PORT = process.env.PORT || 3000;
const config = require('./config');

const app = new App(config);
const server = http.createServer(app.callback());
server.listen(PORT, () => {
  console.info(`Running at ${PORT}`);
});
