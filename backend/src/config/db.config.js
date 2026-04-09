const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const config = require('./index');

dotenv.config();

const dialectOptions = (process.env.NODE_ENV === 'production' || (process.env.HOST && process.env.HOST !== 'localhost'))
  ? {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  }
  : {};

const sequelize = new Sequelize(config.DB.DATABASE, config.DB.DB_USER, config.DB.PASSWORD,
  {
    dialect: 'mysql',
    host: config.DB.HOST,
    port: config.DB.PORT,
    define: {
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions
  });

// (async () => await sequelize.sync({ alter: true }))();

module.exports = sequelize;
