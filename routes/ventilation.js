require("dotenv").config();
var express = require("express");
var axios = require("axios");
var router = express.Router();
var paginate = require("../utils/paginate");

async function getMostEfficientVentilators(page_size, bathroom, office) {
  var { data } = await axios({
    method: "GET",
    url: process.env.API_URL + "ga9m-7gtz.json",
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  });

  if (data) {
    var vents = data.sort(
      (vent1, vent2) => vent2.luminaire_efficacy - vent1.luminaire_efficacy
    );

    if (bathroom && office) {
        return paginate(vents, page_size, 1);
    }
    else if (bathroom) {
        vents = vents.filter(
          (vent) => vent.unit_type == "Bathroom/Utility Room"
        );
        return paginate(vents, page_size, 1);
    }
    else if (office) {
        vents = vents.filter(
          (vent) => vent.unit_type == "In-line (single-port)"
        );
        return paginate(vents, page_size, 1);
    }
    else {
        return [];
    }

    
  } else return [];
}

/**
 * GET /ac?
 *
 * @param page_size the number of products fetched per page
 * @public
 */
router.get("/", async (req, res) => {
  const ventilators = await getMostEfficientVentilators(
    req.query.page_size,
    req.query.bathroom,
    req.query.office
  );

  res.json(ventilators);
});

module.exports = router;
