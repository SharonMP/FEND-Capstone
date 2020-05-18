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

  let tripResult = await getGeonamesDetails('http://localhost:8081/getTripDetails', {'city':finalizedDestination});

  let resultingMessage = 'You have an upcoming trip of ' + numberDaysInTrip + ' day(s) to ' + destination + '<br/>'
  + 'Departure date is ' + departureDateRaw + '<br/>'
  + 'Return date is ' + returnDateRaw + '<br/>'
  + 'Trip is in ' + daysTillTrip.toFixed(2) + ' day(s) <br/>'
  + 'Few details for the trip: <br/>'
  + 'The current temperature of destination is ' + tripResult.temp + '<br/>'
  + 'An image from the destination <br/>'
  + '<img src=\"' + tripResult.imageUrl + '\" alt="image of ' + destination + '" height="100" width="100"/>';

  document.getElementById('results').innerHTML = resultingMessage;
}

export { handleSubmit }
