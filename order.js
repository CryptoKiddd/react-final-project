const {
  verifyToken,
  verifyTokenAuthorization,
  verifyTokenAdmin,
} = require("./verifyToken");
const CryptoJs = require("crypto-js");
const Order = require("../models/Order");
const { json } = require("express");
const router = require("express").Router();

//Create

router.post("/",  verifyTokenAuthorization, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (error) {
    res.status(500).json(err);
  }
});
//   getuser orders

router.get("/find/:userId", verifyTokenAuthorization, async (req, res) => {
  try {
    const orders = await Order.findBy({ userId: req.params.userId });

    res.status(200).json(orders);
  } catch (error) {
    res.status(401).json("not found", err);
  }
});

//get all Orders
router.get("/", verifyTokenAdmin, async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json(orders);
  } catch (error) {
    res.status(401).json("not found", err);
  }
});

//get monthly income
router.get("/income", verifyTokenAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: prevMonth,
          },
        },
      },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);

    res.status(200).json(income)
  } catch (error) {
    res.status(500).json(500);
  }
});

module.exports = router;
