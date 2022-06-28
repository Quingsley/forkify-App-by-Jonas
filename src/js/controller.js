import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import View from './views/view.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_MODAL_SEC } from './config.js';

// if(module.hot) {
//   module.hot.accept()
// }
const controlRecipes = async function() {
  try{
    const id = window.location.hash.slice(1);
    if(!id) return;
    recipeView.renderSpinner();

    // update results view to mark selected results
    resultsView.update(model.getSearchResultsPage());

     // update bookmarks view to mark selected results
    bookmarksView.update(model.state.bookmarks);

    //1) fetching data from api
    await model.loadRecipe(id);
   
   // 2) rendering the recipe
   recipeView.render(model.state.recipe);
  } catch(err){
    recipeView.renderError();
  }
}
controlRecipes();

//implememnting search Results
const controlSearchResults = async function() {
  try{

    resultsView.renderSpinner();
    // getting query from user
    const query = searchView.getQuery();
    if(!query) return;

    // await search results
    await model.loadSearchResults(query);
     //console.log(model.state.search.results);

      // render search results
     resultsView.render(model.getSearchResultsPage());

     //display pagination
     paginationView.render(model.state.search);
     
  }catch(err){
    recipeView.renderError();
  }
}

const controlPagination = function(goto) {
    // render new pagination results
     resultsView.render(model.getSearchResultsPage(goto));

     //display new pagination buttons
     paginationView.render(model.state.search);
}

//Updating the serivings functionality
const controlUpdateServings = function(newServings) {
  //update recipe servings in state
  model.updateServings(newServings);

  // update the renderRecipe UI
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe)
}

// bookmarking recipes
const controlAddBookmarkRecipe = function() {
  // adding/deleting bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  // updating the bookmark the recipe View
  recipeView.update(model.state.recipe);

  //dispalying the bookmark  
  bookmarksView.render(model.state.bookmarks);
  
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlUploadRecipe = async function(newRecipe) {
  try {

    // show spinner when uploading
    addRecipeView.renderSpinner();
    // code to handle upload
    await model.uploadRecipe(newRecipe);

    // render the recipe
    recipeView.render(model.state.recipe);

    // render the bookmark in the bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //success message
    addRecipeView.renderMessage();

    // settimeout to close modal window
    setTimeout(function(){
      addRecipeView.toggleWindow()},
      CLOSE_MODAL_SEC * 1000
    );
    
  } catch(err) {
    console.log('💥💥💥',err);
    addRecipeView.renderError(err.message);
  }
  
}

// subcribers
const init = function() {
  bookmarksView.addHanlderRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  // subscriber of serachView
  searchView.searchHandler(controlSearchResults);
  
  //subsriber of paginationView
  paginationView.addHandlerClick(controlPagination);
  //subscriber for updating servings
  recipeView.addHandlerServings(controlUpdateServings);

  //subcriber to handle the bookmark btn
  recipeView.addHandlerBookmark(controlAddBookmarkRecipe);

  //subcriber to handle uploading of new Recipe
  addRecipeView.addHandlerUpload(controlUploadRecipe);
}

init();





//load and hash events
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);