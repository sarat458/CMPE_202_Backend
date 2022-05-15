const User = require("../models/user_model");
const Booking = require("../models/booking_model");
const Hotel=require("../models/hotel_model");
const Room=require("../models/rooms_model");
const date = require('date-and-time');
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

//User signup API
exports.signUp=async (req,res)=>{
    User.findOne({
        email:req.body.email
    })
    .exec((err,user)=>{
        
        if (err){
            res.status(500).send({message:err});
            //res.status(500);
        }
        if(user){
            res.status(400).send({message:"User already exists."});
            //res.status(400)
        }
        if(!user){
            const user=new User({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                password:bcrypt.hashSync(req.body.password,10),
                dob:req.body.dob,
                mobile:req.body.mobile,
                rewardPoints:0      
            });

            user.save()
            .then(response => {
                res.send({
                    id:user._id,
                    email:user.email,
                    name:user.firstName+" "+user.lastName,
                    rewardPoints:user.rewardPoints,
                    isAuth:true
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Unsuccessful");
            });            
        }
    });
};

// User SignIn API
exports.signIn=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec((err,user)=>{

        if(err){
            res.status(500).send({message:err});
        }

        if(!user){
            res.status(404).send({message:"User not found"});
        }
        var passwordIsValid=bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if(!passwordIsValid){
            res.status(401).send({message:"Invalid Password"});
        }
        res.status(200).send({
            id:user._id,
            email:user.email,
            name:user.firstName+" "+user.lastName,
            rewardPoints:user.rewardPoints,
            isAuth:true
        });
    });
};

// User Update Profile API
exports.updateProfile = (req,res) => {
	User.findOne({
		email:req.body.email
	})
		.exec((err,user) => {
			if(err){
				res.status(500).send({message:err});
				return;
			}
			if(!user) {
				return res.status(404).send({message:"User not found"});
			}
			if(req.body.firstname){
				user.firstName = req.body.firstname;
			}
			if(req.body.lastname){
				user.lastName = req.body.lastname;
			}
			if(req.body.dob){
				user.dob = req.body.dob;
			}
			if(req.body.mobile){
				user.mobile = req.body.mobile;
			}
			if(req.body.password){
				user.password = bcrypt.hashSync(req.body.password,10);
			}
			user.save()
            .then(response=>{
                res.send("Successfully updated details")
            })
            .catch(err=>{
                res.status(500).send("Details are not updated.Please try again");
            })
		});
};

//Price Details
exports.viewPrice=(req,res)=>{
    Room.findOne({
        hotel_id:req.body.hotel_id,
        roomType:req.body.roomType
    })
    .exec((err,hotelDetails)=>{
        if(err){
            res.status(500).send({message:err});
        }
        var date1 =new Date(req.body.checkInDate);
        var date2 =new Date(req.body.checkOutDate);
        const days=parseInt((date2-date1)/(1000 * 60 * 60 * 24));
        const price=(hotelDetails.basePrice)*days
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
    });
 };

 //Redeem reward points
 exports.redeemRewards=(req,res)=>{
    User.findOne({
        _id:mongoose.Types.ObjectId(req.params.id)
    }).then(resp => {
        resp.password=undefined;
        res.status(200).send(resp);
    })
    .catch(err => {
        res.status(500).send("Internal Error");
    })
    
};

//User Booking
// /User Booking
exports.userBooking=(req,res)=>{
    console.log(req.body);
    if(req.body){
        const booking=new Booking({
            userId:req.body.userId,
            hotelId:req.body.hotelId,
            hotelName:req.body.name,
            bookingDate:new Date().toJSON().slice(0, 10),
            checkInDate:req.body.checkInDate,
            checkOutDate:req.body.checkOutDate,
            roomType:req.body.roomType,
            roomCount:req.body.roomCount,
            roomPrice:req.body.roomPrice,
            guestList:req.body.guestList,
            amountPaid:req.body.amountPaid,
            bookingStatus:req.body.bookingStatus,
            bookingID:req.body.bookingID
        });
        booking.save((err,resp)=>{
            console.log(err,resp);
            if (err){
                res.status(500).send({message:err});
            }
            User.findOneAndUpdate({ _id:mongoose.Types.ObjectId(req.body.userId)},{ $inc: { rewardPoints:req.body.amountPaid}})            
            .then(response=>{
                res.status(200).send("Successfully booked")
            })
            .catch(err=>{
                console.log(err);
                res.status(500).send({message:err})
            })
        });
    }
}
//View all bookings
exports.getBookings = (req,res) => {
    Booking.find({
        userId:req.params.userId
    })
    .then((bookings)=>{
        if (bookings.lenght==0){
            res.status(200).send({results:"There are no bookings"});
        }
        res.status(200).send({results:bookings});
    })
}

//Cancel Booking
exports.cancelBooking=(req,res) => {
    console.log("Check",req.body.bookingID);
    Booking.updateMany({bookingID : req.body.bookingID},{$set:{'bookingStatus':"cancelled"}})
    .then( response => {
        res.status(200).send("Cancelled Succesfully");
    })
    .catch( err => {
        console.log(err);
        res.status(500).send(" Cancel Unsuccessful");
    })
}

//Booking on BookingID
exports.BookingonId=(req,res)=>{
    Booking.findOne({bookingID:req.params.bookingId})
.then((response) =>{
    res.status(500).send(response)
})
.catch( err => {
    console.log(err);
    res.send({message:err});
})}


exports.updateBooking = async (req,res) => {
    const {body} = req;
    for(let i=0;i<body.rooms.length>0 ;i++){
        console.log(body.bookingID,body.rooms[i].bed_type);
        let book = await Booking.findOne({bookingID: body.bookingID,roomType : body.rooms[i].bed_type});
        console.log(book);
        if(book!=null){
            let b =await Booking.updateOne({_id:book._id,roomType : body.rooms[i].bed_type},{$set:{checkInDate :req.body.checkInDate, checkOutDate:req.body.checkOutDate,roomCount : body.rooms[i].quantity , amountPaid :  body.amountPaid , roomPrice : body.rooms[i].price,bookingDate:new Date().toJSON().slice(0, 10) }});
            console.log(b);
        }else{
            const booking=new Booking({
                userId:req.body.userId,
                hotelId:req.body.hotelId,
                hotelName:req.body.name,
                bookingDate:new Date().toJSON().slice(0, 10),
                checkInDate:req.body.checkInDate,
                checkOutDate:req.body.checkOutDate,
                roomType:body.rooms[i].bed_type,
                roomCount:body.rooms[i].quantity,
                roomPrice:body.rooms[i].price,
                amountPaid:body.amountPaid,
                bookingStatus:"Active",
                bookingID : req.body.bookingID
            });
            let b = await booking.save();
        }
    }
    res.send("Success");
}