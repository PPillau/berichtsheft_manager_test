// pages/api/user.js
import { use } from 'next-api-middleware';
import db from '../../../../models';
import authorize from '../../../../middleware/authorize';
db.sequelize.sync();

const Record = db.Record;

const withMiddleware = use(authorize);

const apiRouteHandler = async (req, res) => {
  try {
    const record = await Record.findOne({
      where: { identnumber: req.query.identnumber, id: req.query.recordId },
    });
    if (record) {
      return res.status(200).json({
        record,
      });
    } else {
      return res
        .status(404)
        .json({ error: 'No record found for this identnumber and recordId' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error when retrieving single record.' });
  }
};

export default withMiddleware(apiRouteHandler);
