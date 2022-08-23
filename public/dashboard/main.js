const userId = window.location.href.split("=")[1];
const todoTitle = document.querySelector("#todoTitle");
const todoDescription = document.querySelector("#todoDescription");
const todoStatus = document.querySelector("#todoStatus");
const createTodoBtn = document.querySelector("#createTodo");
const submitCreateTodoBtn = document.querySelector("#submitCreateTodo");
//const updateTodoBtn = document.querySelector("#updateTodo");
//const deleteTodoBtn = document.querySelector("#deleteTodo");
const changePassword = document.querySelector("#changePassword");
let updateTodoBtnIsActive = false;
let deleteTodoBtnIsActive = false;

// alert("helo");
// submitCreateTodoBtn.style.display = "none";
// todoTitle.style.display = "none";
// todoDescription.style.display = "none";
// todoStatus.style.display = "none";

async function readTodos() {
	try {
		submitCreateTodoBtn.style.display = "none";
		todoTitle.style.display = "none";
		todoDescription.style.display = "none";
		todoStatus.style.display = "none";

		const ol_todo = document.querySelector("#ol");
		while (ol_todo.firstChild) ol_todo.removeChild(ol_todo.firstChild);

		const result = await fetch("http://localhost:3000/todos", {
			method: "GET",
			headers: {
				user_id: userId,
			},
		});
		const todos = await result.json();
		todos.forEach((t) => {
			const li = document.createElement("li");
			const button = document.createElement("button");
			li.innerHTML = `<h3>Title:</h3> ${t.title} <h4>Description:</h4> ${t.description} <h4>isCompleted:</h4> ${t.is_completed}`;
			li.id = t.todo_id;
			// Delete todo with onclick
			li.addEventListener("click", async (e) => {
				const json_request = {};
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
			});
			ol_todo.appendChild(li);
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
