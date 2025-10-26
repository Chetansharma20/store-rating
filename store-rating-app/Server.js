// const express = require("express");
// const cors = require("cors");
// // const cors = require("cors");
// // const path = require("path");
// const sequelize = require("./Database.js"); // your DB connection
// const routes = require("./routes/Routes.js");
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api", routes);
// // Optional: simple test route
// app.get("/", (req, res) => {
//   res.send("✅ Backend deployed successfully!");
// });

// // Sync DB and start server
// const PORT = process.env.PORT || 3000;
// sequelize
//   .sync()
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("❌ DB connection failed:", err);
//   });
// Server.js (CommonJS)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./Database.js");
const routes = require("./routes/Routes.js");

dotenv.config();
const app = express();

const corsOptions = {
  origin: ["https://store-rating-z8vd.vercel.app", 
    "https://store-rating-z8vd-git-master-chetansharma20s-projects.vercel.app",
    "https://store-rating-z8vd-iw5vabpbs-chetansharma20s-projects.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use("/api", routes);

app.get("/", (req,res)=> res.send("✅ Backend deployed successfully!"));

const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(()=> app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`)))
  .catch(err => console.error("❌ DB connection failed:", err));
