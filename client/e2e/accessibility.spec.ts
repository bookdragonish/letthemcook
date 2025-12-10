import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { waitForPageLoad } from "./utils";

test.describe('recipe overview page', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('');
        await waitForPageLoad(page);
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

test.describe('single recipe page', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('http://localhost:5173/project2/recipe/53049');
        await waitForPageLoad(page);

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

test.describe('search page', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('http://localhost:5173/project2/search');
        await waitForPageLoad(page);

        // Excluded until additional header is added to RecipeCard to avoid errors when running test
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
})