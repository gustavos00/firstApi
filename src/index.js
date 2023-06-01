const http = require("http");
const { URL } = require("url");

const bodyParser = require("./helpers/bodyParser");
const routes = require("./routes");

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);
  const parsedParams = Object.fromEntries(parsedUrl.searchParams);

  let { pathname } = parsedUrl;
  let id = null;
  const splitEnpoint = pathname.split("/").filter(Boolean);

  if (splitEnpoint.length > 1) {
    pathname = `/${splitEnpoint[0]}/:id`;
    id = splitEnpoint[1];
  }

  const route = routes.find(
    (routObject) =>
      routObject.endpoint === pathname && routObject.method === request.method
  );

  if (route) {
    request.query = parsedParams;
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { "Content-Type": "text/html" });
      response.end(body);
    };

    if (["POST", "PUT"].includes(request.method)) {
      bodyParser(request, () => {
        route.handler(request, response);
      });
    } else {
      route.handler(request, response);
    }
  } else {
    response.writeHead(statusCode, { "Content-Type": "text/html" });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
});

server.listen(3000, () =>
  console.log("Server started at http://localhost:3000")
);
