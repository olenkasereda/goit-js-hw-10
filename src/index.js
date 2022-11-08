import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const profileContainer = document.querySelector('.country-info');
const listCountry = document.querySelector('.country-list');
searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  let inputQuery = searchInput.value;
  if (!inputQuery) {
    profileContainer.innerHTML = '';
    return;
  }
  console.log(inputQuery);
  fetchCountries(inputQuery).then(buildProfileMarkup).catch(onFetchError);
}

function buildProfileMarkup(data) {
  console.log(data.length);
  if (2 <= data.length && data.length <= 10) {
    getMoreCountries(data);
    return;
  } else if (data.length > 10) {
    getMoreTenCountries(data);
    return;
  }
  getCountry(data);
}

function getMoreTenCountries() {
  onClearMarkup();
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function getMoreCountries(data) {
  onClearMarkup();
  const markup = data
    .map(({ name, flags, capital, population, languages }) => {
      return `<li>
      <h3><img width="35" height="25" src="${flags.svg}"</img>
      ${name.official}</h3>
        </li> `;
    })
    .join('');
  listCountry.innerHTML = markup;
}

function getCountry(data) {
  onClearMarkup();
  const markup = data
    .map(({ name, flags, capital, population, languages }) => {
      return `
      <h2><img width="35" height="25" src="${flags.svg}"</img>
      ${name.official}</h2>
      <p>Capital: ${capital[0]}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages).toString()}</p>
     `;
    })
    .join('');
  profileContainer.innerHTML = markup;
}

function onFetchError(error) {
  Notify.failure('Oops, there is no country with that name');
}

function onClearMarkup() {
  profileContainer.innerHTML = '';
  listCountry.innerHTML = '';
}
