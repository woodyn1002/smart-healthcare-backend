import express from "express";
import {controller} from "./users.controller";
import healthData from "./health-data";
import meals from "./meals";
import fitness from "./fitness";

const router = express.Router();

router.get('/:username', controller.getUser);
router.delete('/:username', controller.deleteUser);
router.post('/:username/change-password', controller.changePassword);

router.use('/', healthData);
router.use('/', meals);
router.use('/', fitness);

export default router;