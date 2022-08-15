const User = require("../users");
const validater = require("./validateRegistration");
const user = new User.User();

function handleUserRoutes(req, res) {
	if (req.url === "/register" && req.method === "POST") {
		handleRegisterRoute(req, res);
	} else if (req.url === "/login" && req.method === "POST") {
		handleLoginRoute(req, res);
	} else if (req.url.match(/\/account\/([0-9]+)/) && req.method === "PUT") {
		const userId = req.url.split("/")[2];
		handleChangePassword(req, res, userId);
	} else if (req.url === "/forgot" && req.method === "POST") {
		handleForgotPassword(req, res);
	} else if (req.url === "/forgot" && req.method === "PUT") {
		handleNewPasswordAfterForgetted(req, res);
	} else {
		res.writeHead(502, { "Content-Type": "application/json" });
		res.end(JSON.stringify("Route not found"));
	}
}

// Function to handle register route
function handleRegisterRoute(req, res) {
	try {
		let body: any = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const validatedData = await validater.validateRegisteration(
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
		let body: any = "";
		req.on("data", (chunk) => {
			console.log(chunk)
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

// Function to handle change password
function handleChangePassword(req, res, userId) {
	try {
		let body: any = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const response = await user.changePassword(
				userId,
				body.oldPassword,
				body.newPassword,
				body.confirmPassword
			);
			if (!response) {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify("Password updated"));
			} else {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(response));
			}
		});
	} catch (err) {
		res.writeHead(530, { "Content-Type": "application/json" });
		console.log(err);
		res.end();
	}
}

// Function handle forgot password
function handleForgotPassword(req, res) {
	try {
		let body: any = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const response = await user.forgotPassword(body.userName, body.email);
			if (response || !response) {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify("Check your email, verification code has been sended")
				);
			}
		});
	} catch (err) {
		console.log(err);
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to handle set new password
function handleNewPasswordAfterForgetted(req, res) {
	try {
		let body: any = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", async () => {
			body = JSON.parse(body);
			const response = await user.setNewPassword(
				body.email,
				body.token,
				body.password,
				body.confirmPassword
			);
			if (!response) {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify("Password Changed Successfully"));
			} else {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(response));
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
