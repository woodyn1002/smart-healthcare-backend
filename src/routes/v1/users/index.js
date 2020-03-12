import express from "express";
import * as controllers from "./users.controller";
import healthData from "./health-data";
import meals from "./meals";
import fitness from "./fitness";
import validators from "../../../middlewares/validators";
import Joi from "joi";

const router = express.Router();

router.get('/',
    validators.loggedIn, validators.isAdmin,
    controllers.getUsers);

router.get('/:username',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required()
    }),
    controllers.getUser);

router.post('/:username/change-password',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required()
    }),
    validators.body({
        password: Joi.string().trim().min(6).max(20).required()
    }),
    controllers.changePassword);

router.delete('/:username',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required()
    }),
    controllers.deleteUser);

router.use('/', healthData);
router.use('/', meals);
router.use('/', fitness);

export default router;