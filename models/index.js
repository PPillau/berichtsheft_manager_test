import getConfig from 'next/config';
const { serverRuntimeConfig: config } = getConfig();
import Sequelize from 'sequelize';
import userModel from './user';
import recordModel from './record';

// Override timezone formatting for MSSQL
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
};

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    operatorAliases: false,
    pool: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = userModel(sequelize, Sequelize);
db.Record = recordModel(sequelize, Sequelize);

export default db;
