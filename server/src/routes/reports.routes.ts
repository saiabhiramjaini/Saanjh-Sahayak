import { Router } from "express";
import { create, getAll, getById, update, getByCaretakerId, getByDoctorId } from "../controllers/reports.controllers";

const reportsRouter = Router();

reportsRouter.post("/create", create as any);
reportsRouter.get("/", getAll as any);
reportsRouter.get("/:id", getById as any);
reportsRouter.put("/:id", update as any);
reportsRouter.get("/caretaker/:caretakerId", getByCaretakerId as any);
reportsRouter.get("/doctor/:doctorId", getByDoctorId as any);

export default reportsRouter;