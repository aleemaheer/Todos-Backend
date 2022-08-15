//const Todo = require("../todos");
import {Todo} from "../todos";
var todo = new Todo.Todos();

function handleTodosRoutes(req, res) {
	if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "GET") {
		const todoId = req.url.split("/")[2];
		handleGetTodo(req, res, todoId);
	} else if (req.url === "/todos" && req.method === "GET") {
		handleGetTodos(req, res);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "DELETE") {
		const todoId = req.url.split("/")[2];
		handleDeleteTodo(req, res, todoId);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PUT") {
		const todoId = req.url.split("/")[2];
		handleUpdateTodo(req, res, todoId);
	} else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PATCH") {
		const todoId = req.url.split("/")[2];
		handleUpdateTodoStatus(req, res, todoId);
	} else if (req.url === "/todos" && req.method === "POST") {
		handleCreateTodo(req, res);
	} else {
		res.writeHead(502, { "Content-Type": "application/json" });
		res.end(JSON.stringify("Route not found"));
	}
}

// Function to handle Get todo route
async function handleGetTodo(req, res, todoId) {
	try {
		const userId = parseInt(req.headers.user_id);
		const response = await todo.getTodo(userId, todoId);
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

// Function to handle Get todos route
async function handleGetTodos(req, res) {
	try {
		const userId = parseInt(req.headers.user_id);
		const response = await todo.getTodos(userId);
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
async function handleDeleteTodo(req, res, todoId) {
	try {
		const userId = req.headers.user_id;
		const response = await todo.deleteTodo(userId, todoId);
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

// Function to handle update todo
function handleUpdateTodo(req, res, todoId) {
	try {
		let body: any = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const title: any = body.title;
			const description = body.description;
			const userId = req.headers.user_id;
			const response = await todo.updateTodo(
				todoId,
				userId,
				title,
				description,
			);
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

// Function to handle update todo status
function handleUpdateTodoStatus(req, res, todoId) {
	try {
		let body: any = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const userId = req.headers.user_id;
			const isCompleted: boolean = body.isCompleted;
			const response = await todo.updateTodoStatus(
				todoId,
				userId,
				isCompleted,
			);
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

// Function to handle create todo
function handleCreateTodo(req, res) {
	try {
		let body: any = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const todoTitle = body.title;
			const todoDescription = body.description;
			const userId = parseInt(req.headers.user_id);
			const response = await todo.createTodo(
				userId,
				todoTitle,
				todoDescription
			);
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

module.exports = {
	handleTodosRoutes,
};
