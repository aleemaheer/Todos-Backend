//const fs = require("fs");
import * as fs from 'fs';
//const nodemailer = require("nodemailer");
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
//const crypto = require("crypto");
//const dotenv = require("dotenv");
import * as dotenv from 'dotenv';
dotenv.config();
const path = require("path").join(__dirname, "/data");
const key = "abcdefgh";

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

	sendMail(reciever: string, token: string) {
		const transporter: any = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			auth: {
				user: "serviceemail06@gmail.com",
				pass: process.env.pass,
			},
		});
		transporter
			.sendMail({
				from: "Todos Backend", // sender address
				to: reciever, // list of receivers
				subject: "Password Verification Token", // Subject line
				text: `This is some text`, // plain text body
				html: `<h4>Token ${token}</h4>`, // html body
			})
			.then((info) => {
				console.log("Successfully sended email");
			})
			.catch(console.error);
	}

	init() {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
		if (!fs.existsSync(path + "/users.json")) {
			fs.writeFileSync(path + "/users.json", JSON.stringify([]));
		}
	}

	// Register User
	register(userName: string, email: string, password: string) {
		return new Promise(async (resolve, reject) => {
			const data = await this.usersData();
			let userId = data.length;
			//password = md5(password);
			const hashedPassword = crypto
				.createHmac("sha256", key)
				.update(password)
				.digest("hex");
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
				let newUser: { userId?: any, password?: any, userName?: any,  email?: any} = {
					userId,
					userName,
					email,
					password: hashedPassword,
				};
				data.push(newUser);
				fs.writeFile(path + "/users.json", JSON.stringify(data), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
					//newUser = JSON.parse(newUser.splice(3, 1));
					//const newUser2: { password?: string } = { password: password};
					//delete newUser['newUser2'];
					delete newUser.password;
					resolve(JSON.stringify(newUser));
				});
			} else {
				resolve("emailNotAcceptable");
			}
		});
	}

	// Login
	login(email: string, password: string) {
		return new Promise(async (resolve, reject) => {
			try {
				let userObject;
				const data = await this.usersData();
				const hashedPassword = crypto
					.createHmac("sha256", key)
					.update(password)
					.digest("hex");
				for (let i = 0; i < data.length; i++) {
					if (email === data[i].email && hashedPassword === data[i].password) {
						userObject = data[i];
						break;
					}
				}
				if (!userObject) {
					resolve(null);
				} else {
					delete userObject.password;
					if (userObject.token && userObject.timeStamp) {
						delete userObject.token;
						delete userObject.timeStamp;
					}
					resolve(JSON.stringify(userObject));
				}
			} catch (err) {
				console.log(err);
				reject();
			}
		});
	}

	// Function to change password
	changePassword(userId: string, oldPassword: string, newPassword: string, confirmPassword: string) {
		return new Promise(async (resolve, reject) => {
			try {
				let targetUserIndex = -1;
				const data = await this.usersData();
				const hashedOldPassword = crypto
					.createHmac("sha256", key)
					.update(oldPassword)
					.digest("hex");
				for (let i = 0; i < data.length; i++) {
					if (
						data[i].userId === parseInt(userId) &&
						hashedOldPassword === data[i].password
					) {
						targetUserIndex = i;
						break;
					}
				}
				// Call validate password function
				const passwordValidation = await this.validatePassword(
					newPassword,
					confirmPassword
				);
				if (!passwordValidation && targetUserIndex !== -1) {
					const hashedNewPassword = crypto
						.createHmac("sha256", key)
						.update(newPassword)
						.digest("hex");
					const updatedPassword = hashedNewPassword;
					data[targetUserIndex].password = updatedPassword;
					fs.writeFile(path + "/users.json", JSON.stringify(data), (err) => {
						if (err) {
							console.log(err);
						}
						// File written
					});
					resolve(null);
				} else {
					resolve("Check password and try again");
				}
			} catch (err) {
				console.log(err);
				reject();
			}
		});
	}

	// Function to validate password
	validatePassword(password: string, confirmPassword: string) {
		return new Promise(async (resolve, reject) => {
			var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
			if (password.length <= 90 && password === confirmPassword) {
				if (format.test(password) && password.length >= 8) {
					resolve(null);
				} else {
					resolve(
						"Please use some special characters and password must be 8 characters long."
					);
					return;
				}
			} else {
				resolve(
					"Please confirm password, it must be 8 characters long and must contain special character"
				);
			}
		});
	}

	// Forgot password
	forgotPassword(userName, email) {
		return new Promise(async (resolve, reject) => {
			let targetUserIndex = -1;
			const data = await this.usersData();
			for (let i = 0; i < data.length; i++) {
				if (data[i].userName === userName && data[i].email === email) {
					targetUserIndex = i;
				}
			}
			// If user exists then save token in user object and send this token in email
			const rand = () => {
				const rand = Math.random().toString(36).substr(2);
				return rand + rand;
			};
			if (targetUserIndex === -1) {
				resolve(null);
			} else {
				const timeStamp = Math.floor(new Date().getTime());
				const token = rand();
				data[targetUserIndex].token = token;
				data[targetUserIndex].timeStamp = timeStamp;
				this.sendMail(email, token);
				fs.writeFile(path + "/users.json", JSON.stringify(data), (err) => {
					if (err) {
						console.log(err);
						reject();
					}
					// file written
					resolve(null);
				});
			}
		});
	}

	// Function to set New password when forgetted
	setNewPassword(email, token, password, confirmPassword) {
		return new Promise(async (resolve, reject) => {
			let targetUserIndex = -1;
			let message;
			const time = Math.floor(new Date().getTime()); // This will return time in milliseconds
			let twoMinuteAgo = time - 120000;
			const validatedPasswordError = await this.validatePassword(
				password,
				confirmPassword
			);
			if (!validatedPasswordError) {
				const data = await this.usersData();
				// Check that email and token is correct
				for (let i = 0; i < data.length; i++) {
					if (data[i].email === email && data[i].token === token) {
						if (data[i].timeStamp >= twoMinuteAgo) {
							targetUserIndex = i;
							break;
						} else {
							message = "Token Expired";
						}
					}
				}
				if (targetUserIndex !== -1) {
					const hashedPassword = crypto
						.createHmac("sha256", key)
						.update(password)
						.digest("hex");
					data[targetUserIndex].password = hashedPassword;
					delete data[targetUserIndex].timeStamp;
					delete data[targetUserIndex].token;
					fs.writeFile(path + "/users.json", JSON.stringify(data), (err) => {
						if (err) {
							console.log(err);
						}
						// File written successfully
					});
					resolve(null);
				} else {
					if (message) {
						resolve(message);
					} else {
						resolve("Please write all fields correctly");
					}
				}
			} else {
				resolve(validatedPasswordError);
			}
		});
	}
}

module.exports = {
	User,
};
