const userId = window.location.href.split("=")[1];
const todoTitle = document.querySelector("#todoTitle");
const todoDescription = document.querySelector("#todoDescription");
const todoStatus = document.querySelector("#todoStatus");
const createTodoBtn = document.querySelector("#createTodo");
const submitCreateTodoBtn = document.querySelector("#submitCreateTodo");
const todoClass = document.querySelector(".todo");
const tbody = document.querySelector("#tbody");
const changePassword = document.querySelector("#changePassword");

async function readTodos() {
	try {
		submitCreateTodoBtn.style.display = "none";
		todoTitle.style.display = "none";
		todoDescription.style.display = "none";
		todoStatus.style.display = "none";

		const ol_todo = document.querySelector("#ol");
		while (ol_todo.firstChild) ol_todo.removeChild(ol_todo.firstChild);

		const tr = document.querySelector("#tr");
		while (tbody.node) tr.removeChild(tbody.node);

		const result = await fetch("http://localhost:3000/todos", {
			method: "GET",
			headers: {
				user_id: userId,
			},
		});
		const todos = await result.json();
		todos.forEach((t) => {
			const tdOfEdit = document.querySelector("#editBtn");
			const tdOfDelete = document.querySelector("#deleteBtn");
			const tdOfStatus = document.querySelector("#editStatusBtn");
			const tdOfTitle = document.querySelector("#title");
			const tdOfDescription = document.querySelector("#description");
			const wTdOfStatus = document.querySelector("#status");
			const editButton = document.createElement("button");
			const deleteButton = document.createElement("button");
			const editStatusButton = document.createElement("button");
			const tr = document.createElement("tr");
			//tr.innerHTML = `<th>${t.title}</th><td>${t.description}</td><td>${t.is_completed}</td><td><button>Edit ✍️</button></td><td><button>Delete ❌</button></td><td><button>Edit Status ✅</button></td>`;
			editButton.innerText = "Edit ✍️";
			deleteButton.innerText = "Delete ❌";
			editStatusButton.innerText = "Edit Status ✅";

			editButton.id = t.todo_id;
			deleteButton.id = t.todo_id;
			editStatusButton.status = t.is_completed;
			editStatusButton.id = t.todo_id;

			// Append in table
			tdOfEdit.appendChild(editButton);
			tdOfDelete.appendChild(deleteButton);
			tdOfStatus.appendChild(editStatusButton);
			tdOfTitle.innerText = t.title;
			tdOfDescription.innerText = t.description;
			wTdOfStatus.innerText = t.is_completed;

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
				console.log(json_request);
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
				console.log(response);
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
				alert("Deleted");
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
			alert("Todo Created");
			console.log(result);
		}
		readTodos();
	});
}

// Function to handle change password
changePassword.addEventListener("click", () => {
	window.location = `/dashboard/changePassword.html/id=${userId}`;
});

readTodos();
