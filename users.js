const fs = require("fs");
const { resolve } = require("path");
const path = "./data";

class Users {
	constructor(body) {
		this.body = body;
	}

	// Register User
	register() {
		return new Promise((resolve, reject) => {
			this.body = JSON.parse(this.body);
            if (!fs.existsSync(path)) fs.mkdirSync("data");
			if (!fs.existsSync("./data/users.json")) {
				fs.writeFileSync("./data/users.json", JSON.stringify([]));
			}
			fs.readFile("./data/users.json", "utf-8", (err, data) => {
				if (err) {
					console.log(err);
					reject();
				}
				data = JSON.parse(data);
				let userId = data.length;
				userId++;
				let checkEmail = true;
				if (data.length !== 0) {
					// Check user's email that same emails cannot be created
					for (let i = 0; i < data.length; i++) {
						if (data[i].email === this.body.email) {
							checkEmail = false;
							break;
						}
					}
				}
				if (checkEmail) {
					let newUser = {
						userId: userId,
						userName: this.body.userName,
						email: this.body.email,
					};
					data.push(newUser);
					fs.writeFile("./data/users.json", JSON.stringify(data), (err) => {
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
		});
	}

    // Login
    login() {
        return new Promise((resolve, reject) => {
        try {
            this.body = JSON.parse(this.body);
            let userObject;
            if (!fs.existsSync(path) || !fs.existsSync("./data/users.json")) {
                resolve();
            } else {
                fs.readFile("./data/users.json", "utf-8", (err, data) => {
                    if (err) {
                        console.log(err);
                        reject();
                    }
                    data = JSON.parse(data);
                    for (let i = 0; i < data.length; i++) {
                        if (this.body.email === data[i].email) {
                            userObject = data[i];
                            break;
                        }
                    }
                    resolve(JSON.stringify(userObject));
                })
            }
        }
        catch (err) {
            console.log(err);
            reject();
        }
    })
    }
}

module.exports = {
	Users,
};
