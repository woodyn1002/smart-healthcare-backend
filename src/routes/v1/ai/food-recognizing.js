import express from "express";
import multer from "multer";
import Jimp from "jimp";
import * as FoodRecognizingService from "../../../services/food-recognizing";

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './dist/food-uploads');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now());
        }
    }),
    limits: {fileSize: 16 * 1024 * 1024}
});

router.post('/',
    upload.single('imageFile'),
    (req, res) => {
        Jimp.read(req.file.path)
            .then(image => {
                image.resize(300, Jimp.AUTO)
                    .getBufferAsync(Jimp.AUTO)
                    .then(buffer => FoodRecognizingService.recognize(buffer))
                    .then(foods => res.json(foods))
                    .catch(err => {
                        console.error(err);
                        res.status(500).end();
                    });
            });
    });

export default router;