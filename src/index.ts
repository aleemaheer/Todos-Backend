import * as http from "http";
import fs from "fs";
import path from "path";
const handleTodosRoutes = require(path.resolve(__dirname, "routes/todoRoute"));
const handleUserRoutes = require(path.resolve(__dirname, "routes/userRoute"));
const handleStaticRoutes = require(path.resolve(__dirname, "routes/staticRoute"));

const server = http.createServer((req, res) => {
	const headers: any = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "OPTIONS, POST, GET, DELETE, PUT, PATCH",
		"Access-Control-Allow-Headers":
			"Origin, X-Requested-With, Content-Type, Accept",
		"Access-Control-Allow-Credentials": true,
	};

	if (req.method === "OPTIONS") {
		res.writeHead(204, headers);
		res.end();
		return;
	}

	if (
		req.url === "/register" ||
		req.url === "/login" ||
		req.url === "/forgot"
	) {
		handleCors(req, res);
		handleUserRoutes.handleUserRoutes(req, res);
	} else if (req.url === "/todos") {
		// Handle todos routes
		handleCors(req, res);
		handleTodosRoutes.handleTodosRoutes(req, res);
	} else if (req.url === "/") {
		handleCors(req, res);
		handleStaticRoutes.handleStaticRoutes(req, res);
	} else {
		handleCors(req, res);
		handleMatchingUrls(req, res);
		// res.writeHead(502, { "Content-Type": "application/json" });
		// res.end(JSON.stringify("Route not found"));
	}
});
// req.url.match(/\/todos\/([0-9]+)/

function handleCors(req: any, res: any) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE,PATCH");
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.statusCode = 200;
}

function handleMatchingUrls(req: any, res: any) {
	if (req.url.match(/\/account\/([0-9]+)/)) {
		handleCors(req, res);
		handleUserRoutes.handleUserRoutes(req, res);
	} else if (req.url.match(/\/todos\/([0-9]+)/)) {
		handleCors(req, res);
		handleTodosRoutes.handleTodosRoutes(req, res);
	} else {
		handleCors(req, res);
		handleStaticRoutes.handleStaticRoutes(req, res);
	}
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
