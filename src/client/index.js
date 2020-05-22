import { handleSubmit } from './js/formHandler'

import './styles/base.scss'
import './styles/cards.scss'
import './styles/header.scss'
import './styles/section.scss'

// Using event listener per mentor advice at https://knowledge.udacity.com/questions/82043
// Accepts both keypress and button clicks.
const form = document.getElementById('form');
if (!!form) {
  form.addEventListener('submit', handleSubmit);
}

const resultsElement = document.getElementById('results-section');
if (!!resultsElement) {
  resultsElement.style.display = "none";
}

const errorElement = document.getElementById('error-section');
if (!!errorElement) {
  errorElement.style.display = "none";
}
