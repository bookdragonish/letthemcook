import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { storageKeyCategory, storageKeyOrder, storageKeyPageNumberOverview, storageKeyPageNumberSearch, storageKeySearchValue } from '../utils/storageKeys'

/*

Slice that manages:
- category for RecipeOverview filters
- order for sort A–Z / Z–A
- searchValue for SearchPage

 */

const storedPageNumSearch = sessionStorage.getItem(storageKeyPageNumberSearch) 
const storedPageNumOverview = sessionStorage.getItem(storageKeyPageNumberOverview) 
const storedSearchVal = sessionStorage.getItem(storageKeySearchValue) 
const storedCat = sessionStorage.getItem(storageKeyCategory) 
const storedOrd = sessionStorage.getItem(storageKeyOrder) 

const pageOverviewParsed = storedPageNumOverview ? JSON.parse(storedPageNumOverview) : 1;
const pageSearchParsed = storedPageNumSearch ? JSON.parse(storedPageNumSearch) : 1;
const storedOrdParsed = storedOrd ? JSON.parse(storedOrd) : 1;

export interface FiltersState {
  category: string
  order: 1 | -1
  searchValue: string
  pageSearch: number
  pageOverview: number
}

const initialState: FiltersState = {
  category: storedCat ?? 'All',
  order:  storedOrdParsed,
  searchValue: storedSearchVal || '',
  pageSearch: pageSearchParsed,
  pageOverview: pageOverviewParsed,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload
    },
    setOrder(state, action: PayloadAction<1 | -1>) {
      state.order = action.payload
    },
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload
    },
    setPageSearch(state, action: PayloadAction<number>) {
      state.pageSearch = action.payload
    },
    setPageOverview(state, action: PayloadAction<number>) {
      state.pageOverview = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setCategory, setOrder, setSearchValue, setPageOverview, setPageSearch, resetFilters } =
  filtersSlice.actions

export default filtersSlice.reducer