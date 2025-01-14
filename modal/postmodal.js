const mongoose=require('mongoose')
const postScheme=mongoose.Schema({
   user_id:{
    type:String,
    requires:true
   },
   comments:{
    type:Array,
    default:[]
},
    likes:{
        type:Array,
        default:[]
    },
    postpicture:{
     type:String,
     default:""
    },
    Desc:{
        type:String,
        default:""
       },
       link:{
        type:String,
        default:''
       }
      
},
{timestamps:true}
)
module.exports=mongoose.model('post',postScheme)