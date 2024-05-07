const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./Users/userRoutes");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/testing/user", userRoutes);

if (process.env.NODE_ENV === "production") {
  console.log("this site is in production");
  app.use(express.static(path.join(__dirname, "../Frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Frontend/build/index.html"));
  });
}
module.exports = app;
