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
    res.render('home', {
        error: false
    })
})

app.get('/forecast', async (req, res) => {
    let cityName = req.query.city
    let stateCode = getStateCodeByStateName(req.query.state)
    
    let geocodingArgs = `q=${cityName},${stateCode},US&limit=1&appid=${API_KEY}`
    let geocodingResponse = await fetch(geocodingEndpoint + geocodingArgs)
    let geocodingData = await geocodingResponse.json()

    if (geocodingData?.length === 0) {
        console.log('No such city found.')
        return res.render('home', {
            error: true,
            message: 'No such city found.'
        })
    }
    else if (geocodingData.cod) {
        console.log('No parameters specified.')
        return res.render('home', {
            error: true,
            message: 'No parameters specified.'
        })
    }

    let latitude = geocodingData[0]?.lat
    let longitude = geocodingData[0]?.lon

    let weatherArgs = `lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
    let weatherResponse = await fetch(weatherEndpoint + weatherArgs)
    let weatherData = await weatherResponse.json()

    res.render('forecast', {
        data: weatherData
    })
})

app.get('/how-it-works', (req, res) => {
    res.render('how_it_works')
})

app.get('/weekly-forecast', (req, res) => {
    /*
    const forecastEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?'
    let args = `lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`

    let forecastResponse = await fetch(forecastEndpoint + args)
    let forecastData = await forecastResponse.json()

    let days = { '1': [], '2': [], '3': [], '4': [], '5': [] }

    let position = 0
    for (let i = 0; i < data.list.length; i++) {
    if (i % 8 === 0) {
        position++
    }

    if (days[position] === undefined) {
        days[position] = []
    }
    days[position].push(forecastData.list[i])
    }
    */
    res.render('weekly')
})

app.listen(3000, () => {
    console.log('Server started on port 3000.')
})
