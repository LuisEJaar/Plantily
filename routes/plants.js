const express = require('express')
const router = express.Router()
const Plant = require('../models/plant')
const Area = require('../models/area')
const Diary = require('../models/diary')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const {ensureAuth} = require('../middleware/auth')

//Show all plants Route
router.get('/', ensureAuth, async (req,res) => {
    let query = Plant.find({user: req.user.id})
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
router.get('/new', ensureAuth, async (req,res) => {
   renderNewPage(res, new Plant())
})

//Create New plant route
router.post('/', async (req,res) => {
    const plant = new Plant ({
        plantName: req.body.plantName,
        area: req.body.area,
        plantedDate: new Date(req.body.plantedDate), 
        type: req.body.type,
        height: req.body.height,
        sun: req.body.sun,
        potSize: req.body.potSize,
        waterInt: req.body.waterInt,
        waterAmt: req.body.waterAmt,
        pestStatus: req.body.pestStatus,
        description: req.body.description, 
        user: req.user.id
    })
    if(req.body.cover != null && req.body.cover !== ""){
        saveCover(plant, req.body.cover)
    }
    try{
        const newPlant  = await plant.save()
        res.redirect(`plants/${newPlant.id}`)
    } catch (err){
        console.log(err)
        renderNewPage(res, plant, true)
    }
})

//Show Individual plant page route
router.get('/:id', ensureAuth, async (req,res) => {
    try {
        const plant = await Plant.findById(req.params.id)
                                    .populate('area')
                                    .exec()
        const diaries = await Diary.find({plant: plant.id}).exec()
            res.render('plants/show', {
            plant: plant,
            diariesByPlant: diaries
        })
    } catch (err){
        console.log(err)
        res.redirect('/')
    }
})

// Edit plant page route
router.get('/:id/edit', ensureAuth, async (req,res) => {
    try {
        const plant = await Plant.findById(req.params.id)
        renderEditPage(res, plant)
    } catch {
        res.redirect('/')
    }
 })

 //Update plant route
 router.put('/:id', ensureAuth, async (req,res) => {
    let plant
    try{
        plant = await Plant.findById(req.params.id)
        plant.plantName = req.body.plantName,
        plant.area= req.body.area,
        plant.plantedDate= new Date(req.body.plantedDate), 
        plant.type= req.body.type,
        plant.height= req.body.height,
        plant.sun= req.body.sun,
        plant.potSize= req.body.potSize,
        plant.waterInt= req.body.waterInt,
        plant.waterAmt= req.body.waterAmt,
        plant.pestStatus= req.body.pestStatus,
        plant.description= req.body.description
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
router.delete('/:id', ensureAuth, async (req, res) => {
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