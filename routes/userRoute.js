const User = require("../users");
const user = new User.User();

function handleUserRoutes(req, res) {
	if (req.url === "/register" && req.method === "POST") {
		handleRegisterRoute(req, res);
	} else if (req.url === "/login" && req.method === "POST") {
		handleLoginRoute(req, res);
	} else {
		res.writeHead(502, { "Content-Type": "application/json" });
		res.end(JSON.stringify("Route not found"));
	}
}

// Function to handle register route
function handleRegisterRoute(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const validatedData = await validateRegisteration(
				body.userName,
				body.email,
				body.password,
				body.confirm_password
			);
			if (validatedData === "Validated") {
				const response = await user.register(
					body.userName,
					body.email,
					body.password
				);
				if (!response) {
					res.writeHead(502, { "Content-Type": "application/json" });
					res.end();
				} else if (response === "emailNotAcceptable") {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify(
							"Sorry this email already exists, please try another"
						)
					);
				} else {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(response);
				}
			} else {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(validatedData));
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to handle login route
function handleLoginRoute(req, res) {
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const email = body.email;
			const response = await user.login(email, body.password);
			if (!response) {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify("Please check your password and email"));
			} else {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(response);
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

module.exports = {
	handleUserRoutes,
};

// Function to validate register user
async function validateRegisteration(
	userName,
	email,
	password,
	confirm_password
) {
	return new Promise((resolve, reject) => {
		let count = 0;
		// Validate userName
		var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
		if (!format.test(userName) && userName.length <= 90) {
			count += 1;
		} else {
			resolve("User name cannot contains special characters");
			return;
		}
		// Validate email
		var emailRegex =
			/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			count += 1;
		} else {
			resolve("Sorry please validate your email");
			return;
		}
		// Validate password
		if (password === confirm_password && password.length <= 90) {
			if (format.test(password) && password.length >= 8) {
				count += 1;
			} else {
				resolve(
					"Please use some special characters and password must be 8 characters long."
				);
				return;
			}
		} else {
			resolve("Please confirm your password carefully");
		}
		if (count === 3) {
			resolve("Validated");
		} else {
			resolve("Not validated");
		}
	});
}

// function to test validate function
async function testValidator(userName, email, password, confirm_password) {
	try {
		const response = await validateRegisteration(
			userName,
			email,
			password,
			confirm_password
		);
		if (!response) {
			console.log("Email not validated");
		} else {
			console.log(response);
		}
	} catch (err) {
		console.log(err);
	}
}

//testValidator("aleem", "aleem@todo.com", "@@@@////", "@@@@////");
