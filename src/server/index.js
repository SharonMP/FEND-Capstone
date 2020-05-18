const dotenv = require('dotenv');
dotenv.config();

fetch = require("node-fetch");

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
  let geonamesResult = await (await fetch(geonamesUrl)).json();

  let lat = geonamesResult.geonames[0].lat
  let lng = geonamesResult.geonames[0].lng;
  console.log('geoNamesResult: ' + lat + ', ' + lng);

  projectData['lat'] = lat;
  projectData['lng'] = lng;

  let weatherbitUrl = 'https://api.weatherbit.io/v2.0/current?lat=' + lat + '&lon=' + lng + '&key=' + process.env.WEATHERBIT_APIKEY;
  let weatherbitResult = await (await fetch(weatherbitUrl)).json();

  let temp = weatherbitResult.data[0].temp;
  console.log('weatherbitResult: ' + temp);

  projectData['temp'] = temp;

  let pixabayUrl = 'https://pixabay.com/api/?q=' + city + '&image_type=photo&category=places&safesearch=true&key=' + process.env.PIXABAY_APIKEY;
  let pixabayResult = await (await fetch(pixabayUrl)).json();

  let imageUrl = pixabayResult.hits[0].largeImageURL;
  console.log('pixabayResult: ' + imageUrl);

  projectData['imageUrl'] = imageUrl;

  response.send(projectData);
}

module.exports = server