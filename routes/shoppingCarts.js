const express = require("express");

const { ShoppingCart } = require("../models/shoppingCarts");
const { validate } = require("../models/shoppingCarts");
const _ = require("lodash");
const router = express.Router();

/* GET product in cart. */
router.get("/", async (req, res) => {
  const shoppingCart = await ShoppingCart.findOne({
    user_id: req.query.user_id,
  });
  if (!shoppingCart) {
    res.send("no items in shopping cart ");
  } else if (shoppingCart) {
    [];
    // nedd to re arang and chang what send
    // do map and then pic and then send

    res.send(shoppingCart);
  }
});

/* add product to cart  */
router.post("/addproduct", async (req, res, next) => {
  const { error } = validate(req.body);

  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).send({ errors: listErrors });
  }

  // check if there is a shoppincart document for the user
  const shoppingCart = await ShoppingCart.findOne({
    user_id: req.body.user_id,
  });

  // if there is shoppingcart for the user then delete then copy
  // the products from the shopping cart and the add the new one and
  // create a new shopping cart and save

  if (shoppingCart) {
    let products = shoppingCart.products;

    // build the new product in product format
    const newProduct = {
      productid: req.body.productid,
      quantity: req.body.quantity,
      price: req.body.price,
    };

    //  add to the rest of the products
    products.push({ product: newProduct });

    let doc = {
      user_id: req.body.user_id,
      products,
    };
    await shoppingCart.remove({
      _id: req.body.user_id,
    });

    const newShoppingCart = new ShoppingCart(doc);
    await newShoppingCart.save();

    res.status(201).send("added");
  } else if (!shoppingCart) {
    // if there isnt shopping cart for the use then build one and add the product and save

    let products = [
      {
        product: {
          productid: req.body.productid,
          quantity: req.body.quantity,
          price: req.body.price,
        },
      },
    ];

    let doc = {
      user_id: req.body.user_id,
      products,
    };

    const newShoppingCart = new ShoppingCart(doc);
    await newShoppingCart.save();
    res.status(201).send("added");
  }
});

const getShoppingCart = async (user_id) => {
  const shoppingCart = await ShoppingCart.findOne({ user_id: user_id });
  if (!shoppingCart) {
    return "no items in shopping cart ";
  } else if (shoppingCart) {
    return shoppingCart;
  }
};

// remove item from userr's shopping cart
router.put("/removeItem", async (req, res, next) => {
  let shoppingCart = await getShoppingCart(req.query.user_id);

  let newshoppingCart = _.filter(shoppingCart.products, (product) => {
    return product.product.productid != req.query.productid;
  });
  shoppingCart.products = newshoppingCart;

  await shoppingCart.save();
  console.log("item removed ");
  res.send("item removed");
});

// update the qty of product in shopping cart - need body.user_id , body.productid , body.updateQty
router.patch("/updataShoppingCart", async (req, res, next) => {
  try {
    let shoppingCart = await getShoppingCart(req.body.user_id);
    await _.map(shoppingCart.products, (product) => {
      if (product.product.productid == req.body.productid) {
        return (product.product.quantity = req.body.updateQty);
      }
    });
    shoppingCart.save();
    res.status(201);
  } catch (err) {
    console.log(err);
    return err;
  }
});

module.exports = router;
