const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
conversation_userId: {
    type:String,
        ref: 'User',
       
    },
    messagee: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    read: {
        type: String,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
