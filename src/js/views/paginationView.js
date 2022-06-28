import View from './view.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
    _parentElement = document.querySelector('.pagination');
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click',function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            const goToBtn = +btn.dataset.goto;
            handler(goToBtn);
        })
    }
     _generateMarkup() {
        let curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        //console.log(numPages);
        //on page 1, and there are other pages
        if(curPage === 1 && curPage < numPages ) {
            return this._generateMarkupNextPage(curPage);
        }
        // on last page
        if(curPage === numPages && numPages > 1) {
            return this._generateMarkupPrevPage(curPage);
        }
        // on some other page
        if(curPage < numPages) {
            return `${this._generateMarkupPrevPage(curPage)}${this._generateMarkupNextPage(curPage)}`;
        }
        //on page 1, and there are NO other pages
        return '';
     }
     
     _generateMarkupPrevPage(curPage) {
            return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
          </button>`;
     }
     _generateMarkupNextPage(curPage) {
        return `
             <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
     }
}

export default new paginationView();