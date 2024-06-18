const express = require("express");
const router = express.Router();
const { registerRest, changeMenu, getMenu, update_reviews } = require("../controllers/restController");
const {
  registerOwner,
  logOwner_in,
  signOwner,
} = require("../controllers/ownerController");
const validate_token = require("../middleware/tokenhandler");
router.post("/registerRest", validate_token, registerRest);
router.post("/signOwner", signOwner);
router.post("/registerOwner", registerOwner);
router.post("/loginOwner", validate_token, logOwner_in);
router.post("/changeMenu",validate_token,changeMenu)
router.post("/getMenu",validate_token,getMenu)
router.post("/updateRev",validate_token,update_reviews)
module.exports = router;
