const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    db.collection(collectionname).find().toArray()
      .then(results => {
        res.render('index.ejs', { plants: results })
        plantsArray = results
      })
      .catch(error => console.error(error))
})

module.exports = router