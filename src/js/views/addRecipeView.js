import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {

    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpenModal = document.querySelector('.nav__btn--add-recipe');
    _btnCloseModal = document.querySelector('.btn--close-modal');
    _message = 'Recipe successfully uploaded :)';

    constructor() {
        super();
        this._addHandlerShowModal();
        this._addHandlerCloseModal();
    }

    toggleWindow() {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    _addHandlerShowModal() {
        this._btnOpenModal.addEventListener('click',this.toggleWindow.bind(this));
    }

    _addHandlerCloseModal() {
        this._btnCloseModal.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit',function(e){
            e.preventDefault();

            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr)
            handler(data);
        })
    }
    

}

export default new AddRecipeView();