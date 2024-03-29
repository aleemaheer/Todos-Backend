import fs from "fs";
import path from "path";

function handleStaticRoutes(req: any, res: any) {
	if (req.method === "GET") {
		console.log(req.url);
		renderStaticPages(req, res);
	}
}

// Function to render or serve html pages
function renderStaticPages(req: any, res: any) {
	const url = req.url;
	let urlParts = req.url.split(".");
	if (req.url === "/") {
		fs.readFile(
			path.resolve(__dirname, `../../public/index.html`),
			"utf-8",
			(err, data) => {
				if (err) {
					console.log(err);
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end();
				}
				res.writeHead(200, { "Content-Type": "text/html" });
				res.end(data);
			}
		);
	} else if (urlParts[1] === "js" || urlParts[1] === "html") {
		fs.readFile(
			path.resolve(__dirname, `../../public${url}`),
			"utf-8",
			(err, data) => {
				if (err) {
					console.log(err);
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end();
				}
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
				res.end();
			}
		);
	} else if (urlParts[1] === "css") {
		fs.readFile(
			path.resolve(__dirname, `../../public${url}`),
			"utf-8",
			(err, data) => {
				if (err) {
					console.log(err);
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end();
				}
				res.writeHead(200, { "Content-Type": "text/css" });
				res.write(data);
				res.end();
			}
		);
	} else if (urlParts[1] === "png") {
		fs.readFile(path.resolve(__dirname, `../../public${url}`),
		
		(err, data) => {
			if (err) {
				console.log(err);
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end("<h1>404 Not Found</h1>");
			}
			res.writeHead(200, { "Content-Type": "image/x-png"});
			console.log(data);
			res.write(data);
			res.end();
		})

	}
	else {
		urlParts = req.url.split("/id");
		fs.readFile(
			path.resolve(__dirname, `../../public${urlParts[0]}`),
			"utf-8",
			(err, data) => {
				if (err) {
					console.log(err);
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end();
				}
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
				res.end();
			}
		);
	}
}

module.exports = {
	handleStaticRoutes,
};

