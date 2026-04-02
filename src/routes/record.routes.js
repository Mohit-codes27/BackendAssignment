const express = require("express");
const router = express.Router();
const { createRecord, getRecords, updateRecord, deleteRecord, } = require("../controllers/record.controller");
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(auth); // Protect all record routes

router.post("/", authorize("admin"), createRecord);
router.get("/", getRecords);
router.put("/:id", authorize("admin"), updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

module.exports = router;
