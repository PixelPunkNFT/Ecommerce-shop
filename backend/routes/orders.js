const { Order } = require("../models/order");
// const { Order } = require("../models/order");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");


const router = require("express").Router();

//CREATE

// createOrder is fired by stripe webhook
// example endpoint

router.post("/", auth, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).send(savedOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint per creare un nuovo ordine
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      products,
      subtotal,
      total,
      shipping,
      paymentStatus,
    } = req.body;

    // Crea un nuovo ordine utilizzando il modello "Order"
    const newOrder = new Order({
      userId,
      products,
      subtotal,
      total,
      shipping,
      paymentStatus,
    });

    // Salva il nuovo ordine nel database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la creazione dell'ordine." });
  }
});

//UPDATE
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

//DELETE
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).send("Order has been deleted...");
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", isUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET ALL ORDERS

router.get("/", isAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", isAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET orders stats

router.get("/stats", isAdmin, async (req, res) => {
  const previusMonth = moment()
  .month(moment().month() - 1)
  .set("date", 1)
  .format("YYYY-MM-DD HH:mm:ss");

  try {
      const orders = await Order.aggregate([
          {
              $match: { createdAt: { $gte: new Date(previusMonth)}},
          },
          {
              $project:{
                  month: {$month: "$createdAt"}
              }
          },
          {
              $group:{
                  _id: "$month",
                  total: {$sum: 1}
              }
          }
      ]);
      res.status(200).send(orders)
  } catch (err) {
      console.log(err);
      res.status(500).sendStatus(err);
  }

  // res.send(previusMonth);
});

module.exports = router;




//GET 1 WEEK SALES

router.get("/week-sales", async (req, res) => {
  const last7Days = moment()
  .day(moment().day() - 7)
  .set("date", 1)
  .format("YYYY-MM-DD HH:mm:ss");

  try {
      const orders = await Order.aggregate([
          {
              $match: { createdAt: { $gte: new Date(last7Days)}},
          },
          {
              $project:{
                  day: {$dayOfWeek: "$createdAt"},
                  sales: "$total"
              }
          },
          {
              $group:{
                  _id: "$day",
                  total: {$sum: "$sales"}
              }
          }
      ]);
      res.status(200).send(orders)
  } catch (err) {
      console.log(err);
      res.status(500).sendStatus(err);
  }

  // res.send(previusMonth);
});




module.exports = router;

