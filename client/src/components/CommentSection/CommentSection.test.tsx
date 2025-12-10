import { render, screen } from "@testing-library/react";
import CommentSection from "./CommentSection";
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { Comment } from "../../types/comment";

// Mock the CommentForm component
vi.mock("../CommentForm/CommentForm", () => ({
  default: vi.fn(() => <div>Mocked CommentForm</div>),
}));

// Mock useComments hook (new!)
vi.mock("../../hooks/useComments/useComments", () => ({
  useComments: vi.fn(),
}));

import { useComments } from "../../hooks/useComments/useComments";

describe("CommentSection", () => {
  const mockRecipeId = "abc123";

  const mockComments: Comment[] = [
    {
      anonymousName: "Alice",
      comment: "Looks delicious!",
      date: "2024-04-10T10:00:00Z",
    },
    {
      anonymousName: "Bob",
      comment: "I’ll try this next weekend!",
      date: "2024-04-11T12:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the title and CommentForm", async () => {
    // Setting the response value for the mocked fetch hook
    (useComments as ReturnType<typeof vi.fn>).mockReturnValue({
      comments: [],
      isLoading: false,
      isError: false,
      submitComment: vi.fn(),
    });

    // Render component
    render(<CommentSection recipeId={mockRecipeId} />);

    // Title and Mocked Form should be in the document
    expect(screen.getByText(/Comment section/i)).toBeInTheDocument();
    expect(screen.getByText("Mocked CommentForm")).toBeInTheDocument();
  });

  it("fetches and displays comments", async () => {
    // Setting the response value for the mocked fetch hook and render component
    (useComments as ReturnType<typeof vi.fn>).mockReturnValue({
      comments: mockComments,
      isLoading: false,
      isError: false,
      submitComment: vi.fn(),
    });

    render(<CommentSection recipeId={mockRecipeId} />);

    // Comments should appear
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Looks delicious!")).toBeInTheDocument();
    expect(screen.getByText("I’ll try this next weekend!")).toBeInTheDocument();
  });

  it("handles fetch error", async () => {
    // The response to the hook will be an error
    (useComments as ReturnType<typeof vi.fn>).mockReturnValue({
      comments: [],
      isLoading: false,
      isError: true,
      submitComment: vi.fn(),
    });

    // Spy on the global console error. Spy is a testing wrapper that let us track
    // How many times it is called, arguments called with and optionally replace implementation
    // This us implemented by the help of AI (Chat GPT)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Render the component and wait till the fetch is called
    render(<CommentSection recipeId={mockRecipeId} />);

    // Check that the spy gave an error
    expect(consoleSpy).toHaveBeenCalled();

    // Prevents other test that rely on real console output to fail
    consoleSpy.mockRestore();
  });
});
