"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
//const Todo = require("../todos");
var todos_1 = require("../todos");
var todo = new todos_1.Todo.Todos();
function handleTodosRoutes(req, res) {
    if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "GET") {
        var todoId = req.url.split("/")[2];
        handleGetTodo(req, res, todoId);
    }
    else if (req.url === "/todos" && req.method === "GET") {
        handleGetTodos(req, res);
    }
    else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "DELETE") {
        var todoId = req.url.split("/")[2];
        handleDeleteTodo(req, res, todoId);
    }
    else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PUT") {
        var todoId = req.url.split("/")[2];
        handleUpdateTodo(req, res, todoId);
    }
    else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PATCH") {
        var todoId = req.url.split("/")[2];
        handleUpdateTodoStatus(req, res, todoId);
    }
    else if (req.url === "/todos" && req.method === "POST") {
        handleCreateTodo(req, res);
    }
    else {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify("Route not found"));
    }
}
// Function to handle Get todo route
function handleGetTodo(req, res, todoId) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = parseInt(req.headers.user_id);
                    return [4 /*yield*/, todo.getTodo(userId, todoId)];
                case 1:
                    response = _a.sent();
                    if (!response) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify("Todo not found"));
                    }
                    else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(response);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    res.writeHead(503, { "Content-Type": "application/json" });
                    res.end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to handle Get todos route
function handleGetTodos(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, response, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = parseInt(req.headers.user_id);
                    return [4 /*yield*/, todo.getTodos(userId)];
                case 1:
                    response = _a.sent();
                    if (!response) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify("Todo not found"));
                    }
                    else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(response);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.log(err_2);
                    res.writeHead(503, { "Content-Type": "application/json" });
                    res.end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to handle delete todo
function handleDeleteTodo(req, res, todoId) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, response, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.headers.user_id;
                    return [4 /*yield*/, todo.deleteTodo(userId, todoId)];
                case 1:
                    response = _a.sent();
                    if (!response) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify("Todo not found"));
                    }
                    else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(response);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.log(err_3);
                    res.writeHead(503, { "Content-Type": "application/json" });
                    res.end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to handle update todo
function handleUpdateTodo(req, res, todoId) {
    var _this = this;
    try {
        var body_1 = "";
        req.on("data", function (chunk) {
            body_1 += chunk;
        });
        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
            var title, description, userId, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body_1 = JSON.parse(body_1);
                        title = body_1.title;
                        description = body_1.description;
                        userId = req.headers.user_id;
                        return [4 /*yield*/, todo.updateTodo(todoId, userId, title, description)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            res.writeHead(404, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("Todo not found"));
                        }
                        else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(response);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    }
    catch (err) {
        console.log(err);
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end();
    }
}
// Function to handle update todo status
function handleUpdateTodoStatus(req, res, todoId) {
    var _this = this;
    try {
        var body_2 = "";
        req.on("data", function (chunk) {
            body_2 += chunk;
        });
        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
            var userId, isCompleted, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body_2 = JSON.parse(body_2);
                        userId = req.headers.user_id;
                        isCompleted = body_2.isCompleted;
                        return [4 /*yield*/, todo.updateTodoStatus(todoId, userId, isCompleted)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            res.writeHead(404, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("Todo not found"));
                        }
                        else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify(response));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    }
    catch (err) {
        console.log(err);
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end();
    }
}
// Function to handle create todo
function handleCreateTodo(req, res) {
    var _this = this;
    try {
        var body_3 = "";
        req.on("data", function (chunk) {
            body_3 += chunk;
        });
        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
            var todoTitle, todoDescription, userId, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body_3 = JSON.parse(body_3);
                        todoTitle = body_3.title;
                        todoDescription = body_3.description;
                        userId = parseInt(req.headers.user_id);
                        return [4 /*yield*/, todo.createTodo(userId, todoTitle, todoDescription)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            res.writeHead(404, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("This user id does not exist, please register to create todos"));
                        }
                        else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify(response));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    }
    catch (err) {
        console.log(err);
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end();
    }
}
module.exports = {
    handleTodosRoutes: handleTodosRoutes
};
