// pages/api/user.js
import { use } from 'next-api-middleware';
import db from '../../../../models';
import authorize from '../../../../middleware/authorize';
db.sequelize.sync();

const Record = db.Record;

const withMiddleware = use(authorize);

const apiRouteHandler = async (req, res) => {
  try {
    const { beginOfWeek, endOfWeek, text, isSafe, identnumber } = req.body;
    let statusChange = {};
    if (!isSafe) {
      statusChange = { status: 0 };
    }

    Record.update(
      { beginOfWeek, endOfWeek, text, ...statusChange },
      {
        where: { identnumber, id: req.query.recordId },
      }
    )
      .then(() => {
        if (isSafe) {
          return res.status(200).json({
            message: 'Record saved.',
          });
        }
        return res.status(200).json({
          message: 'Record updated.',
        });
      })
      .catch((error) => {
        return res.status(404).json({ error: 'Record could not be updated.' });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error when retrieving single record.' });
  }
};

export default withMiddleware(apiRouteHandler);
