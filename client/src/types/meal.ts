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

export type MealPreview = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string | null;
  strCategory: string;
}

export interface PaginatedResult<T> {
  page: number;
  limit?: number;
  total: number;
  totalPages: number;
  data: T[];
}