require("dotenv").config();
var express = require("express");
var axios = require("axios");
var router = express.Router();
var paginate = require("../utils/paginate");

async function getMostEfficientAirConditioners(page_size) {
  var { data } = await axios({
    method: "GET",
    url: process.env.API_URL + "i97v-e8au.json",
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  });

  if (data) {
    const acs = data.sort(
      (ac1, ac2) =>
        ac2.combined_energy_efficiency_ratio_ceer -
        ac1.combined_energy_efficiency_ratio_ceer
    );

    return paginate(acs, page_size, 1);
  } else return [];
}

/**
 * GET /ac?
 *
 * @param page_size the number of products fetched per page
 * @public
 */
router.get("/", async (req, res) => {
  const airConditioners = await getMostEfficientAirConditioners(req.query.page_size);

  res.json(airConditioners);
});

module.exports = router;
