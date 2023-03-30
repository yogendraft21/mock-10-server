const express = require("express");
const { connection } = require("./config/db");
const { auth } = require("./middleware/auth");
const { PostRoute } = require("./routes/Post.route");
const { UserRoute } = require("./routes/User.route");
const app = express();
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Welcome to Social Media")
})

app.use("/api",UserRoute);
// app.use(auth);
app.use("/api/posts",PostRoute)
app.listen(8081,async()=>{
    try {
        await connection;
        console.log("DB Connected and Running on port 3000");
    } catch (error) {
        console.log(error);
    }
})