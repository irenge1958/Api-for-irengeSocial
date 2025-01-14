const route=require("express").Router()
const user=require("../modal/usermodal")
const Notification = require('../modal/notificationmodal');
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
        currentUser.followings.map(async (friend) => {
        return    await user.findByIdAndUpdate({_id:friend}, { $push: { notifications: notification._id }
            });
        });
    };
 
    await friendNot(); // Call the async function here
 
    return notification;
 };
 
route.get('/:id',async (req,res)=>{
    try{
      console.log(req.params.id)
        const myuser= await user.findOne({_id:req.params.id})
        res.status(200).send(myuser)
    }
    catch(err){
        console.log(err)
    }
})
route.get('/all/users',async (req,res)=>{
  try{
   
      const myuser= await user.find()
      res.status(200).send(myuser)
  }
  catch(err){
      console.log(err)
  }
})
route.get('/search/:q', async (req, res) => {
     
 
  try {
    const results = await user.find({ username: { $regex: `^${req.params.q}`, $options: 'i' } }); // Find items starting with the provided string (case-insensitive)
    res.json(results).status(200);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
route.get('/searchs/:q', async (req, res) => {
     
 
    try {
      const results = await user.find({ username:  req.params.q }); // Find items starting with the provided string (case-insensitive)
      res.json(results).status(200);
    } catch (error) {
      console.error('Error searching:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
    
route.put('/follow/:id', async (req,res)=>{
    
    try{
     
        // Update the user being followed to add the follower
        await user.updateOne({ _id: req.body.id }, { $push: { followers: req.params.id } });

        // Update the user who is following to add the following
        await user.updateOne({ _id: req.params.id }, { $push: { followings: req.body.id } });
        createNotification(req.params.id,`has started following you`,`?username=${req.body.username}&id=${req.params.id}`,req.body.profilepicture,req.body.username)
        res.status(200).json({ message: "Followed successfully" });
    }

 catch(err){
    console.log(err)
 }
 })
 route.put('/unfollow/:id', async (req,res)=>{
    try{
        // Update the user being followed to remove the follower
        await user.updateOne({ _id: req.body.id }, { $pull: { followers: req.params.id } });

        // Update the user who is following to remove the following
        await user.updateOne({ _id: req.params.id }, { $pull: { followings: req.body.id } });

        res.status(200).json({ message: "unFollowed successfully" });
    }

 catch(err){
    console.log(err)
 }
 })
 route.get('/followings/:id', async (req,res)=>{
    try{
        // followers
        const myuser= await user.findOne({_id:req.params.id})
        res.status(200).send(myuser.followings)
    }

 catch(err){
    console.log(err)
 }
 })
 route.get('/followers/:id', async (req,res)=>{
    try{
        // followers
        const myuser= await user.findOne({_id:req.params.id})
        res.status(200).send(myuser.followers)
    }

 catch(err){
    console.log(err)
 }
 })
 route.put(`/updateinfo/:id`, async (req, res) => {
  try {
     // Assuming post is your mongoose model
 
     await user.updateOne({ _id:req.params.id   }, { $set: req.body });
     res.status(200).send('post liked successfully');
  } catch (err) {
     console.log(err);
  }
});
module.exports=route;  