"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caretaker_controllers_1 = require("../controllers/caretaker.controllers");
const caretakerRouter = (0, express_1.Router)();
caretakerRouter.post("/signup", caretaker_controllers_1.signup);
caretakerRouter.post("/signin", caretaker_controllers_1.signin);
exports.default = caretakerRouter;
