import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import GridInteractions from "./GridInteractions";
import { MemoryRouter } from "react-router-dom";
import type { Mock } from "vitest";

//Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual, // keep MemoryRouter, Link, etc.
    useNavigate: () => mockNavigate, // override only this
  };
});

//Mock Redux selector
vi.mock("../../store/hooks", () => ({
  useAppSelector: vi.fn(),
}));

import { useAppSelector } from "../../store/hooks";

describe("GridInteractions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ascending label when currentOrder = 1", () => {
    //Mock category from Redux
    (useAppSelector as Mock).mockReturnValue("Beef");

    const mockToggle = vi.fn();

    render(
      <MemoryRouter>
        <GridInteractions currentOrder={1} onToggleSort={mockToggle} />
      </MemoryRouter>
    );

    // Sorted ascending text
    expect(
      screen.getByRole("button", { name: /sorted ascending/i })
    ).toBeInTheDocument();

    // Label text
    expect(screen.getByText("Title A-Z ↑")).toBeInTheDocument();

    // aria-pressed should be false for ascending
    expect(
      screen.getByRole("button", { name: /sorted ascending/i })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("renders descending label when currentOrder = -1", () => {
    (useAppSelector as Mock).mockReturnValue("Beef");

    const mockToggle = vi.fn();

    render(
      <MemoryRouter>
        <GridInteractions currentOrder={-1} onToggleSort={mockToggle} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: /sorted descending/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Title Z-A ↓")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sorted descending/i })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onToggleSort with -1 when currentOrder = 1 (asc → desc)", () => {
    (useAppSelector as Mock).mockReturnValue("Beef");

    const mockToggle = vi.fn();

    render(
      <MemoryRouter>
        <GridInteractions currentOrder={1} onToggleSort={mockToggle} />
      </MemoryRouter>
    );

    // Sort button is the second button
    const sortBtn = screen.getByText("Title A-Z ↑");
    fireEvent.click(sortBtn);

    expect(mockToggle).toHaveBeenCalledTimes(1);
    expect(mockToggle).toHaveBeenCalledWith(-1);
  });

  it("calls onToggleSort with 1 when currentOrder = -1 (desc → asc)", () => {
    (useAppSelector as Mock).mockReturnValue("Beef");

    const mockToggle = vi.fn();

    render(
      <MemoryRouter>
        <GridInteractions currentOrder={-1} onToggleSort={mockToggle} />
      </MemoryRouter>
    );

    const sortBtn = screen.getByText("Title Z-A ↓");
    fireEvent.click(sortBtn);

    expect(mockToggle).toHaveBeenCalledTimes(1);
    expect(mockToggle).toHaveBeenCalledWith(1);
  });

  it("navigates to the correct random recipe based on category", () => {
    (useAppSelector as Mock).mockReturnValue("Chicken");

    const mockToggle = vi.fn();

    render(
      <MemoryRouter>
        <GridInteractions currentOrder={1} onToggleSort={mockToggle} />
      </MemoryRouter>
    );

    const randomBtn = screen.getByRole("button", { name: /random recipe/i });

    fireEvent.click(randomBtn);

    // Navigates to correct URL
    expect(mockNavigate).toHaveBeenCalledWith("/recipe/Chicken");
  });

  it("renders the Randomizer button next to the Sort button", () => {
    // Mock Redux selector
    (useAppSelector as Mock).mockReturnValue("Chicken");

    const mockToggle = vi.fn();

    render(
      <MemoryRouter>
        <GridInteractions currentOrder={1} onToggleSort={mockToggle} />
      </MemoryRouter>
    );

    const controlsRegion = screen.getByRole("region", {
      name: /sorting order recipes and get random/i,
    });

    // Randomizer button: selected using ARIA label from real component
    expect(
      within(controlsRegion).getByRole("button", { name: /random recipe/i })
    ).toBeInTheDocument();

    // Sort button: selected using ARIA label that includes "Sorted"
    expect(
      within(controlsRegion).getByRole("button", { name: /sorted/i })
    ).toBeInTheDocument();
  });
});
