import { Router } from "express";
import { getRequestHandling, indentifyController } from "../controllers/identify.controller";

const identifyRouter = Router();

identifyRouter.get("/",getRequestHandling);
identifyRouter.post("/",indentifyController);

export {identifyRouter};