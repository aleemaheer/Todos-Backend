const http = require("http");
const store = require("./store");

const server = http.createServer((req, res) => {
	if (req.url === "/todos" && req.method === "GET") {
		//handleTodos(req, res);
		HandleTodos(req, res);
	} else if (req.url === "/todos" && req.method === "POST") {
		//handleCreateTodo(req, res);
		HandleCreateTodoTest(req, res);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "GET") {
		const id = req.url.split("/")[2];
		//HandleTodo(req, res, id);
		HandleTodoTest(req, res, id);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "DELETE") {
		const id = req.url.split("/")[2];
		//handleDeleteTodo(req, res, id);
		handleDeleteTodoTest(req, res, id);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PUT") {
		const id = req.url.split("/")[2];
		handleUpdateTodo(req, res, id);
	} else if (
		req.url.match(/\/todos\/updateStatus\/([0-9]+)/) &&
		req.method === "PUT"
	) {
		const id = req.url.split("/")[3];
		handleTodoStatus(req, res, id);
	} else {
		res.writeHead(502, { "Content-Type": "application/json" });
		res.end(JSON.stringify("Route not found"));
	}
});

// Function to handle for changing status of todo
function handleChangeStatus(req, res, id) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const response = await store.changeStatus(id, body);
			if (response) {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(response));
			} else {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Todo not found" }));
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to handle update todo
function handlUpdateTodo(req, res, id) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const response = await store.updateTodo(id, body);
			if (response) {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(response));
			} else {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Todo not found" }));
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

server.listen(3000, () => console.log("Server is listening on 3000"));

// Function to handle to returning todos
async function HandleTodos(req, res) {
	const todos = new store.store();
	const response = await todos.getTodos();
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify(response));
}

// Function to handle to returning todo
async function HandleTodoTest(req, res, id) {
	try {
		const todos = new store.store(id);
		const response = await todos.getTodo();
		if (!response) {
			res.writeHead(404, { "Content-Type": "application/json" });
			console.log(response);
			res.end(JSON.stringify("Todo not found"));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(response));
		}
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to handle create todo
async function HandleCreateTodoTest(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			let id = 1;
			const todos = new store.store(id, body);
			const response = await todos.createTodo();
			if (response) {
				res.writeHead(200, { "Content-type": "application/json" });
				res.end(response);
			} else {
				res.end();
				console.log("Response is " + response);
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Handle delete todo
async function handleDeleteTodoTest(req, res, id) {
	try {
		const todos = new store.store(id);
		const response = await todos.deleteTodo();
		if (!response) {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify("Todo not found"));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(response));
		}
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to update status of todo
function handleTodoStatus(req, res, id) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const todos = new store.store(id, body);
			const response = await todos.updateStatus();
			if (!response) {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end(JSON.stringify("Todo not found"));
			} else {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(response));
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to update status
function handleUpdateTodo(req, res, id) {
	try {
		let body = '';
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async() => {
			const todos = new store.store(id, body);
			const response = await todos.updateTodo();
			if (!response) {
				res.writeHead(404, {"Content-Type": "application/json"});
				res.end(JSON.stringify("Todo not found"));
			} else {
				res.writeHead(200, {"Content-Type": "application/json"});
				res.end(JSON.stringify(response));
			}
		})
	} 
	catch (err) {
		console.log(err);
		res.writeHead(503, {"Content-Type": "application/json"});
		res.end();
	}
}
