#!/usr/bin/env node
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})


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
        readline.question("Enter your email: ", async (email) => {
            await login(email);
            (isLoggedIn) ? options() : authorizeUser();
            //readline.close();
        });
    } else if (loginOrRegister === "2") {
        readline.question("Enter username: ", (userName) => {
            readline.question("Enter email: ", async (email) => {
                await register(userName, email);
                (isLoggedIn) ? options() : authorizeUser();
                //readline.close();
            })
        })
    } else if (loginOrRegister === "0") {
        console.log("Bye Bye");
        readline.close();
    }
    else {
        console.log("Invalid Input");
        authorizeUser();
    }
})
}

readline.on("close", () => {
    console.log("Ended");
    process.exit(0);
})

// Function to login
async function login(email) {
    let response = await user.login(email);
    if (!response) {
        console.log("You have not registered yet, please register");
    } else {
        console.log("Logged In");
        isLoggedIn = true;
        response = JSON.parse(response);
        loggedInUserId = (response.userId);
        //readline.close();
    }
}

// Function to register
async function register(userName, email) {
    let response = await user.register(userName, email);
    if (response === "emailNotAcceptable") {
        console.log("Email Not acceptable");
    } else {
        console.log("Successfully Registered");
        isLoggedIn = true;
        response = JSON.parse(response);
        loggedInUserId = (response.userId);
        //readline.close();
    }
}

// This is for different options whether to create todos, update, vice versa
function options() {
    console.log("What you want to do:\n1- Create Todo\n2- Get Todos\n3- Get Todo\n4- Update Todo\n5- Update status of todo\n6- Delete Todo\n7- (0 to quit)");
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
        } else if (option === "0") {
            readline.close();
        } else {
            console.log("Invalid Input"); // have to sleep some milli seconds
            options();
        }
    })
}

// Function to handle create todo
function handleCreateTodo() {
   readline.question("Enter todo Title: ", (todoTitle) => {
    readline.question("Enter todo Description: ", (todoDescription) => {
        createTodo(loggedInUserId, todoTitle, todoDescription);
    })
    })
}

// Function to handle get todos
function handleGetTodos() {
    getTodos(loggedInUserId);
}

// Function to handle get todo
function handleGetTodo() {
    readline.question("Enter todo id: ", (todoId) => {
        getTodo(loggedInUserId, todoId);
    })
}

// Function to handle update todo
function handleUpdateTodo() {
    readline.question("Enter todo id: ", (todoId) => {
        readline.question("Enter todo title: ", (todoTitle) => {
            readline.question("Enter todo description: ", (todoDescription) => {
                updateTodo(todoId, todoTitle, todoDescription);
            })
        })
    })
}

// Function to handle update status of todo
function handleUpdateStatusOfTodo() {
    readline.question("Enter todo id: ", (todoId) => {
        readline.question("Enter todo status: ", (todoStatus) => {
            updateTodoStatus(todoId, todoStatus);
        })
    })
}

// Function to handle delete todo
function handleDeleteTodo() {
    readline.question("Enter todo id: ", (todoId) => {
        deleteTodo(todoId, loggedInUserId);
    })
}

// Function to create Todo
async function createTodo(loggedInUserId, todoTitle, todoDescription) {
    let response = await todo.createTodo(loggedInUserId, todoTitle, todoDescription);
    console.log(loggedInUserId, todoTitle, todoDescription);
    if (!response) {
        console.log("Sorry something bad happens!");
        options();
    } else {
        //response = JSON.stringify(response);
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
    let response = await todo.updateTodo(todoId, loggedInUserId, todoTitle, todoDescription);
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
    let response = await todo.updateTodoStatus(todoId, loggedInUserId, todoStatus);
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