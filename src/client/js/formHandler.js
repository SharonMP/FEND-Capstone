const formInputValidationReasonCode = {
    EMPTY: 'empty',
    URL_PARSE_ERROR: 'url_parse_error',
    OK: 'ok',
}

function validateFormInput(url) {
  // Pattern: http|https:www.example.com
  const pattern = new RegExp('^https?:\/\/[a-zA-Z0-9-]+.[a-zA-Z0-9-]+.?[a-zA-Z0-9-]*[\/*[a-zA-Z0-9-]*\/*]*$');

  if (url.length <= 0) {
    return formInputValidationReasonCode.EMPTY;
  }

  const isUrlPatternMatched = pattern.test(url);
  if(!isUrlPatternMatched) {
    return formInputValidationReasonCode.URL_PARSE_ERROR;
  }

  return formInputValidationReasonCode.OK;
}

// Call local server to post the results
const getSummary = async(localUrl, apiUrl) => {
  const request = await fetch(localUrl, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(apiUrl)
  });

  try {
    const response = await request.json();

    return response;
  } catch(error) {
    markUIWithError('There was an unexpected error with summarizing the text');
  }
}

// Call local server to post the results
const postData = async(url, data) => {

  if (data === "ERROR") {
    return "ERROR";
  }
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  try {
    const response = await response.json();

    return response;
  } catch(error) {
    console.log("Error in postData: ", error);
  }
}

// Call local server to get the results and render on page
const updateUI = async(data) => {
  try {

    if (data === "ERROR") {
      markUIWithError('There was an unexpected error with summarizing the text');
      return;
    }
    const request = await fetch('http://localhost:8081/all');
    const response = await request.json();

    if (typeof(response) !== 'undefined') {
      updateInputBackgroundColor("");
      document.getElementById('results').innerHTML = 'Polarity:' + response.polarity
      + '<br/>' +  'Subjectivity: ' + response.subjectivity
      + '<br/>' + 'Text: ' + response.text;
    } else {
      markUIWithError('There was an unexpected error with summarizing the text');
      return;
    }
  } catch(error) {
    console.log("Error in updateUI: ", error);
    markUIWithError('There was an unexpected error with summarizing the text');
    return;
  }
}

function updateInputBackgroundColor(color) {
  const inputElement = document.getElementById('name');
  inputElement.style.backgroundColor = color;
}

function markUIWithError(message) {
  updateInputBackgroundColor('red');
  document.getElementById('results').innerHTML = message;
}

// Button handler that chains a series of Promises (async calls) using `then`
function handleSubmit(event) {
  event.preventDefault();
  const inputElement =  document.getElementById('name');
  const url = inputElement.value;

  const validationResult = validateFormInput(url);
  if (validationResult === formInputValidationReasonCode.URL_PARSE_ERROR) {
    markUIWithError('URL is not valid');
  } else if (validationResult === formInputValidationReasonCode.EMPTY) {
    markUIWithError('Blank URL is not allowed');
  } else {
    getSummary('http://localhost:8081/sentiment', {url: url})
    .then(function(data) {
      if (typeof(data) !== 'undefined') {
        postData('http://localhost:8081/add', {polarity: data.polarity, subjectivity: data.subjectivity, text: data.text});
      } else {
        markUIWithError('There was an unexpected error with summarizing the text');
        return "ERROR";
      }
    })
    .then(function(data) {
      return updateUI(data);
    });
  }
}

export { handleSubmit, validateFormInput }
