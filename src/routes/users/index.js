import express from "express";
import {controller} from "./users.controller";
import healthData from "./health-data";

const router = express.Router();

router.get('/:username', controller.getUser);
router.delete('/:username', controller.deleteUser);
router.post('/:username/change-password', controller.changePassword);

router.use('/:username/health-data', healthData);

export default router;