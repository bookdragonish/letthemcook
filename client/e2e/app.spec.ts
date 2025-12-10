import { test, expect } from "@playwright/test";
import { waitForGraphQL } from "./utils";

test("test sorting button", async ({ page }) => {
  await page.goto("");
  await expect(
    page.getByRole("link").filter({ hasText: "DessertApam balik" })
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Sorted ascending. Click to" })
    .click();
  await expect(
    page.getByRole("link").filter({ hasText: "VegetarianYaki Udon" })
  ).toBeVisible();
});

test("filter by vegan", async ({ page }) => {
  await page.goto("");

  await Promise.all([
    waitForGraphQL(page),
    page.getByRole("img", { name: "Vegan" }).click(),
  ]);

  const grid = page.getByRole("region", { name: "Recipes", exact: true });
  await expect(grid).toBeVisible();

  await expect(
    page.getByRole("link").filter({ hasText: "VeganRoast fennel and" })
  ).toBeVisible({ timeout: 15000 });
});

test("search for recipe", async ({ page }) => {
  await page.goto("");

  // CLICK THE SEARCH LINK IN THE MAIN NAV ONLY
  await page.getByRole("link", { name: "SEARCH" }).first().click();

  const searchBox = page.getByRole("textbox", {
    name: "Type in search words for",
  });

  await expect(
    page.getByText("Search to see your results.")
  ).toBeVisible();

  await expect(searchBox).toHaveValue("");
  expect(await searchBox.inputValue()).toBe("");

  await searchBox.click();
  await searchBox.fill("udon");

  await Promise.all([
    waitForGraphQL(page),
    page.getByRole("button", { name: "Search" }).click(),
  ]);

  const grid = page.getByRole("region", { name: "Recipes", exact: true });
  await expect(grid).toBeVisible();

  await expect(
    page.getByRole("link").filter({ hasText: "PorkJapanese Katsudon" })
  ).toBeVisible();
});


test("all recipes button", async ({ page }) => {
  await page.goto("");

  await page
    .getByRole("link", { name: "View recipe details for Apam" })
    .click();
  await page.getByRole("link", { name: "HOME", exact: true }).first().click();

  await expect(
    page.getByRole("heading", { name: "Recipes", exact: true })
  ).toBeVisible();
});

test("navigation cross back to search results", async ({ page }) => {
  await page.goto("");

  await page.getByRole("link", { name: "SEARCH", exact: true }).first().click();

  const searchBox = page.getByRole("textbox", {
    name: "Type in search words for",
  });

  searchBox.click();
  searchBox.fill("udon");

  await Promise.all([
    waitForGraphQL(page),
    page.getByRole("button", { name: /search/i }).click(),
  ]);

  const grid = page.getByRole("region", { name: "Recipes", exact: true });
  await expect(grid).toBeVisible();

  await page
    .getByRole("link", { name: "View recipe details for Japanese Katsudon" })
    .click();
  await page.getByRole("button", { name: "Go back to previous page" }).click();

  await expect(
    page.getByRole("link", {
      name: "View recipe details for Japanese Katsudon",
    })
  ).toBeVisible();
});

test("navigation via logo", async ({ page }) => {
  await page.goto("");

  await page.getByRole("link").filter({ hasText: "DessertApam balik" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link")
    .filter({ hasText: /^$/ })
    .click();

  await expect(
    page.getByRole("heading", { name: "Recipes", exact: true })
  ).toBeVisible();
});

test("next button", async ({ page }) => {
  await page.goto("");
  await expect(page.getByText("1")).toBeVisible();

  await Promise.all([
    waitForGraphQL(page),
    page.getByRole("button", { name: "Next" }).click(),
  ]);

  await expect(page.getByText("2")).toBeVisible();

  await Promise.all([
    waitForGraphQL(page),
    page.getByRole("button", { name: "Previous" }).click(),
  ]);
  await expect(page.getByText("1")).toBeVisible();
});
