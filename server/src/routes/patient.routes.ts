import { Router } from "express";
import { create, getAll, getById, getByOldAgeHomeId, getByCaretakerId, getByDoctorId  } from "../controllers/patient.controllers";

const patientRouter = Router();

patientRouter.post("/", create as any);
patientRouter.get("/", getAll as any);
patientRouter.get("/:id", getById as any);
patientRouter.get("/oldagehome/:oldAgeHomeId", getByOldAgeHomeId as any);
patientRouter.get("/caretaker/:caretakerId", getByCaretakerId as any);
patientRouter.get("/doctor/:doctorId", getByDoctorId as any);

export default patientRouter;