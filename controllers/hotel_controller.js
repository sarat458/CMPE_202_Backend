const Hotel = require("../models/hotel_model");
const Booking=require("../models/booking_model");
const Room = require("../models/rooms_model")
const mongoose = require("mongoose");

//Searching hotel base on city name
exports.searchHotels =  (req,res) => {
     Hotel.find({
        city:req.params.city
    })
    .then((hotels) => {
        if(hotels.length==0)
            return res.status(200).send({results:"Hotels not found"});
        res.status(200).send({results:hotels});
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Error in fetching")
    });
};
// //checking room availablity
// exports.roomsavailability=(req,res)=>{
//     Booking.find({
//         hotelId:req.params.hotelId,
//         checkInDate:req.checkInDate,
//         checkOutDate:req.checkOutDate
//     })
// }

//checking room availablity
exports.roomsAvailability=async (req,res)=>{
    //console.log(req.params.hotelId,req.params.checkInDate,req.params.checkOutDate)
    const {hotelId,checkInDate,checkOutDate} = req.params;
    let roomTypes = await Room.find({hotel_id:hotelId});
    let hotel = await Hotel.find({_id:hotelId});
    let singleCount=0,doubleCount=0,suiteCount=0;
    let checkIn = new Date(checkInDate);
    let checkOut = new Date(checkOutDate);
    let response=[];
    for(let d = checkIn ; d.getTime()<=checkOut.getTime(); d.setDate(d.getDate()+1)){
        let records = await Booking.find({$and:[{checkInDate : {$lte : d}},{checkOutDate:{ $gte : d }},{hotelId:{$eq : hotelId}}]});
        let obj ={
            s:0,
            d:0,
            su:0
        }
        console.log(records.length);
        for(let r of records){
            if(r.roomType==='Single'){
                obj["s"]+=r.roomCount;
                
            }else if(r.roomType==="Double"){
                obj["d"]+=r.roomCount;
            }else{
                obj["su"]+=r.roomCount;
            }
        }
        singleCount=Math.max(singleCount,obj["s"]);
        doubleCount=Math.max(doubleCount,obj["d"]);
        suiteCount=Math.max(suiteCount,obj["su"]);

        //console.log(hotel);
       //console.log(singleCount,doubleCount,SuiteCount);
    }
    for(let room of roomTypes){
        let obj={};
        obj["bed_type"]=room.roomType;
        obj["capacity"]=room.maxGuests;
        obj["price"]=calculatePrice(room.basePrice,checkInDate,checkOutDate);
        obj["desired_quantity"]=0;
        //console.log(hotel[0].singleRoomCount,hotel[0].doubleRoomCount,hotel[0].suiteRoomCount,singleCount,doubleCount,suiteCount);
        if(room.roomType==="Single"){
            obj["quantity"] = hotel[0].singleRoomCount - singleCount;
        }else if(room.roomType==="Double"){
            obj["quantity"] = hotel[0].doubleRoomCount - doubleCount;
        }else{
            obj["quantity"] = hotel[0].suiteRoomCount - suiteCount;
        }
        
        response.push(obj);
    }
    //console.log(hotel);
    res.send(response);
    
};

function calculatePrice(price,checkIn,checkOut) {
    var date1 =new Date(checkIn);
    var date2 =new Date(checkOut);
    const days=parseInt((date2-date1)/(1000 * 60 * 60 * 24));
    const checkInMonth=(date1.getMonth())+1;
    const checkOutMonth=(date2.getMonth())+1;
    //Thanks giving Christmas pricing
    if((date1.getDate()+1>19 && checkInMonth==11)||checkInMonth==12){
        price+=(price*0.20);
    }
    //Summer Season pricing
    else if((checkInMonth==4||checkInMonth==5)||(checkOutMonth==4||checkOutMonth==5)){
        price+=(price*0.20);
    }
    //Weekend Prcing
    else if (date1.getDay()>date2.getDay()||date2.getDay()==7){
        price+=(price*0.15);
    }
    return price
}

//Searching hotel based on _id
exports.searchHotelId =  (req,res) => {
    Hotel.find({
       _id:mongoose.Types.ObjectId(req.params.hotelId)
   })
   .then((hotel) => {
       if(hotel.length==0)
           return res.status(200).send({results:"Hotels not found"});
       res.status(200).send(hotel) 
   })
   .catch(err => {
       console.log(err);
       res.status(500).send("Error in fetching");
   });
};