const express = require('express')
const router = express.Router()
const Plant = require('../models/plant')
const Area = require('../models/area')
const Diary = require('../models/diary')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//Create New diary route
router.post('/', async (req,res) => {
    const diary = new Diary ({
        diaryTitle: req.body.diaryTitle,
        diaryText: req.body.diaryText,
        diaryDate: req.body.diaryDate,
        height: req.body.height, 
        waterInt: req.body.waterInt,
        sun: req.body.sun,
        potSize: req.body.potSize,
        pestStatus: req.body.pestStatus,
        repotted: req.body.repotted,
        fertilized: req.body.fertilized,
        pestsTreated: req.body.pestsTreated,
        trauma: req.body.trauma,
        plant: req.body.plant, 
        heightChange: req.body.heightChange,
        sunChange: req.body.sunChange,
        waterAmtChange: req.body.waterAmtChange,
        waterIntChange: req.body.waterIntChange, 
        potSizeChange: req.body.potSizeChange,
        pestsSighted: req.body.pestsSighted
    })
    if(req.body.cover) saveCover(diary, req.body.cover)
    try{
        await diary.save()
        res.redirect('back')
    } catch (err) {
        console.log(err)
        res.redirect('back')
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

 //Update diary route
 router.put('/:id', async (req,res) => {
    let plant
    try{
        plant = await Plant.findById(req.params.id)
        plant.plantName = req.body.plantName
        plant.area = req.body.area
        plant.plantedDate = new Date(req.body.plantedDate.split("T")[0])
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

//Delete diary route
router.delete('/:id', async (req, res) => {
    let diary
    try {
        diary = await Diary.findById(req.params.id)
        await diary.remove()
        res.redirect('back')
    } catch {
        res.redirect('back')
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

function saveCover(diary, coverEncoded){
    if(coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        diary.coverImage = new Buffer.from(cover.data, 'base64')
        diary.coverImageType = cover.type
    }
}


module.exports = router