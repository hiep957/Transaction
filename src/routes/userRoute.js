const express = require("express");
const User = require("../models/userSchema");
const mongoose = require("mongoose");
const ApiError = require("../untils/ApiError");
const RequestModal = require("../models/requestSchema");
const url =
  "mongodb+srv://admin:hieplaso1@mern-booking-app.ba2nf6u.mongodb.net/Transaction";
const router = express.Router();

router.post("/", async (req, res,next) => {
  try {
    const user_data = req.body;
    const mongoClient = await mongoose.connect(url);
    const session = await mongoClient.startSession();

    const transactionOptions = {
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    };

    try {
      // Start a transaction
      await session.withTransaction(async () => {
        console.log("inside transaction line 25");
        let user = new User(user_data);
        // Save the user
        try {
          await user.save({ session });
          // throw new ApiError(400,"Error in saving user");
        } catch (error) {
          // If an error occurs during the transaction, the transaction aborts and all changes made during the transaction are discarded.
          await session.abortTransaction();
          next(error)
        }

        const userId = user._id;
        ;
        // Create a request tracker
        let request_tracker = {};
        request_tracker["name"] = user_data["name"];
        request_tracker["date_of_request"] = new Date();
        console.log(request_tracker)
        let new_request_tracker = new RequestModal(request_tracker);
       // Save the request tracker
        await new_request_tracker.save({session});

        // Commit the transaction
        await session.commitTransaction();

        return res.status(200).json({ message: "Transaction completed successfully", userId: userId});

      }, transactionOptions);
    } catch (error) {
      next(error);
    }
    finally {
      // End the session
      session.endSession();
      return;
    }

    
  } catch (e) {
    console.log("line 51");
    next(e);
  }
});

module.exports = router;
