
export type FetchMealsArgs =
  | AllMealsArgs
  | SearchMealsArgs;

  export type AllMealsArgs = {
  type: "all";
  order?: number;
  category?: string;
  page?: number;
  limit?: number;
};

export type SearchMealsArgs = {
  type: "search";
  queryValue: string;
  page: number;
  limit?: number;
};
