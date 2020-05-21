import { handleSubmit } from './js/formHandler'

import './styles/base.scss'
import './styles/cards.scss'
import './styles/header.scss'
import './styles/section.scss'

document.getElementById('results-section').style.display = "none";
document.getElementById('error-section').style.display = "none";
// Using event listener per mentor advice at https://knowledge.udacity.com/questions/82043
// Accepts both keypress and button clicks.
const form = document.getElementById('form');
if (!!form) {
  form.addEventListener('submit', handleSubmit);
}
