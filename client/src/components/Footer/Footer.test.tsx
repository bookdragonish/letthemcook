import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

// The Footer component only renders static text, so we check that it renders and contains the expected text
describe("Footer", () => {
  it("renders the footer text correctly", () => {
    // Render the Footer component in a virtual DOM
    render(<Footer />);

    // Find the text we expect to be inside the footer
    const footerText = screen.getByText(
      /website by gina giske, ida brattøy ustad, arild gustad and ingvild sandven/i
    );

    expect(footerText).toBeInTheDocument();
  });

  it("uses the correct HTML tag", () => {
    // Render again
    render(<Footer />);

    // There should be exactly one <footer> element
    const footer = screen.getByRole("contentinfo");
    expect(footer.tagName.toLowerCase()).toBe("footer");
  });
});
