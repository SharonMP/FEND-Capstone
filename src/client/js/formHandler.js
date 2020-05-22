// Call local server to post the results
const getGeonamesDetails = async(localUrl, cityName) => {
  const request = await fetch(localUrl, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cityName)
  });

  try {
    return await request.json();

  } catch (error) {
    markUIWithError('There was an unexpected error getting details for the trip');
  }
}

function areDatesValid(departureDate, returnDate) {
  console.log('departureDate: ' + departureDate);
  console.log('returnDate: ' + returnDate);
  console.log('departureDate.getTime() <= returnDate.getTime(): ' + (departureDate.getTime() <= returnDate.getTime()));
  return departureDate.getTime() <= returnDate.getTime();
}

function displayErrorMessage(message) {
  document.getElementById('error').innerHTML = message;
  document.getElementById('error-section').style.display = "block";
}
function markUIWithError() {
  const red = 'red';
  const departureElement = document.getElementById('departure');
  departureElement.style.backgroundColor = red;
  const returnElement = document.getElementById('return');
  returnElement.style.backgroundColor = red;
}

async function handleSubmit(event) {
  event.preventDefault();

  let destination = document.getElementById("destination").value;
  let finalizedDestination = destination.toLowerCase().split(" ").join("+");

  let departureDateRaw = document.getElementById("departure").value;
  let returnDateRaw = document.getElementById("return").value;
  let departureDate = new Date(departureDateRaw);
  let daysTillTrip = (departureDate - new Date()) / (1000 * 60 * 60 * 24); // convert to days
  let returnDate = new Date(returnDateRaw);
  let numberDaysInTrip = (returnDate - departureDate) / (1000 * 60 * 60 * 24); // convert to days

  let datesAreValid = areDatesValid(departureDate, returnDate);

  if (!datesAreValid) {
    markUIWithError();
    displayErrorMessage('Departure date should be earlier than return date');
    return;
  }

  let tripResult = await getGeonamesDetails('http://localhost:8081/getTripDetails', {'city':finalizedDestination});

  console.log('tripResult.error: ' + tripResult.error);
  if (typeof tripResult.error !== 'undefined') {
    var errorMessage = '';

    if (tripResult.error === 'geonames') {
      errorMessage = 'Could not find the destination. Please ensure city is in US.';
    } else if (tripResult.error === 'weatherbit') {
      errorMessage = 'There was an issue getting weather information of the destination city. Please try again after some time.';
    } else if (tripResult.error === 'pixabay') {
      errorMessage = 'There was an issue getting images of the destination city. Please try again after some time.';
    } else {
      errorMessage = 'There was an issue getting details for your trip. Please try again after some time.';
    }
    displayErrorMessage(errorMessage);
    return;
  }

  console.log('Passed the error handling block');

  let resultingMessage =
  'You have an upcoming trip of ' + numberDaysInTrip + ' day(s) to ' + destination + '<br/>'
  + 'Departure date is ' + departureDateRaw + '<br/>'
  + 'Return date is ' + returnDateRaw + '<br/>'
  + 'Trip is ' + daysTillTrip.toFixed(2) + ' day(s) away <br/>'
  + 'The typical weather there is High: ' + tripResult.highTemp + ' &#8457;, Low: ' + tripResult.lowTemp + ' &#8457; <br/>'
  + 'Mostly <img src="' + tripResult.weatherIcon + '" alt ="' + tripResult.weatherDescription
  + '" height="25" width="25"> (' + tripResult.weatherDescription.toLowerCase() + ') throughout the day<br/>'
  ;

  document.getElementById('form-section').style.display = "none";

  let imageElement = document.getElementById('results-img');
  imageElement.src = tripResult.imageUrl;
  imageElement.height = "250";
  imageElement.width = "250";
  imageElement.alt = "image of " + destination;

  document.getElementById('results').innerHTML = resultingMessage;
  document.getElementById('results-section').style.display = "block";
}

export { handleSubmit, areDatesValid }
