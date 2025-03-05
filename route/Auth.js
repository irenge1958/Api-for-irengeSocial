const route=require("express").Router()
const user=require("../modal/usermodal")
const bcrypt=require("bcrypt")
// registering the user
route.post('/register', async (req,res)=>{

    console.log(req.body.password)
   const hashpassword= await bcrypt.hash(req.body.password,10)

     // Check if the username already exists
     const existingUser = await user.findOne({ username: req.body.username });
     const existingUser2 = await user.findOne({ email: req.body.email });
    
     // If user with the same username exists, return a response
     if (existingUser || existingUser2) {
         return res.status(400).send('User already exists');
     } 
   try{
    const newuser= await new user({
        username:req.body.username,
        password:hashpassword,
        email:req.body.email
       }) 
       await newuser.save();
    res.status(200).send(newuser)
    console.log(newuser)
   }catch(err){
    console.log(err)
   }
})
route.post('/login', async (req, res) => {
   try {
       const thisuser = await user.findOne({ email: req.body.email });
      console.log(thisuser)
       if (!thisuser) {
            res.status(402).send("This user does not exist"); // Return the response with message
       } 

       const passw = await bcrypt.compare(req.body.password, thisuser.password);

       if (passw) {
           res.status(200).send(thisuser);
     
       } 
      
       else { 
            res.status(404).send('Wrong password!');
       }
        
   } catch (err) {
       console.log(err);
       return res.status(500).send('Internal Server Error'); // Return a generic error message for internal server error
   }
});
route.post('/signinwithgoogle', async (req, res,next) => {
    console.log(req.body.email)
    
     try {
         // Find user by email
         const newUser = await user.findOne({ email: req.body.email });
    
         // Check if user exists
         if (newUser) {
 // Send success response
 res.status(200).json(newUser);}
 
else{
    const newUser = await user.create({
        email: req.body.email,
        profilepicture: req.body.img,
        username: req.body.username,
        fromgoogle:true
    });

    // Send success response
    res.status(200).json(newUser);
}
 


     } catch (err) {
         console.log(err);
         // Send an error response
         next(err)
     }
    });
module.exports=route;