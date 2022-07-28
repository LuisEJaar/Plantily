if(process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv')
    dotenv.config({path:__dirname+'/.env'});
}

const express = require("express")
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const areaRouter = require('./routes/areas')
const plantRouter = require('./routes/plants')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.set('view engine', 'ejs')
const path = require('path')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))

app.use('/', indexRouter)
app.use('/areas', areaRouter)
app.use('/plants', plantRouter)

app.listen(process.env.PORT || 3000, function() {
    console.log(`listening on http://localhost:${3000}`)
})