import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentForm from "./CommentForm";

describe("CommentForm", () => {
  const mockCommentUpdate = vi.fn(); // mock the function of updating the comment state in "CommentSection.tsc"

  beforeEach(() => { // Reset before each it
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("Renders the form correctly", () => {
    render(<CommentForm commentUpdate={mockCommentUpdate} />);

    //Checks render correctly
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /post/i })).toBeInTheDocument();
  });

  it("Remember the anonymous name", async () => {
    // Setting the session storage before render
    sessionStorage.setItem("anonymousName", "FoodFan");

    render(<CommentForm commentUpdate={mockCommentUpdate} />);

    //Checks that the input is updated with the session storage
    const nameInput = await screen.findByLabelText(/name/i);
    expect(nameInput).toHaveValue("FoodFan");
  });

  it("Does not post when comment field is empty", async () => {
    render(<CommentForm commentUpdate={mockCommentUpdate} />);

    //Clicks button whitout filling the input
    const button = screen.getByRole("button", { name: /post/i });
    fireEvent.click(button);

    // Check that the function that updates the database is not called if the input field is not filled
    await waitFor(() => {
      expect(mockCommentUpdate).not.toHaveBeenCalled();
    });
  });

  it("The comment is posted to the database", async () => {
    render(<CommentForm commentUpdate={mockCommentUpdate} />);

    // Get input fields
    const nameInput = screen.getByLabelText(/name/i);
    const commentInput = screen.getByLabelText(/comment/i);

    // The test change input fields and clicks on button
    fireEvent.change(nameInput, { target: { value: "food_lover" } });
    fireEvent.input(commentInput, {
      target: { value: "This recipe was okay" },
    });

    const button = screen.getByRole("button", { name: /post/i });
    fireEvent.click(button);

    // Check that the correct functions were called with the correct attributes
    await waitFor(() => {
      expect(mockCommentUpdate).toHaveBeenCalledTimes(1);
      expect(mockCommentUpdate).toHaveBeenCalledWith(
        "food_lover",
        "This recipe was okay"
      );
    });
  });
});
