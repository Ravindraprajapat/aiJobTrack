import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createApplication, deleteApplication, getApplications, updateApplication, parseApplicationDetails, parseApplicationStream, getSuggestions } from "../controllers/applicationController.js";

const applicationRouter = express.Router()

applicationRouter.post("/suggestions", isAuth, getSuggestions);
applicationRouter.post("/parse-stream", isAuth, parseApplicationStream);
applicationRouter.post("/parse", isAuth, parseApplicationDetails);
applicationRouter.post("/createApplication", isAuth, createApplication);
applicationRouter.get("/getApplication", isAuth, getApplications);
applicationRouter.patch("/:id", isAuth, updateApplication);
applicationRouter.delete("/:id", isAuth, deleteApplication);

export default applicationRouter;