import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useComments } from "./useComments";
import { getCommentsbyRecipeID, addComment } from "../../api/fetchComments";
import type { Comment } from "../../types/comment";
import type { Mock } from "vitest";
// AI GEN: made with ai to cover 

// --- Mock API functions ---
vi.mock("../../api/fetchComments", () => ({
  getCommentsbyRecipeID: vi.fn(),
  addComment: vi.fn(),
}));

const mockComments: Comment[] = [
  {
    anonymousName: "Alice",
    comment: "Nice!",
    date: "2024-01-01",
  },
  {
    anonymousName: "Bob",
    comment: "Love it!",
    date: "2024-01-02",
  },
];

describe("useComments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  it("fetches comments on mount", async () => {
    (getCommentsbyRecipeID as Mock).mockResolvedValueOnce(mockComments);

    const { result } = renderHook(() => useComments("abc123"));

    // Loading first
    expect(result.current.isLoading).toBe(true);

    // Wait for effect to complete
    await act(async () => {});

    expect(getCommentsbyRecipeID).toHaveBeenCalledWith("abc123");
    expect(result.current.comments).toEqual(mockComments);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  // ---------------------------------------------------------------------------
  it("sets error state when fetching fails", async () => {
    (getCommentsbyRecipeID as Mock).mockRejectedValueOnce(new Error("fail"));

    const { result } = renderHook(() => useComments("abc123"));

    await act(async () => {});

    expect(result.current.isError).toBe(true);
    expect(result.current.comments).toEqual([]);
  });

  // ---------------------------------------------------------------------------
  it("submits a comment and refetches the list", async () => {
    // Initial fetch
    (getCommentsbyRecipeID as Mock)
      .mockResolvedValueOnce(mockComments) // for mount
      .mockResolvedValueOnce([
        ...mockComments,
        {
          anonymousName: "Carl",
          comment: "Tasty!",
          date: "2024-01-03",
        },
      ]); // after submit

    // addComment returns success
    (addComment as Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useComments("abc123"));

    // let initial fetch complete
    await act(async () => {});

    // Submit comment
    await act(async () => {
      await result.current.submitComment("Carl", "Tasty!");
    });

    expect(addComment).toHaveBeenCalledWith("abc123", "Carl", "Tasty!");
    expect(getCommentsbyRecipeID).toHaveBeenCalledTimes(2);
    expect(result.current.comments).toHaveLength(3);
    expect(result.current.isError).toBe(false);
  });

  // ---------------------------------------------------------------------------
  it("sets error when submit API fails", async () => {
    // Initial fetch OK
    (getCommentsbyRecipeID as Mock).mockResolvedValueOnce(mockComments);

    // Submit fails
    (addComment as Mock).mockRejectedValueOnce(new Error("fail"));

    const { result } = renderHook(() => useComments("abc123"));

    await act(async () => {});

    await act(async () => {
      await result.current.submitComment("X", "Broken");
    });

    expect(result.current.isError).toBe(true);
  });

  // ---------------------------------------------------------------------------
  it("sets error when submitComment is called with empty fields", async () => {
    (getCommentsbyRecipeID as Mock).mockResolvedValueOnce(mockComments);

    const { result } = renderHook(() => useComments("abc123"));

    await act(async () => {});

    await act(async () => {
      await result.current.submitComment("", "");
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });
});
