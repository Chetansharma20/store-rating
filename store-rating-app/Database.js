const path = require("path");
const caPath = path.join(__dirname, process.env.DB_CA_PATH);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(caPath)
      }
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    logging: false
  }
);
