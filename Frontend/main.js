const createTodo = document.querySelector("#createTodo");
const updateTodo = document.querySelector("#updateTodo");
const updateStatus = document.querySelector("#updateStatus");
createTodo.addEventListener("click", async (e) => {
	const json_request = {};
	json_request.title = prompt("Enter your todo item");
    json_request.description = prompt("Enter description");
    if (json_request.title === '' || json_request.description === '') {
        alert("Empty todo can't be created");
    } else {
	const result = await fetch("http://localhost:3000/todos", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(json_request),
	});
	const success = await result.json();
	readTodos();
	alert("Created");
}
});

// Update todo
updateTodo.addEventListener("click", async (e) => {
    const json_request = {};
    const id = prompt("Enter todo id, as mentioned before todo");
    json_request.title = prompt("Enter todo title");
    json_request.description = prompt("Enter todo description");
    if (id === '' || json_request.title === '' || json_request.description === '') {
        alert("Empty todo can't be updated");
    } else {
    const result = await fetch("http://localhost:3000/todos/" + id, {
        method: "PUT",
        headers: { "content-type": "application/json"},
        body: JSON.stringify(json_request)
    });
    const success = await result.json();
    readTodos();
}
})

// Update status of todo
updateStatus.addEventListener("click", async () => {
    let json_request = {};
    const id = prompt("Enter todo id, as mentioned before todo");
    let status = prompt("Enter status, this must be true of false");
    let updatedStatus;
    if (id === '' || status === '') {
        alert("Empty todo's status can't be updated")
    } else {
    (status === "true") ? updatedStatus = true : updatedStatus = false;
    json_request = {
        isCompleted: updatedStatus
    };
    const result = await fetch("http://localhost:3000/todos/updateStatus/" + id, {
        method: "PUT",
        headers: { "content-type": "application/json"},
        body: JSON.stringify(json_request)
    });
    const success = await result.json();
    readTodos();
}
})

readTodos();
async function readTodos() {
	try {
		const ol_todo = document.querySelector("#ol");
		while (ol_todo.firstChild) ol_todo.removeChild(ol_todo.firstChild);

		const result = await fetch("http://localhost:3000/todos", {
			method: "GET",
		});
		const todos = await result.json();
		todos.forEach((t) => {
			const li = document.createElement("li");
			li.innerHTML = `<h4>Title:</h4> ${t.title} <h4>Description:</h4> ${t.description} <h4>isCompleted:</h4> ${t.isCompleted}`;
			li.id = t.id;
			// Delete todo with onclick
			li.addEventListener("click", async (e) => {
				const json_request = {};
				json_request.id = e.target.id;
                console.log(e.target.id);
				const result = await fetch("http://localhost:3000/todos/" + e.target.id, { method: "DELETE" });
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
