const express = require('express')
const fetch = require('node-fetch')
const states = require('us-state-codes')

const { getStateCodeByStateName } = require('us-state-codes')
const geocodingEndpoint = 'https://api.openweathermap.org/geo/1.0/direct?'
const weatherEndpoint = 'https://api.openweathermap.org/data/2.5/weather?'
const forecastEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?'
const API_KEY = '9965dce7f97fcb2a4d726496253bda5b' // <-- replace with your own key

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

const locationCoordinates = async (city, state) => {
    let stateCode = getStateCodeByStateName(state)

    let geocodingArgs = `q=${city},${stateCode},US&limit=1&appid=${API_KEY}`
    let geocodingResponse = await fetch(geocodingEndpoint + geocodingArgs)
    let geocodingData = await geocodingResponse.json()

    return geocodingData?.length === 0 ? { error: true } : {
        latitude: geocodingData[0]?.lat,
        longitude: geocodingData[0]?.lon
    }
}

app.get('/', (req, res) => {
    res.render('home', { error: false })
})

app.get('/forecast', async (req, res) => {
    let coordinates = await locationCoordinates(req.query.city, req.query.state)
    if (coordinates.error) {
        return res.render('home', {
            error: true,
            message: 'No such city found.'
        })
    }

    let { latitude, longitude } = coordinates
    let weatherArgs = `lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`

    let weatherResponse = await fetch(weatherEndpoint + weatherArgs)
    let weatherData = await weatherResponse.json()

    res.render('forecast', { data: weatherData })
})

app.get('/how-it-works', (req, res) => {
    res.render('how_it_works')
})

app.get('/weekly-forecast', async (req, res) => {
    let coordinates = await locationCoordinates(req.query.city, req.query.state)
    if (coordinates.error) {
        return res.render('home', {
            error: true,
            message: 'No such city found.'
        })
    }

    let { latitude, longitude } = coordinates;
    let args = `lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`

    let forecastResponse = await fetch(forecastEndpoint + args)
    let forecastData = await forecastResponse.json()

    let days = { '1': [], '2': [], '3': [], '4': [], '5': [] }
    let position = 0
    for (let i = 0; i < forecastData.list.length; i++) {
        if (i % 8 === 0) {
            position++
        }

        if (days[position] === undefined) {
            days[position] = []
        }
        days[position].push(forecastData.list[i])
    }

    res.render('weekly', {
        data: days,
        name : forecastData.city.name
    })
})

app.listen(3000, () => {
    console.log('Server started on port 3000.')
})
