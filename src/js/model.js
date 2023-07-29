import { getJSON } from './helpers.js';
import { API_URL } from './config.js';

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      sourceUrl: recipe.source_url,
    };

    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};
