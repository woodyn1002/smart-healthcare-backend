import express from "express";
import auth from "./auth";
import users from "./users";
import foods from "./foods";
import exercises from "./exercises";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

router.use('/auth', auth);

router.use('/users', authMiddleware);
router.use('/users', users);

router.use('/foods', authMiddleware);
router.use('/foods', foods);

router.use('/exercises', authMiddleware);
router.use('/exercises', exercises);

export default router;