const express = require('express')
const router = express.Router()
const Plant = require('../models/plant')
const Area = require('../models/area')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//Show all plants Route
router.get('/', async (req,res) => {
    let query = Plant.find()
    if(req.query.plantName != null && req.query.plantName != ''){
        query = query.regex('plantName', new RegExp(req.query.plantName, 'i'))
    }
    if(req.query.plantedBefore != null && req.query.plantedBefore != ''){
        query = query.lte('plantedDate', req.query.plantedBefore)
    }
    if(req.query.plantedAfter != null && req.query.plantedAfter != ''){
        query = query.gte('plantedDate', req.query.plantedAfter)
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
        plantName: req.body.plantName,
        area: req.body.area,
        plantedDate: new Date(req.body.plantedDate), 
        height: req.body.height,
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
        plant = await Plant.findById(req.params.id)
        plant.plantName = req.body.plantName
        plant.area = req.body.area
        plant.plantedDate = new Date(req.body.plantedDate)
        plant.height = req.body.height
        plant.description = req.body.description
        if(req.body.cover != null && req.body.cover !== ""){
            saveCover(plant, req.body.cover)
        }
        await plant.save()
        res.redirect(`/plants/${plant.id}`)
    } catch (err){
        console.log(err)
        if (plant != null) {
            renderEditPage(res, plant, true)
        } else {
            res.redirect('/')
        }
    }
})

//Delete plant page route
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