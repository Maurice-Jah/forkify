// Imports
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0. Mark recipe as selected
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

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
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1. Update the recipe servings in the state
  model.updateServings(newServings);
  // 2. Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // 1. Add or Remove Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2. Update Recipe view
  recipeView.update(model.state.recipe);

  // 3. Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const handleBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Add Recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Showing spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render success message
    addRecipeView.renderSuccess();

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Close popup window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(handleBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