// Handle static routes
/*
function handleStaticRoutes(req: any, res: any) {
	if (req.url === "/" && req.method === "GET") {
		handleStartPage(req, res);
		console.log(req.url);
	} else if (req.url === "/main.js") {
		handleJavaScriptFile(req, res);
		console.log(req.url);
	} else if (req.url === "/style.css" && req.method === "GET") {
		handleCssFile(req, res);
		console.log(req.url);
	} else if (req.url === "/login.html" && req.method === "GET") {
		handleLoginPage(req, res);
		console.log(req.url);
	} else if (req.url === "/register.html" && req.method === "GET") {
		handleRegisterPage(req, res);
		console.log(req.url);
	} else if (
		req.url.match(/\/dashboard\/dashboard.html\/id=([0-9]+)/) &&
		req.method === "GET"
	) {
		handleDashboard(req, res);
		console.log(req.url);
	} else if (
		req.url === "/dashboard/dashboard.html/style.css" &&
		req.method === "GET"
	) {
		handleDashboardCss(req, res);
		console.log(req.url);
	} else if (req.url === "/dashboard/dashboard.html/main.js" && req.method === "GET") {
        handleDashboardJS(req, res);
		console.log(req.url);
    } else if (req.url.match(/\/dashboard\/changePassword.html\/id=([0-9]+)/) && req.method === "GET") {
        handleChangePassword(req, res);
    } else if (req.url === "/forgotPassword/forgetPassword.html" && req.method === "GET") {
        handleForgetPassword(req, res);
    } else if (req.url === "/forgotPassword/setPassword.html" && req.method === "GET") {
        handleSetPassword(req, res);
    } else {
		res.writeHead(503, { "Content-Type": "application/json" });
		res.end();
	}
}

// Function to send html page on startup
function handleStartPage(req: any, res: any) {
	fs.readFile(
		path.resolve(__dirname, "../../public/index.html"),
		"utf-8",
		(err, data) => {
			if (err) {
				console.log(err);
				res.write("404 Not found");
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
				//console.log(data);
			}
			res.end();
		}
	);
}

// Funtion to send JavaScript File
function handleJavaScriptFile(req: any, res: any) {
	fs.readFile(
		path.resolve(__dirname, "../../public/main.js"),
		"utf-8",
		(err, data) => {
			if (err) {
				console.log(err);
				res.write("404 Not found");
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
			}
			res.end();
		}
	);
}

// Functio to send CSS File
function handleCssFile(req: any, res: any) {
	fs.readFile(
		path.resolve(__dirname, "../../public/style.css"),
		"utf-8",
		(err, data) => {
			if (err) {
				console.log(err);
				res.write("404 Not Found");
			} else {
				res.writeHead(200, { "Content-Type": "text/css" });
				res.write(data);
			}
			res.end();
		}
	);
}

// Function to send Login page
function handleLoginPage(req: any, res: any) {
	fs.readFile(
		path.resolve(__dirname, "../../public/login.html"),
		"utf-8",
		(err, data) => {
			if (err) {
				console.log(err);
				res.write("404 Not Found");
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
			}
			res.end();
		}
	);
}

// Function to send Register page
function handleRegisterPage(req: any, res: any) {
	fs.readFile(
		path.resolve(__dirname, "../../public/register.html"),
		"utf-8",
		(err, data) => {
			if (err) {
				console.log(err);
				res.write("404 Not Found");
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
			}
			res.end();
		}
	);
}

// Function to handle logged in user dashboard
function handleDashboard(req: any, res: any) {
	fs.readFile(
		path.resolve(__dirname, "../../public/dashboard/dashboard.html"),
		"utf-8",
		(err, data) => {
			if (err) {
				console.log(err);
				res.write("404 Not Found");
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
			}
			res.end();
		}
	);
}

// Function to handle dashboard css
function handleDashboardCss(req: any, res: any) {
	fs.readFile(
		path.resolve(__dirname, "../../public/dashboard/style.css"),
		"utf-8",
		(err, data) => {
			if (err) {
				console.log(err);
				res.write("404 Not Found");
			} else {
				res.writeHead(200, { "Content-Type": "text/css" });
				res.write(data);
			}
			res.end();
		}
	);
}

// Function to handle JavaScript of dashboard
function handleDashboardJS(req: any, res: any) {
    fs.readFile(path.resolve(__dirname, "../../public/dashboard/main.js"),
    "utf-8",
    (err, data) => {
        if (err) {
            console.log(err);
            res.write("404 Not found");
        } else {
            res.writeHead(200, { "Content-Type": "text/html"});
            res.write(data);
        }
        res.end();
    })
}

// Function to handle change password
function handleChangePassword(req: any, res: any) {
    fs.readFile(path.resolve(__dirname, "../../public/dashboard/changePassword.html"),
    "utf-8",
    (err, data) => {
        if (err) {
            console.log(err);
            res.write("404 Not found");
        } else {
            res.writeHead(200, { "Content-Type": "text/html"});
            res.write(data);
        }
        res.end();
    })
}

// Function to handle forget password
function handleForgetPassword(req: any, res: any) {
    fs.readFile(path.resolve(__dirname, "../../public/forgotPassword/forgetPassword.html"),
    "utf-8",
    (err, data) => {
        if (err) {
            console.log(err);
            res.write("404 Not found");
        } else {
            res.writeHead(200, { "Content-Type": "text/html"});
            res.write(data);
        }
        res.end();
    })
}

// Function to handle SET password after forgotten
function handleSetPassword(req: any, res: any) {
    fs.readFile(path.resolve(__dirname, "../../public/forgotPassword/setPassword.html"),
    "utf-8",
    (err, data) => {
        if (err) {
            console.log(err);
            res.write("404 Not found");
        } else {
            res.writeHead(200, { "Content-Type": "text/html"});
            res.write(data);
        }
        res.end();
    })
}

module.exports = {
	handleStaticRoutes,
};
*/
