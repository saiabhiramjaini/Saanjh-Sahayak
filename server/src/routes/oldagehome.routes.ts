import { Router } from "express";
import { create, getById, getByCaretakerId, getByDoctorId } from "../controllers/oldagehome.controllers";

const oldagehomeRouter = Router();

oldagehomeRouter.post("/create", create as any);
oldagehomeRouter.get("/:id",  getById as any);
oldagehomeRouter.get("/caretaker/:caretakerId", getByCaretakerId as any);
oldagehomeRouter.get("/doctor/:doctorId", getByDoctorId as any);

export default oldagehomeRouter;