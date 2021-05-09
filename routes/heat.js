require("dotenv").config();
var express = require("express");
var axios = require("axios");
var router = express.Router();
var paginate = require("../utils/paginate");
var notify = require("../controllers/notify");


async function getMostEfficientFurnaces(page_size) {
  var { data } = await axios({
    method: "GET",
    url: process.env.API_URL + "i97v-e8au.json",
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  });

  if (data) {
    const furnaces = data.sort(
      (furnace1, furnace2) =>
        furnace2.efficiency_afue - furnace1.efficiency_afue
    );

    return paginate(furnaces, page_size, 1);
  }
  else return [];
}

async function getMostEfficientBoilers(page_size) {
  var { data } = await axios({
    method: "GET",
    url: process.env.API_URL + "6rww-hpns.json",
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  });

  if (data) {
    const boilers = data.sort(
      (boiler1, boiler2) => boiler2.efficiency_afue - boiler1.efficiency_afue
    );

    return paginate(boilers, page_size, 1);
  } else return [];
}

async function getMostEfficientHeatpumps(page_size) {
  var { data } = await axios({
    method: "GET",
    url: process.env.API_URL + "4c82-7ysy.json",
    headers: {
      "X-App-Token": process.env.API_TOKEN,
    },
  });

  if (data) {
    const heatpumps = data.sort(
      (heatpump1, heatpump2) => heatpump2.eer_rating - heatpump1.eer_rating
    );

    return paginate(heatpumps, page_size, 1);
  } else return [];
}

/**
 * POST /heat?
 *
 * @param page_size the number of products fetched per page
 * @public
 */
router.post(
  "/",
  async (req, res, next) => {
    try {
      if (req.query.furnace) {
        req.body.furnaces = await getMostEfficientFurnaces(req.query.page_size);
      }

      next();
    } catch (error) {
      res.status(404).json({ message: err.toString() });
    }
  },
  async (req, res, next) => {
    try {
      if (req.query.boiler) {
        req.body.boilers = await getMostEfficientBoilers(req.query.page_size);
      }

      next();
    } catch (error) {
      res.status(404).json({ message: err.toString() });
    }
  },
  async (req, res) => {
    try {
      if (req.query.heatpump) {
        req.body.heatpumps = await getMostEfficientHeatpumps(req.query.page_size);
      }
      console.log(req.body.furnaces, req.body.boilers);
      
      notify(req.body.email, [
        {
          category: "Furnace",
          products: req.body.furnaces,
        },
        {
          category: "Boiler",
          products: req.body.boilers,
        },
        {
          category: "Heat Pumps",
          products: req.body.heatpumps,
        },
      ]);

      res.json({ message: "Recommendations have been sent to your email!" });
    } catch (error) {
      res.status(404).json({ message: "Cannot send recommendations!" });
    }
  }
);

module.exports = router;
