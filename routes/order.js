const express = require("express");
const router = express.Router();

const {
  getOrderById,
  createOrder,
  getAllOrder,
  getOrderStatus,
  updateStatus,
} = require("../controllers/order");
const { isSignedIn, isAuthenticate, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateInventory } = require("../controllers/product");
//PARAMETER
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//WRITE(CREATE)
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticate,
  pushOrderInPurchaseList,
  updateInventory,
  createOrder
);

//READ
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  getAllOrder
);
router.get(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  getOrderStatus
);

//UPDATE

router.put(
  "/order/:order/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  updateStatus
);

module.exports = router;
