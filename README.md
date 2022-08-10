#### Todos Backend
* In this repository, I am making a RESTFUL API in vanilla nodejs, not using any external modules.

##### Server usage:
* First clone this repository:
```bash
    git clone "git@github.com:aleemaheer/Todos-Backend.git"
```
* Then go into the todos backend project:
```bash
    cd "Todos-Backend"
```
* Here you can run the server by typing command:
```bash
    node index.js
```
make sure that you have installed node.js, you can check by command:
```bash
    node --version
```
* The endpoints are given in the api.rest file, also if you have Rest client extension installed, you can send requests to server very easily, or you can send requests what other tool you preferred to use like curl, postman etc.

##### CLI Usage: 
* When you are in todos backend folder, there is another directory of CLI, go get there:
```bash
    cd CLI
```
* Here you can install the todos command to use the CLI:
```bash
    npm install -g todos
```
* Later you can run this command from anywhere from your terminal, like:
```bash
    todos
```

###### Note: In order to use CLI and server data be same, you have to run the command from Todos-Backend repository, both commands have to be run in the root directory:
```bash
    Todos-Backend$ node index.js
```
and
```bash
    Todos-Backend$ todos
```