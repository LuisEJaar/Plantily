const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
const mongodb = require('mongodb');
const expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

app.listen(process.env.PORT || 3000, function() {
    console.log(`listening on http://localhost:${3000}`)
})

app.use(bodyParser.urlencoded({ extended: true }))

const MongoClient = require('mongodb').MongoClient

let connectionString = "mongodb+srv://luisjaar:mPoDy1DUi6nX54G3@cluster0.se0vt.mongodb.net/?retryWrites=true&w=majority"
let dbname = 'plantly-plants-entries'
let collectionname = 'plants'

const indexRouter = require('./routes/index')

MongoClient.connect(connectionString, { useUnifiedTopology: true }) 
.then(client => {
    console.log('Connected to Database')
    const db = client.db(dbname)
    const plantsCollection = db.collection(collectionname)
    let plantsArray

    app.use('/', indexRouter)

    app.get('/newplant', (req, res) => {
      res.render( __dirname +'/views/newplant.ejs')
    })
    app.get('/progress', (req, res) => {
      res.render( __dirname +'/views/progress.ejs')
    })
    app.get('/newdiary', (req, res) => {
      db.collection(collectionname).find().toArray()
          .then(results => {
            res.render('newdiary.ejs', { plants: results })
            plantsArray = results
          })
          .catch(error => console.error(error))
    })
    
    // New plant 
    app.post('/newplant', (req, res) => {
        let isUnique = []
        plantsArray.map((object) => {
          isUnique.push(!(req.body.name === object.name))
        })
        if(isUnique.indexOf(false) === -1) {
          plantsCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
        } else {
            res.redirect('/')
        }
        console.log(isUnique.length)
    })

  // Edit Plant Page Population
    app.get('/editplant/:id', (req, res) => {
      const id = req.params.id.toLowerCase()
      db.collection(collectionname).find({ _id: new mongodb.ObjectId(id)}).toArray()
        .then(results => {
          console.log({plants: results})
          res.render('editplant.ejs', {plants: results})
        })
        .catch(error => console.error(error))
    })

    // Edit Plant Page Functionality
    app.put("/editplant", (req, res) => {
      plantsCollection.updateOne( 
          { _id: new mongodb.ObjectId(req.body.id)},
        {
          $set: {
            name: req.body.name,  
            plant_date: req.body.plant_date,
            type: req.body.type,
            height: req.body.height,
            sun_exposure: req.body.sun_exposure,
            watering_schedule: req.body.watering_schedule
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
    })

    // Diary Plant Page Population
    app.get('/plantdiary/:id', (req, res) => {
      const id = req.params.id.toLowerCase()
      db.collection(collectionname).find({ _id: new mongodb.ObjectId(id)}).toArray()
        .then(results => {
          console.log({plants: results})
          res.render('plantdiary.ejs', {plants: results})
        })
        .catch(error => console.error(error))
    })

    // Add to Diary Page Functionality
    app.put("/addToDiary", (req, res) => {
      const id = req.body.id.toLowerCase()
      plantsCollection.updateOne( 
        { _id: new mongodb.ObjectId(req.body.id)},
        {
          $push: { 
            diary: {
              date: req.body.date,
              height: req.body.plant_height,
              notes: req.body.plant_notes
            }  
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
    })

    //edit diary entry population
    app.get('/editDiary/:id/:entry', (req, res) => {
      const id = req.params.id.toLowerCase()
      const entry = req.params.entry.toLowerCase()
      db.collection(collectionname).find({ _id: new mongodb.ObjectId(id)}).toArray()
        .then(results => {
          console.log(results[0].diary[entry])
          res.render('editdiary.ejs', {diary: results[0].diary[entry], entry: entry, id: id})
        })
        .catch(error => console.error(error))
    })

    //Edit diary page functionality
    app.put("/editdiary", (req, res) => {
      plantsCollection.updateOne( 
        { _id: req.body.id},
        {
          $set: { 
            [diary[0].date]: req.body.date,
            [diary[0].height]: req.body.height,
            [diary[0].notes]: req.body.notes
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
    })

    //deletes a plant from the garden page
    app.delete("/deleteplant", (req, res) => {
      plantsCollection.deleteOne(
        { _id: new mongodb.ObjectId(req.body.id)}   
      )
      .then(result => {
        res.json(`Deleted`)
      })
      .catch(error => console.error(error))
    })
})
.catch(error => console.error(error))
