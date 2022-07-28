const express = require('express')
const router = express.Router()
const Plant = require('../models/plant')
const Area = require('../models/area')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//Show all plants Route
router.get('/', async (req,res) => {
    let query = Plant.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const plants = await query.exec()
        res.render('plants/index', {
            plants: plants,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//Show new plant form / page Route
router.get('/new', async (req,res) => {
   renderNewPage(res, new Plant())
})

//Create New plant route
router.post('/', async (req,res) => {
    const plant = new Plant ({
        title: req.body.title,
        area: req.body.area,
        publishDate: new Date(req.body.publishDate), 
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(plant, req.body.cover)
    try{
        const newPlant  = await plant.save()
        res.redirect(`plants/${newPlant.id}`)
    } catch {
        renderNewPage(res, plant, true)
    }
})

//Show Individual plant page route
router.get('/:id', async (req,res) => {
    try {
        const plant = await Plant.findById(req.params.id)
                                    .populate('area')
                                    .exec()
        res.render('plants/show', {plant: plant})
    } catch {
        res.redirect('/')
    }
})

// Edit plant page route
router.get('/:id/edit', async (req,res) => {
    try {
        const plant = await Plant.findById(req.params.id)
        renderEditPage(res, plant)
    } catch {
        res.redirect('/')
    }
 })

 //Update plant route
 router.put('/:id', async (req,res) => {
    let plant
    try{
        plant = Plant.findById(req.params.id)
        plant.title = req.body.title
        plant.area = req.body.area
        plant.publishDate = req.body.publishDate
        plant.pageCount = req.body.pageCount
        plant.description = req.body.description
        if(req.body.cover != null && req.body.cover !== ""){
            saveCover(plant, req.body.cover)
        }
        await plant.save()
        res.redirect(`plants/${newPlant.id}`)
    } catch {
        if (plant != null) {
            renderEditPage(res, plant, true)
        } else {
            res.redirect('/')
        }
    }
})

//Delete plant route
router.delete('/:id', async (req, res) => {
    let plant
    try {
        plant = await Plant.findById(req.params.id)
        await plant.remove()
        res.redirect('/plants')
    } catch {
        if (plant != null){
            res.render('plants/show', {
                plant: plant,
                errorMessage: 'Could not remove plant'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage (res, plant, hasError = false) {
    renderFormPage(res, plant, 'new', hasError)
}

async function renderEditPage (res, plant, hasError = false) {
   renderFormPage(res, plant, 'edit', hasError)
}

async function renderFormPage (res, plant, form, hasError = false) {
    try {
        const areas = await Area.find({})
        const params = {
            areas: areas,
            plant: plant
        }
        if(hasError) {
            if (form === 'edit') {
                params.errorMessage = `Error Updating Plant`
            } else {
                params.errorMessage = `Error Creating Plant`
            }
        }
        res.render(`plants/${form}`, params)
    } catch {
        res.redirect('/plants')
    }
}

function saveCover(plant, coverEncoded){
    if(coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        plant.coverImage = new Buffer.from(cover.data, 'base64')
        plant.coverImageType = cover.type
    }
}


module.exports = router