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
let location = '/plants'

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
      db.collection(collectionname).find().toArray()
        .then(results => {
          res.render('newplant.ejs')
        })
        .catch(error => console.error(error))
    })
    app.get('/progress', (req, res) => {
      db.collection(collectionname).find().toArray()
        .then(results => {
          res.render('progress.ejs')
        })
        .catch(error => console.error(error))
    })

    // Edit Plant Page Population
    app.get('/editplant', (req, res) => {
      db.collection(collectionname).find().toArray()
        .then(results => {
          res.render('editplant.ejs', { plants: results})
        })
        .catch(error => console.error(error))
    })

    // Edit Plant Page Population
    // app.get('/editplant', (req, res) => {
    //   const mongoId = req.params.mongoid.toLowerCase() 
    //   db.collection(collectionname).find().toArray()
    //     .then(results => {
    //       res.render('editplant.ejs', {id: mongoId})
    //     })
    //     .catch(error => console.error(error))
    // })

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
      plantsCollection.updateOne({ 
          id: req.body._id
        },
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
        console.log(result)
       })
      .catch(error => console.error(error))
    })

    app.delete("/deleteplant", (req, res) => {
      console.log(req.body.id)
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
