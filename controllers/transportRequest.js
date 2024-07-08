const router = require("express").Router();
const TransportRequest = require("../models/TransportRequest");
const {
  validateTransportRequest,
  handleValidation,
} = require("../validation/validateTransportRequest");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// TODO pending result ??? REMOVE AFTER ??? 

router.post(
  "/",
  validateTransportRequest,
  handleValidation,
  async (req, res) => {
    try {
      const { phone, countryCode } = req.body;
      console.log(countryCode, phone);

      // Generate verification code // TODO
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();

      // Send SMS
      await client.messages.create({
        body: `Your verification code is ${verificationCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `${countryCode}${phone}`,
      });

      // Save the request with the verification code and status 'pending'
      const newRequest = new TransportRequest({
        ...req.body,
        verificationCode,
      });
      await newRequest.save();

      res.status(200).json({
        message:
          "Transport request created. Verification code sent to your phone.",
        requestId: newRequest._id,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

router.post("/verify", async (req, res) => {
  try {
    const { requestId, verificationCode } = req.body;
    const request = await TransportRequest.findById(requestId);

    if (request.verificationCode === verificationCode) {
      request.status = "verified";
      await request.save();
      res.status(201).json({ message: "Phone number verified successfully." });
    } else {
      res.status(400).json({ message: "Invalid verification code." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;
