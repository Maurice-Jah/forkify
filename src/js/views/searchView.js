import { async } from 'regenerator-runtime';

class searchView {
  #parentElement = document.querySelector('.search');

  getQuery() {
    const query = document.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    document.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
