import express from "express";
import * as reportingController from "../controllers/reportingController.js";
// import { checkLoggedIn } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/bug-report",reportingController.bugReport);



export default router;
