// Function to validate register user
async function validateRegisteration(
	userName: string,
	email: string,
	password: string,
	confirm_password: string
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
async function testValidator(userName: string, email: string, password: string, confirm_password: string) {
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

module.exports = {
	validateRegisteration,
};
