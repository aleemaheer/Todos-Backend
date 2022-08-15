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
//const fs = require("fs");
var fs = require("fs");
//const nodemailer = require("nodemailer");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
//const crypto = require("crypto");
//const dotenv = require("dotenv");
var dotenv = require("dotenv");
dotenv.config();
var path = require("path").join(__dirname, "/data");
var key = "abcdefgh";
var User = /** @class */ (function () {
    function User() {
        this.init();
    }
    User.prototype.usersData = function () {
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
    User.prototype.sendMail = function (reciever, token) {
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "serviceemail06@gmail.com",
                pass: process.env.pass
            }
        });
        transporter
            .sendMail({
            from: "Todos Backend",
            to: reciever,
            subject: "Password Verification Token",
            text: "This is some text",
            html: "<h4>Token ".concat(token, "</h4>")
        })
            .then(function (info) {
            console.log("Successfully sended email");
        })["catch"](console.error);
    };
    User.prototype.init = function () {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        if (!fs.existsSync(path + "/users.json")) {
            fs.writeFileSync(path + "/users.json", JSON.stringify([]));
        }
    };
    // Register User
    User.prototype.register = function (userName, email, password) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var data, userId, hashedPassword, checkEmail, i, newUser_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersData()];
                    case 1:
                        data = _a.sent();
                        userId = data.length;
                        hashedPassword = crypto
                            .createHmac("sha256", key)
                            .update(password)
                            .digest("hex");
                        userId++;
                        checkEmail = true;
                        if (data.length !== 0) {
                            // Check user's email that same emails cannot be created
                            for (i = 0; i < data.length; i++) {
                                if (data[i].email === email) {
                                    checkEmail = false;
                                    break;
                                }
                            }
                        }
                        if (checkEmail) {
                            newUser_1 = {
                                userId: userId,
                                userName: userName,
                                email: email,
                                password: hashedPassword
                            };
                            data.push(newUser_1);
                            fs.writeFile(path + "/users.json", JSON.stringify(data), function (err) {
                                if (err) {
                                    console.log(err);
                                    reject();
                                }
                                //newUser = JSON.parse(newUser.splice(3, 1));
                                //const newUser2: { password?: string } = { password: password};
                                //delete newUser['newUser2'];
                                delete newUser_1.password;
                                resolve(JSON.stringify(newUser_1));
                            });
                        }
                        else {
                            resolve("emailNotAcceptable");
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // Login
    User.prototype.login = function (email, password) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var userObject, data, hashedPassword, i, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userObject = void 0;
                        return [4 /*yield*/, this.usersData()];
                    case 1:
                        data = _a.sent();
                        hashedPassword = crypto
                            .createHmac("sha256", key)
                            .update(password)
                            .digest("hex");
                        for (i = 0; i < data.length; i++) {
                            if (email === data[i].email && hashedPassword === data[i].password) {
                                userObject = data[i];
                                break;
                            }
                        }
                        if (!userObject) {
                            resolve(null);
                        }
                        else {
                            delete userObject.password;
                            if (userObject.token && userObject.timeStamp) {
                                delete userObject.token;
                                delete userObject.timeStamp;
                            }
                            resolve(JSON.stringify(userObject));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        reject();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    // Function to change password
    User.prototype.changePassword = function (userId, oldPassword, newPassword, confirmPassword) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var targetUserIndex, data, hashedOldPassword, i, passwordValidation, hashedNewPassword, updatedPassword, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        targetUserIndex = -1;
                        return [4 /*yield*/, this.usersData()];
                    case 1:
                        data = _a.sent();
                        hashedOldPassword = crypto
                            .createHmac("sha256", key)
                            .update(oldPassword)
                            .digest("hex");
                        for (i = 0; i < data.length; i++) {
                            if (data[i].userId === parseInt(userId) &&
                                hashedOldPassword === data[i].password) {
                                targetUserIndex = i;
                                break;
                            }
                        }
                        return [4 /*yield*/, this.validatePassword(newPassword, confirmPassword)];
                    case 2:
                        passwordValidation = _a.sent();
                        if (!passwordValidation && targetUserIndex !== -1) {
                            hashedNewPassword = crypto
                                .createHmac("sha256", key)
                                .update(newPassword)
                                .digest("hex");
                            updatedPassword = hashedNewPassword;
                            data[targetUserIndex].password = updatedPassword;
                            fs.writeFile(path + "/users.json", JSON.stringify(data), function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                // File written
                            });
                            resolve(null);
                        }
                        else {
                            resolve("Check password and try again");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.log(err_2);
                        reject();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    // Function to validate password
    User.prototype.validatePassword = function (password, confirmPassword) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var format;
            return __generator(this, function (_a) {
                format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (password.length <= 90 && password === confirmPassword) {
                    if (format.test(password) && password.length >= 8) {
                        resolve(null);
                    }
                    else {
                        resolve("Please use some special characters and password must be 8 characters long.");
                        return [2 /*return*/];
                    }
                }
                else {
                    resolve("Please confirm password, it must be 8 characters long and must contain special character");
                }
                return [2 /*return*/];
            });
        }); });
    };
    // Forgot password
    User.prototype.forgotPassword = function (userName, email) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var targetUserIndex, data, i, rand, timeStamp, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetUserIndex = -1;
                        return [4 /*yield*/, this.usersData()];
                    case 1:
                        data = _a.sent();
                        for (i = 0; i < data.length; i++) {
                            if (data[i].userName === userName && data[i].email === email) {
                                targetUserIndex = i;
                            }
                        }
                        rand = function () {
                            var rand = Math.random().toString(36).substr(2);
                            return rand + rand;
                        };
                        if (targetUserIndex === -1) {
                            resolve(null);
                        }
                        else {
                            timeStamp = Math.floor(new Date().getTime());
                            token = rand();
                            data[targetUserIndex].token = token;
                            data[targetUserIndex].timeStamp = timeStamp;
                            this.sendMail(email, token);
                            fs.writeFile(path + "/users.json", JSON.stringify(data), function (err) {
                                if (err) {
                                    console.log(err);
                                    reject();
                                }
                                // file written
                                resolve(null);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // Function to set New password when forgetted
    User.prototype.setNewPassword = function (email, token, password, confirmPassword) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var targetUserIndex, message, time, twoMinuteAgo, validatedPasswordError, data, i, hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetUserIndex = -1;
                        time = Math.floor(new Date().getTime());
                        twoMinuteAgo = time - 120000;
                        return [4 /*yield*/, this.validatePassword(password, confirmPassword)];
                    case 1:
                        validatedPasswordError = _a.sent();
                        if (!!validatedPasswordError) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.usersData()];
                    case 2:
                        data = _a.sent();
                        // Check that email and token is correct
                        for (i = 0; i < data.length; i++) {
                            if (data[i].email === email && data[i].token === token) {
                                if (data[i].timeStamp >= twoMinuteAgo) {
                                    targetUserIndex = i;
                                    break;
                                }
                                else {
                                    message = "Token Expired";
                                }
                            }
                        }
                        if (targetUserIndex !== -1) {
                            hashedPassword = crypto
                                .createHmac("sha256", key)
                                .update(password)
                                .digest("hex");
                            data[targetUserIndex].password = hashedPassword;
                            delete data[targetUserIndex].timeStamp;
                            delete data[targetUserIndex].token;
                            fs.writeFile(path + "/users.json", JSON.stringify(data), function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                // File written successfully
                            });
                            resolve(null);
                        }
                        else {
                            if (message) {
                                resolve(message);
                            }
                            else {
                                resolve("Please write all fields correctly");
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        resolve(validatedPasswordError);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return User;
}());
module.exports = {
    User: User
};
