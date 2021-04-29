// pages/api/user.js
import { use } from 'next-api-middleware';
import authorize from '../../../../middleware/authorize';

import { getNumber } from '../../../../services/recordService';

const withMiddleware = use(authorize);

const apiRouteHandler = async (req, res) => {
  try {
    const number = await getNumber(req.query.identnumber);
    return res.status(200).json({
      number,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error when retrieving record number for identnumber.' });
  }
};

export default withMiddleware(apiRouteHandler);
