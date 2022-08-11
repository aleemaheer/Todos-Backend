#!/usr/bin/env node
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

const validator = require("../../routes/validateRegistration");
const User = require("../../users");
const user = new User.User();
const Todo = require("../../todos");
const todo = new Todo.Todo();

console.clear();
console.log("Welcome to Todos Backend CLI");
console.log("What you want to do: \n1- Login\n2- Register\n3- (0 to quit)");

// Question to ask login or register
let isLoggedIn = false;
let loggedInUserId;

authorizeUser();
function authorizeUser() {
	readline.question("Press appropriate keys: ", (loginOrRegister) => {
		if (loginOrRegister === "1") {
			readline.question("Enter your email: ", (email) => {
				readline.question("Enter your password: ", async (password) => {
					await login(email, password);
					isLoggedIn ? options() : authorizeUser();
				});
				// readline.close();
			});
		} else if (loginOrRegister === "2") {
			readline.question("Enter username: ", (userName) => {
				readline.question("Enter email: ", (email) => {
					readline.question("Enter your password: ", (password) => {
						readline.question(
							"Confirm your password: ",
							async (confirmPassword) => {
								const validatedData = await validator.validateRegisteration(
									userName,
									email,
									password,
									confirmPassword
								);
								if (validatedData === "Validated") {
									await register(userName, email, password);
									isLoggedIn ? options() : authorizeUser();
								} else {
									console.log(validatedData);
									authorizeUser();
								}
							}
						);
					});
					// readline.close();
				});
			});
		} else if (loginOrRegister === "0") {
			console.log("Bye Bye");
			readline.close();
		} else {
			console.log("Invalid Input");
			authorizeUser();
		}
	});
}

readline.on("close", () => {
	console.log("Ended");
	process.exit(0);
});

// Function to login
async function login(email, password) {
	let response = await user.login(email, password);
	if (!response) {
		console.log("You have not registered yet, please register");
		authorizeUser();
	} else {
		console.log("Logged In");
		isLoggedIn = true;
		response = JSON.parse(response);
		loggedInUserId = response.userId;
		// readline.close();
	}
}

// Function to register
async function register(userName, email, password) {
	let response = await user.register(userName, email, password);
	if (response === "emailNotAcceptable") {
		console.log("Email Not acceptable");
		authorizeUser();
	} else {
		console.log("Successfully Registered");
		isLoggedIn = true;
		response = JSON.parse(response);
		loggedInUserId = response.userId;
		// readline.close();
	}
}

// This is for different options whether to create todos, update, vice versa
function options() {
	console.log(
		"What you want to do:\n1- Create Todo\n2- Get Todos\n3- Get Todo\n4- Update Todo\n5- Update status of todo\n6- Delete Todo\n7- Change password\n8- (0 to quit)"
	);
	readline.question("Press appropriate keys: ", (option) => {
		if (option === "1") {
			handleCreateTodo();
		} else if (option === "2") {
			handleGetTodos();
		} else if (option === "3") {
			handleGetTodo();
		} else if (option === "4") {
			handleUpdateTodo();
		} else if (option === "5") {
			handleUpdateStatusOfTodo();
		} else if (option === "6") {
			handleDeleteTodo();
		} else if (option === "7") {
			handleChangePassword();
		} else if (option === "0") {
			readline.close();
		} else {
			console.log("Invalid Input"); // have to sleep some milli seconds
			options();
		}
	});
}

// Function to handle create todo
function handleCreateTodo() {
	readline.question("Enter todo Title: ", (todoTitle) => {
		readline.question("Enter todo Description: ", (todoDescription) => {
			createTodo(loggedInUserId, todoTitle, todoDescription);
		});
	});
}

// Function to handle get todos
function handleGetTodos() {
	getTodos(loggedInUserId);
}

// Function to handle get todo
function handleGetTodo() {
	readline.question("Enter todo id: ", (todoId) => {
		getTodo(loggedInUserId, todoId);
	});
}

// Function to handle update todo
function handleUpdateTodo() {
	readline.question("Enter todo id: ", (todoId) => {
		readline.question("Enter todo title: ", (todoTitle) => {
			readline.question("Enter todo description: ", (todoDescription) => {
				updateTodo(todoId, todoTitle, todoDescription);
			});
		});
	});
}

// Function to handle update status of todo
function handleUpdateStatusOfTodo() {
	readline.question("Enter todo id: ", (todoId) => {
		readline.question("Enter todo status: ", (todoStatus) => {
			updateTodoStatus(todoId, todoStatus);
		});
	});
}

// Function to handle delete todo
function handleDeleteTodo() {
	readline.question("Enter todo id: ", (todoId) => {
		deleteTodo(todoId, loggedInUserId);
	});
}

// Function to handle change password
function handleChangePassword() {
	readline.question("Enter your old password: ", (oldPassword) => {
		readline.question("Enter your new password: ", (newPassword) => {
			readline.question("Confirm your new password: ", (confirmPassword) => {
				changePassword(oldPassword, newPassword, confirmPassword);
			});
		});
	});
}

// Function to create Todo
async function createTodo(loggedInUserId, todoTitle, todoDescription) {
	const response = await todo.createTodo(
		loggedInUserId,
		todoTitle,
		todoDescription
	);
	console.log(loggedInUserId, todoTitle, todoDescription);
	if (!response) {
		console.log("Sorry something bad happens!");
		options();
	} else {
		// response = JSON.stringify(response);
		console.log("Todo Created");
		console.table(response);
		options();
	}
}

// Function to get todos
async function getTodos(loggedInUserId) {
	let response = await todo.getTodos(loggedInUserId);
	if (!response) {
		console.log("Sorry something bad happens");
		options();
	} else {
		console.log("Your todos\n");
		response = JSON.parse(response);
		console.table(response);
		options();
	}
}

// Function to get todo
async function getTodo(loggedInUserId, todoId) {
	let response = await todo.getTodo(loggedInUserId, todoId);
	if (!response) {
		console.log("Todo not found");
		options();
	} else {
		response = JSON.parse(response);
		console.table(response);
		options();
	}
}

// Function to update todo
async function updateTodo(todoId, todoTitle, todoDescription) {
	let response = await todo.updateTodo(
		todoId,
		loggedInUserId,
		todoTitle,
		todoDescription
	);
	if (!response) {
		console.log("Sorry Todo not found with this id");
		options();
	} else {
		response = JSON.parse(response);
		console.table(response);
		options();
	}
}

// Function to update status of todo
async function updateTodoStatus(todoId, todoStatus) {
	todoStatus = JSON.parse(todoStatus);
	const response = await todo.updateTodoStatus(
		todoId,
		loggedInUserId,
		todoStatus
	);
	if (!response) {
		console.log("Todo not found with this id");
		options();
	} else {
		console.log("Status updated");
		console.table(response);
		options();
	}
}

// Function to delete todo
async function deleteTodo(todoId) {
	let response = await todo.deleteTodo(loggedInUserId, todoId);
	if (!response) {
		console.log("Todo not found with this id");
		options();
	} else {
		response = JSON.parse(response);
		console.log("Successfully todo Deleted");
		options();
	}
}

async function changePassword(oldPassword, newPassword, confirmPassword) {
	//oldPassword = JSON.parse(oldPassword);
	//newPassword = JSON.parse(newPassword);
	let response = await user.changePassword(
		loggedInUserId,
		oldPassword,
		newPassword,
		confirmPassword
	);
	if (!response) {
		console.log("Password Updated");
		options();
	} else {
		console.log(response);
		options();
	}
}
