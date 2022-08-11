const User = require("../users");
const validater = require("./validateRegistration");
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
