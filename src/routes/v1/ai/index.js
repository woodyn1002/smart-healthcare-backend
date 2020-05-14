import express from "express";
import exerciseRecognizing from "./exercise-recognizing";
import foodRecognizing from "./food-recognizing";

const router = express.Router();

router.use('/exercise-recognizing', exerciseRecognizing);
router.use('/food-recognizing', foodRecognizing);

export default router;