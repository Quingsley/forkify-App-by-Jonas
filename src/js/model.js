import { async } from "regenerator-runtime";
import { API_URL,RES_PER_PAGE,KEY } from "./config.js";
// import { getAJAX, getAJAX } from "./helpers.js";
import { getAJAX } from "./helpers.js";
export const state = {
    recipe: {

    },
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },

    bookmarks: [],
};

const createRecipeObject = function(data) {
    const { recipe } = data.data;
        
        return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        cookingTime:recipe.cooking_time,
        ingredients: recipe.ingredients,
        image: recipe.image_url,
        servings: recipe.servings,
        ...(recipe.key && {key: recipe.key}),
        }
}

export const loadRecipe =  async function(id) {
    try {
        const data = await getAJAX(`${API_URL}${id}?key=${KEY}`);

        state.recipe = createRecipeObject(data);
         if(state.bookmarks.some(bookmark => bookmark.id === id)){
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
    } catch(err){
        // temporary error handling
         console.error(`${err} 💥💥💥💥`);
         throw err;
    }
}

export const loadSearchResults = async function(query) {
    state.search.query = query;
    try{
        const data = await getAJAX(`${API_URL}?search=${query}&key=${KEY}`)
        state.search.results = data.data.recipes.map(rec => {
            return {
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,  
             ...(rec.key && {key: rec.key})
            }
        })
        state.search.page = 1;
    } catch(err){
         console.error(`${err} 💥💥💥💥`);
         throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage; // 0
    const end = page * state.search.resultsPerPage; // 9
    return state.search.results.slice(start, end);
}

//updating the servings
export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}

// store bookmarks to local storage
const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

// retrieving from localstorage
const getBookmarks = function() {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}

// bookmarks
export const addBookmark = function(recipe) {
    // pushing the bookmark in the array
    state.bookmarks.push(recipe);
    //marking current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const deleteBookmark = function(id) {
    // find the index to delete
    const index = state.bookmarks.findIndex(el => el.id === id);
    // deleting the bookmarked recipe from the array
    state.bookmarks.splice(index, 1);
     //marking current recipe as NOT bookmarked
     if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();

}

export const uploadRecipe =  async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => { 
            const ingArr = ing[1].split(',').map(el => el.trim())
            //replaceAll(' ','').split(','); 
            if(ingArr.length !== 3) throw new Error('Wrong Ingredient format. Please use the correct format :)');
            const [quantity,unit,description] = ingArr;
            return {quantity: quantity ? +quantity : null, unit, description};
        })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
       const data = await getAJAX(`${API_URL}?key=${KEY}`,recipe);
       state.recipe = createRecipeObject(data);

       addBookmark(state.recipe);
     } catch(err) {
        throw err;
     }
    
    
}

const init = function() {
    getBookmarks();
}
init();