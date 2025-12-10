import { Db, MongoClient } from "mongodb";
import "dotenv/config";

//Cache for database connection
const database: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (database) return database;

  // Connect to MongoDB or return error
  try {
    //Get the info from enviremment file
    const mongoURL = process.env.MongoDBLink;
    if (!mongoURL) {
      throw new Error(" Missing MongoDBLink in environment variables");
    }
    const client = new MongoClient(mongoURL);

    await client.connect();
    console.log("Connected to MongoDB");

    //Collecting the database
    const database = client.db("letThemCookDB");
    return database;
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    throw error;
  }
}
