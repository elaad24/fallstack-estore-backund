var express = require("express");
const { Product } = require("../models/products");
const { validate } = require("../models/products");
const _ = require("lodash");
var router = express.Router();
const { noPhotoImg } = require("../noPhotoImg");

/* add product  */
router.post("/addproduct", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).send({ errors: listErrors });
  }

  let product = new Product(
    _.pick(req.body, [
      "name",
      "description",
      "price",
      "qty",
      "category",
      "pic",
      "seller_id",
    ])
  );

  if (!req.body.pic) {
    product.pic = noPhotoImg;
  }

  await product.save();

  res.send(
    _.pick(product, [
      "name",
      "description",
      "price",
      "qty",
      "category",
      "pic",
      "seller_id",
    ])
  );
});

/* Get all product  */
router.get("/", async (req, res, next) => {
  let prodlist = [];
  const products = await Product.find();
  for (i of products) {
    prodlist.push(i._doc);
  }

  res.send(prodlist);
});

/* get praticale product */
router.get("/item", async (req, res) => {
  if (!req.query.id) {
    console.log("error - no parms id ");
    return res.status(400).send("error - no parms id");
  }

  const product = await Product.find({ _id: req.query.id });
  if (!product) {
    res.status(404).send("error - item doesnt found");
  }

  res.send(
    _.pick(product[0], [
      "name",
      "description",
      "price",
      "qty",
      "category",
      "pic",
      "seller_id",
    ])
  );
});

module.exports = router;
