const fs = require("fs");
const http = require("http");
let data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

const server = http.createServer((req, res) => {
	if (req.url === "/todos" && req.method === "GET") {
		getTodos(req, res);
	} else if (req.url === "/todos" && req.method === "POST") {
		createTodo(req, res);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "GET") {
		const id = req.url.split("/")[2];
		getTodo(req, res, id);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "DELETE") {
		const id = req.url.split("/")[2];
		deleteTodo(req, res, id);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PUT") {
		const id = req.url.split("/")[2];
		updateTodo(req, res, id);
	} else {
		res.writeHead(502, {"Content-Type": "application/json"});
		res.end(JSON.stringify("Route not found"));
	}
});

// Function to get all todos (GET REQUEST)
function getTodos(req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify(data));
}

// Function to get a single todo (GET REQUEST)
function getTodo(req, res, id) {
	try {
		// Search todo by id
		let singleTodo;
		for (let i = 0; i < data.length; i++) {
			if (data[i].id === parseInt(id)) {
				singleTodo = data[i];
				break;
			}
		}
		if (!singleTodo) {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify(`Todo with id ${id} not found`));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(singleTodo));
		}
	} catch (err) {
		console.log(err.message);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end("Internal Server Error");
	}
}

// Function to call for post request
function createTodo(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});

		req.on("end", () => {
			const { title, description, isCompleted } = JSON.parse(body);
			const getIdFromThere = JSON.parse(fs.readFileSync("data.json", "utf-8"));
			let id = getIdFromThere.length;
			id++;
			const newTodo = {
				id: id,
				title: title,
				description: description,
				isCompleted: isCompleted,
			};
			data.push(newTodo);
			fs.writeFileSync("data.json", JSON.stringify(data));
			res.writeHead(200, { "Content-Type": "application/json" });
			res.write(JSON.stringify(newTodo));
			res.end();
		});
	} catch (err) {
		console.log(err.message);
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to call for delete request
function deleteTodo(req, res, id) {
	try {
		let indexOfTargetTodo;
		if (!data[0]) {
			res.writeHead(404, {"Content-Type": "application/json"});
			res.end(JSON.stringify(`Todo list is empty`));
		} else {
			for (let i = 0; i < data.length; i++) {
				if (data[i].id === parseInt(id)) {
					indexOfTargetTodo = i;
					break;
				} else {
					// not found
				}
			}
			if (indexOfTargetTodo != 0 && !indexOfTargetTodo) {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end(JSON.stringify(`Todo with id ${id} not found`));
			} else {
				// Delete the todo with indexOfTargetTodo
				data.splice(indexOfTargetTodo, 1);
				fs.writeFileSync("data.json", JSON.stringify(data));
				res.writeHead(200, { "Content-Type": "application/json" });
				res.write(JSON.stringify(data));
				res.end();
			}
		}
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to call for put request
function updateTodo(req, res, id) {
	try {
		let targetTodo = "";
		let indexOfTargetTodo = "";
		for (let i = 0; i < data.length; i++) {
			if (data[i].id === parseInt(id)) {
				targetTodo = data;
				indexOfTargetTodo = i;
				break;
			}
		}
		if (!targetTodo) {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end();
		}
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", () => {
			const { title, description, isCompleted } = JSON.parse(body);
			const newTodo = {
				id: parseInt(id),
				title: title,
				description: description,
				isCompleted: isCompleted,
			};
			data[indexOfTargetTodo] = newTodo;
			fs.writeFileSync("data.json", JSON.stringify(data));
			res.writeHead(200, { "Content-Type": "application/json" });
			res.write(JSON.stringify(newTodo));
			res.end();
		});
	} catch (err) {
		res.writeHead(503, { "Content-Type": "application/json" });
		console.log(err);
		res.end();
	}
}

server.listen(3000, () => console.log("Server is listening on 3000"));
