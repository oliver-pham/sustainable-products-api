require("dotenv").config();
var express = require('express');
var axios = require('axios');
var router = express.Router();
var notify = require('../controllers/notify');

/**
 * POST /lighting
 * 
 * @param technology "LED" (light emitting diode), "CFL" (compact fluorescent light ) or "halogen"
 * @param page_size the number of products fetched per page
 * @public
 */
router.post("/", (req, res) => {
  axios({
    method: "GET",
    url: process.env.API_URL + "wyt9-72bp.json",
    params: {
      $limit: 3,
      lighting_technology_used: "LED"
    },
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  })
    .then((response) => {      
      notify(req.body.email, [{ category: "Lighting", products: response.data }]);
      res.json({ message: "Recommendations have been sent to your email!"});
    })
    .catch((err) => {
      res.status(404).json({ message: "Cannot send recommendations!" });
    });
});

module.exports = router;