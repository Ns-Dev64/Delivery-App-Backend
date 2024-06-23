const async_handler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerOwner = async_handler(async (req, res) => {
  const { FullName, Password, Username, Address } = req.body;
  const hashed_pass = await bcrypt.hash(Password, 10);
  const new_owner = new owner({
    FullName: FullName,
    Password: hashed_pass,
    Username: Username,
    Address: Address,
  });

  await new_owner.save();
  return res.status(200).json({ message: "success" });
});

const signOwner = async_handler(async (req, res, next) => {
  const { Username, Password } = req.body;
  if (!Username || !Password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  } 
  else {
    const owner_new = await owner.findOne({ Username });
    if (owner_new && (await bcrypt.compare(Password, owner_new.Password))) {
      access_token = jwt.sign(
        {
          user: {
            FullName: owner_new.FullName,
            Username: owner_new.Username,
            id:owner_new._id
          },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "120m" }
      );
      console.log(access_token)
      req.headers["authorization"] = `Bearer ${access_token}`;
      req.url = "/loginOwner";
      next();
    } else {
      res.status(400);
      throw new Error("wrong email or password");
    }
  }
});

const logOwner_in = async_handler(async (req, res) => {
  res.status(200).json(req.user);
});





module.exports = { registerOwner, signOwner, logOwner_in };
