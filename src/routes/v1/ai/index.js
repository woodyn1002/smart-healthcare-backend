import express from "express";
import exerciseRecognizing from "./exercise-recognizing";

const router = express.Router();

router.use('/exercise-recognizing', exerciseRecognizing);

export default router;