import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import * as MongoDB from "./mongodb"
import indexRouter from "./routes";

export const app = express();

export function startApp() {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cors());

    return MongoDB.connect()
        .then(() => {
            app.set('mongodb', MongoDB.db);

            app.use('/', indexRouter);
        });
}