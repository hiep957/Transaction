const express = require("express");
const userRoute = require("./routes/userRoute");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const transferRoute = require("./routes/tranferRoute");
const errorHandlingMiddleware = require("./middlewares/errorHandling");
const app = express();


mongoose
  .connect("mongodb+srv://admin:hieplaso1@mern-booking-app.ba2nf6u.mongodb.net/Transaction", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.use(bodyParser.json());
app.use("/transfer",transferRoute);
app.use("/user",userRoute);
app.use(errorHandlingMiddleware);
app.use("/",(req,res)=>{
    try{
        return res.status(200).json({message:"Hello World"})
    }
    catch(e){
        return res.status(500).json({message:"Something went wrong"})
    }
})


app.listen(7000, () => {
    console.log("Server is running on port 7000");
  });