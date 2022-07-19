const fs = require("fs");
const { resolve } = require("path");
const { resourceLimits } = require("worker_threads");
//const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

// Function to return all todos
function getTodos() {
	return new Promise((resolve, reject) => {
		fs.readFile("data.json", "utf-8", (err, data) => {
			if (err) {
				console.log(err);
				reject();
			}
			resolve(JSON.parse(data));
		});
	});
}

// Function to find a todo
function getTodo(id) {
	return new Promise((resolve, reject) => {
		try {
			fs.readFile("data.json", "utf-8", (err, data) => {
				if (err) {
					console.log(err);
				}
				data = JSON.parse(data);
				let todo = "";
				for (let i = 0; i < data.length; i++) {
					if (data[i].id === parseInt(id)) {
						todo = data[i];
						break;
					}
				}
				resolve(todo);
			});
		} catch (err) {
			console.log(err.message);
			reject("Todo not found");
		}
	});
}

// Function to create new todo
function createTodo(body) {
	return new Promise((resolve, reject) => {
		try {
			let todos = JSON.parse(fs.readFileSync("data.json", "utf-8"));
			let id = todos.length;
			id++;
			console.log(id);
			const { title, description } = JSON.parse(body);
			const todo = {
				id: id,
				title: title,
				description: description,
				isCompleted: false,
			};
			todos.push(todo);
			fs.writeFile("data.json", JSON.stringify(todos), (err) => {
				if (err) {
					console.log(err);
				}
				// File writed successfull
			});
			resolve(todo);
		} catch (err) {
			console.log(err);
		}
	});
}

// Function to delete todo
function deleteTodo(id) {
	return new Promise((resolve, reject) => {
		try {
			let targetTodo;
			fs.readFile("data.json", "utf-8", (err, data) => {
				if (err) {
					console.log(err);
				}
				data = JSON.parse(data);
				for (let i = 0; i < data.length; i++) {
					if (data[i].id === parseInt(id)) {
						targetTodo = i;
						break;
					} else {
						// todo not found
					}
				}
				if (targetTodo) {
					data.splice(targetTodo, 1);
					console.log(targetTodo);
					fs.writeFile("data.json", JSON.stringify(data), (err) => {
						if (err) {
							console.log(err);
						}
						// file written successfully
					});
					resolve(data);
				} else {
					resolve();
				}
			});
		} catch (err) {
			console.log(err);
			reject();
		}
	});
}

// Function to change the status of todo, i.e., todo is completed or not
function changeStatus(id, body) {
	return new Promise((resolve, reject) => {
		const { isCompleted } = JSON.parse(body);
		body = JSON.parse(body);
		fs.readFile("data.json", "utf-8", (err, data) => {
			if (err) {
				console.log(err);
				reject();
			}
			data = JSON.parse(data);
			let targetTodo = -1;
			for (let i = 0; i < data.length; i++) {
				if (data[i].id === parseInt(id)) {
					targetTodo = i;
					break;
				}
			}
			if (targetTodo === -1) {
				resolve();
			} else {
				data[targetTodo].isCompleted = isCompleted;
				fs.writeFile("data.json", JSON.stringify(data), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
					// Data writed
				});
				resolve(data[targetTodo]);
			}
		});
	});
}

// Function to update todo
function updateTodo(id, body) {
	return new Promise((resolve, reject) => {
		let { title, description } = JSON.parse(body);
		let targetTodo;
		fs.readFile("data.json", "utf-8", (err, data) => {
			if (err) {
				console.log(err);
				reject();
			}
			data = JSON.parse(data);
			for (let i = 0; i < data.length; i++) {
				if (data[i].id === parseInt(id)) {
					targetTodo = i;
					break;
				}
			}
			if (!targetTodo) {
				resolve();
			} else {
				data[targetTodo].title = title;
				data[targetTodo].description = description;
				fs.writeFile("data.json", JSON.stringify(data), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
					// File writed successfully
				});
				resolve(data[targetTodo]);
			}
		});
	});
}

module.exports = {
	getTodos,
	getTodo,
	createTodo,
	deleteTodo,
	changeStatus,
	updateTodo,
};
