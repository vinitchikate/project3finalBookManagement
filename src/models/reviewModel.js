const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: "book"
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
    },
    reviewedAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    rating: {
        type: Number,
        min: [1, "rating should be greater than 1"],
        max: [5, "rating should be less than 5"],
        required: true
    },
    review: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model('review', reviewSchema)
