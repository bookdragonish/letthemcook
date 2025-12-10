import { connectDB } from "./config/db";
import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { redis } from "./cache/redisClient";
import { Collection } from "mongodb";
import { Meal } from "./types/Meals";
import { CommentSection } from "./types/Comments";


async function startServer() {

  // Connect to MongoDB accessing the collections
  const db = await connectDB();
  const mealsCollection: Collection<Meal> = db.collection("meals");
  const commentCollection: Collection<CommentSection> = db.collection("comments");

  // Create index in order to increase preformance
  await mealsCollection.createIndex({ strCategory: 1 });

  // Pass collections to resolvers
  const root = resolvers(mealsCollection, commentCollection, redis);

  //Run the server for the API
  const app = express();

  //Regardless of the fetch the cors information need to correspond to this
  app.use(
    cors({
      origin: "*", // This is technically meant for testing purposes, and is considered bad for security reasons
      methods: ["GET", "POST", "OPTIONS"], //Available fetch methods
    })
  );

  app.options("/", cors());

  // The path is defined here
  app.get("/mealsDB", async (req, res, next) => {
    try {
      // If there's a ?query=... in the URL, skip and let GraphQL handle it
      if (req.query.query) return next();

      const allMeals = await root.meals();
      res.json({ data: { meals: allMeals } });
    } catch (err) {
      next(err);
    }
  });

  // Handler that uses the url and gets the parameters. Also console logs if port 4000 is used for api
  app.all("/mealsDB", createHandler({ schema, rootValue: root }));

  app.listen(4000, () => {
    console.log("GraphQL API running at http://localhost:4000/mealsDB"); // TODO: Update to correct url after hosting server
  });
}

startServer().catch(console.error);
