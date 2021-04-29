// pages/api/user.js
import { use } from 'next-api-middleware';
import db from '../../../../models';
import authorize from '../../../../middleware/authorize';
db.sequelize.sync();

const User = db.User;
const Record = db.Record;

const withMiddleware = use(authorize);

const apiRouteHandler = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { identnumber: req.query.identnumber },
    });
    if (user) {
      const records = await Record.findAll({
        where: { identnumber: req.query.identnumber },
        order: [['number', 'DESC']],
      });
      return res.status(200).json({
        records,
      });
    } else {
      return res.status(404).json({ error: 'No user found for this userId' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error when retrieving records.' });
  }
};

export default withMiddleware(apiRouteHandler);
