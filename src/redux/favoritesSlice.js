import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const recipe = action.payload;
      const exists = state.favoriterecipes.some(
        (fav) => fav.idFood === recipe.idFood
      );

      if (exists) {
        // Remove if it already exists
        state.favoriterecipes = state.favoriterecipes.filter(
          (fav) => fav.idFood !== recipe.idFood
        );
      } else {
        // Add if not in list
        state.favoriterecipes.push(recipe);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
