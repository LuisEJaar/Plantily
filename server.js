if(process.env.NODE_ENV != 'production'){
  require("dotenv")
}

const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'});

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("connected"))

app.use('/', indexRouter)

app.listen(process.env.PORT || 3000, function() {
  console.log(`listening on http://localhost:${3000}`)
})

// let connectionString = "mongodb+srv://luisjaar:mPoDy1DUi6nX54G3@cluster0.se0vt.mongodb.net/?retryWrites=true&w=majority"
// let dbname = 'plantly-plants-entries'
// let collectionname = 'plants'