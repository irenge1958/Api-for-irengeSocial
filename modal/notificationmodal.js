const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
   
    link: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    profilepicture:{
        type: String,
        default:''
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
