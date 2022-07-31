const http = require("http");
const todosStore = require("./todos");
const userStore = require("./users");

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

	if (req.url === "/register" && req.method === "POST") {
		handleRegisterUser(req, res);
	} else if (req.url === "/login" && req.method === "POST") {
		handleLogin(req, res);
	} else if (req.url === "/todos" && req.method === "POST") {
		handleCreateTodo(req, res);
	} else if (req.url === "/todos" && req.method === "GET") {
		handleCors(req, res);
		handleGetTodos(req, res);
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
		req.url.match(/\/todos\/([0-9]+)/) &&
		req.method === "PATCH"
	) {
		const id = req.url.split("/")[2];
		handleUpdateTodoStatus(req, res, id);
	} else {
		res.writeHead(502, { "Content-Type": "application/json" });
		res.end(JSON.stringify("Route not found"));
	}
});

// Function to handle to return todo
async function handleGetTodo(req, res, id) {
	try {
		const userId = parseInt(req.headers.user_id);
		body = "js";
		const todos = new todosStore.Todo(userId, id, body);
		const response = await todos.getTodo();
		if (!response) {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify("Todo not found"));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(response);
		}
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to handle delete todo
async function handleDeleteTodo(req, res, id) {
	try {
		const userId = req.headers.user_id;
		const todos = new todosStore.Todo(userId, id);
		const response = await todos.deleteTodo();
		if (!response) {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify("Todo not found"));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(response);
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
			const userId = req.headers.user_id;
			const todos = new todosStore.Todo(userId, id, body);
			const response = await todos.updateTodoStatus();
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
			const userId = req.headers.user_id;
			console.log("User id " + userId);
			const todos = new todosStore.Todo(userId, id, body);
			const response = await todos.updateTodo();
			if (!response) {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end(JSON.stringify("Todo not found"));
			} else {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(response);
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
	res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE,PATCH");
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.statusCode = 200;
}

// Function to handle register user, post request
function handleRegisterUser(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const users = new userStore.User(body);
			const response = await users.register();
			if (!response) {
				res.writeHead(502, { "Content-Type": "application/json" });
				res.end();
			} else if (response === "emailNotAcceptable") {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify("Sorry this email already exists, please try another")
				);
			} else {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(response);
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to handle create todo testing
function handleCreateTodo(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const userId = parseInt(req.headers.user_id);
			let todoId = 1;
			const todos = new todosStore.Todo(userId, todoId, body);
			const response = await todos.createTodo();
			if (!response) {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify(
						"This user id does not exist, please register to create todos"
					)
				);
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

// Function to handle get todos
async function handleGetTodos(req, res) {
	try {
		const userId = parseInt(req.headers.user_id);
		const todos = new todosStore.Todo(userId);
		const response = await todos.getTodos();
		if (!response) {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify("Todo not found"));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(response);
		}
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to handle login post request
function handleLogin(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			const users = new userStore.User(body);
			const response = await users.login();
			if (!response) {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end(JSON.stringify("You have not registered yet, please register"));
			} else {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(response);
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
