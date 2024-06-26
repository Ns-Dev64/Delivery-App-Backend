const async_handler = require("express-async-handler");
const customer = require("../models/customerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerCust = async_handler(async (req, res) => {
  const { Name, Email, Password, Phone_num } = req.body;

  const user_avail = await customer.findOne({ Email });

  if (user_avail) {
    res.status(401);
    throw new Error("user already exsists");
  }
  const hashed_pass = await bcrypt.hash(Password, 10);
  const new_user = new customer({
    Name: Name,
    Email: Email,
    Phone_num: Phone_num,
    Password: hashed_pass,
  });
  await new_user.save();
  return res.status(200).json({message:"success"});
});

const signCust = async_handler(async (req, res, next) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  } else {
    const user = await customer.findOne({ Email });
    if (user && (await bcrypt.compare(Password, user.Password))) {
      access_token = jwt.sign(
        {
          user: {
            Email: user.Email,
            Name: user.Name,
            Phone: user.Phone_num,
            id: user._id,
          },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "120m" }
      );
      req.headers["authorization"] = `Bearer ${access_token}`;
      console.log(access_token)
      req.url = "/loginCust";
      next();
    } else {
      res.status(400);
      throw new Error("wrong email or password");
    }
  }
});

const logged_in = async_handler(async (req, res) => {
  res.status(200).json(req.user);
});


const updateCust = async_handler(async (req, res) => {
  try {
    const cust_update = await customer.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.status(200).json({message:"success"});
  } catch (err) {
    res.status(401);
    throw new Error("Error occured whilst upating data");
  }
});

const deleteCust=async_handler(async(req,res)=>{
    const cust_delete=await customer.findById(req.user.id)
    if(!cust_delete){
        res.status(400)
        throw new Error("Error occured whilst processing your request")
    }
    await cust_delete.deleteOne()
    res.status(200).json({message:"success"})
})
module.exports = { registerCust, signCust, logged_in,updateCust , deleteCust};
