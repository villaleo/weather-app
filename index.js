const express = require('express')
const { getStateCodeByStateName } = require('us-state-codes')
const fetch = require('node-fetch')
const states = require('us-state-codes')
const geocodingEndpoint = 'http://api.openweathermap.org/geo/1.0/direct?'
const weatherEndpoint = 'https://api.openweathermap.org/data/2.5/weather?'
const API_KEY = '9965dce7f97fcb2a4d726496253bda5b' // <-- replace with your own key

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/forecast', async (req, res) => {
    let cityName = req.query.city
    let stateCode = getStateCodeByStateName(req.query.state)
    
    let geocodingArgs = `q=${cityName},${stateCode},US&limit=1&appid=${API_KEY}`
    let geocodingResponse = await fetch(geocodingEndpoint + geocodingArgs)
    let geocodingData = await geocodingResponse.json()

    if (geocodingData?.length === 0) {
        console.log('No such city found.')
        return res.render('home')
    }
    else if (geocodingData.cod) {
        console.log('No parameters specified.')
        return res.render('home')
    }

    let latitude = geocodingData[0]?.lat
    let longitude = geocodingData[0]?.lon

    let weatherArgs = `lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    let weatherResponse = await fetch(weatherEndpoint + weatherArgs)
    let weatherData = await weatherResponse.json()

    console.log(weatherData)

    res.render('forecast', {
        data: weatherData
    })
})

app.get('/how-it-works', (req, res) => {
    res.render('how_it_works')
})

app.get('/four-day-forecast', (req, res) => {
    res.render('four_day_forecast')
})

app.listen(3000, () => {
    console.log('Server started on port 3000.')
})
