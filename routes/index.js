const express = require('express')
const router = express.Router()
const Plant = require('../models/plant')
const {ensureGuest} = require('../middleware/auth')

router.get('/', async (req,res) => {
    let plants = {}
    try {
        plants = await Plant.find().sort({createAt: 'desc'}).limit(10).exec()
    } catch {
        plants = []
    }
    console.log(req.user)
    res.render('index', {
        plants: plants,
        user: req.user
    })
})

router.get('/login', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login'
    })
  })

module.exports = router