import { buildSchema } from "graphql";
import gql from "graphql-tag"

//Defines structure for GaphQL API
const typeDefString = `

    type Meal {
        idMeal: ID!
        strMeal: String!
        strMealAlternate: String
        strCategory: String!
        strArea: String!
        strInstructions: String!
        strMealThumb: String!
        strTags: String
        strYoutube: String!

        ingredients: [String!]!
        measures: [String!]!

        strSource: String
        strImageSource: String
        strCreativeCommonsConfirmed: String
        dateModified: String
    }

    type Comment {
        anonymousName: String!
        comment: String!
        date: String!
    }
    
    type CommentSection {
        recipeID: ID!
        comments: [Comment]!
    }

    type MealsResult {
        data: [Meal!]!
        page: Int!
        limit: Int!
        total: Int!
        totalPages: Int!
    }

    type Query {
        # Gets all meals
        meals(
            order: Int, 
            page: Int, 
            limit: Int,
            category: String
        ): MealsResult!

        # Meals by id
        meal(id: ID!): Meal

        # Search for meals
        searchMeals(
            value: String!,
            page: Int, 
            limit: Int
        ): MealsResult!

        # Find the comment section
        commentsByRecipe(recipeID: ID!): CommentSection
    }

    type Mutation {
        addComment(recipeID: ID!, anonymousName: String!, comment: String): CommentSection
    }
`;

export const schema = buildSchema(typeDefString);
export const typeDef = gql(typeDefString);
