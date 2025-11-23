const mongoose = require("mongoose")

let isConnected = false;

function connectDb() {
    mongoose
        .connect(process.env.MONGODB_URL, {
            retryWrites: true,
            w: "majority",
            serverSelectionTimeoutMS: 5000,
        })
        .then(() => {
            isConnected = true;
            console.log("✅ Connected to MongoDB successfully!")
        })
        .catch((err) => {
            isConnected = false;
            console.error("⚠️ MongoDB connection failed:", err.message)
            console.log("⚠️ Using mock data instead")
        })
}

module.exports = connectDb
module.exports.isConnected = () => isConnected