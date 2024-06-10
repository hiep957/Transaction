const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ApiError = require("../untils/ApiError");
const User = require("../models/userSchema");
const url =
    "mongodb+srv://admin:hieplaso1@mern-booking-app.ba2nf6u.mongodb.net/Transaction";


//transaction cộng trừ tiền giữa 2 user
router.post("/", async (req, res,next) => {
    const { fromId, toId, amount } = req.body;

    try {
        if (!fromId || !toId || !amount) {
            throw new ApiError(400,'Missing required fields');
        }
        await mongoose.connect(url);

        const session = await mongoose.startSession();

        const transactionOptions = {
            readPreference: "primary",
            readConcern: { level: "local" },
            writeConcern: { w: "majority" },
        };

        session.startTransaction(transactionOptions);

        try {
            const fromUser = await User.findById(fromId).session(session);
            const toUser = await User.findById(toId).session(session);
            console.log(fromUser);  
            console.log(toUser);
            if (!fromUser || !toUser) {
                throw new ApiError(400,'Invalid user id');
            }
            if (fromUser.amount < amount) {
                throw new ApiError(400,'Not enough money');
            }

            fromUser.amount -= amount;
            toUser.amount += amount;

            await fromUser.save({ session });
            await toUser.save({ session });

            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ message: "Transaction completed successfully", fromUser: fromUser.name, toUser: toUser.name, amount: amount });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            next(error);
        }
    } catch (error) {
       next(error);
    }
});


//API cộng tiền vào tài khoản
router.post("/:id", async (req, res) => {
    const {id} = req.params;
    const {amount} = req.body;
    if(!id || !amount){
        return res.status(400).send('Missing required fields');
    }
    try {
        const user = await User.findById(id);
        if(!user){
            throw new Error('Invalid user id');
        }
        user.amount += amount;
        await user.save();
        return res.status(200).json({message: 'Amount added successfully', user: user.name, amountOfUser: user.amount});
    }
    catch(e){
        return res.status(500).send('Something went wrong');
    }
    
})

module.exports = router;
