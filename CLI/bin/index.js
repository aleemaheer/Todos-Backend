#!/usr/bin/env node
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})

const User = require("../../users");
const user = new User.User();

console.clear();
console.log("Welcome to Todos Backend CLI");
console.log("What you want to do: \n1- Login\n2- Register");

readline.question("Press 1 to login and 2 to Register: ", (loginOrRegister) => {
    if (loginOrRegister === "1") {
        readline.question("Enter your email: ", (email) => {
            login(email);
            //readline.close();
        });
    } else if (loginOrRegister === "2") {
        readline.question("Enter username: ", (userName) => {
            readline.question("Enter email: ", (email) => {
                register(userName, email);
                //readline.close();
            })
        })
    } else if (loginOrRegister === "0") {
        console.log("Bye Bye");
        readline.close();
    }
    else {
        console.log("Invalid Input");
    }
})

readline.on("close", () => {
    console.log("Ended");
    process.exit(0);
})

// Function to login
async function login(email) {
    const response = await user.login(email);
    if (!response) {
        console.log("You have not registered yet, please register");
    } else {
        console.log("Logged In");
        readline.close();
    }
}

// Function to register
function register(userName, email) {
    console.log(`UserName: ${userName}\nEmail: ${email}`);
}