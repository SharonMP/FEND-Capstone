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

  } catch(error) {
    markUIWithError('There was an unexpected error getting details for the trip');
  }
}

function areDatesValid(departureDate, returnDate) {
  console.log('departureDate: ' + departureDate);
  console.log('returnDate: ' + returnDate);
  console.log('departureDate.getTime() <= returnDate.getTime(): ' + (departureDate.getTime() <= returnDate.getTime()));
  return departureDate.getTime() <= returnDate.getTime();
}

function markUIWithError(message) {
  const red = 'red';
  const departureElement = document.getElementById('departure');
  departureElement.style.backgroundColor = red;
  const returnElement = document.getElementById('return');
  returnElement.style.backgroundColor = red;
  document.getElementById('error').innerHTML = message;
  document.getElementById('error-section').style.display = "block";
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
    markUIWithError('Departure date should be earlier than return date');
    return;
  }


  let tripResult = await getGeonamesDetails('http://localhost:8081/getTripDetails', {'city':finalizedDestination});

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

export { handleSubmit }
