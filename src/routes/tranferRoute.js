const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ApiError = require("../untils/ApiError");
const User = require("../models/userSchema");
const asyncHandler = require("../untils/asyncHandler");
const url =
    "mongodb+srv://admin:hieplaso1@mern-booking-app.ba2nf6u.mongodb.net/Transaction";

    
//transaction cộng trừ tiền giữa 2 user
router.post("/",
    asyncHandler(async (req, res, next) => {
        const { fromId, toId, amount } = req.body;


        if (!fromId || !toId || !amount) {
            throw new ApiError(400, 'Missing required fields');
        }

        await mongoose.connect(url);

        //transfer operation
        const transferOperation = (session) => tranferMoney(session, fromId, toId, amount);
        //transaction options
        const transactionOptions = {
            readPreference: "primary",
            readConcern: { level: "local" },
            writeConcern: { w: "majority" }
        };
        //call transaction helper Promise
        const result = await transactionHelper(transferOperation, transactionOptions);
        return res.status(200).json({
            message: "Transaction completed successfully",
            fromUser: result.fromUser.name,
            toUser: result.toUser.name,
            amount: amount
        });
    }));
const transactionHelper = async (fn, options) => {
    // Start a session
    const session = await mongoose.startSession();

    try {
        // Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
        return await new Promise((resolve, reject) => {
            let result;
            // The callback to execute within the transaction
            session.withTransaction(() => fn(session).then(res => result = res), options)
                .then(() => resolve(result))
                .catch(reject);
        });
    } finally {
        // End the session
        session.endSession();
    }
}

const tranferMoney = async (session, fromId, toId, amount) => {
    const fromUser = await User.findById(fromId).session(session);
    const toUser = await User.findById(toId).session(session);

    if (!fromUser || !toUser) {
        throw new Error('User not found');
    }

    if (fromUser.amount < amount) {
        throw new Error('Insufficient funds');
    }

    fromUser.amount -= amount;
    toUser.amount += amount;

    await fromUser.save({ session });
    await toUser.save({ session });
    console.log("fromUser", fromUser);
    console.log("toUser", toUser);
    return { fromUser, toUser };
}



//API cộng tiền vào tài khoản
router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    if (!id || !amount) {
        return res.status(400).send('Missing required fields');
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('Invalid user id');
        }
        user.amount += amount;
        await user.save();
        return res.status(200).json({ message: 'Amount added successfully', user: user.name, amountOfUser: user.amount });
    }
    catch (e) {
        return res.status(500).send('Something went wrong');
    }

})



module.exports = router;
