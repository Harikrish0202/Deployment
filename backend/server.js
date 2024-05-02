const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");

let DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log("DB connection Succesfull");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App Running on port: ${port}`);
});
