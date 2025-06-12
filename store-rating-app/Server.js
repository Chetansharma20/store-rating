const express = require("express");
const cors = require("cors")
const app = express();
const routes = require("./routes/Routes.js");
const sequelize = require('./Database.js');
app.use(cors())
app.use(express.json());
app.use("/api", routes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log("Server running on port 3000"));
});
