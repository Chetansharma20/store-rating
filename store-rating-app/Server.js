const express = require("express");
const cors = require("cors");
// const cors = require("cors");
// const path = require("path");
const sequelize = require("./Database.js"); // your DB connection
const routes = require("./routes/Routes.js");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);
// Optional: simple test route
app.get("/", (req, res) => {
  res.send("✅ Backend deployed successfully!");
});

// Sync DB and start server
const PORT = process.env.PORT || 3000;
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });

