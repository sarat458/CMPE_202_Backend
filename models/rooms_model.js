
const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const Schema=mongoose.Schema;

//Creating room schema and model

const roomSchema =new Schema({

    hotelId:{type:String,required:true},
    roomType:{type:String,required:true},
    basePrice:{type:Number,required:true},
    maxGuests:{type:Number,required:true}
	
});

const Room = mongoose.model('Room',roomSchema);

module.exports=Room;

