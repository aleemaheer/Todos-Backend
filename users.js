const fs = require("fs");
const md5 = require("md5");
const { resolve } = require("path");
const path = __dirname + "/data";

class User {
	constructor() {
		this.init();
	}

	async usersData() {
		try {
			const data = fs.readFileSync(path + "/users.json", "utf-8");
			return JSON.parse(data);
		} catch (err) {
			console.log(err);
		}
	}

	init() {
		if (!fs.existsSync(path)) {
			fs.mkdirSync("data");
		}
		if (!fs.existsSync(path + "/users.json")) {
			fs.writeFileSync(path + "/users.json", JSON.stringify([]));
		}
	}

	// Register User
	register(userName, email, password) {
		return new Promise(async (resolve, reject) => {
			const data = await this.usersData();
			let userId = data.length;
			password = md5(password);
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
				const newUser = {
					userId,
					userName,
					email,
					password,
				};
				data.push(newUser);
				fs.writeFile(path + "/users.json", JSON.stringify(data), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
					// newUser = JSON.parse(newUser.splice(3, 1));
					delete newUser.password;
					resolve(JSON.stringify(newUser));
				});
			} else {
				resolve("emailNotAcceptable");
			}
		});
	}

	// Login
	login(email, password) {
		return new Promise(async (resolve, reject) => {
			try {
				let userObject;
				const data = await this.usersData();
				for (let i = 0; i < data.length; i++) {
					if (email === data[i].email && md5(password) === data[i].password) {
						userObject = data[i];
						break;
					}
				}
				if (!userObject) {
					resolve();
				} else {
					delete userObject.password;
					resolve(JSON.stringify(userObject));
				}
			} catch (err) {
				console.log(err);
				reject();
			}
		});
	}

	// Function to change password
	changePassword(userId, oldPassword, newPassword) {
		return new Promise(async (resolve, reject) => {
			try {
				let targetUserIndex = -1;
				const data = await this.usersData();
				for (let i = 0; i < data.length; i++) {
					if (
						data[i].userId === parseInt(userId) &&
						md5(oldPassword) === data[i].password
					) {
						targetUserIndex = i;
						break;
					}
				}
				// Call validate password function
				const passwordValidation = await this.validatePassword(newPassword);
				if (!passwordValidation && targetUserIndex !== -1) {
					const updatedPassword = md5(newPassword);
					data[targetUserIndex].password = updatedPassword;
					fs.writeFile(path + "/users.json", JSON.stringify(data), (err) => {
						if (err) {
							console.log(err);
						}
						// File written
					});
					resolve();
				} else {
					resolve(passwordValidation);
				}
			} catch (err) {
				console.log(err);
				reject();
			}
		});
	}

	// Function to validate password
	validatePassword(password) {
		return new Promise(async (resolve, reject) => {
			var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
			if (password.length <= 90) {
				if (format.test(password) && password.length >= 8) {
					resolve();
				} else {
					resolve(
						"Please use some special characters and password must be 8 characters long."
					);
					return;
				}
			} else {
				resolve(
					"Please must be 8 characters long and must contain special character"
				);
			}
		});
	}
}

module.exports = {
	User,
};
