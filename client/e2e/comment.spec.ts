import { test, expect } from "@playwright/test";
import { waitForPageLoad } from "./utils";

test('post comment', async ({ page }) => {
  await page.goto("/project2/recipe/53073");
  await waitForPageLoad(page);

  // Helper function to generate random string to comment
  function generateRandomString(length: number = 6): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }

  const testComment = generateRandomString();

  await page.getByRole("textbox", { name: "Name:" }).click();
  await page.getByRole("textbox", { name: "Name:" }).fill("janedoe");
  await page.getByRole("textbox", { name: "Comment:" }).click();
  await page.getByRole("textbox", { name: "Comment:" }).fill(testComment);
  await page.getByRole("button", { name: "Post" }).click();

  await expect(page.getByText(testComment)).toBeVisible();
});

test('post comment with empty comment displays error', async ({ page }) => {
  await page.goto("/project2/recipe/53073");
  await waitForPageLoad(page);

  await page.getByRole("textbox", { name: "Name:" }).click();
  await page.getByRole("textbox", { name: "Name:" }).fill("janedoe");
  await page.getByRole("button", { name: "Post" }).click();

  await expect(page.getByText('Comment cannot be empty.')).toBeVisible();
});

test('post comment without name displays error', async ({ page }) => {
  await page.goto("/project2/recipe/53073");
  await waitForPageLoad(page);

  await page.getByRole("textbox", { name: "Comment:" }).click();
  await page.getByRole("textbox", { name: "Comment:" }).fill("test comment");
  await page.getByRole("button", { name: "Post" }).click();

  await expect(page.getByText('Name is required.')).toBeVisible();
});