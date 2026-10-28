// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     if (!process.env.MONGO_URI) {
//       throw new Error("MONGO_URI is missing from the .env file");
//     }

//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     throw error;
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing from Backend/.env");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    if (error.reason) {
      console.error("Server selection details:", error.reason);
    }

    throw error;
  }
};

export default connectDB;