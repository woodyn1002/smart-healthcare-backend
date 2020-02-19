import express from "express";
import {controller} from "./users.controller";

const router = express.Router();

router.get('/:username', controller.getUser);
router.delete('/:username', controller.deleteUser);
router.post('/:username/change-password', controller.changePassword);

export default router;