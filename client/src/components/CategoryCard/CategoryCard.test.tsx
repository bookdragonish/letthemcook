import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import CategoryCard from "./CategoryCard";

describe("CategoryCard", () => {
    it("renders image and label", () => {
        render(<CategoryCard image="test.jpg" label="TestImg" />);
        const img = screen.getByAltText("Image of TestImg") as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.src).toContain("test.jpg");
        expect(screen.getByText("TestImg")).toBeInTheDocument();
    });

    it("calls onClick when button is clicked", () => {
        const onClick = vi.fn();
        render(<CategoryCard image="test.jpg" label="TestImg" onClick={onClick} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not throw when onClick is not provided", () => {
        render(<CategoryCard image="test.jpg" label="TestImg" />);
        const button = screen.getByRole("button");
        expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("adds an extra class when isSelected is true", () => {
        const { rerender } = render(
            <CategoryCard image="test.jpg" label="TestImg" isSelected={false} />
        );
        const buttonNotSelected = screen.getByRole("button");
        // Split classname on whitespace and remove empty strings, then count
        const classCountNotSelected = buttonNotSelected.className.split(/\s+/).filter(Boolean).length;

        rerender(<CategoryCard image="test.jpg" label="TestImg" isSelected={true} />);
        const buttonSelected = screen.getByRole("button");
        const classCountSelected = buttonSelected.className.split(/\s+/).filter(Boolean).length;

        // When selected the class name should be length 2, non selected 1.
        expect(classCountNotSelected).toEqual(1);
        expect(classCountSelected).toEqual(2);

    });
});