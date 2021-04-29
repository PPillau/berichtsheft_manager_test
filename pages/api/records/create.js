import authorize from '../../../middleware/authorize';
import { use } from 'next-api-middleware';

import db from '../../../models';

import { getNumber } from '../../../services/recordService';
db.sequelize.sync();
const Record = db.Record;

const withMiddleware = use(authorize);

const apiRouteHandler = async (req, res) => {
  let {
    identnumber,
    text,
    beginOfWeek,
    endOfWeek,
    apprenticeshipyear,
    status,
    statusText,
  } = req.body;

  const number = await getNumber(identnumber);
  if (number < 0) {
    return res
      .status(400)
      .json({ error: 'Identnumber does not belong to valid user!' });
  }

  try {
    const newRecord = await Record.create({
      number,
      identnumber,
      text,
      beginOfWeek: new Date(beginOfWeek),
      endOfWeek: new Date(endOfWeek),
      apprenticeshipyear,
      status,
      statusText,
    });
    return res.status(201).send(newRecord);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro in record creation.');
  }
};

export default withMiddleware(apiRouteHandler);
