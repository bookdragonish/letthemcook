// AI GEN

import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";

// Helper to strip dynamic CSS classnames from snapshots
function cleanHTML(element: HTMLElement) {
  const html = element.outerHTML;
  return html.replace(/class="[^"]*"/g, 'class=""');
}

describe("Navbar Snapshots", () => {

  beforeEach(() => {
    // Required so getByRole("button", {name:/open menu/i}) works
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  it("matches snapshot: initial render", () => {
    const nav = screen.getByRole("navigation", { name: /main navigation/i });

    // Remove CSS module noise
    expect(cleanHTML(nav)).toMatchSnapshot();
  });

  it("matches snapshot: mobile menu opened", () => {
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    const sidebar = screen.getByRole("list", { name: /mobile navigation/i });

    // Remove CSS module noise
    expect(cleanHTML(sidebar)).toMatchSnapshot();
  });

  it("matches snapshot: mobile menu closed again", () => {
    const menuButton = screen.getByRole("button", { name: /open menu/i });

    fireEvent.click(menuButton); // open
    fireEvent.click(menuButton); // close

    const sidebar = screen.getByRole("list", { name: /mobile navigation/i });

    // Remove CSS module noise
    expect(cleanHTML(sidebar)).toMatchSnapshot();
  });
});
