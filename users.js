const fs = require("fs");
const path = "/home/aleemaheer/todos_backend/data";

class User {
	constructor() {
		this.init();
	}

	async usersData() {
		try {
			const data = fs.readFileSync("/home/aleemaheer/todos_backend/data/users.json", "utf-8");
			return JSON.parse(data);
		}
		catch (err) {
			console.log(err);
		}
	}

	init() {
		if (!fs.existsSync(path)) {
			fs.mkdirSync("data");
		}
		if (!fs.existsSync("/home/aleemaheer/todos_backend/data/users.json")) {
			fs.writeFileSync("/home/aleemaheer/todos_backend/data/users.json", JSON.stringify([]));
		}
	}

	// Register User
	register(userName, email) {
		return new Promise(async (resolve, reject) => {
				const data = await this.usersData();
				let userId = data.length;
				userId++;
				let checkEmail = true;
				if (data.length !== 0) {
					// Check user's email that same emails cannot be created
					for (let i = 0; i < data.length; i++) {
						if (data[i].email === email) {
							checkEmail = false;
							break;
						}
					}
				}
				if (checkEmail) {
					let newUser = {
						userId: userId,
						userName: userName,
						email: email,
					};
					data.push(newUser);
					fs.writeFile("/home/aleemaheer/todos_backend/data/users.json", JSON.stringify(data), (err) => {
						if (err) {
							console.log(err);
							reject();
						}
						resolve(JSON.stringify(newUser));
					});
				} else {
					resolve("emailNotAcceptable");
				}
		});
	}

	// Login
	login(email) {
		return new Promise(async (resolve, reject) => {
			try {
				let userObject;
				const data = await this.usersData();
				for (let i = 0; i < data.length; i++) {
					if (email === data[i].email) {
						userObject = data[i];
						break;
					}
				}
				if (!userObject) {
					resolve();
				} else {
					resolve(JSON.stringify(userObject));
				}
			} catch (err) {
				console.log(err);
				reject();
			}
		});
	}
}

module.exports = {
	User,
};
