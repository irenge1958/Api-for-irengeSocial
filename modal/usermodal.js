const mongoose=require('mongoose')
const userScheme=mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:30,
        unique:true
    },
    email:{
        type:String,
        required:true,
        min:3,
        max:30,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
    city:{
        type:String,
        default:''
    },
    from:{
        type:String,
        default:''
    },
    relationship:{
        type:String,
        default:''
    },
    school:{
        type:String,
        default:''
    },
    followings:{
        type:Array,
        default:[]
    },
    followers:{
        type:Array,
        default:[]
    },
    profilepicture:{
     type:String,
     default:""
    },
    coverpicture:{
        type:String,
        default:""
       },
       isadmin:{
        type:Boolean,
        default:false
       },
       notifications: [{
        type: Array,
        ref: 'Notification'
    }]
},
{timestamps:true}
)
module.exports=mongoose.model('users',userScheme)