require("dotenv").config();
var express = require("express");
var axios = require("axios");
var router = express.Router();
var paginate = require("../utils/paginate");

/**
 * GET /hvac?
 *
 * @param page_size the number of products fetched per page
 * @param page_number the page number
 * @public
 */
router.get("/", (req, res) => {
  axios({
    method: "GET",
    url: process.env.API_URL + "e4mh-a2u3.json",
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  })
    .then((response) => {
      const products = response.data
        .sort(
          // Sort the HVAC products based on energy efficiency ratio (EER) Rating
          (hvac1, hvac2) => hvac2.eer_rating_btu_wh - hvac1.eer_rating_btu_wh
        );

      res.json(paginate(products, req.query.page_size, req.query.page_number));
    })
    .catch((err) => {
      res.status(404).json({ message: err.toString() });
    });
});

module.exports = router;
