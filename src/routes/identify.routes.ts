import { Router } from "express";
import { indentifyController } from "../controllers/identify.controller";

const identifyRouter = Router();

identifyRouter.get("/",indentifyController);

export {identifyRouter};