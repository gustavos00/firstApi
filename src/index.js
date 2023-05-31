const http = require("http");
const { URL } = require("url");

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
      routObject.endpoint === pathname &&
      routObject.method === request.method
  );

  if (route) {
    request.query = parsedParams;
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { "Content-Type": "text/html" });
      response.end(body);
    }


    route.handler(request, response);
  } else {
   
  }
});

server.listen(3000, () =>
  console.log("Server started at http://localhost:3000")
);
