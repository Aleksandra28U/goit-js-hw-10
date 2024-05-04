// implementacja css, skryptów, KTÓRE TRZEBA WCZYTAĆ POPRZEZ NPM i import kodu z fetchCountries.js
import './styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

// stworzenie opóźnienia
const DEBOUNCE_DELAY = 300;

// uzyskanie dostępu z HTML do pola wyszukiwania i list
const squerys = {
  searchEl: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

// czyszczenie elementów w HTML do stanu default
const clearMarkup = drefault => (drefault.innerHTML = '');

// metoda usuwania znaków białych z pola wyszukiwania
const inputHandler = white => {
  const textInput = white.target.value.trim();

  // jeśli w polu wyszukiwania nie ma żadnego tekstu to nie pojawia się żadna lista
  if (!textInput) {
    clearMarkup(squerys.countryList);
    clearMarkup(squerys.countryInfo);
    return;
  }

  // funkcja wyświetlająca kraje po wpisaniu tekstu w wyszukiwarkę
  fetchCountries(textInput)
    .then(data => {
      console.log(data); // wyświetlenie sugerowanych krajów/kraju
      if (data.length > 10) {
        // powyżej 10 możliwości pojawia się informacja i czyszczona jest lista krajów
        clearMarkup(squerys.countryList);
        clearMarkup(squerys.countryInfo);
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data); // cd console.log(data); funkcja z linijki zaczynającej się od const renderMarkup - 52
    })
    .catch(error => {
      clearMarkup(squerys.countryList);
      clearMarkup(squerys.countryInfo);
      Notify.failure('Oops..., there is no country with that name'); // jeśli nie ma takiego kraju to wyśwoitla się informacja
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    //jeśli wybrany zostanie 1 kraj to zostanie on wyświetlony z żądanymi danymi
    clearMarkup(squerys.countryList); // nie będzie listy
    const markupInfo = createInfoMarkup(data);
    squerys.countryInfo.innerHTML = markupInfo;
  } else {
    // jeśli będzie 2-10 krajów wybranych wyświetli się tylko ich lista
    clearMarkup(squerys.countryInfo); // nie będzie pojedynczego kraju
    const markupList = createListMarkup(data);
    squerys.countryList.innerHTML = markupList;
  }
};

// wyświetlenie listy krajów 2-10
const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

// wyświetlenie informacji tylko o 1 kraju
const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.png}" alt="${name.official}" width="200" height="100">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

// jeśli wpisywany jest teks w polu wyszukiwania ewentualne listy pojawiają się dopiero po 0,3 sekundy
squerys.searchEl.addEventListener(
  'input',
  debounce(inputHandler, DEBOUNCE_DELAY)
);
