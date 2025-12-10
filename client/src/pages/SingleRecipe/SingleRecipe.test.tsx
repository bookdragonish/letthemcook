import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import SingleRecipe from './SingleRecipe';
import type { Meal } from '../../types/meal'; // adjust if the type is called MealPreview or similar

// --- Mock hook return type ---
interface MockHookReturn {
    data: Meal | null;
    isLoading: boolean;
    isError: boolean;
}

// --- Shared mutable mock value ---
let mockHookReturn: MockHookReturn = {
    data: null,
    isLoading: false,
    isError: false,
};

// --- Mock the hook ---
vi.mock('../../hooks/useFetchSingleMeal/useFetchSingleMeal', () => ({
    useFetchSingleMeal: (): MockHookReturn => mockHookReturn,
}));

// --- Mock child components ---

// Mock RecipeMedia component
vi.mock('./components/RecipeMedia/RecipeMedia', () => ({
    default: ({ recipe }: { recipe?: Meal }) => (
        <div data-testid="recipe-media">{recipe?.strMeal ?? 'no-media'}</div>
    ),
}));

// Mock InfoSection component
vi.mock('./components/InfoSection/InfoSection', () => ({
    default: ({ recipe }: { recipe?: Meal }) => (
        <div data-testid="info-section">{recipe?.strMeal ?? 'no-info'}</div>
    ),
}));

// Mock CommentSection component
vi.mock('../../components/CommentSection/CommentSection', () => ({
    default: ({ recipeId }: { recipeId: string }) => (
        <div data-testid="comment-section">comments for {recipeId}</div>
    ),
}));

// Mock CrossButton component
vi.mock('./components/CrossButton/CrossButton', () => ({
    default: () => <button data-testid="cross-button">close</button>,
}));

// --- The actual tests ---
describe('SingleRecipe', () => {
    it('shows loader state (does not render child components) when loading', () => {
        mockHookReturn = { data: null, isLoading: true, isError: false };

        const { container } = render(<SingleRecipe recipeId="42" />);

        expect(screen.queryByTestId('recipe-media')).toBeNull();
        expect(screen.queryByTestId('info-section')).toBeNull();
        expect(container).toBeTruthy();
    });

    it('shows error message when hook reports error', () => {
        mockHookReturn = { data: null, isLoading: false, isError: true };

        render(<SingleRecipe recipeId="42" />);
        expect(
            screen.getByRole("button", { name: /refresh/i })
        ).toBeInTheDocument();
    });

    it('renders child components and passes recipe + recipeId when data is available', () => {
        const mockMeal: Meal = { strMeal: 'VegetarianYaki Udon', idMeal: 'rec-1' } as Meal;

        mockHookReturn = { data: mockMeal, isLoading: false, isError: false };

        render(<SingleRecipe recipeId="rec-1" />);

        expect(screen.getByTestId('recipe-media')).toHaveTextContent('VegetarianYaki Udon');
        expect(screen.getByTestId('info-section')).toHaveTextContent('VegetarianYaki Udon');
        expect(screen.getByTestId('comment-section')).toHaveTextContent('comments for rec-1');
        expect(screen.getByTestId('cross-button')).toBeInTheDocument();
    });
});
