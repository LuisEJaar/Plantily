const mongoose = require('mongoose')
const Plant = require('./plant')

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    // Tying to a user: 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

//allows us to run method before an action is taken
areaSchema.pre('remove', function(next) {
    //refers to the plants
    Plant.find({area: this.id}, (err, plants) => {
        // passes the error along
        if(err){
            next(err)
            // if there are plants then don't delete area
        } else if (plants.length > 0) {
            next(new Error('This area has plants still'))
        } else {
            next()
        }
    })
})
module.exports = mongoose.model('Area', areaSchema)