// AI GEN: For consistency in generating keys we used ai to generate the keys to the cache

export const cacheKeys = {
  meals: (order: number, category: string, page: number, limit: number) =>
    `meals:${order}:${category}:${page}:${limit}`,

  meal: (id: string) => `meal:${id}`,
};