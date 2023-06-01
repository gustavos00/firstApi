function bodyParser(request, callback) {
  let body = "";

  request
    .on("data", (chunk) => {
      body += chunk;
    })
    .on("end", () => {
      body = JSON.parse(body);

      request.body = body;
      callback();
    });
}

module.exports = bodyParser;
