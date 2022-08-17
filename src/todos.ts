const fs = require("fs");
import { pool } from "./db";
const path = require("path").join(__dirname, "data");
export module Todo{
export class Todos {
	constructor() {
		this.init();
	}



	init() {
		try {
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			if (!fs.existsSync(path + "/todos.json")) {
				fs.writeFile(path + "/todos.json", JSON.stringify([]), (err: string) => {
					if (err) {
						console.log(err);
					}
					// File written successfully
				});
				fs.writeFile(path + "/users.json", JSON.stringify([]), (err: string) => {
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
	getTodo(userId: number, todoId: number) {
		return new Promise(async (resolve, reject) => {
			try {
				// let targetTodo;
				// const todosData = await this.readTodos();
				// for (let i = 0; i < todosData.length; i++) {
				// 	if (
				// 		todosData[i].userId === userId &&
				// 		parseInt(todosData[i].todoId) === todoId
				// 	) {
				// 		targetTodo = todosData[i];
				// 	}
				// }
				const todo = await pool.query("SELECT title, description, is_completed FROM todos WHERE todo_id = $1 AND user_id = $2", [todoId, userId]);
				/// ------ Another method to search -------/////////
				// const targetTodo = data.find((item) => item.todoId === parseInt(this.id));
				resolve(JSON.stringify(todo.rows));
			} catch (err) {
				console.log(err);
				reject();
			}
		});
	}

	// Delete todo
	deleteTodo(userId: number, todoId: number) {
		return new Promise(async (resolve, reject) => {
			let targetTodo = -1;
			const filteredTodos: Array<String> = [];
			const todosData = await this.readTodos();
			for (let i = 0; i < todosData.length; i++) {
				if (
					todosData[i].userId === userId &&
					todosData[i].todoId === todoId
				) {
					targetTodo = i;
					break;
				}
			}
			if (targetTodo === -1) {
				resolve(null);
			} else {
				todosData.splice(targetTodo, 1);
				fs.writeFile(path + "/todos.json", JSON.stringify(todosData), (err: string) => {
					if (err) {
						console.log(err);
						reject();
					}
					// file writed
					fs.readFile(path + "/todos.json", "utf-8", (err: string, data: any) => {
						if (err) {
							console.log(err);
							reject();
						}
						data = JSON.parse(data);
						for (let i = 0; i < data.length; i++) {
							if (data[i].userId === userId) {
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
	updateTodoStatus(todoId: number, userId: number, status: string) {
		return new Promise(async (resolve, reject) => {
			const todosData = await this.readTodos();
			let targetTodo;
			for (let i = 0; i < todosData.length; i++) {
				if (
					todosData[i].todoId === todoId &&
					todosData[i].userId === userId
				) {
					targetTodo = i;
					break;
				}
			}
			if (targetTodo || targetTodo === 0) {
				todosData[targetTodo].isCompleted = status;
				fs.writeFile(path + "/todos.json", JSON.stringify(todosData), (err: string) => {
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
	updateTodo(todoId: number, userId: number, title: string, description: string) {
		return new Promise(async (resolve, reject) => {
			let targetTodo;
			const todosData = await this.readTodos();
			for (let i = 0; i < todosData.length; i++) {
				if (
					todosData[i].userId === userId &&
					todosData[i].todoId === todoId
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
				fs.writeFile(path + "/todos.json", JSON.stringify(todosData), (err: string) => {
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
	createTodo(userId: number, todoTitle: string, todoDescription: string) {
		return new Promise(async (resolve, reject) => {
			let existUser = true;
			const user_id = await pool.query("SELECT user_id FROM users WHERE user_id = $1", [userId]);
			if (!user_id.rows[0]) {
				existUser = false;
			}
			if (existUser) {
				const newTodo = await pool.query("INSERT INTO todos (user_id, title, description, is_completed) VALUES ($1, $2, $3, $4)", [userId, todoTitle, todoDescription, false]);
				const todo = await pool.query("SELECT title, description, is_completed FROM todos WHERE todo_id = $1", [newTodo.rows[0].todo_id]);
				resolve(todo.rows);
			} else {
				resolve(null);
			}
		});
	}

	// Get Todos with user id
	getTodos(userId: number) {
		return new Promise(async (resolve) => {
			const todos = await pool.query("SELECT title, description, is_completed FROM todos WHERE user_id = $1;", [userId]);
			resolve(JSON.stringify(todos.rows));
			// const todosData = await this.readTodos();
			// const usersData = await this.readUsers();
			// let filteredTodos: Array<String> = [];
			// let i = 1;
			// for (i = 0; i < todosData.length; i++) {
			// 	if (todosData[i].userId === userId) {
			// 		filteredTodos.push(todosData[i]);
			// 	}
			// }
			// let existUser = false;
			// for (let i = 0; i < usersData.length; i++) {
			// 	if (usersData[i].userId === userId) {
			// 		existUser = true;
			// 		break;
			// 	}
			// }
			// if (!existUser) {
			// 	resolve(JSON.stringify("This user does not exist"));
			// } else {
			// 	if (!filteredTodos[0]) {
			// 		resolve(JSON.stringify([]));
			// 	} else {
			// 		resolve(JSON.stringify(filteredTodos));
			// 	}
			// }
		});
	}
}
}

// module.exports = {
// 	Todo,
// };

// Justing testing a function
async function readData() {
	try {
		const data = await pool.query("SELECT  title, description, is_completed FROM todos;");
		console.log(data.rows);
	} catch (err) {
		console.log(err);
	}
}

//readData();