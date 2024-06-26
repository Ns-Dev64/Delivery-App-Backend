const async_handler = require("express-async-handler");
const axios = require("axios");
const crypto = require("crypto");
const { error } = require("console");

let salt_key = process.env.SALT_KEY;
let merchant_id = process.env.MERCHANT_ID;

const payment_initiation = async_handler(async (req, res) => {
  try {
    const data = {
      merchantId: merchant_id,
      merchantuserId: req.body.merchantuserId,
      merchantTransactionId: req.body.merchantTransactionId,
      name: req.body.name,
      amount: req.body.amount * 100,
      number: req.body.number,
      redirectUrl: `http://localhost:5001/status?id=${req.body.transactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:5001/status?id=${req.body.transactionId}`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;
    const prod_url =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    const response = await axios.post(
      prod_url,
      { request: payloadMain },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error in payment handler:", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
});

const callbackHandler = async_handler(async (req, res) => {
  const response = res.req.body;
  const merchantId = response.merchantId;
  const merchantTransactionId = response.transactionId;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const keyIndex = 1;
  const checksum = sha256 + "###" + keyIndex;
  const verif_url = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;
  const options = {
    method: "GET",
    url: verif_url,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": merchantId,
    },
  };
  axios
    .request(options)
    .then(async (response) => {
      const verif_data = response.data;
      const client_verif = {
        code: verif_data.code,
        message: verif_data.message,
        transactionId: verif_data.data.transactionId,
        paymentType: verif_data.data.paymentInstrument.cardType,
        responseCode: verif_data.data.responseCode,
      };
      res.status(200).json(client_verif);
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = { payment_initiation, callbackHandler };
