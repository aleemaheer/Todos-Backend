const http = require("http");
const handleTodosRoutes = require("./routes/todoRoute");
const handleUserRoutes = require("./routes/userRoute");

const server = http.createServer((req, res) => {
	const headers = {
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
		req.url.match(/\/account\/([0-9]+)/)
	) {
		handleUserRoutes.handleUserRoutes(req, res);
	} else if (req.url === "/todos" || req.url.match(/\/todos\/([0-9]+)/)) {
		// Handle todos routes
		handleTodosRoutes.handleTodosRoutes(req, res);
	} else {
		res.writeHead(502, { "Content-Type": "application/json" });
		res.end(JSON.stringify("Route not found"));
	}
});

function handleCors(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE,PATCH");
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.statusCode = 200;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
