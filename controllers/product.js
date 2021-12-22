const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

//GET PRODUCT BY ID
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    // .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

//CREATE PRODUCT
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problems with images",
      });
    }

    //DESTRUCTURE THE FIELDS FOR RESTRICTION
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please enter all Fields",
      });
    }

    let product = new Product(fields);

    //HANDLING FILES
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "Image size is too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //SAVING TO THE DATABASE
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "saving in db is failed!",
        });
      }
      res.json(product);
    });
  });
};

//GET A SINGLE PRODUCT
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problems with images",
      });
    }

    //UPDATION CODE
    let product = req.product;
    product = _.extend(product, fields);

    //HANDLING FILES
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "Image size is too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //SAVING TO THE DATABASE
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation failed!",
        });
      }
      res.json(product);
    });
  });
};

//DELETE
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        err: "failed to delete the product",
      });
    }
    res.json({
      message: "deletion successfully",
      deletedProduct,
    });
  });
};

//GET ALL PRODUCTS
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    // .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Products are not available",
        });
      }
      res.json(products);
    });
};

//GET ALL UNIQUE CATEGORY
exports.getAllUniqueCategory = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO Category found",
      });
    }
    res.json(category);
  });
};

//MIDDLEWARE
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateInventory = (req, res, next) => {
  let operations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });
  Product.bulkWrite(operations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "bulk is failed",
      });
    }
    next();
    // res.json(products);
  });
};
