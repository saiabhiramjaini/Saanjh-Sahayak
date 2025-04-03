import { Router } from "express";
import { signin, signup } from "../controllers/caretaker.controllers";

const caretakerRouter = Router();

caretakerRouter.post("/signup", signup as any);
caretakerRouter.post("/signin", signin as any);

export default caretakerRouter;