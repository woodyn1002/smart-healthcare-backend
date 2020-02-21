import express from "express";
import {controller} from "./users.controller";
import healthData from "./health-data";
import meals from "./meals";

const router = express.Router();

router.get('/:username', controller.getUser);
router.delete('/:username', controller.deleteUser);
router.post('/:username/change-password', controller.changePassword);

router.use('/:username/health-data', healthData);
router.use('/:username/meals', meals);

export default router;