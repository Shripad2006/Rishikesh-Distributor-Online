const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: String,
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model('Comments', commentsSchema);
