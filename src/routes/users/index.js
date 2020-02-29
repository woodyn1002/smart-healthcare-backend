import express from "express";
import {controller} from "./users.controller";
import healthData from "./health-data";
import meals from "./meals";
import fitness from "./fitness";
import validators from "../../middlewares/validators";

const router = express.Router();

router.get('/:username',
    validators.loggedIn, validators.canManageUser,
    controller.getUser);
router.delete('/:username',
    validators.loggedIn, validators.canManageUser,
    controller.deleteUser);
router.post('/:username/change-password',
    validators.loggedIn, validators.canManageUser,
    controller.changePassword);

router.use('/', healthData);
router.use('/', meals);
router.use('/', fitness);

export default router;