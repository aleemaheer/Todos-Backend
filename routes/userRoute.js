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
var User = require("../users");
var validater = require("./validateRegistration");
var user = new User.User();
function handleUserRoutes(req, res) {
    if (req.url === "/register" && req.method === "POST") {
        handleRegisterRoute(req, res);
    }
    else if (req.url === "/login" && req.method === "POST") {
        handleLoginRoute(req, res);
    }
    else if (req.url.match(/\/account\/([0-9]+)/) && req.method === "PUT") {
        var userId = parseInt(req.url.split("/")[2]);
        handleChangePassword(req, res, userId);
    }
    else if (req.url === "/forgot" && req.method === "POST") {
        handleForgotPassword(req, res);
    }
    else if (req.url === "/forgot" && req.method === "PUT") {
        handleNewPasswordAfterForgetted(req, res);
    }
    else {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify("Route not found"));
    }
}
// Function to handle register route
function handleRegisterRoute(req, res) {
    var _this = this;
    try {
        var body_1 = "";
        req.on("data", function (chunk) {
            body_1 += chunk;
        });
        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
            var validatedData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body_1 = JSON.parse(body_1);
                        return [4 /*yield*/, validater.validateRegisteration(body_1.userName, body_1.email, body_1.password, body_1.confirm_password)];
                    case 1:
                        validatedData = _a.sent();
                        if (!(validatedData === "Validated")) return [3 /*break*/, 3];
                        return [4 /*yield*/, user.register(body_1.userName, body_1.email, body_1.password)];
                    case 2:
                        response = _a.sent();
                        if (!response) {
                            res.writeHead(502, { "Content-Type": "application/json" });
                            res.end();
                        }
                        else if (response === "emailNotAcceptable") {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("Sorry this email already exists, please try another"));
                        }
                        else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(response);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(validatedData));
                        _a.label = 4;
                    case 4: return [2 /*return*/];
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
// Function to handle login route
function handleLoginRoute(req, res) {
    var _this = this;
    try {
        var body_2 = "";
        req.on("data", function (chunk) {
            body_2 += chunk;
        });
        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
            var email, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body_2 = JSON.parse(body_2);
                        email = body_2.email;
                        return [4 /*yield*/, user.login(email, body_2.password)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("Please check your password and email"));
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
// Function to handle change password
function handleChangePassword(req, res, userId) {
    var _this = this;
    try {
        var body_3 = "";
        req.on("data", function (chunk) {
            body_3 += chunk;
        });
        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body_3 = JSON.parse(body_3);
                        return [4 /*yield*/, user.changePassword(userId, body_3.oldPassword, body_3.newPassword, body_3.confirmPassword)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("Password updated"));
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
        res.writeHead(530, { "Content-Type": "application/json" });
        console.log(err);
        res.end();
    }
}
// Function handle forgot password
function handleForgotPassword(req, res) {
    var _this = this;
    try {
        var body_4 = "";
        req.on("data", function (chunk) {
            body_4 += chunk;
        });
        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body_4 = JSON.parse(body_4);
                        return [4 /*yield*/, user.forgotPassword(body_4.userName, body_4.email)];
                    case 1:
                        response = _a.sent();
                        if (response || !response) {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("Check your email, verification code has been sended"));
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
// Function to handle set new password
function handleNewPasswordAfterForgetted(req, res) {
    var _this = this;
    try {
        var body_5 = "";
        req.on("data", function (chunk) {
            body_5 += chunk;
        });
        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body_5 = JSON.parse(body_5);
                        return [4 /*yield*/, user.setNewPassword(body_5.email, body_5.token, body_5.password, body_5.confirmPassword)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("Password Changed Successfully"));
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
    handleUserRoutes: handleUserRoutes
};
