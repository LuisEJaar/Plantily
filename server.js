const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient



MongoClient.connect("mongodb+srv://luisjaar:mPoDy1DUi6nX54G3@cluster0.se0vt.mongodb.net/?retryWrites=true&w=majority", { useUnifiedTopology: true })
    .then(client => {
    console.log('Connected to Database')
    })
    .catch(error => console.error(error))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
    res.sendFile(__dirname + '/styles/normalize.css')
    res.sendFile(__dirname + '/styles/style.css')
})

app.post("/plants", (req,res)=> {
    console.log("plants page")
    console.log(req.body)
})

const PORT = 3000

app.listen(process.env.PORT || PORT, function () {
    console.log('listening on 3000')
})

