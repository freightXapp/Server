const { check, validationResult } = require("express-validator");
const { parsePhoneNumberFromString } = require("libphonenumber-js");

const validateTransportRequest = [
  check("fullName").not().isEmpty().withMessage("Full Name is required"),
  check("email").isEmail().withMessage("Email is not valid"),
  check("phone").custom((value, { req }) => {
    const phoneNumber = parsePhoneNumberFromString(
      req.body.countryCode + value
    );
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Error("Phone number is not valid");
    }
    return true;
  }),
  check("countryCode").not().isEmpty().withMessage("Country code is required"),
  check("pickupLocation")
    .not()
    .isEmpty()
    .withMessage("Pickup Location is required"),
  check("dropoffLocation")
    .not()
    .isEmpty()
    .withMessage("Dropoff Location is required"),
  check("goodsDescription")
    .isLength({ min: 10 })
    .withMessage("Goods Description must be at least 10 characters long"),
  check("weight")
    .isFloat({ gt: 0 })
    .withMessage("Weight must be a positive number"),
  check("dimensions").not().isEmpty().withMessage("Dimensions are required"),
  check("pickupDateTime")
    .not()
    .isEmpty()
    .custom((value) => {
      const pickupDate = new Date(value);
      const today = new Date();
      if (pickupDate < today) {
        throw new Error("Pickup Date cannot be in the past");
      }
      return true;
    }),
  check("deliveryDateTime")
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      const deliveryDate = new Date(value);
      const pickupDate = new Date(req.body.pickupDateTime);
      if (deliveryDate < pickupDate) {
        throw new Error("Delivery Date cannot be before Pickup Date");
      }
      return true;
    }),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Construct a structured error response
    const errorResponse = {};
    errors.array().forEach((error) => {
        console.log(error.param)
      errorResponse[error.param] = error.msg;
    });
    return res.json({ errors: errorResponse });
  }
  next();
};

module.exports = { validateTransportRequest, handleValidation };
