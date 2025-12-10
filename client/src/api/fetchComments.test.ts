import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCommentsbyRecipeID, addComment } from "./fetchComments";

// AI GEN


const MOCK_COMMENTS = [
  {
    anonymousName: "Alice",
    comment: "Great recipe!",
    date: "2025-11-13T12:00:00Z",
  },
  {
    anonymousName: "Bob",
    comment: "Loved it!",
    date: "2025-11-13T13:00:00Z",
  },
];

describe("Comments API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches comments by recipe ID successfully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { commentsByRecipe: { comments: MOCK_COMMENTS } } }),
    }));

    const comments = await getCommentsbyRecipeID("52772");

    expect(comments).toBeDefined();
    expect(comments.length).toBe(2);
    expect(comments[0].anonymousName).toBe("Alice");
  });

  it("throws an error if GraphQL returns errors on fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        errors: [{ message: "Recipe not found" }],
      }),
    }));

    await expect(getCommentsbyRecipeID("52772")).rejects.toThrow("Recipe not found");
  });

  it("adds a comment successfully", async () => {
    const newComment = { anonymousName: "Charlie", comment: "Nice!", date: "2025-11-13T14:00:00Z" };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { commentsByRecipe: { comments: [newComment] } },
      }),
    }));

    const result = await addComment("52772", newComment.anonymousName, newComment.comment);

    expect(result).toBeDefined();
    expect(result.comments.length).toBe(1);
    expect(result.comments[0].anonymousName).toBe("Charlie");
  });

  it("throws an error if GraphQL returns errors on addComment", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        errors: [{ message: "Cannot add comment" }],
      }),
    }));

    await expect(addComment("52772", "Dave", "Hello")).rejects.toThrow("Cannot add comment");
  });
});
