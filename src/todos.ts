const fs = require("fs");
import { stat } from "fs";
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
				let userExist = true;
				const user_id = await pool.query("SELECT user_id FROM users WHERE user_id = $1", [userId]);
				if (!user_id.rows[0]) {
					userExist = false;
				}
				if (userExist) {
					const todo = await pool.query("SELECT todo_id, title, description, is_completed FROM todos WHERE todo_id = $1 AND user_id = $2", [todoId, userId]);
					resolve(JSON.stringify(todo.rows));
				} else {
					resolve(null);
				}
			} catch (err) {
				console.log(err);
				reject();
			}
	});
}

	// // Delete todo
	deleteTodo(userId: number, todoId: number) {
	return new Promise(async (resolve, reject) => {
		let existUser = true;
		const user_id = await pool.query("SELECT user_id FROM todos WHERE user_id = $1 AND todo_id = $2", [userId, todoId]);
		if (!user_id.rows[0]) {
			existUser = false;
		}
		if (existUser) {
			await pool.query("DELETE FROM todos WHERE user_id = $1 AND todo_id = $2", [userId, todoId]);
			resolve(JSON.stringify("Todo Deleted"));
		} else {
			resolve(JSON.stringify("Todo Not found"));
		}
		});
	}

	// Update status of todo, i.e., completed or not
	updateTodoStatus(todoId: number, userId: number, status: string) {
		return new Promise(async (resolve, reject) => {
			let existUser = true;
			const user = await pool.query("SELECT user_id FROM todos WHERE user_id = $1 AND todo_id = $2", [userId, todoId]);
			if (!user.rows[0]) {
				existUser = false;
			}
			if (existUser) {
				await pool.query("UPDATE todos SET is_completed = $1 WHERE todo_id = $2 AND user_id = $3", [status, todoId, userId]);
				const todo = await pool.query("SELECT todo_id, title, description, is_completed FROM todos WHERE user_id = $1 AND todo_id = $2", [userId, todoId]);
				resolve(todo.rows);
			} else {
				resolve("Please enter correct user id and todo id.");
			}
		});
	}

	// Update todo
	updateTodo(todoId: number, userId: number, title: string, description: string) {
		return new Promise(async (resolve, reject) => {
			let existUser = true;
			const user = await pool.query("SELECT user_id FROM todos WHERE user_id = $1 AND todo_id = $2", [userId, todoId]);
			if (!user.rows[0]) {
				existUser = false;
			}
			if (existUser) {
				await pool.query("UPDATE todos SET title = $1, description = $2 WHERE user_id = $3 AND todo_id = $4", [title, description, userId, todoId]);
				const todo = await pool.query("SELECT todo_id, title, description, is_completed FROM todos WHERE user_id = $1", [userId]);
				resolve(JSON.stringify(todo.rows));
			} else {
				resolve(null);
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
				const newTodo = await pool.query("INSERT INTO todos (user_id, title, description, is_completed) VALUES ($1, $2, $3, $4) RETURNING *", [userId, todoTitle, todoDescription, false]);
				const todo = await pool.query("SELECT todo_id, title, description, is_completed FROM todos WHERE todo_id = $1", [newTodo.rows[0].todo_id]);
				resolve(todo.rows);
			} else {
				resolve(null);
			}
		});
	}

	// Get Todos with user id
	getTodos(userId: number) {
		return new Promise(async (resolve) => {
			let existUser = true;
			const user_id = await pool.query("SELECT user_id FROM users WHERE user_id = $1", [userId]);
			if (!user_id.rows[0]) {
				existUser = false;
			}
			if (existUser) {
				const todos = await pool.query("SELECT todo_id, title, description, is_completed FROM todos WHERE user_id = $1;", [userId]);
				resolve(JSON.stringify(todos.rows));
			} else {
				resolve(null);
			}
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