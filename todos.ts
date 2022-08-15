const fs = require("fs");
const path = require("path").join(__dirname, "data");
// const path = __dirname + "/data";

class Todo {
	constructor() {
		this.init();
	}

	init() {
		try {
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			if (!fs.existsSync(path + "/todos.json")) {
				fs.writeFile(path + "/todos.json", JSON.stringify([]), (err) => {
					if (err) {
						console.log(err);
					}
					// File written successfully
				});
				fs.writeFile(path + "/users.json", JSON.stringify([]), (err) => {
					if (err) {
						console.log(err);
					}
					// File written successfully
				});
			}
		} catch (err) {
			console.log(err);
		}
	}

	// Function to read todos
	async readTodos() {
		try {
			const data = await fs.readFileSync(path + "/todos.json", "utf-8");
			return JSON.parse(data);
		} catch (err) {
			console.log(err);
		}
	}

	// Function to read users data
	async readUsers() {
		try {
			const data = fs.readFileSync(path + "/users.json", "utf-8");
			return JSON.parse(data);
		} catch (err) {
			console.log(err);
		}
	}

	// Get Todo
	getTodo(userId, todoId) {
		return new Promise(async (resolve, reject) => {
			try {
				let targetTodo;
				const todosData = await this.readTodos();
				for (let i = 0; i < todosData.length; i++) {
					if (
						todosData[i].userId === userId &&
						parseInt(todosData[i].todoId) === parseInt(todoId)
					) {
						targetTodo = todosData[i];
					}
				}
				/// ------ Another method to search -------/////////
				// const targetTodo = data.find((item) => item.todoId === parseInt(this.id));
				resolve(JSON.stringify(targetTodo));
			} catch (err) {
				console.log(err);
				reject();
			}
		});
	}

	// Delete todo
	deleteTodo(userId, todoId) {
		return new Promise(async (resolve, reject) => {
			let targetTodo = -1;
			const filteredTodos = [];
			const todosData = await this.readTodos();
			for (let i = 0; i < todosData.length; i++) {
				if (
					todosData[i].userId === parseInt(userId) &&
					todosData[i].todoId === parseInt(todoId)
				) {
					targetTodo = i;
					break;
				}
			}
			if (targetTodo === -1) {
				resolve(null);
			} else {
				todosData.splice(targetTodo, 1);
				fs.writeFile(path + "/todos.json", JSON.stringify(todosData), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
					// file writed
					fs.readFile(path + "/todos.json", "utf-8", (err, data) => {
						if (err) {
							console.log(err);
							reject();
						}
						data = JSON.parse(data);
						for (let i = 0; i < data.length; i++) {
							if (data[i].userId === parseInt(userId)) {
								filteredTodos.push(data[i]);
							}
						}
						resolve(JSON.stringify(filteredTodos));
					});
				});
			}
		});
	}

	// Update status of todo, i.e., completed or not
	updateTodoStatus(todoId, userId, status) {
		return new Promise(async (resolve, reject) => {
			const todosData = await this.readTodos();
			let targetTodo;
			for (let i = 0; i < todosData.length; i++) {
				if (
					todosData[i].todoId === parseInt(todoId) &&
					todosData[i].userId === parseInt(userId)
				) {
					targetTodo = i;
					break;
				}
			}
			if (targetTodo || targetTodo === 0) {
				todosData[targetTodo].isCompleted = status;
				fs.writeFile(path + "/todos.json", JSON.stringify(todosData), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
					// File written successfully
				});
				resolve(todosData[targetTodo]);
			} else {
				resolve(null);
			}
		});
	}

	// Update todo
	updateTodo(todoId, userId, title, description) {
		return new Promise(async (resolve, reject) => {
			let targetTodo;
			const todosData = await this.readTodos();
			for (let i = 0; i < todosData.length; i++) {
				if (
					todosData[i].userId === parseInt(userId) &&
					todosData[i].todoId === parseInt(todoId)
				) {
					targetTodo = i;
					break;
				}
			}
			// Update todo
			if (!targetTodo && targetTodo !== 0) {
				resolve(null);
			} else {
				todosData[targetTodo].title = title;
				todosData[targetTodo].description = description;
				fs.writeFile(path + "/todos.json", JSON.stringify(todosData), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
					// File written
				});
				resolve(JSON.stringify(todosData[targetTodo]));
			}
		});
	}

	// Create a new todo testing
	createTodo(userId, todoTitle, todoDescription) {
		return new Promise(async (resolve, reject) => {
			const todosData = await this.readTodos();
			const usersData = await this.readUsers();
			let existUser = false;
			for (let i = 0; i < usersData.length; i++) {
				if (usersData[i].userId === userId) {
					existUser = true;
					break;
				}
			}
			if (existUser) {
				let id = todosData.length;
				id++;
				const todo = {
					todoId: id,
					userId,
					title: todoTitle,
					description: todoDescription,
					isCompleted: false,
				};
				todosData.push(todo);
				fs.writeFile(path + "/todos.json", JSON.stringify(todosData), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
				});
				resolve(todo);
			} else {
				resolve(null);
			}
		});
	}

	// Get Todos with user id
	getTodos(userId) {
		return new Promise(async (resolve) => {
			const todosData = await this.readTodos();
			const usersData = await this.readUsers();
			const filteredTodos = [];
			let i = 1;
			for (i = 0; i < todosData.length; i++) {
				if (todosData[i].userId === parseInt(userId)) {
					filteredTodos.push(todosData[i]);
				}
			}
			let existUser = false;
			for (let i = 0; i < usersData.length; i++) {
				if (usersData[i].userId === parseInt(userId)) {
					existUser = true;
					break;
				}
			}
			if (!existUser) {
				resolve(JSON.stringify("This user does not exist"));
			} else {
				if (!filteredTodos[0]) {
					resolve(JSON.stringify([]));
				} else {
					resolve(JSON.stringify(filteredTodos));
				}
			}
		});
	}
}

module.exports = {
	Todo,
};
