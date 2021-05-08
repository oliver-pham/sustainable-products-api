require("dotenv").config();
var express = require('express');
var axios = require('axios');
var router = express.Router();
var paginate = require('../utils/paginate')

/**
 * GET /lighting?
 * 
 * @param technology "LED" (light emitting diode), "CFL" (compact fluorescent light ) or "halogen"
 * @param page_size the number of products fetched per page
 * @param page_number the page number
 * @public
 */
router.get("/", (req, res) => {
  axios({
    method: "GET",
    url: process.env.API_URL + "wyt9-72bp.json",
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  })
    .then((response) => {
      // TODO:  Always "LED"?
      const products = response.data
        .filter(
          (fixture) => fixture.lighting_technology_used === req.query.technology
        );

      res.json(
        paginate(products, req.query.page_size, req.query.page_number),
      );
    })
    .catch((err) => {
      res.status(404).json({ message: err.toString() });
    });
});

module.exports = router;
