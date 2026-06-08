// store-rating-app/Database.js

const { Sequelize } = require("sequelize"); // import Sequelize
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // load environment variables

// Determine CA file path
// Use DB_CA_PATH if set (Render), otherwise fallback to local ./ca.pem
const caPath = process.env.DB_CA_PATH
  ? path.resolve(process.env.DB_CA_PATH)
  : path.join(__dirname, "ca.pem");

let ca;
try {
  ca = fs.readFileSync(caPath, "utf8");
} catch (err) {
  console.warn(`⚠️  Warning: Unable to read CA file at ${caPath}. SSL might not work.`);
  ca = null; // fallback to null if file is missing
}

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: ca ? { ssl: { ca } } : {}, // only add SSL if CA exists
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ DB Connected Successfully"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

module.exports = sequelize;
