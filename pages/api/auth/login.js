import db from '../../../models';
import getConfig from 'next/config';
import SHA512 from 'crypto-js/sha512';
const User = db.users;
const { serverRuntimeConfig: config } = getConfig();
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

db.sequelize.sync();

const generateSalt = () => {};

export default async (req, res) => {
  const { loginhandle, password, logintype } = req.body;
  let query = {};
  if (logintype == 0) {
    query = { identnumber };
  } else {
    query = {
      firstname: loginhandle.split(' ')[0],
      surname: loginhandle.split(' ')[1],
    };
  }

  try {
    const user = User.findOne({ where: query })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            error: `${
              logintype == 0 ? 'Identifikationsnummer' : 'Anmeldename'
            } oder Passwort ist falsch`,
          });
        }
        if (
          user.password.toLowerCase() == SHA512(password + user.salt).toString()
        ) {
          return res.status(201).json({
            token: jwt.sign({ sub: user.identnumber }, config.secret),
            identnumber: user.identnumber,
          });
        } else {
          return res.status(401).json({
            error: `${
              logintype == 0 ? 'Identifikationsnummer' : 'Anmeldename'
            } oder Passwort ist falsch`,
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          error: 'Es ist ein Problem beim Anmeldevorgang aufgetreten!',
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error in signup. Please try again.' });
  }
};
