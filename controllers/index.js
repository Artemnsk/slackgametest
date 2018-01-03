"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const actions_1 = require("./actions");
const authorize_1 = require("./authorize");
const commands_1 = require("./commands");
exports.router = express.Router();
exports.router.use(bodyParser.urlencoded());
exports.router.use("/", authorize_1.router);
exports.router.use("/", commands_1.router);
exports.router.use("/", actions_1.router);
//# sourceMappingURL=index.js.map