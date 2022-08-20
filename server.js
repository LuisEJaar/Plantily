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
const diaryRouter = require('./routes/diaries')
const authRouter = require('./routes/auth')
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

//What we're using for passwords
const passport = require('passport')
// Needed for passport to work
const session = require('express-session')

//For letting your session continue *must be below  session*
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const dotenv = require('dotenv')
const morgan = require('morgan')
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))

// Load config
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

//Lets us parse our requests url
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

//Logging in dev mode (morgan)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Sessions *Must be above passport middleware*
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // lets you store your session
    store: new MongoStore({mongooseConnection: mongoose.connection}) 
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

app.use('/', indexRouter)
app.use('/areas', areaRouter)
app.use('/plants', plantRouter)
app.use('/diaries', diaryRouter)
app.use('/auth', authRouter)

app.listen(process.env.PORT || 3000, function() {
    console.log(`listening on http://localhost:${3000}`)
})