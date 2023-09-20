const express = require("express");
const Stripe = require("stripe");
const {Product} = require('../models/product');
const {Order} = require('../models/order');
const mongoose = require('mongoose'); // Importa Mongoose per la gestione degli ObjectId

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  // Estrai solo le informazioni essenziali da req.body.cartItems
  const cartItems = req.body.cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    desc: item.desc,
    price: item.price,
    cartQuantity: item.cartQuantity,
    size: item.size,
  }));

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cartItemsCount: cartItems.length,
      cart: JSON.stringify(cartItems),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image.url],
          description: item.desc,
          metadata: {
            id: item.id,
            size: item.size,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["IT"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "eur",
          },
          display_name: "Spedizione Gratuita",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 15,
            currency: "eur",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({ url: session.url });
});

// Create order function

const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const products = Items.map((item) => {
    if (!mongoose.Types.ObjectId.isValid(item.id)) {
      return null;
    }

    // Converti il prezzo da centesimi a euro
    const priceInEuro = item.price / 100; // Conversione da centesimi a euro

    return {
      productId: item.id,
      quantity: item.cartQuantity,
      price: priceInEuro, // Salva il prezzo convertito
    };
  });

  const validProducts = products.filter((product) => product !== null);

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: validProducts,
    subtotal: data.amount_subtotal / 100, // Conversione da centesimi a euro
    total: data.amount_total / 100, // Conversione da centesimi a euro
    shipping: data.customer_details,
    paymentStatus: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};


// Stripe webhook

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
     //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            createOrder(customer, data);

            // Aggiorna la quantità dei prodotti venduti nel database
            const items = JSON.parse(customer.metadata.cart);

            for (const item of items) {
              const product = await Product.findById(item.id);

              if (product) {
                // Trova la taglia corrispondente
                const sizeToUpdate = product.sizes.find(
                  (size) => size.size === item.size
                );

                if (sizeToUpdate && sizeToUpdate.quantity >= item.cartQuantity) {
                  // Sottrai la quantità venduta
                  sizeToUpdate.quantity -= item.cartQuantity;

                  // Salva il prodotto aggiornato
                  await product.save();
                }
              }
            }
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);

module.exports = router;
