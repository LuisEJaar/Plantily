const mongoose = require('mongoose')

const diarySchema = new mongoose.Schema({ 
    diaryTitle: {
        type: String,
        required: true
    }, 
    diaryText: {
        type: String,
        required: false
    }, 
    diaryDate: {
        type: Date,
        required: true
    }, 
    height: {
        type: Date,
        required: false
    }, 
    // Descriptive (string)
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
        type: Boolean,
        required: false
    },
    // Events (bool)
    repotted: {
        type: Number,
        required: false
    },
    fertilized: {
        type: Boolean,
        required: false
    },
    pestTreated: {
        type: String,
        required: false
    }, 
    trauma: {
        type: String,
        required: false
    },
    
    // Image stuff 
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    coverImage: {
        type: Buffer,
    }, 
    coverImageType: {
        type: String,
    },
    //Tying the diary entry to the plant
    plant: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Plant'
    }
})

diarySchema.virtual('coverImagePath').get(function () {
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Diary', diarySchema)