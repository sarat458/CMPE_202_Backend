const express = require('express');
const controller = require("../controllers/hotel_controller");
const router = express();
router.get('/searchhotels/:city',controller.searchHotels);
router.get('/roomsavailability/:hotelId/:checkInDate/:checkOutDate',controller.roomsAvailability );
router.get('/searchhotelid/:hotelId',controller.searchHotelId);
module.exports = router;    