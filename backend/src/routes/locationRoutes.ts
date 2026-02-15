import { Router } from "express";
import { getUniqueLocations } from "../controllers/locationController.js";

const router = Router();

router.get("/", getUniqueLocations);

export default router;
