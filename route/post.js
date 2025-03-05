const route=require("express").Router()
const post=require("../modal/postmodal")
const user=require("../modal/usermodal")
const Notification = require('../modal/notificationmodal');

route.get('/not/:not', async (req,res)=>{
   try{
      console.log(req.params.not)
const arrayintostring=req.params.not.split(',')
      const not=await Promise.all(arrayintostring.map((noti)=>{
         return Notification.findOne({_id:noti})
      }))
      
      res.status(200).send(not)
}
catch(err){
   console.log(err)
}
})
const createNotification = async (userId, message, link,profilepicture,username) => {
   const notification = await Notification.create({
       userId,
       profilepicture,
       username,
       message,
       link
   });

   const currentUser = await user.findOne({ _id: userId });

   const friendNot = async () => {
       currentUser.followers.map(async (friend) => {
       return    await user.findByIdAndUpdate({_id:friend}, { $push: { notifications: notification._id }
           });
       });
   };

   await friendNot(); // Call the async function here

   return notification;
};

route.post('/createpost', async (req,res)=>{
   try{
    const newpost= await new post({
        user_id:req.body.user_id,
        postpicture:req.body.postpicture,
        Desc:req.body.desc,
      
       }) 
       const savedPost = await newpost.save();

       // Une fois sauvegardé, tu peux récupérer l'ID généré
       savedPost.link = savedPost._id;
     
       // Sauvegarder à nouveau le post après avoir ajouté le lien
       await savedPost.save();
     
       // Renvoi de la réponse avec le post sauvegardé
       res.status(200).send(savedPost);
    
  const thepostnot = {
   _id: newpost._id.toString(),
   createdAt: newpost.createdAt.toISOString(),
   updatedAt: newpost.updatedAt.toISOString(),
   comments: newpost.comments,
   likes: newpost.likes,
   user_id: newpost.user_id,
   
};


    createNotification(req.body.user_id,'has added new post',`linkpost?mypost=${JSON.stringify(thepostnot)}`,req.body.profilepicture,req.body.username)
    await post.updateOne({ _id:newpost._id   }, { $set: { link: JSON.stringify(thepostnot)} });
 
   }catch(err){
    console.log(err)
   }
})

route.get('/seepost/:id', async (req,res)=>{
   try{
      const allpost= await post.find({user_id:req.params.id})
      res.status(200).send(allpost)
}
catch(err){
   console.log(err)
}
})
route.get('/mypost/:id', async (req,res)=>{
   try{
      const allpost= await post.findOne({_id:req.params.id})
      res.status(200).send(allpost)
}
catch(err){
   console.log(err)
}
})
route.get('/Timeline/:id', async (req,res)=>{
   try{
      const Currentuser= await user.findOne({_id:req.params.id})
      const postofcurrentuser=await post.find({user_id:Currentuser._id})
      const friendpost=await Promise.all(Currentuser.followings.map((friend)=>{
         return post.find({user_id:friend})
      }))
      res.status(200).send(postofcurrentuser.concat(...friendpost))
}
catch(err){
   console.log(err)
}
})
route.get('/randomv',async(req,res)=>{
   try{
    const randomv=await post.aggregate([{$sample:{size:40}}])
    res.status(200).json(randomv)
   }catch(err){
   next(err)
   }
})
route.put('/comment/:id', async (req,res)=>{
   try{
   console.log(req.params.id)
      await post.updateOne({ _id: req.body.id }, { $push: { comments:{id:req.params.id,content:req.body.content}}});
      res.status(200).send('commented successfully')
}
catch(err){
   console.log(err)
}
})
route.put('/likes/:id', async (req,res)=>{
   try{
      console.log(req.params.id)
      await post.updateOne({ _id: req.body.id }, { $push: { likes: req.params.id } });
      res.status(200).send('post liked successfully')
}
catch(err){
   console.log(err)
}
})
route.put('/dislikes/:id', async (req,res)=>{
   try{
   
      await post.updateOne({ _id: req.body.id }, { $pull: { likes: req.params.id } });
      res.status(200).send('post liked successfully')
}
catch(err){
   console.log(err)
}
})
route.put('/profilepicture/:id', async (req, res) => {
   try {
      // Assuming post is your mongoose model
   console.log(req.body.postpic)
      await user.updateOne({ _id:req.params.id   }, { $set: { profilepicture: req.body.postpic} });
      res.status(200).send('post liked successfully');
   } catch (err) {
      console.log(err);
   }
});
route.put('/coverpicture/:id', async (req, res) => {
   try {
      // Assuming post is your mongoose model
      console.log(req.body.postpic)
      await user.updateOne({ _id:req.params.id   }, { $set: { coverpicture: req.body.postpic} });
      res.status(200).send('post liked successfully');
   } catch (err) {
      console.log(err);
   }
});
route.put('/notification/:id', async (req, res) => {
   try {
      // Assuming post is your mongoose model
  
      await Notification.updateOne({ _id:req.params.id   }, { $set: { read: true} });
      res.status(200).send('post liked successfully');
   } catch (err) {
      console.log(err);
   }
});
route.delete('/delete/:id', async (req, res) => {
   try {
      // Assuming post is your mongoose model
  
      await post.deleteOne({ _id:req.params.id    });
      res.status(200).send('post deleted successfully');
   } catch (err) {
      console.log(err);
   }
});
module.exports=route;
