import mongoose from "mongoose";

export const db = mongoose.connection;

db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

export function connect() {
    const config = {
        host: process.env.APP_MONGO_HOST,
        port: process.env.APP_MONGO_PORT,
        user: process.env.APP_MONGO_USER,
        password: process.env.APP_MONGO_PWD,
        database: process.env.APP_MONGO_DB
    };
    return mongoose.connect(
        `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
        {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
}