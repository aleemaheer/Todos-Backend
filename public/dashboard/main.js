const userId = window.location.href.split("=")[1];
const todoTitle = document.querySelector("#todoTitle");
const todoDescription = document.querySelector("#todoDescription");
const createTodoBtn = document.querySelector("#createTodo");
const submitCreateTodoBtn = document.querySelector("#submitCreateTodo");
const cancelBtn = document.querySelector("#cancel");
const todoTitleLabel = document.querySelector("#todoTitleLabel");
const todoDescriptionLabel = document.querySelector("#todoDescriptionLabel");
const todoClass = document.querySelector(".todo");
const tbody = document.querySelector("#tbody");
const changePassword = document.querySelector("#changePassword");
const backBtn = document.querySelector("#back");
const logOutBtn = document.querySelector("#logOut");
const h2 = document.querySelector("h3");

// Get the user name from local storage and display
const userName = localStorage.getItem("userName");
h2.innerHTML = `Welcome ${userName}`;

// Function to cancel from creating todo
cancelBtn.addEventListener("click", (e) => {
	e.preventDefault();
	submitCreateTodoBtn.style.display = "none";
	todoTitle.style.display = "none";
	todoDescription.style.display = "none";
	todoTitleLabel.style.display = "none";
	todoDescriptionLabel.style.display = "none";
	cancelBtn.style.display = "none";
});

// Function to logout
logOutBtn.addEventListener("click", (e) => {
	e.preventDefault();
	localStorage.clear();
	window.location = "/";
});

// Function to go back
backBtn.addEventListener("click", (e) => {
	e.preventDefault();
	window.location = "/login.html";
});

async function readTodos() {
	try {
		submitCreateTodoBtn.style.display = "none";
		todoTitle.style.display = "none";
		todoDescription.style.display = "none";
		todoTitleLabel.style.display = "none";
		todoDescriptionLabel.style.display = "none";
		cancelBtn.style.display = "none";

		const tr = document.querySelector("#tr");

		const result = await fetch("http://localhost:3000/todos", {
			method: "GET",
			headers: {
				user_id: userId,
			},
		});
		const todos = await result.json();
		todos.forEach((t) => {
			// Create elements
			const editButton = document.createElement("button");
			const deleteButton = document.createElement("button");
			const editStatusButton = document.createElement("button");
			const tr = document.createElement("tr");
			const title = document.createElement("th");
			const description = document.createElement("td");
			const status = document.createElement("td");
			const tdOfEdit = document.createElement("td");
			const tdOfDelete = document.createElement("td");
			const tdOfStatus = document.createElement("td");
			//tr.innerHTML = `<th>${t.title}</th><td>${t.description}</td><td>${t.is_completed}</td><td><button>Edit ✍️</button></td><td><button>Delete ❌</button></td><td><button>Edit Status ✅</button></td>`;
			editButton.innerText = "Edit ✍️";
			deleteButton.innerText = "Delete ❌";
			editStatusButton.innerText = "Edit Status ✅";

			// Append title, description, status
			title.innerText = t.title;
			description.innerText = t.description;
			if (t.is_completed === true) {
				status.innerText = "Completed";
			} else {
				status.innerText = "Incompleted";
			}
			//status.innerText = status;

			editButton.id = t.todo_id;
			editButton.title = t.title;
			editButton.description = t.description;
			deleteButton.id = t.todo_id;
			editStatusButton.id = t.todo_id;
			editStatusButton.status = t.is_completed;

			// Append buttons in td
			tdOfEdit.appendChild(editButton);
			tdOfDelete.appendChild(deleteButton);
			tdOfStatus.appendChild(editStatusButton);
			// Append title, description, status in th, td, td
			tr.appendChild(title);
			tr.appendChild(description);
			tr.appendChild(status);
			// Append buttons in html
			tr.appendChild(tdOfEdit);
			tr.appendChild(tdOfDelete);
			tr.appendChild(tdOfStatus);
			// Append tr in body
			tbody.appendChild(tr);

			editButton.addEventListener("click", (e) => {
				window.location = `/dashboard/edit.html/id=${e.target.id}+${userId}`;
			});
			editStatusButton.addEventListener("click", async (e) => {
				let status;
				if (e.target.status === true) {
					status = false;
				} else {
					status = true;
				}
				const json_request = {};
				json_request.isCompleted = status;
				const result = await fetch(
					`http://localhost:3000/todos/${e.target.id}`,
					{
						method: "PATCH",
						headers: {
							"content-type": "application/json",
							user_id: userId,
						},
						body: JSON.stringify(json_request),
					}
				);
				const response = await result.json();
				window.location = window.location.href;
			});
			// Delete todo with onclick
			deleteButton.addEventListener("click", async (e) => {
				const result = await fetch(
					`http://localhost:3000/todos/${e.target.id})`,
					{
						method: "DELETE",
						headers: {
							"content-type": "application/json",
							user_id: userId,
						},
					}
				);
				const success = await result.json();
				readTodos();
				window.location = window.location.href;
			});
		});
	} catch (e) {
		console.log(e);
	}
}

// Create Todo
createTodoBtn.addEventListener("click", () => {
	createTodo();
});

// Function to create new Todo
async function createTodo() {
	todoTitle.style.display = "block";
	todoDescription.style.display = "block";
	submitCreateTodoBtn.style.display = "block";
	todoTitleLabel.style.display = "block";
	todoDescriptionLabel.style.display = "block";
	cancelBtn.style.display = "block";

	submitCreateTodoBtn.addEventListener("click", async () => {
		const json_request = {};
		json_request.title = todoTitle.value;
		json_request.description = todoDescription.value;
		const result = await fetch("http://localhost:3000/todos", {
			method: "POST",
			headers: {
				user_id: userId,
				"content-type": "application/json",
			},
			body: JSON.stringify(json_request),
		});
		todoTitle.value = "";
		todoDescription.value = "";
		const response = await result.json();
		if (typeof response === "string") {
			alert("Empty Todo can't be created");
			console.log(response);
		} else {
			console.log(result);
		}
		//readTodos();
		window.location = window.location.href;
	});
}

// Function to handle change password
changePassword.addEventListener("click", () => {
	window.location = `/dashboard/changePassword.html/id=${userId}`;
});

readTodos();
