import { Router } from "express";
import { indentifyController } from "../controllers/identify.controller";

const identifyRouter = Router();

identifyRouter.post("/",indentifyController);

export {identifyRouter};