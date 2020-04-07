import mongoose from "mongoose";

export const db = mongoose.connection;

db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

export function connect() {
    return mongoose.connect(process.env.APP_MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    });
}