const fs = require("fs");
const path = "./data";

class Store {
	constructor(userId, id, body) {
		this.userId = userId;
		this.id = id;
		this.body = body;
	}

	// Get todos
	getTodos() {
		return new Promise((resolve, reject) => {
			if (fs.existsSync(path)) {
				fs.readFile("./data/data.json", "utf-8", (err, data) => {
					if (err) {
						console.log(err);
						reject();
					}
					resolve(JSON.parse(data));
				});
			} else {
				fs.mkdirSync("data");
				let data = [];
				fs.writeFile(
					"./data/data.json",
					JSON.stringify(data),
					{ flag: "a+" },
					(err) => {
						if (err) {
							console.log(err);
							reject();
						}
						resolve();
					}
				);
			}
		});
	}

	// Get Todo
	getTodo() {
		return new Promise((resolve, reject) => {
			try {
				if (!fs.existsSync(path) || !fs.existsSync("./data/todos.json")) {
					resolve();
				} else {
					let targetTodo;
					fs.readFile("./data/todos.json", "utf-8", (err, data) => {
						if (err) {
							console.log(err);
							reject();
						}
						data = JSON.parse(data);
						for (let i = 0; i < data.length; i++) {
							if (
								data[i].userId === this.userId &&
								parseInt(data[i].todoId) === parseInt(this.id)
							) {
								targetTodo = data[i];
							}
						}
						resolve(JSON.stringify(targetTodo));
					});
				}
			} catch (err) {
				console.log(err);
				reject();
			}
		});
	}

	// Delete todo
	deleteTodo() {
		return new Promise((resolve, reject) => {
			if (!fs.existsSync(path) || !fs.existsSync("./data/todos.json")) {
				resolve();
			} else {
				let targetTodo = -1;
				fs.readFile("./data/todos.json", "utf-8", (err, data) => {
					if (err) {
						console.log(data);
						reject();
					}
					data = JSON.parse(data);
					for (let i = 0; i < data.length; i++) {
						if (
							data[i].userId === parseInt(this.userId) &&
							data[i].todoId === parseInt(this.id)
						) {
							targetTodo = i;
							break;
						}
					}
					console.log(targetTodo);
					if (targetTodo === -1) {
						resolve();
					} else {
						data.splice(targetTodo, 1);
						fs.writeFile("./data/todos.json", JSON.stringify(data), (err) => {
							if (err) {
								console.log(err);
								reject();
							}
							// file writed
							console.log("file");
							resolve(JSON.stringify(data));
						});
					}
				});
			}
		});
	}

	// Update status of todo, i.e., completed or not
	updateTodoStatus() {
		return new Promise((resolve, reject) => {
			if (!fs.existsSync("./data/todos.json")) {
				resolve();
			} else {
			fs.readFile("./data/todos.json", "utf-8", (err, data) => {
				if (err) {
					console.log(err);
					reject();
				}
				data = JSON.parse(data);
				let targetTodo;
				this.body = JSON.parse(this.body);
				for (let i = 0; i < data.length; i++) {
					if (data[i].todoId === parseInt(this.id) && data[i].userId === parseInt(this.userId)) {
						targetTodo = i;
						break;
					}
				}
				if (targetTodo) {
					data[targetTodo].isCompleted = this.body.isCompleted;
					fs.writeFile("./data/data.json", JSON.stringify(data), (err) => {
						if (err) {
							console.log(err);
							reject();
						}
						// File written successfully
					});
					resolve(data[targetTodo]);
				} else {
					resolve();
				}
			});
		}
		});
	}

	// Update todo
	updateTodo() {
		return new Promise((resolve, reject) => {
			if (!fs.existsSync(path)) {
				fs.mkdirSync("data");
				fs.writeFileSync("./data/data.json", JSON.stringify([]));
			}
			fs.readFile("./data/data.json", "utf-8", (err, data) => {
				if (err) {
					console.log(err);
					reject();
				}
				data = JSON.parse(data);
				this.body = JSON.parse(this.body);
				let targetTodo = -1;
				for (let i = 0; i < data.length; i++) {
					if (data[i].id === parseInt(this.id)) {
						targetTodo = i;
					}
				}
				if (targetTodo !== -1) {
					data[targetTodo].title = this.body.title;
					data[targetTodo].description = this.body.description;
					fs.writeFile("./data/data.json", JSON.stringify(data), (err) => {
						if (err) {
							console.log(err);
							reject();
						}
						// File written successful
					});
					resolve(data[targetTodo]);
				} else {
					resolve();
				}
			});
		});
	}

	// Create a new todo testing
	createTodo() {
		return new Promise((resolve, reject) => {
				if (!fs.existsSync("./data/users.json")) {
					resolve();
				} else {
					if (!fs.existsSync("./data/todos.json")) fs.writeFileSync("./data/todos.json", JSON.stringify([]));
					fs.readFile("./data/todos.json", "utf-8", (err, data) => {
						if (err) {
							console.log(err);
							reject();
						}
						data = JSON.parse(data);
						this.body = JSON.parse(this.body);
						const users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
						let existUser = false;
						for (let i = 0; i < users.length; i++) {
							if (users[i].userId === this.userId) {
								existUser = true;
								break;
							}
						}
						console.log(existUser);
						if (existUser) {
						let id = data.length;
						id++;
						let todo = {
							todoId: id,
							userId: this.userId,
							title: this.body.title,
							description: this.body.description,
							isCompleted: false,
						};
						data.push(todo);
						fs.writeFile("./data/todos.json", JSON.stringify(data), (err) => {
							if (err) {
								console.log(err);
								reject();
							}
						});
						let filteredTodos = [];
						fs.readFile("./data/todos.json", "utf-8", (err, data) => {
							if (err) {
								console.log(err);
								reject();
							}
							data = JSON.parse(data);
							for (let i = 0; i < data.length; i++) {
								if (data[i].userId === this.userId) {
									filteredTodos += data[i];
								}
							}
						})
						console.log(data);
						resolve(JSON.stringify(filteredTodos));
					} else {
						resolve();
					}
					});
				}
		});
	}

	// Get Todos with user id
	getTodosTesting() {
		return new Promise((resolve, reject) => {
			if (!fs.existsSync(path) || !fs.existsSync("./data/todos.json")) {
				resolve();
			} else {
				fs.readFile("./data/todos.json", "utf-8", (err, data) => {
					if (err) {
						console.log(err);
						reject();
					}
					data = JSON.parse(data);
					let filteredTodos = [];
					for (let i = 0; i < data.length; i++) {
						if (data[i].userId === parseInt(this.userId)) {
							filteredTodos.push(data[i]);
						}
					}
					console.log(filteredTodos);
					resolve(JSON.stringify(filteredTodos));
				});
			}
		});
	}
}

module.exports = {
	Store,
};
