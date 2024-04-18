if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongo");
const findOrCreate = require("mongoose-findorcreate");
const mongo_sanitize = require("express-mongo-sanitize");
const User = require("./models/user.js");
// const { isLoggedIn, setCurrentUser } = require("./middlewears/middleware.js");
const Authentication = require("./routes/Authentication.js");
const Dashboard = require("./routes/Dashboard.js");
const Insights = require("./routes/Insights.js");
const bodyParser = require("body-parser");
const app = express();
const { verifyToken } = require("./middlewears/jwt_verify.js");

app.use(express.urlencoded({ extended: true }));
app.use(mongo_sanitize());
app.use(express.json());
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => {
    console.error.bind(e);
  });

app.get("/", cors(), async (req, res) => {});
app.use("/", Authentication);
app.use("/:user/dashboard", verifyToken, Dashboard);
app.use("/:user/insights", verifyToken, Insights);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
