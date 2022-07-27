const http = require("http");
const store = require("./store");

const server = http.createServer((req, res) => {
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "OPTIONS, POST, GET, DELETE, PUT",
		"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
		"Access-Control-Allow-Credentials": true
	}

	if (req.method === 'OPTIONS') {
		res.writeHead(204, headers);
		res.end();
		return;
	}

	//if (['GET', 'POST'].indexOf(req.method) > -1) {
	//	res.writeHead(200, headers);
	//	res.end();
	//	return;
	//}

	if (req.url === "/todos" && req.method === "GET") {
		handleCors(req, res);
		handleGetTodos(req, res);
	} else if (req.url === "/todos" && req.method === "POST") {
		handleCreateTodo(req, res);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "GET") {
		const id = req.url.split("/")[2];
		handleGetTodo(req, res, id);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "DELETE") {
		const id = req.url.split("/")[2];
		handleDeleteTodo(req, res, id);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PUT") {
		const id = req.url.split("/")[2];
		handleUpdateTodo(req, res, id);
	} else if (
		req.url.match(/\/todos\/updateStatus\/([0-9]+)/) &&
		req.method === "PUT"
	) {
		const id = req.url.split("/")[3];
		handleUpdateTodoStatus(req, res, id);
	} else {
		res.writeHead(502, { "Content-Type": "application/json" });
		res.end(JSON.stringify("Route not found"));
	}
});

// Function to handle to return todos
async function handleGetTodos(req, res) {
	const todos = new store.Store();
	const response = await todos.getTodos();
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify(response));
}

// Function to handle to return todo
async function handleGetTodo(req, res, id) {
	try {
		const todos = new store.Store(id);
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
async function handleCreateTodo(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			let id = 1;
			const todos = new store.Store(id, body);
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

// Function to handle delete todo
async function handleDeleteTodo(req, res, id) {
	try {
		const todos = new store.Store(id);
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
function handleUpdateTodoStatus(req, res, id) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const todos = new store.Store(id, body);
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

// Function to update content of todo 
function handleUpdateTodo(req, res, id) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const todos = new store.Store(id, body);
			const response = await todos.updateTodo();
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

function handleCors(req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
		res.setHeader(
			"Access-Control-Allow-Methods",
			"POST, GET, PUT, DELETE,PATCH"
		);
		res.setHeader("Access-Control-Allow-Credentials", true);
		res.statusCode = 200;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
