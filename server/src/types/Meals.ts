
export interface MealsArgs {
  order?: 1 | -1;
  page?: number;
  limit?: number;
  category?: string;
}

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;

  ingredients: string[];
  measures: string[];

  strSource: string | null;
  strImageSource: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
}

export type MealResponse = {
  meals: Meal[] | [];
}

export type MealsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Meal[];
}