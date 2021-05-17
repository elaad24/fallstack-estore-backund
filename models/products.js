const Joi = require("@hapi/joi");

const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  price: {
    type: Number,
    required: true,
    min: 0.001,
    max: 99999999,
  },
  qty: {
    type: Number,
    required: true,
    min: 0,
    max: 99999999,
  },
  category: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  seller_id: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  pic: {
    type: String,
    required: false,
  },
  time_stamp: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productsSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(255),
    description: Joi.string().required().min(2).max(1024),
    price: Joi.number().required().min(0.001).max(99999999),
    qty: Joi.number().required().min(0).max(99999999),
    category: Joi.string().required().min(2).max(255),
    seller_id: Joi.string().required().min(2).max(1024),
    pic: Joi.string(),
  });
  return schema.validate(product, { abortEarly: false });
}

exports.Product = Product;
exports.validate = validateProduct;
