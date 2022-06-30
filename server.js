const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
const mongodb = require('mongodb');

const PORT = 3000

app.listen(process.env.PORT || PORT, function() {
    console.log(`listening on http://localhost:${PORT}`)
})

app.use(bodyParser.urlencoded({ extended: true }))

const MongoClient = require('mongodb').MongoClient

let connectionString = "mongodb+srv://luisjaar:mPoDy1DUi6nX54G3@cluster0.se0vt.mongodb.net/?retryWrites=true&w=majority"
let dbname = 'plantly-plants-entries'
let collectionname = 'plants'

MongoClient.connect(connectionString, { useUnifiedTopology: true }) 
.then(client => {
    console.log('Connected to Database')
    const db = client.db(dbname)
    const plantsCollection = db.collection(collectionname)
    let plantsArray
    app.set('view engine', 'ejs')
    app.get('/', (req, res) => {
        db.collection(collectionname).find().toArray()
          .then(results => {
            res.render('index.ejs', { plants: results })
            plantsArray = results
          })
          .catch(error => console.error(error))
    })
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

    app.put("/editplant", (req, res) => {
      plantsCollection.updateOne( 
          { _id: new mongodb.ObjectId(req.body.id)},
        {
          $push: { 
            diary: {
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
