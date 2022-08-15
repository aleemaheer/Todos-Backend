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
exports.Todo = void 0;
var fs = require("fs");
var path = require("path").join(__dirname, "data");
// const path = __dirname + "/data";
var Todo;
(function (Todo) {
    var Todos = /** @class */ (function () {
        function Todos() {
            this.init();
        }
        Todos.prototype.init = function () {
            try {
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
                if (!fs.existsSync(path + "/todos.json")) {
                    fs.writeFile(path + "/todos.json", JSON.stringify([]), function (err) {
                        if (err) {
                            console.log(err);
                        }
                        // File written successfully
                    });
                    fs.writeFile(path + "/users.json", JSON.stringify([]), function (err) {
                        if (err) {
                            console.log(err);
                        }
                        // File written successfully
                    });
                }
            }
            catch (err) {
                console.log(err);
            }
        };
        // Function to read todos
        Todos.prototype.readTodos = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fs.readFileSync(path + "/todos.json", "utf-8")];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, JSON.parse(data)];
                        case 2:
                            err_1 = _a.sent();
                            console.log(err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Function to read users data
        Todos.prototype.readUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    try {
                        data = fs.readFileSync(path + "/users.json", "utf-8");
                        return [2 /*return*/, JSON.parse(data)];
                    }
                    catch (err) {
                        console.log(err);
                    }
                    return [2 /*return*/];
                });
            });
        };
        // Get Todo
        Todos.prototype.getTodo = function (userId, todoId) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var targetTodo, todosData, i, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            targetTodo = void 0;
                            return [4 /*yield*/, this.readTodos()];
                        case 1:
                            todosData = _a.sent();
                            for (i = 0; i < todosData.length; i++) {
                                if (todosData[i].userId === userId &&
                                    parseInt(todosData[i].todoId) === parseInt(todoId)) {
                                    targetTodo = todosData[i];
                                }
                            }
                            /// ------ Another method to search -------/////////
                            // const targetTodo = data.find((item) => item.todoId === parseInt(this.id));
                            resolve(JSON.stringify(targetTodo));
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _a.sent();
                            console.log(err_2);
                            reject();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        // Delete todo
        Todos.prototype.deleteTodo = function (userId, todoId) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var targetTodo, filteredTodos, todosData, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            targetTodo = -1;
                            filteredTodos = [];
                            return [4 /*yield*/, this.readTodos()];
                        case 1:
                            todosData = _a.sent();
                            for (i = 0; i < todosData.length; i++) {
                                if (todosData[i].userId === parseInt(userId) &&
                                    todosData[i].todoId === parseInt(todoId)) {
                                    targetTodo = i;
                                    break;
                                }
                            }
                            if (targetTodo === -1) {
                                resolve(null);
                            }
                            else {
                                todosData.splice(targetTodo, 1);
                                fs.writeFile(path + "/todos.json", JSON.stringify(todosData), function (err) {
                                    if (err) {
                                        console.log(err);
                                        reject();
                                    }
                                    // file writed
                                    fs.readFile(path + "/todos.json", "utf-8", function (err, data) {
                                        if (err) {
                                            console.log(err);
                                            reject();
                                        }
                                        data = JSON.parse(data);
                                        for (var i = 0; i < data.length; i++) {
                                            if (data[i].userId === parseInt(userId)) {
                                                filteredTodos.push(data[i]);
                                            }
                                        }
                                        resolve(JSON.stringify(filteredTodos));
                                    });
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        // Update status of todo, i.e., completed or not
        Todos.prototype.updateTodoStatus = function (todoId, userId, status) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var todosData, targetTodo, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.readTodos()];
                        case 1:
                            todosData = _a.sent();
                            for (i = 0; i < todosData.length; i++) {
                                if (todosData[i].todoId === parseInt(todoId) &&
                                    todosData[i].userId === parseInt(userId)) {
                                    targetTodo = i;
                                    break;
                                }
                            }
                            if (targetTodo || targetTodo === 0) {
                                todosData[targetTodo].isCompleted = status;
                                fs.writeFile(path + "/todos.json", JSON.stringify(todosData), function (err) {
                                    if (err) {
                                        console.log(err);
                                        reject();
                                    }
                                    // File written successfully
                                });
                                resolve(todosData[targetTodo]);
                            }
                            else {
                                resolve(null);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        // Update todo
        Todos.prototype.updateTodo = function (todoId, userId, title, description) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var targetTodo, todosData, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.readTodos()];
                        case 1:
                            todosData = _a.sent();
                            for (i = 0; i < todosData.length; i++) {
                                if (todosData[i].userId === parseInt(userId) &&
                                    todosData[i].todoId === parseInt(todoId)) {
                                    targetTodo = i;
                                    break;
                                }
                            }
                            // Update todo
                            if (!targetTodo && targetTodo !== 0) {
                                resolve(null);
                            }
                            else {
                                todosData[targetTodo].title = title;
                                todosData[targetTodo].description = description;
                                fs.writeFile(path + "/todos.json", JSON.stringify(todosData), function (err) {
                                    if (err) {
                                        console.log(err);
                                        reject();
                                    }
                                    // File written
                                });
                                resolve(JSON.stringify(todosData[targetTodo]));
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        // Create a new todo testing
        Todos.prototype.createTodo = function (userId, todoTitle, todoDescription) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var todosData, usersData, existUser, i, id, todo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.readTodos()];
                        case 1:
                            todosData = _a.sent();
                            return [4 /*yield*/, this.readUsers()];
                        case 2:
                            usersData = _a.sent();
                            existUser = false;
                            for (i = 0; i < usersData.length; i++) {
                                if (usersData[i].userId === userId) {
                                    existUser = true;
                                    break;
                                }
                            }
                            if (existUser) {
                                id = todosData.length;
                                id++;
                                todo = {
                                    todoId: id,
                                    userId: userId,
                                    title: todoTitle,
                                    description: todoDescription,
                                    isCompleted: false
                                };
                                todosData.push(todo);
                                fs.writeFile(path + "/todos.json", JSON.stringify(todosData), function (err) {
                                    if (err) {
                                        console.log(err);
                                        reject();
                                    }
                                });
                                resolve(todo);
                            }
                            else {
                                resolve(null);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        // Get Todos with user id
        Todos.prototype.getTodos = function (userId) {
            var _this = this;
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var todosData, usersData, filteredTodos, i, existUser, i_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.readTodos()];
                        case 1:
                            todosData = _a.sent();
                            return [4 /*yield*/, this.readUsers()];
                        case 2:
                            usersData = _a.sent();
                            filteredTodos = [];
                            i = 1;
                            for (i = 0; i < todosData.length; i++) {
                                if (todosData[i].userId === parseInt(userId)) {
                                    filteredTodos.push(todosData[i]);
                                }
                            }
                            existUser = false;
                            for (i_1 = 0; i_1 < usersData.length; i_1++) {
                                if (usersData[i_1].userId === parseInt(userId)) {
                                    existUser = true;
                                    break;
                                }
                            }
                            if (!existUser) {
                                resolve(JSON.stringify("This user does not exist"));
                            }
                            else {
                                if (!filteredTodos[0]) {
                                    resolve(JSON.stringify([]));
                                }
                                else {
                                    resolve(JSON.stringify(filteredTodos));
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        return Todos;
    }());
    Todo.Todos = Todos;
})(Todo = exports.Todo || (exports.Todo = {}));
// module.exports = {
// 	Todo,
// };
