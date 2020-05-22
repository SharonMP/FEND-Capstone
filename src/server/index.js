const dotenv = require('dotenv');
dotenv.config();

const fetch = require("node-fetch");

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const cors = require("cors");

const app = express()
app.use(cors());
app.use(express.static('dist'))

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
let server = app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

app.post('/getTripDetails', getTripDetails);

async function getTripDetails(request, response) {
  let body = request.body;
  let city = body.city;

  let geonamesUrl = 'http://api.geonames.org/searchJSON?name_equals=' + city + '&country=US&maxRows=1&username=' + process.env.GEONAMES_USER;
  let geonamesResult;
  let lat;
  let lng;
  let geonamesResultRaw = await fetch(geonamesUrl);

  try {
    geonamesResult = await geonamesResultRaw.json();

    console.log('geonamesResult: ' + JSON.stringify(geonamesResult));
    console.log('geonamesResult.geonames: ' + JSON.stringify(geonamesResult.geonames));

    lat = geonamesResult.geonames[0].lat
    lng = geonamesResult.geonames[0].lng;
    console.log('geoNamesResult: ' + lat + ', ' + lng);

    projectData['lat'] = lat;
    projectData['lng'] = lng;

  } catch (error) {
    projectData['error'] = 'geonames';
    response.send(projectData);
    return;
  }

  console.log('lat: ' + lat + ', lng: ' + lng);
  let weatherbitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=' + lat + '&lon=' + lng + '&key=' + process.env.WEATHERBIT_APIKEY + '&units=I';
  console.log('weatherbitUrl: ' + weatherbitUrl);
  let weatherbitResult;
  let highTemp;
  let lowTemp;
  let weather;
  let weatherbitResultRaw = await fetch(weatherbitUrl);

  try {
    weatherbitResult = await weatherbitResultRaw.json();

    console.log('weatherbitResult: ' + JSON.stringify(weatherbitResult));
    console.log('weatherbitResult.data: ' + JSON.stringify(weatherbitResult.data));

    highTemp = weatherbitResult.data[0].high_temp;
    lowTemp = weatherbitResult.data[0].low_temp;
    weather = weatherbitResult.data[0].weather;

    projectData['highTemp'] = highTemp;
    projectData['lowTemp'] = lowTemp;
    projectData['weatherDescription'] = weather.description;
    projectData['weatherIcon'] = 'https://www.weatherbit.io/static/img/icons/' + weather.icon + '.png';

    console.log('weatherBit projectData: ' + JSON.stringify(projectData));
    console.log('At end of weatherbit block');
  } catch (error) {
    projectData['error'] = 'weatherbit';
    response.send(projectData);
    return;
  }

  let pixabayUrl = 'https://pixabay.com/api/?q=' + city + '&image_type=photo&category=places&safesearch=true&key=' + process.env.PIXABAY_APIKEY;
  let pixabayResult;
  let imageUrl;
  let pixabayResultRaw = await fetch(pixabayUrl);

  try {
    pixabayResult = await pixabayResultRaw.json();

    console.log('pixabayResult: ' + JSON.stringify(pixabayResult));
    console.log('pixabayResult.hits: ' + JSON.stringify(pixabayResult.hits));

    imageUrl = pixabayResult.hits[0].largeImageURL;

    projectData['imageUrl'] = imageUrl;
  } catch (error) {
    projectData['error'] = 'pixabay';
    response.send(projectData);
    return;
  }

  console.log('It\'s all good!');
  console.log('projectData: ' + JSON.stringify(projectData));
  response.send(projectData);
  return;
}

module.exports = server