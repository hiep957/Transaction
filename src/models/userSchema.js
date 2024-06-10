
const mongoose = require("mongoose");

// export type UserTypes = {
//     name: String;
//     age: Number;
//     company: [
//         {
//             name: String;
//             employer_name: String;
//         }
//     ];
//     married: Boolean;
//     date_of_birth: String;
// }

const userSchema = new mongoose.Schema({
    name: {type: String,required: true},
    amount: {type: Number,required: true},
    age: {type: Number,required: false},
    company: [
        {
            name: {type: String,required: false},
            employer_name: {type: String,required: false}
        }
    ],
    married: {type: Boolean,required: false},
    date_of_birth: {type: Date,required: false}
})

const User = mongoose.model("User",userSchema);

module.exports = User;