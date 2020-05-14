import express from "express";
import multer from "multer";
import * as FoodRecognizingService from "../../../services/food-recognizing";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 16 * 1024 * 1024 }
});

router.post('/',
    upload.single('imageFile'),
    (req, res) => {
        FoodRecognizingService.recognize(req.file)
            .then(foods => res.json(foods))
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    });

export default router;