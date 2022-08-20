const express = require('express')
const router = express.Router()
const Area = require('../models/area')
const Plant = require('../models/plant')
const {ensureAuth, ensureGuest} = require('../middleware/auth')

//All areas Route
router.get('/', ensureAuth, async (req,res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    } 
    try {
        const areas = await Area.find(searchOptions)
        res.render('areas/index', {
            areas: areas, 
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//Show new area form Route
router.get('/new', ensureAuth, (req,res) => {
    res.render('areas/new', {area: new Area()})
})

//Create New Area route
router.post('/', ensureAuth, async (req,res) => {
    const area = new Area({
        name: req.body.name
    })
    try {
        const newArea = await area.save()
        res.redirect(`areas/${newArea.id}`)
    } catch { 
        res.render('areas/new', {
            area: area,
            errorMessage: 'Error Creating Area'
        })
    }
})

//Individual Area Page
router.get('/:id', ensureAuth, async (req,res)=> {
    try {
        const area = await Area.findById(req.params.id)
        const plants = await Plant.find({area: area.id}).limit(6).exec()
        res.render('areas/show', {
            area: area,
            plantsByArea: plants
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

//Edit Area Page
router.get('/:id/edit', ensureAuth, async (req, res)=> {
    try {
        const area = await Area.findById(req.params.id)
        res.render('areas/edit', {area: area})
    } catch {
        res.redirect('/areas')
    }
})

//Update Area Page
router.put('/:id', ensureAuth, async (req,res)=> {
    let area
    try {
        area = await Area.findById(req.params.id)
        area.name = req.body.name
        await area.save()
        res.redirect(`/areas/${area.id}`)
    } catch { 
        if(area == null){
            res.redirect('/')
        } else {
            res.render('/areas/edit', {
                area: area,
                errorMessage: 'Error Updating Area'
            })
        }
    }
})

router.delete('/:id', ensureAuth, async (req, res)=>{
    let area
    try {
        area = await Area.findById(req.params.id)
        await area.remove()
        res.redirect(`/areas`)
    } catch { 
        if(area == null){
            res.redirect('/')
        } else {
            res.redirect(`/areas/${area.id}`)
        }
    }
})

module.exports = router