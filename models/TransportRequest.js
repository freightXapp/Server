const mongoose = require("mongoose");

const transportRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  countryCode: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  goodsDescription: { type: String, required: true },
  weight: { type: Number, required: true },
  dimensions: { type: String, required: true },
  pickupDateTime: { type: Date, required: true },
  deliveryDateTime: { type: Date, required: true },
  specialInstructions: { type: String },
  status: { type: String, default: "pending" }, // 'pending' or 'verified'
  verificationCode: { type: String },
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("TransportRequest", transportRequestSchema);
