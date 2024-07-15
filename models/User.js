const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  password: String,
  userType: String,
  email: String,
  country: String,
  companyName: String,
  companyAddress: String,
  companyPersons: String,
  companyTruck: [String],
  companyFrights: [String],
  phoneNumber: String,
  isPhoneValidated: Boolean,
  ads: [String],
  promoAdCountAvailable: Number,
  maxAd: Number,
  documents: Buffer,
  companyActivity: String,
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  rating: Number,
  firstCompanyDate: String,
  isSuperAdmin: Boolean,
  isSealed: Boolean,
  userIsValidated: Boolean,
  leadAds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
  partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  managedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  takenLoads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Load" }],
  takenFrights: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fright" }],
  referPerson: String,
  ratingPaid: Number,
  lastLogin: Date,
  registrationDate: Date,
  companyStartDate: String,
  taxRegistryNumber: String,
  refreshToken: String,
  isEmailValidated: {type: Boolean, default: false},
});


module.exports = mongoose.model("User", userSchema);

