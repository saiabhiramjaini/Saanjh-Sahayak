import { Router } from "express";
import { signup, signin, getAllDoctors, getById } from "../controllers/doctor.controllers";

const doctorRouter = Router();

doctorRouter.post("/signup", signup as any);
doctorRouter.post("/signin", signin as any);
doctorRouter.get("/all", getAllDoctors as any);
doctorRouter.get("/:id", getById as any);

export default doctorRouter;