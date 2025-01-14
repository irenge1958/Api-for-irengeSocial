const route=require("express").Router()
const user=require("../modal/usermodal")
const message=require("../modal/message")
const Conversations=require("../modal/conversation")
route.post('/message/:converstaionid', async (req, res) => {
    try {
        const myreq=(req.params.converstaionid)
        const dates= new Date()
        if(myreq!=='0'){
            const messages = await message.create({
                conversation_userId:myreq,
                messagee:req.body.message,
                sender:req.body.senderid
            });
            
            await messages.save();
            await Conversations.updateOne({ _id:myreq   }, { $set: { date: dates} });
            res.status(200).send(messages)
        }
        else { 
            const dates= new Date()
         
            const converations = await Conversations.create({
               members:[req.body.reciever,req.body.senderid],
               date:dates
                 }); 
            await converations.save();
             const messages = await message.create({
                conversation_userId:converations._id,
                messagee:req.body.message,
                sender:req.body.senderid,
                
            });
            await messages.save();
            res.status(200).send(messages)
        }
         
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error'); // Return a generic error message for internal server error
    }
 });
 route.get('/conversation/:id',async (req,res)=>{
    console.log(req.params.id)
    try{
        console.log(req.params.id,'id')
        const myuser= await Conversations.find({ members: { $in :`${req.params.id}`},})
        res.status(200).send(myuser)
    }
    catch(err){
        console.log(err)
    }
})

route.get('/messagefromconv/:user_id/:id',async (req,res)=>{
    try{
       
        const myuser= await Conversations.find({ members: { $all :[req.params.user_id,req.params.id]}})
        res.status(200).send(myuser)
        console.log(myuser)
    }
    catch(err){
        console.log(err)
    }
})
route.get('/messagefromconvs/:user_id',async (req,res)=>{
    try{
       
        const myuser= await Conversations.find({ members: { $all :[req.params.user_id]}})
        
        res.status(200).send(myuser)
        console.log(myuser)
    }
    catch(err){
        console.log(err)
    }
})
route.post('/createconv/:user_id/:id',async (req,res)=>{
    try{
    
      
            const converations = await Conversations.create({
               members:[req.params.user_id,req.params.id]
            
                 }); 
            await converations.save();
            res.status(200).send(converations)
    }
    catch(err){
        console.log(err)
    }
})
route.get('/message/:id',async (req,res)=>{
    console.log(req.params.id)
    try{
       
        const myuser= await message.find({conversation_userId:req.params.id})
        console.log(myuser)
        res.status(200).send(myuser)
    }
    catch(err){
        console.log(err)
    }
})
route.put(`/marasread/:id`, async (req, res) => {
    try {
       // Assuming post is your mongoose model
 
      const changed= await message.updateMany({ conversation_userId:req.params.id}, { $set: {read:true} });
       console.log(changed)
      res.status(200).send(changed);
    } catch (err) {
       console.log(err);
    }
  });
 module.exports=route;