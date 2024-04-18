import mongoose from "mongoose";

const coupounCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your event coupoun code name!"],
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  shop: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    required: [true, "Please enter your event product description!"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Event = mongoose.model("coupounCode", coupounCodeSchema);
export default Event;
