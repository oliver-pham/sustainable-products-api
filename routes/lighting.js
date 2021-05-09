require("dotenv").config();
var express = require('express');
var axios = require('axios');
var router = express.Router();

/**
 * GET /lighting?
 * 
 * @param technology "LED" (light emitting diode), "CFL" (compact fluorescent light ) or "halogen"
 * @param page_size the number of products fetched per page
 * @public
 */
router.get("/", (req, res) => {
  axios({
    method: "GET",
    url: process.env.API_URL + "wyt9-72bp.json",
    params: {
      $limit: req.query.page_size,
      lighting_technology_used: "LED"
    },
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => {
      res.status(404).json({ message: err.toString() });
    });
});

module.exports = router;