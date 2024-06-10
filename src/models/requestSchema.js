const mongoose = require("mongoose");

// export type RequestTypes = {
//     name: String;
//     date_of_request: String;    
// }


const requestSchema = new mongoose.Schema({
    name: {type: String,required: true},
    date_of_request: {type: Date,required: true},
})

const RequestModal =  mongoose.model("RequestModal",requestSchema);

module.exports = RequestModal;
