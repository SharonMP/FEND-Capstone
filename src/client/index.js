import { handleSubmit } from './js/formHandler'

import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/resets.scss'

// Using event listener per mentor advice at https://knowledge.udacity.com/questions/82043
// Accepts both keypress and button clicks.
const form = document.getElementById('form');
if (!!form) {
  form.addEventListener('submit', handleSubmit);
}
