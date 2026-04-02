const express = require("express");
const router = express.Router();
const { getAllUsers, toggleUserStatus } = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.get("/", auth, authorize("admin"), getAllUsers);
router.patch("/:id/status", auth, authorize("admin"), toggleUserStatus);

module.exports = router;
