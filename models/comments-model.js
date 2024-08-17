const mongoose = require('mongoose');

// Define the Reply schema
const replySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    content: String,
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

// Update the Comment schema to include replies
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
    ],
    replies: [replySchema]  // Add the replies field as an array of replySchema
});

module.exports = mongoose.model('Comments', commentsSchema);
