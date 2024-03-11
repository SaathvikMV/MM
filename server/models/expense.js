const mongoose = require("mongoose");
const User = require("./user.js");
const expenseScehma = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  budget: [
    {
      year: { type: Number },
      month: { type: String },
      amount: { type: Number },
    },
  ],
  expense: [
    {
      Amount: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        default: "NA",
        required: true,
      },
      description: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      payment_method: {
        type: String,
      },
    },
  ],
});
const Expense = new mongoose.model("Expense", expenseScehma);
module.exports = Expense;
