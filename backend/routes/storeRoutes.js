const express = require("express");
const store = require("../config/store");

const router = express.Router();

//@route GET /api/store/config
//@desc public store settings: shipping, payment methods, policies, size guide
//@access public
router.get("/config", (req, res) => {
  const { coupons, ...publicConfig } = store;
  res.json(publicConfig);
});

module.exports = router;
