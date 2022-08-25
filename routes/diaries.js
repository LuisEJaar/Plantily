const express = require('express')
const router = express.Router()
const Plant = require('../models/plant')
const Area = require('../models/area')
const Diary = require('../models/diary')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const {ensureAuth} = require('../middleware/auth')

//Create New diary route
router.post('/', ensureAuth,  async (req,res) => {
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
        pestsSighted: req.body.pestsSighted, 
        user: req.user.id
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


// Edit plant diary page route
router.get('/:plantid/:diaryid/edit', ensureAuth,  async (req,res) => {
    try {
        const plant = await Plant.findById(req.params.plantid)
        const diary = await Diary.findById(req.params.diaryid)
        const areas = await Area.find({})
        const params = {
            areas: areas,
            plant: plant, 
            diary: diary
        }
        res.render(`diaries/edit`, params)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
 })

 //Update diary route 
 router.put('/:id', ensureAuth,  async (req,res) => {
    let diary
    try{
        diary = await Diary.findById(req.params.id)
        diary.diaryTitle = req.body.diaryTitle,
        diary.diaryText = req.body.diaryText,
        diary.diaryDate = req.body.diaryDate,
        diary.height = req.body.height, 
        diary.waterInt = req.body.waterInt,
        diary.sun = req.body.sun,
        diary.potSize = req.body.potSize,
        diary.pestStatus = req.body.pestStatus,
        diary.repotted = req.body.repotted,
        diary.fertilized = req.body.fertilized,
        diary.pestsTreated = req.body.pestsTreated,
        diary.trauma = req.body.trauma,
        diary.plant = req.body.plant, 
        diary.heightChange = req.body.heightChange,
        diary.sunChange = req.body.sunChange,
        diary.waterAmtChange = req.body.waterAmtChange,
        diary.waterIntChange = req.body.waterIntChange, 
        diary.potSizeChange = req.body.potSizeChange,
        diary.pestsSighted = req.body.pestsSighted, 
        diary.user = req.user.id
        if(req.body.cover != null && req.body.cover !== ""){
            saveCover(diary, req.body.cover)
        }
        await diary.save()
        res.redirect(`/plants/${diary.plant}`)
    } catch (err){
        res.redirect('back')
    }
})

//Delete diary route
router.delete('/:id', ensureAuth,  async (req, res) => {
    let diary
    try {
        diary = await Diary.findById(req.params.id)
        await diary.remove()
        res.redirect('back')
    } catch {
        res.redirect('back')
    }
})

function saveCover(diary, coverEncoded){
    if(coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        diary.coverImage = new Buffer.from(cover.data, 'base64')
        diary.coverImageType = cover.type
    }
}


module.exports = router