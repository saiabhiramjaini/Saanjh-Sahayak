import { Router } from "express";
import { signup, signin, getAllDoctors, getById } from "../controllers/doctor.controllers";
import { getByDoctorId } from "../controllers/oldagehome.controllers";

const doctorRouter = Router();

doctorRouter.post("/signup", signup as any);
doctorRouter.post("/signin", signin as any);
doctorRouter.get("/all", getAllDoctors as any);
doctorRouter.get("/:id", getById as any);
doctorRouter.get("/doctor/:doctorId", getByDoctorId as any);

export default doctorRouter;