import express from "express";
import auth from "./auth";
import users from "./users";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

router.use('/auth', auth);

router.use('/users', authMiddleware);
router.use('/users', users);

export default router;