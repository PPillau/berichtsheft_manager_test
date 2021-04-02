import db from '../../../models';
import getConfig from 'next/config';
db.sequelize.sync();
const { serverRuntimeConfig: config } = getConfig();
const jwt = require('jsonwebtoken');

export default async (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, config.secret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: 'Token invalid!' });
      }

      return res
        .status(200)
        .json({ response: 'Token valid!', identnumber: decoded.sub });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erorr while verifying token!' });
  }
};
