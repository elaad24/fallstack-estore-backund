const Joi = require("@hapi/joi");

const mongoose = require("mongoose");

const shoppingCartSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  products: [
    {
      product: {
        productid: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    },
  ],
});

const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);

function validateShoppingCart(shoppingCart) {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    productid: Joi.string().required(),
    quantity: Joi.number().required(),
    price: Joi.number().required(),
  });
  return schema.validate(shoppingCart, { abortEarly: false });
}

exports.ShoppingCart = ShoppingCart;
exports.validate = validateShoppingCart;
