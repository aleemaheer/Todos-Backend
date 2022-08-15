"use strict";
exports.__esModule = true;
//const http = require("http");
var http = require("http");
var handleTodosRoutes = require("./routes/todoRoute");
var handleUserRoutes = require("./routes/userRoute");
var server = http.createServer(function (req, res) {
    var headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, DELETE, PUT, PATCH",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Credentials": true
    };
    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
    }
    if (req.url === "/register" ||
        req.url === "/login" ||
        req.url === "/forgot") {
        handleUserRoutes.handleUserRoutes(req, res);
    }
    else if (req.url === "/todos") {
        // Handle todos routes
        handleTodosRoutes.handleTodosRoutes(req, res);
    }
    else {
        handleMatchingUrls(req, res);
        // res.writeHead(502, { "Content-Type": "application/json" });
        // res.end(JSON.stringify("Route not found"));
    }
});
// req.url.match(/\/todos\/([0-9]+)/
function handleCors(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE,PATCH");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.statusCode = 200;
}
function handleMatchingUrls(req, res) {
    if (req.url.match(/\/account\/([0-9]+)/)) {
        handleUserRoutes.handleUserRoutes(req, res);
    }
    else if (req.url.match(/\/todos\/([0-9]+)/)) {
        handleTodosRoutes.handleTodosRoutes(req, res);
    }
    else {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(JSON.stringify("Route Not Found"));
    }
}
var PORT = process.env.PORT || 3000;
server.listen(PORT, function () { return console.log("Server is listening on ".concat(PORT)); });
