const express = require("express");
const User = require("../models/User.model");
const UserRoute = express.Router();
const bcrypt = require("bcrypt")
const jwt  = require("jsonwebtoken")
UserRoute.get("/",(req,res)=>{
    res.send("User")
})

UserRoute.post("/register",async(req,res)=>{
    const {email,password} = req.body;
   const user = await User.findOne({email:email});
    try {
        if(user){
            return res.send("User Already Exist")
        }
        const salt = await bcrypt.genSalt();
        const hashpass = await bcrypt.hash(password,salt);
        const newUser = new User({
            name:req.body.name,
            email:email,
            password:hashpass,
            dob:req.body.dob,
            bio:req.body.bio
        },req.body);
        await newUser.save();
        res.send({"msg":"User Created"})
    } catch (error) {
        res.send(error)
    }
})

UserRoute.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    // console.log(req.body);
    try {
        const user = await User.findOne({email:email})
        // console.log(user);
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const token = jwt.sign({"userID":user._id},process.env.SECRET_KEY)
                    res.send({"msg":"Login Success","token":token})
                }else{
                    res.send("Invalid Token")
                }
            })
        }else{
            res.send("Invalid Detail")
        }
    } catch (error) {
        console.log("Problem in Login");
    }
})

UserRoute.get("/users",async(req,res)=>{
    try {
        const users = await User.find();
        res.send(users)
    } catch (error) {
        res.send(error)
    }
})

UserRoute.post("/users/:id/friends",async(req,res)=>{
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.body.friendId);
    console.log(friend);
    try {
        if(!user || !friend){
            return res.send("User or friend Not found");
        }
        if(friend.friendRequests.includes(user._id) || user.friends.includes(friend._id)){
            return res.send("Friend Request Already Send or Already Friend");
        }
        
        friend.friendRequests.push(user._id);
        await friend.save();
        res.send("Request Send Successfully")
    } catch (error) {
        res.send(error);
    }
})

UserRoute.post("/users/:id/friends/:friendId",async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const freq = user.friendRequests.find(request => request.equals(req.params.friendId));
        if(!freq){
            return res.send("No request Found");
        }
        const friend = await User.findById(freq);
        if(!friend){
            return res.send("No friend Found");
        }
        if(req.body.accept){
            user.friends.push(friend._id);
            friend.friends.push(user._id);

            await user.save();
            await friend.save();

            user.friendRequests = user.friendRequests.filter(request=> !request.equals(freq));
            await user.save();
            res.send("We are Now Friends")
        }else{
            user.friendRequests = user.friendRequests.filter(request=> !request.equals(freq));
            await user.save();
            res.send("Request Rejected")
        }
    } catch (error) {
        res.send(error)
    }
})



module.exports = {
    UserRoute
}