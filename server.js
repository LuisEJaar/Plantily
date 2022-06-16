const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

const connectionString = "mongodb+srv://luisjaar:mPoDy1DUi6nX54G3@cluster0.se0vt.mongodb.net/?retryWrites=true&w=majority"

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        const db = client.db('plantly-plants-entries')
        const myGarden = db.collection('plants')

        app.post("/plants", (req,res)=> {
            myGarden.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        // app.use()
        app.get('/', (req, res) => {
            // db.collection('plants').find().toArray()
            //   .then(results => {
            //     console.log(results)
            //   })
            //   .catch(error => console.error(error))
            const cursor = db.collection('plants').find()
            console.log(cursor)
            console.log("get not working")
          })
        // app.listen()
    })
    .catch(error => console.error(error))

const PORT = 3000

app.listen(process.env.PORT || PORT, function () {
    console.log('listening on 3000')
})

