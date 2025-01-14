const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    members: {
        type: Array,
        required: true
    },
   
    date: {
        type: String,
        default:''
    }
 
}, { timestamps: true });

module.exports = mongoose.model('Conversations', conversationSchema);