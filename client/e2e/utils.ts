import type { Page } from "@playwright/test";

// Helper function to wait for page load to avoid test crashing
export async function waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
}

/**
 * AI GEN: this waits for the graphql resuest before resuming
 * Waits for a GraphQL POST request that matches an operation name and (optionally) specific variables.
 * this was debugged using AI. We saw this issue where the fetch happens after the test finishes looking for
  // objects. This create a listener to the search function and tries to see what happens when the button is clicked
 */
export function waitForGraphQL(page: Page, endpoint = "/mealsDB") {
  return page.waitForRequest(req =>
    req.method() === "POST" &&
    req.url().includes(endpoint)
  );
}