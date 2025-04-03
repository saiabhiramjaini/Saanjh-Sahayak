"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oldagehome_controllers_1 = require("../controllers/oldagehome.controllers");
const oldagehomeRouter = (0, express_1.Router)();
oldagehomeRouter.post("/create", oldagehome_controllers_1.create);
oldagehomeRouter.get("/:id", oldagehome_controllers_1.getById);
oldagehomeRouter.get("/caretaker/:caretakerId", oldagehome_controllers_1.getByCaretakerId);
oldagehomeRouter.get("/doctor/:doctorId", oldagehome_controllers_1.getByDoctorId);
exports.default = oldagehomeRouter;
