const { Order, ProductCart } = require("../models/order");

//GET ORDER BY ID
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "Order not found",
        });
      }
      req.order = order;
      next();
    });
};

//CREATE ORDER
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "order creation failed",
      });
    }
    res.json(order);
  });
};

//GET ALL ORDERS
exports.getAllOrder = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "no orders found",
        });
      }
      res.json(orders);
    });
};

//ORDER STATUS
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

//UPDATE ORDER
exports.updateOrder = (req, res) => {
  Order.update(
    { _id: req.order._id },
    { $set: { status: req.body.status } },
    (err, updatedOrder) => {
      if (err) {
        return res.status(400).json({
          error: "no order updated",
        });
      }
      res.json(updatedOrder);
    }
  );
};
