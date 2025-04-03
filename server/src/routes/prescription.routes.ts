import { Router } from "express";
import { create, getAll, getById, getByReportId } from "../controllers/prescription.controllers";

const prescriptionRouter = Router();

prescriptionRouter.post("/create", create as any);
prescriptionRouter.get("/", getAll as any);
prescriptionRouter.get("/:id", getById as any);
prescriptionRouter.get("/report/:reportId", getByReportId as any);

export default prescriptionRouter;