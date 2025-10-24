// const{Sequelize} = require("sequelize")
// const sequelize = new Sequelize("store_rating_db", "root", "Chetan20@",{

//     host:"localhost",
//     dialect:"mysql",
//     pool:{
//         max:5,
//         min:0,
//         acquire:30000,
//         idle:10000,
//         logging: false,

//     }
// }) 
// module.exports = sequelize
const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config(); // load .env variables

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(process.env.DB_CA_PATH)
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});
sequelize.authenticate()
  .then(() => console.log("✅ DB Connected Successfully"))
  .catch(err => console.error("❌ DB Connection Error:", err));

module.exports = sequelize;
