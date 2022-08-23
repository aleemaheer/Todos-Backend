import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();
import path from "path";
//const path = require("path").join(__dirname, "/data");
//const pool = require("./db");
import {pool} from "./db"
const key = "abcdefgh";

class User {
	#pass: any
	constructor() { // .././.env
		fs.readFile(path.resolve(__dirname, ".././.env"), "utf-8", (err, data) => {
			if (err) {
				console.log(err);
			}
			//console.log(data)
			this.#pass = data.split("=")[1];
		})
	}

	sendMail(reciever: string, token: string) {
		const transporter: any = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			auth: {
				user: "serviceemail06@gmail.com",
				pass: this.#pass
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
			.then((info: string) => {
				console.log("Successfully sended email");
			})
			.catch(console.error);
	}

	// Register User
	register(userName: string, email: string, password: string) {
		return new Promise(async (resolve, reject) => {
			const data = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
			const hashedPassword = crypto
				.createHmac("sha256", key)
				.update(password)
				.digest("hex");
			let checkEmail = true;
			if (data.rows[0]) {
				checkEmail = false;
			}
			if (checkEmail) {
				await pool.query("INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)", [userName, email, hashedPassword]);
				const newUser = await pool.query("SELECT user_id, user_name, email FROM users WHERE email = $1", [email]);
					resolve(JSON.stringify(newUser.rows));
			} else {
				resolve("emailNotAcceptable");
			}
		});
	}

	// Login
	login(email: string, password: string) {
		return new Promise(async (resolve, reject) => {
			try {
				let existUser = true;
				const hashedPassword = crypto
					.createHmac("sha256", key)
					.update(password)
					.digest("hex");
				const user = await pool.query("SELECT user_id FROM users WHERE email = $1 AND password = $2", [email, hashedPassword]);
				const checkPassword = await pool.query("SELECT user_id FROM users WHERE password = $1", [hashedPassword]);
				if (!user.rows[0]) {
					resolve(null);
				} else {
					const userObject = await pool.query("SELECT user_id, user_name, email FROM users WHERE email = $1 AND password = $2", [email, hashedPassword]);
					resolve(JSON.stringify(userObject.rows));
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
				let userExist = true;
				const user = await pool.query("SELECT user_id FROM users WHERE user_id = $1", [userId]);
				if (!user.rows[0]) {
					userExist = false;
				}
				if (userExist) {
					const password = await pool.query("SELECT password FROM users WHERE user_id = $1", [userId])
					const hashedOldPassword = crypto
					.createHmac("sha256", key)
					.update(oldPassword)
					.digest("hex");
					// Call validate password function
					if (password.rows[0].password === hashedOldPassword) {
						const passwordValidation = await this.validatePassword(
							newPassword,
							confirmPassword
						);
						if (!passwordValidation) {
							const newUpdatedHashedPassword = crypto
							.createHmac("sha256", key)
							.update(newPassword)
							.digest("hex")
							await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [newUpdatedHashedPassword, userId]);
							resolve(null);
						} else {
							resolve(passwordValidation);
						}
					} else {
						resolve("Check password and try again");
					}
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
	forgotPassword(userName: string, email: string) {
		return new Promise(async (resolve, reject) => {
			let existUser = true;
			const user = await pool.query("SELECT user_id FROM users WHERE user_name = $1 AND email = $2", [userName, email]);
			if (!user.rows[0]) {
				existUser = false;
			}
			if (existUser) {
				// If user exists then save token in user object and send this token in email
				const rand = () => {
					const rand = Math.random().toString(36).substr(2);
					return rand + rand;
				};
				const timeStamp = Math.floor(new Date().getTime()); // Get time in milliseconds
				const token = rand();
				this.sendMail(email, token);
				await pool.query("UPDATE users SET token = $1, timestamp = $2 WHERE user_id = $3", [token, timeStamp, user.rows[0].user_id]);
				resolve(null);
			} else {
				resolve(null);
			}
		});
	}

	// Function to set New password when forgetted
	setNewPassword(email: string, token: string, password: string, confirmPassword: string) {
		return new Promise(async (resolve, reject) => {
			const time = Math.floor(new Date().getTime()); // This will return time in milliseconds
			let twoMinuteAgo = time - 120000;
			const validatedPasswordError = await this.validatePassword(
				password,
				confirmPassword
			);
			const timeAtTokenCreated = await pool.query("SELECT timestamp FROM users WHERE email = $1 AND token = $2", [email, token]);
			if (timeAtTokenCreated.rows[0]) {
				if (!validatedPasswordError) {
					const hashedPassword = crypto
						.createHmac("sha256", key)
						.update(password)
						.digest("hex")
					if (timeAtTokenCreated.rows[0].timestamp >= twoMinuteAgo) {
						await pool.query("UPDATE users SET password = $1 WHERE email = $2 AND token = $3", [hashedPassword, email, token]);
						await pool.query("UPDATE users SET timestamp = $1, token = $2 WHERE password = $3", [null, null, hashedPassword]);
						resolve("Password Resetted Successfully");
					} else {
						resolve("Token Expired");
						await pool.query("UPDATE users SET timestamp = $1, token = $2 WHERE email = $3", [null, null, email]);
					}
				} else {
					resolve(validatedPasswordError);
				}
			} else {
				resolve("Please write all fields correctly");
			}
		});
	}
}

module.exports = {
	User,
};

const hello = User;
let hi = new hello();