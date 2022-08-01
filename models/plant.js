const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
    plantName: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
    }, 
    plantedDate: {
        type: Date,
        required: true
    }, 
    height: {
        type: Number,
        required: true
    },
    // waterInt: {
    //     type: Number,
    //     required: true
    // },
    // sun: {
    //     type: String,
    //     required: true
    // },
    // potSize: {
    //     type: Number,
    //     required: true
    // },
    // pestStatus: {
    //     type: Boolean,
    //     required: true
    // },
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
    area: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Area'
    }
})

plantSchema.virtual('coverImagePath').get(function () {
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Plant', plantSchema)