const express = require("express");
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const PostRoute = express.Router();

PostRoute.get("/",async(req,res)=>{
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (error) {
        res.send(error)
        }
})

PostRoute.post("/",async(req,res)=>{
    const {user_id,text,image,createdAt} = req.body;
    const user = await User.findById(user_id);
    try {
        const post = new Post({
            user:user_id,
            text:text,
            image:image,
            createdAt:createdAt
        },req.body);
        await post.save();
        user.posts.push(post._id);
        await user.save();
        res.send("Post Created Success")
    } catch (error) {
        res.send(error)
    }
})

PostRoute.patch("/:id",async(req,res)=>{
    try {
        await Post.findByIdAndUpdate({_id:req.params.id},req.body)
        res.send("post updated successfully")
    } catch (error) {
        res.send(error)
    }
})

PostRoute.delete("/:id",async(req,res)=>{
    try {
        await Post.findByIdAndDelete({_id:req.params.id})
        res.send("post deleted successfully")
    } catch (error) {
        res.send(error)
    }
})

PostRoute.post("/:id/comment",async(req,res)=>{
    const post = await Post.findById(req.params.id);
    try {
        if(!post){
            return res.send("Post not found")
        }
        post.comments.push(req.body);
        await post.save();
        res.send("Comment Success")
    } catch (error) {
        res.send(error)
    }
})

PostRoute.post("/:id/like",async(req,res)=>{
    const post = await Post.findById(req.params.id);
    try {
        if(!post){
            return res.send("Post not found")
        }
        post.likes.push(req.body.user_id);
        await post.save();
        res.send("Liked Success")
    } catch (error) {
        res.send(error)
    }
})

PostRoute.get("/:id",async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.send(post);
    } catch (error) {
        res.send(error);
    }
})

module.exports = {
    PostRoute
}