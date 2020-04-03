require('dotenv-flow').config();

import mongoose from "mongoose";

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

const config = {
    host: process.env.APP_MONGO_HOST,
    port: process.env.APP_MONGO_PORT,
    user: process.env.APP_MONGO_USER,
    password: process.env.APP_MONGO_PWD,
    database: process.env.APP_MONGO_DB
};

mongoose.connect(
    `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
    {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

export default db;