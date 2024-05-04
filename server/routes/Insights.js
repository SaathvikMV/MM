const express = require("express");
const router = express.Router();
const Expense = require("../models/expense.js");
const User = require("../models/user.js");
const HoltWinter = require("./ForecastLogic.js")

router.get("/", async (req, res) => {
  try {
    // console.log(req.user)
    const userExpense = await Expense.findOne({ user: req.user.id }).populate(
      "user"
    );
    // console.log(userExpense.expense)

    function condenseAmountByMonth(data) {
      // Create an object to store the condensed amounts
      let condensedData = new Array(12).fill(0);    
      // Iterate over the data array
   
      data.forEach(item => {
        // Extract the month and year from the date
        const monthYear = new Date(item.date).getMonth();
    
        // Add the item's amount to the corresponding monthYear key in condensedData
        condensedData[monthYear] += item.Amount;
      });

      const currentMonth= new Date().getMonth()
      condensedData=condensedData.slice(0,currentMonth+1)
      return condensedData;
    }
   condenseAmountByMonth(userExpense.expense)

   const predictedValues = HoltWinter(condenseAmountByMonth(userExpense.expense))
  //  console.log(predictedValues)

    

    if (!userExpense) {
      return res
        .status(404)
        .json({ message: "Expense data not found for the user" });
    }

    // Sort expenses array in ascending order based on the date
    userExpense.expense.sort((a, b) => a.date - b.date);


    //username for navbar
    const user = await User.findById(req.user.id);
    var username = "";
    if (user) {
      username = user.username;
      // console.log("User username:", username);
    } else {
      console.log("User not found");
    }

    res.json({
      data:userExpense.expense, 
      name:username,
      budget:userExpense.budget,
      forecast:predictedValues
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//these 2 can be implemented in react only =
// router.post("/month", async (req, res) => {
//   let selectedYear = req.body.year ? parseInt(req.body.year) : 2024;
//   res.json({
//     redirectURL: "/" + req.user.id + "/insights?year=" + selectedYear,
//   });
// });

// router.post("/piechart", async (req, res) => {
//   let selectedMonth = req.body.month ? req.body.month : "2024-01";
//   console.log(selectedMonth);
//   res.json({
//     redirectURL: `/${req.user.id}/insights?month=${selectedMonth}`,
//   });
// });

module.exports = router;
