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
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

       const existingRequest = await TransportRequest.findOne({
         phone,
         countryCode,
         status: {$ne: 'pending'},
         createdAt: { $gte: sevenDaysAgo },
       });

        if (existingRequest) {
          return res.json({
            message: "You have already made a request in the last 7 days.",
            error: 'User existting',
            phone: 'Phone number exists' 
          });
        }

      // Generate verification code // TODO remove comments before release
      //   const verificationCode = Math.floor(
      //     1000 + Math.random() * 9000
      //   ).toString();

      //   // Send SMS
      //   await client.messages.create({
      //     body: `Your verification code is ${verificationCode}`,
      //     from: process.env.TWILIO_PHONE_NUMBER,
      //     to: `${countryCode}${phone}`,
      //   });
      verificationCode = "123";
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
    console.log(requestId, verificationCode);
    const request = await TransportRequest.findById(requestId);

    if (request.verificationCode === verificationCode) {
      request.status = "verified";
      await request.save();
      res.status(201).json({
        message:
          "Phone number verified successfully. Thank you for your request. We are actively working to find a reliable transport company to fulfill this requirement. We appreciate your patience and will update you as soon as possible",
      });
    } else {
        throw new Error;
      res.status(400).json({ message: "Invalid verification code." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;
