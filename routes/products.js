var express = require("express");
const { Product } = require("../models/products");
const { validate } = require("../models/products");
const _ = require("lodash");
var router = express.Router();
const { noPhotoImg } = require("../noPhotoImg");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ 1: "products work" });
});

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

module.exports = router;
