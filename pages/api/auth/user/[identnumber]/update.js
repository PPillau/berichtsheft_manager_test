// pages/api/user.js
import { use } from 'next-api-middleware';
import db from '../../../../../models';
import authorize from '../../../../../middleware/authorize';
db.sequelize.sync();

const User = db.User;

const withMiddleware = use(authorize);

const apiRouteHandler = async (req, res) => {
  try {
    const identnumber = req.query.identnumber;
    const { email, zipcode, street } = req.body;

    User.update(
      { email, zipcode, street },
      {
        where: { identnumber },
      }
    )
      .then(async () => {
        const user = await User.findOne({
          where: { identnumber: req.query.identnumber },
        });
        if (user) {
          return res.status(200).json({
            identnumber: user.identnumber,
            firstname: user.firstname,
            surname: user.surname,
            apprenticeshipyear: user.apprenticeshipyear,
            dateofbirth: user.dateofbirth,
            email: user.email,
            street: user.street,
            zipcode: user.zipcode,
          });
        } else {
          return res.status(404).json({ error: 'Error when updating user.' });
        }
      })
      .catch((error) => {
        return res.status(404).json({ error: 'User could not be updated.' });
      });
  } catch (error) {
    return res.status(500).json({ error: 'Error when updating user.' });
  }
};

export default withMiddleware(apiRouteHandler);
