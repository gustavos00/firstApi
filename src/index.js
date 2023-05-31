const http = require("http");
const { URL } = require("url");

const routes = require("./routes");

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`)
  const parsedParams = Object.fromEntries(parsedUrl.searchParams)

  const route = routes.find(
    (routObject) =>
      routObject.endpoint === parsedUrl.pathname &&
      routObject.method === request.method
  );

  if (route) {
    route.handler({ ...request, query: parsedParams }, response);
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
});

server.listen(3000, () =>
  console.log("Server started at http://localhost:3000")
);
