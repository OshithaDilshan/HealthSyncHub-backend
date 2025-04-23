import mongoose from "mongoose";

export const connectDB = async () => {
    try {
      const connectionString = process.env.MONGO_URI; 
      if(!connectionString){
        throw new Error("Please Enter Connection String")
      }
      await mongoose.connect(connectionString);
      console.log('Connected to MongoDB Atlas');

      
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  };
  