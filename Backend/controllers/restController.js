const async_handler = require("express-async-handler");
const restauarnt = require("../models/restModel");
const owner = require("../models/rest_owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const registerRest = async_handler(async (req, res) => {
  const { Menu_items, Rest_owner, Rest_name } = req.body;
  const new_rest = new restauarnt({
    Menu_items,
    Rest_owner,
    Rest_name,
  });
  await new_rest.save();
  let owner_id;
  Rest_owner.forEach((item) => {
    owner_id = item.Owner_id;
  });
  const upd_id = await owner.findByIdAndUpdate(
    owner_id,
    { Rest_id: new_rest._id },
    { new: true }
  );
  return res.status(200).json({ message: "success" });
});

const changeMenu = async_handler(async (req, res) => {
  const { updatedMenuItems } = req.body;
  const find_rest = await restauarnt.findOne({
    "Rest_owner.Owner_id": req.user.id,
  });
  if(!find_rest){
    res.status(400)
    throw new Error("cant find the restaurant")
  }
  updatedMenuItems.forEach((updatedItem) => {
    const existingIndex = find_rest.Menu_items.findIndex(
      (item) => item._id.toString() == updatedItem._id.$oid
    );
    if (existingIndex !==-1) {
      find_rest.Menu_items[existingIndex].Price = updatedItem.Price;
      find_rest.Menu_items[existingIndex].Dish_name = updatedItem.Dish_name;
    } else {
      find_rest.Menu_items.push(updatedItem);
    }
  });
  await find_rest.save();
  console.log("Menu items updated successfully");
});

const getMenu=async_handler(async(req,res)=>{
  const find_rest = await restauarnt.findOne({
    "Rest_owner.Owner_id": req.user.id,
  });
  if(find_rest){
    console.log(find_rest.Menu_items)
  }
  else{
    res.status(400).json({"Message":error})
  }
})


const update_reviews=async_handler(async(req,res)=>{
  const review=req.body.Reviews
  if(!review){
    res.status(400)
    throw new Error("invalid review")
  }
  if(parseInt(review)>5||parseInt(review)<0){
    res.status(400)
    throw new Error("size out of bounds")
  }
  const upd_rev=await restauarnt.findOneAndUpdate({"Rest_owner.Owner_id":req.user.id},{"Reviews":review},{new:true})
  await upd_rev.save();
  res.status(200).json(upd_rev)
})

module.exports = { registerRest, changeMenu,getMenu ,update_reviews};
