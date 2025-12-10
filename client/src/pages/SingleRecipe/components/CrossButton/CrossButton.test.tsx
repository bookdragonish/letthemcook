import { expect, describe, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CrossButton from "./CrossButton";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, 
     Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: unknown }) => (
      <a href={to} {...props}>{children}</a>
     ),
  };
});


describe("Cross button", () => {
    it("loads cross button", () => {
        const { getByAltText } = render(<CrossButton />);
        const crossImg = getByAltText('cross');

        expect(crossImg).toBeInTheDocument();
    });

    it("sends user back to main page", () => {
        const { getByRole } = render(<CrossButton />);
        const button = getByRole("button", {
          name: /go back to previous page/i,
        });

        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});