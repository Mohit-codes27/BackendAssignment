const express = require("express");
const router = express.Router();
const {getSummary, getCategoryData, getTrends, } = require("../controllers/dashboard.controller");
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.get("/summary", auth, authorize("analyst", "admin"), getSummary);
router.get("/category", auth, authorize("analyst", "admin"), getCategoryData);
router.get("/trends", auth, authorize("analyst", "admin"), getTrends);

module.exports = router;
