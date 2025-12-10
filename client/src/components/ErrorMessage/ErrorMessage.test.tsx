// AI GEN

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ErrorMessage from "./ErrorMessage";
import "@testing-library/jest-dom";

describe("ErrorMessage Component", () => {
    let reloadMock: jest.Mock | ReturnType<typeof vi.fn>;

    beforeEach(() => {
        reloadMock = vi.fn();

        // Gjør det mulig å overskrive window.location.reload
        Object.defineProperty(window, "location", {
            value: {
                ...window.location,
                reload: reloadMock,
            },
            writable: true,
        });
    });

    it("renders the error message text", () => {
        render(<ErrorMessage />);
        expect(screen.getByText(/please try again/i)).toBeInTheDocument();
    });

    it("renders the refresh button", () => {
        render(<ErrorMessage />);
        expect(
            screen.getByRole("button", { name: /refresh/i })
        ).toBeInTheDocument();
    });

    it("calls window.location.reload when Refresh is clicked", () => {
        render(<ErrorMessage />);
        fireEvent.click(screen.getByRole("button", { name: /refresh/i }));
        expect(reloadMock).toHaveBeenCalled();
    });

    it("applies correct CSS classes", () => {
        render(<ErrorMessage />);
        const box = screen.getByText(/please try again/i).closest("div");
        expect(box?.className).toMatch(/message_box/);
    });
});
