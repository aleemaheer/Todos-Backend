const fs = require("fs");
const http = require("http");
const content = require('./data.json');

const server = http.createServer((req, res) => {
	if (req.url === "/todos" && req.method === "GET") {
		getRequest(req, res);
	} else if (req.url === "/todos" && req.method === "POST") {
		postRequest(req, res);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "GET") {
		const id = req.url.split('/')[2];
		getSingleTodo(req, res, id);
	} else if (req.url === "/todos" && req.method === "DELETE") {
		deleteRequest(req, res);
	} else if (req.url === "/todos" && req.method === "PUT") {
		putRequest(req, res);
	} else {
		res.end("Route not found");
	}
});

// Function to call for get request
function getRequest(req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	const data = fs.readFileSync("data.json", "utf-8");
	res.end(JSON.stringify(content));
}

// Function to get a single todo
async function getSingleTodo(req, res, id) {
	try {
		// Search todo by id
		if (!content) {
			res.writeHead(404, {"Content-Type": "application/json"});
			res.end(JSON.stringify({ message: "Product not found"}));
		}
		else {
			res.writeHead(200, {"Content-Type": "application/json"});
			//console.log(content);
			res.end(singleTodo);
			console.log(singleTodo);
		}
	}
	catch (err) {
		console.log(err.message);
		res.writeHead(503, {"Content-Type": "application/json"});
		res.end("Internal Server Error");
	}
}

// Function to call for post request
function postRequest(req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	console.log(typeof req.body);
	res.end("You have sended a post request");
}

// Function to call for delete request
function deleteRequest(req, res) {
	res.writeHead(200, { "Content-Type": "applicaton/json" });
	res.end("You have sended the delete request");
}

// Function to call for put request
function putRequest(req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end("You have sended a put request");
}

server.listen(3000, () => console.log("Server is listening on 3000"));
