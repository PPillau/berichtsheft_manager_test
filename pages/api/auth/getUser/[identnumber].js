// pages/api/user.js
import { use } from 'next-api-middleware';
import db from '../../../../models';
import authorize from '../../../../middleware/authorize';
db.sequelize.sync();
const User = db.users;

const withMiddleware = use(authorize);

const apiRouteHandler = async (req, res) => {
  try {
    // Check if user with that email if already exists
    const user = await User.findOne({
      where: { identnumber: req.query.identnumber },
    });
    if (user) {
      return res.status(200).json({
        identnumber: user.identnumber,
        firstname: user.firstname,
        surname: user.surname,
        apprenticeshipyear: user.apprenticeshipyear,
        email: user.email,
        street: user.street,
        zipcode: user.zipcode,
      });
    } else {
      return res.status(404).json({ error: 'No user found for this userId' });
    }
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Error when retrieving user.' });
  }
};

export default withMiddleware(apiRouteHandler);
