const ul = document.querySelector("ul");
const createTodo = document.querySelector("#createTodo");

const todos = [
    id: 1,
    title: "Wash Dishes",
    description: "Wash dishes before the guests came",
    isCompleted: false
}

for (let i = 0; i < 3; i++) {
    const li = document.createElement('li');
    li.textContent = i;
    ul.appendChild(li);
}

createTodo.addEventListener("click", () => {
    const todo = prompt("Enter a todo");
    readTodos();
})

function readTodos() {

}