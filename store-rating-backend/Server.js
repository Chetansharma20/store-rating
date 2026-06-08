
const express = require("express");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const app = express();
const routes = require("./routes/Routes.js");
const sequelize = require('./Database.js');
const errorMiddleware = require("./middleware/errorMiddleware.js");

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

// Global Error Handler Middleware
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("✅ Backend deployed successfully!");
});
sequelize.sync().then(() => {
  app.listen(3000, () => console.log("Server running on port 3000"));
});
