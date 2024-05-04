const express = require("express");
const router = express.Router();
const Expense = require("../models/expense.js");
const User = require("../models/user.js");
const verifyToken = require("../middlewears/jwt_verify.js");
const Categories = require("./Categorise/Categorise.js")


router.get("/", async (req, res) => {
  const userExpense = await Expense.findOne({
    user: req.user.id,
  }).populate("user");
  const expenses = userExpense.expense;
  const budget = userExpense.budget;
  const user = await User.findById(req.user.id);
  var username = "";
  if (user) {
    username = user.username;
  } else {
    console.log("User not found");
  }
  const expenDetails = {
    expenses: expenses,
    user: username,
    budget: budget,
    items: [],
  };
  res.json(expenDetails);
});

router.post("/categorise", async (req, res) => {
  const keyword = req.body.item
  const answer = await Categories(keyword)
  .then((result) => {
     res.json({predictions:result})
  })
  .catch((error) => {
      console.error('Error in categories:', error);
  });
})

router.post("/add", async (req, res) => {
  const added_date = req.body.date;
  const title = req.body.title;
  const amount = req.body.amount;
  const cat = req.body.category;
  const p_method = req.body.payment_method;
  const newExpense = {
    Amount: amount,
    description: title,
    date: added_date,
    category: cat,
    payment_method: p_method,
  };

  try {
    const expense = await Expense.findOne({ user: req.user.id }).populate(
      "user"
    );
    await expense.expense.push(newExpense);
    await expense.save();
    res.json({ message: "Successfully posted" });
    // res.redirect(/${req.params.user}/dashboard);
  } catch (e) {
    console.log(e);
    res.json({ error: "Error" });
  }
});

router.post("/addbudget", async (req, res) => {
  const entered_budget = req.body.budget;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let currentMonth = "";
  if (req.body.currentMonth) {
    currentMonth = req.body.currentMonth;
  } else {
    currentMonth = currentDate.toLocaleString("default", {
      month: "short",
    });
  }

  try {
    const userQuery = { user: req.user.id };
    const existingEntry = await Expense.findOne({
      ...userQuery,
      "budget.year": currentYear,
      "budget.month": currentMonth,
    });

    if (existingEntry) {
      // Update the existing entry
      const result = await Expense.updateOne(
        userQuery,
        {
          $set: {
            "budget.$[elem].amount": entered_budget,
          },
        },
        {
          arrayFilters: [
            { "elem.year": currentYear, "elem.month": currentMonth },
          ],
        }
      );

      if (result.modifiedCount > 0) {
        res.json({ message: "budget updated" });
      } else {
        res.json({ error: "budget not modified!" });
      }
    } else {
      // If the array is empty or no matching entry found, add a new entry
      const addResult = await Expense.updateOne(
        userQuery,
        {
          $addToSet: {
            budget: {
              year: currentYear,
              month: currentMonth,
              amount: entered_budget,
            },
          },
        },
        { upsert: true } // Add this option to insert if no matching document is found
      );

      if (addResult.modifiedCount > 0 || addResult.upsertedCount > 0) {
        res.json({ message: "budget added / updated" });
      } else {
        res.json({ error: "budget not modified!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ error: "error occurred!" });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const expenseId = req.body.expenseId;
    const userExpense = await Expense.findOne({ user: req.user.id }).populate(
      "user"
    );

    const initialExpenseLength = userExpense.expense.length;

    // Use filter to create a new array without the expense to be deleted
    userExpense.expense = userExpense.expense.filter(
      (expense) => expense._id.toString() !== expenseId
    );

    const finalExpenseLength = userExpense.expense.length;

    // Check if any data is actually deleted
    const isDeleted = initialExpenseLength !== finalExpenseLength;

    if (isDeleted) {
      await userExpense.save();
      res.json({ message: "Successfully deleted" });
    } else {
      res.json({ message: "Expense not found or already deleted" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Error" });
  }
});

module.exports = router;
