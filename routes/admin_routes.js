const express = require('express');
const controller = require("../controllers/admin_controller");
const router = express();

//Admin adds hotel
router.post('/addhotel',controller.addHotel);
router.post('/deletehotel',controller.deleteHotel);

module.exports = router;
