const fs = require("fs");
const path = "./data";

class User {
	#usersData
	constructor() {
		this.init();
		fs.readFile("./data/users.json", "utf-8", (err, data) => {
			if (err) {
				console.log(err);
			}
			this.#usersData = JSON.parse(data);
		})
	}

	init() {
		if (!fs.existsSync(path)) {
			fs.mkdirSync("data");
		}
		if (!fs.existsSync("./data/users.json")) {
			fs.writeFileSync("./data/users.json", JSON.stringify([]));
		}
	}

	// Register User
	register(userName, email) {
		return new Promise((resolve, reject) => {
				let userId = this.#usersData.length;
				userId++;
				let checkEmail = true;
				if (this.#usersData.length !== 0) {
					// Check user's email that same emails cannot be created
					for (let i = 0; i < this.#usersData.length; i++) {
						if (this.#usersData[i].email === email) {
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
					this.#usersData.push(newUser);
					fs.writeFile("./data/users.json", JSON.stringify(this.#usersData), (err) => {
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
		return new Promise((resolve, reject) => {
			try {
				let userObject;
				for (let i = 0; i < this.#usersData.length; i++) {
					if (email === this.#usersData[i].email) {
						userObject = this.#usersData[i];
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
