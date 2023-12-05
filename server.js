const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3200;
const customMiddleware = require('./customMiddleware');

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(customMiddleware)
server.use(router);

server.listen(port, () => console.log(`Your server running on ${port}`));