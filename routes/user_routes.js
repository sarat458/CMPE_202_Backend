const express = require('express');
const controller = require("../controllers/user_controller");
const router = express();
router.post('/signin',controller.signIn);
router.post('/signup',controller.signUp);
router.post('/updatedetails',controller.updateProfile);
router.get('/viewprice',controller.viewPrice);
router.get('/rewardPoints/:id',controller.redeemRewards);
router.get('/getbookings/:userId',controller.getBookings)
router.post('/createBooking',controller.userBooking);
router.put('/cancelBooking',controller.cancelBooking);
router.get('/bookingid/:bookingId',controller.BookingonId);
router.post("/updatebooking",controller.updateBooking);
router.put("/updateRewardPoints/:userId/:rewards",controller.descreaseRewardPoints);
module.exports = router;
