const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
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
