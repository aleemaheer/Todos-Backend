const fs = require("fs");
const http = require("http");
//let data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
const store = require("./store");

const server = http.createServer((req, res) => {
	if (req.url === "/todos" && req.method === "GET") {
		handleTodos(req, res);
	} else if (req.url === "/todos" && req.method === "POST") {
		//createTodo(req, res);
		handleCreateTodo(req, res);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "GET") {
		const id = req.url.split("/")[2];
		//handleTodo(req, res, id);
		HandleTodo(req, res, id);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "DELETE") {
		const id = req.url.split("/")[2];
		//deleteTodo(req, res, id);
		handleDeleteTodo(req, res, id);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PUT") {
		const id = req.url.split("/")[2];
		//updateTodo(req, res, id);
		handleUpdateTodo(req, res, id);
	} else if (
		req.url.match(/\/todos\/updateStatus\/([0-9]+)/) &&
		req.method === "PUT"
	) {
		const id = req.url.split("/")[3];
		handleChangeStatus(req, res, id);
	} else {
		res.writeHead(502, { "Content-Type": "application/json" });
		res.end(JSON.stringify("Route not found"));
	}
});

// Function to get all todos (GET REQUEST)
async function handleTodos(req, res) {
	const todos = await store.getTodos();
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify(todos));
}

// Function to get a single todo (GET REQUEST)
async function HandleTodo(req, res, id) {
	try {
		let todo = await store.getTodo(id);
		if (!todo) {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Todo not found" }));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(todo));
		}
	} catch (err) {
		console.log(err.message);
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

// Function to handle create todo request
function handleCreateTodo(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const response = await store.createTodo(body);
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(response));
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to handle delete todo
async function handleDeleteTodo(req, res, id) {
	try {
		let response = await store.deleteTodo(id);
		if (response) {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(response));
		}
		else {
			res.writeHead(404, {"Content-Type": "application/json"});
			res.end(JSON.stringify({message: "Todo not found"}));
		}
	} catch (err) {
		res.writeHead(503, { "Content-Type": "text/plain" });
		console.log(err);
		const message = await store.deleteTodo(id);
		res.end();
	}
}

// Function to handle for changing status of todo
function handleChangeStatus(req, res, id) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const response = await store.changeStatus(id, body);
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(response));
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to update todo
function handleUpdateTodo(req, res, id) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const response = await store.updateTodo(id, body);
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(response));
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}
