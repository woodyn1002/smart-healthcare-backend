import mongoose from "mongoose";
import config from "./config/mongodb-config.json";

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

mongoose.connect(
    'mongodb://' + config.user + ':' + config.user + '@' + config.host + ':' + config.port + '/' + config.database,
    {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

export default db;