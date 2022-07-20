const fs = require("fs");

let store = class {
	constructor(id, body) {
		this.id = id;
		this.body = body;
	}

	// Get todos
	getTodos() {
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

	// Get Todo
	getTodo() {
		return new Promise((resolve, reject) => {
			try {
				fs.readFile("data.json", "utf-8", (err, data) => {
					if (err) {
						console.log(err);
					}
					data = JSON.parse(data);
					let targetTodo = -1;
					for (let i = 0; i < data.length; i++) {
						if (data[i].id === parseInt(this.id)) {
							targetTodo = i;
							break;
						}
					}
					if (targetTodo !== -1) {
						resolve(data[targetTodo]);
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

	// Create todo
	createTodo() {
		return new Promise((resolve, reject) => {
			fs.readFile("data.json", "utf-8", (err, data) => {
				if (err) {
					console.log(err);
					reject();
				}
				data = JSON.parse(data);
				this.body = JSON.parse(this.body);
				let id = data.length;
				id++;
				let todo = {
					id: id,
					title: this.body.title,
					description: this.body.description,
					isCompleted: false,
				};
				data.push(todo);
				fs.writeFile("data.json", JSON.stringify(data), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
				});
				resolve(JSON.stringify(data));
			});
		});
	}

	// Delete todo
	deleteTodo() {
		return new Promise((resolve, reject) => {
			fs.readFile("data.json", "utf-8", (err, data) => {
				if (err) {
					console.log(err);
					reject();
				}
				data = JSON.parse(data);
				let targetTodo = -1;
				for (let i = 0; i < data.length; i++) {
					if (data[i].id === parseInt(this.id)) {
						targetTodo = i;
                        break;
					}
				}
				if (targetTodo !== -1) {
					data.splice(targetTodo, 1);
                    fs.writeFile("data.json", JSON.stringify(data), (err) => {
                        if (err) {
                            console.log(err);
                        }
                        // file written
                    })
					resolve(data);
				} else {
                    resolve();
                }
			});
		});
	}

    // Update status of todo, i.e., completed or not
    updateStatus() {
        return new Promise((resolve, reject) => {
            fs.readFile("data.json", "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                    reject();
                }
                data = JSON.parse(data);
                let targetTodo = -1;
                this.body = JSON.parse(this.body);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === parseInt(this.id)) {
                        targetTodo = i;
                        break;
                    }
                }
                if (targetTodo !== -1) {
                    data[targetTodo].isCompleted = this.body.isCompleted;
                    fs.writeFile("data.json", JSON.stringify(data), (err) => {
                        if (err) {
                            console.log(err);
                            reject();
                        }
                        // File written successfully
                    })
                    resolve(data[targetTodo]);
                } else {
                    resolve();
                }
            })
        })
    }

    // Update todo
    updateTodo() {
        return new Promise((resolve, reject) => {
            fs.readFile("data.json", "utf-8", (err, data) => {
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
                    fs.writeFile("data.json", JSON.stringify(data), (err) => {
                        if (err) {
                            console.log(err);
                            reject();
                        }
                        // File written successful
                    })
                    resolve(data[targetTodo]);
                } else {
                    resolve();
                }
            })
        })
    }
};

module.exports = {
	store,
};
