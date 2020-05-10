import express from "express";
import auth from "./auth";
import users from "./users";
import foods from "./foods";
import exercises from "./exercises";
import ai from "./ai";

const router = express.Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/foods', foods);
router.use('/exercises', exercises);
router.use('/ai', ai);

export default router;