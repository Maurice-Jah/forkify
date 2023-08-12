// Imports
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 1. Loading the Recipe
    await model.loadRecipe(id);

    // 2. Rendering the Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// Loading the Search Results

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get the query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load the search query
    await model.loadSearchResults(query);

    // 3. Display the search
    resultsView.render(model.getSearchResultsPage());

    //4. Render inital pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
