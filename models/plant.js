const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
    plantName: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: false
    }, 
    plantedDate: {
        type: Date,
        required: true
    }, 
    type: {
        type: String,
        required: false
    },
    height: {
        type: Number,
        required: false
    },
    waterInt: {
        type: Number,
        required: false
    },
    waterAmt: {
        type: Number,
        required: false
    },
    sun: {
        type: String,
        required: false
    },
    potSize: {
        type: Number,
        required: false
    },
    pestStatus: {
        type: String,
        required: false
    },
    // Image stuff
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }, 
    coverImage: {
        type: Buffer,
        required: true
    }, 
    coverImageType: {
        type: String,
        required: true
    },
    //Tying the plant entry to the area
    area: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Area'
    }, 
    // Tying to a user: 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

plantSchema.virtual('coverImagePath').get(function () {
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Plant', plantSchema)