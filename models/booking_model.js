const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const Schema=mongoose.Schema;


//Creating Booking Schema

const bookingSchema= new Schema({

    userId: {
        type:String,
        required:[true, 'User id is required']
    },
    hotelId: {
        type:String,
        required:[true, 'Hotel id is required']
    },
    bookingId:{
        type:String
    },
    hotelName:{
        type:String,
        required:[true,'Hotel Name is required']
    },
    bookingDate:{
        type:Date,
        default:Date.now
    },
    checkInDate:{
        type:Date,
        required:[true,'Check-in date is required.']
    },
    checkOutDate:{
        type:Date,
        required:[true,'Checkout date is required.']
    },
    roomType:{
        type:String,
        required:[true,'Room Type is required']
    },
    roomCount:{
        type:Number,
        required:[true,'Room Count is required']
    },
    roomPrice:{
        type:Number
    },
    guestList:{
        type: String
    },
    amountPaid: {
        type:Number,
        required:[true,'Amount paid is required']
    },
    bookingStatus:{
        type:String,
        required:[true,'Booking status is required']
    },
    bookingID:{
        type: String,
        required:[true,'Booking id is required']
    }
   
});

const Booking=mongoose.model('Booking',bookingSchema);
module.exports=Booking;


