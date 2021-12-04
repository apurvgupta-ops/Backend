const express = require("express");
const router = express.Router();
const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategory,
} = require("../controllers/product");
const { isSignedIn, isAuthenticate, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//PARAMETER
router.param("userId", getUserById);
router.param("productId", getProductById);

//WRITE(CREATE)
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  createProduct
);

//READ
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.get("/products/categories", getAllUniqueCategory);

//UPDATE
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  updateProduct
);

//DELETE
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  deleteProduct
);

//ALL PRODUCTS
router.get("/products", getAllProducts);

module.exports = router;
